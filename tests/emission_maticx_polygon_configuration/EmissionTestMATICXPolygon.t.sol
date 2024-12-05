// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {AaveV3Polygon, AaveV3PolygonAssets} from 'aave-address-book/AaveV3Polygon.sol';
import {IEmissionManager, ITransferStrategyBase, RewardsDataTypes, IEACAggregatorProxy} from '../../src/interfaces/IEmissionManager.sol';
import {LMSetupBaseTest} from '../utils/LMSetupBaseTest.sol';
import {IPermissionedPayloadsController, PayloadsControllerUtils, IPayloadsControllerCore} from 'aave-address-book/governance-v3/IPermissionedPayloadsController.sol';

// TEMPORARY IMPORTS
import {IOwnable} from 'aave-address-book/common/IOwnable.sol';
import {TransparentProxyFactory} from 'solidity-utils/contracts/transparent-proxy/TransparentProxyFactory.sol';
import {ProxyAdmin} from 'solidity-utils/contracts/transparent-proxy/ProxyAdmin.sol';
import {Executor} from 'aave-governance-v3/contracts/payloads/Executor.sol';
import {PermissionedPayloadsController} from 'aave-governance-v3/contracts/payloads/PermissionedPayloadsController.sol';
import {IERC20} from 'forge-std/interfaces/IERC20.sol';

contract EmissionTestMATICXPolygon is LMSetupBaseTest {
  address public constant override REWARD_ASSET = AaveV3PolygonAssets.MaticX_UNDERLYING;
  uint88 constant DURATION_DISTRIBUTION = 180 days;
  uint256 public constant override TOTAL_DISTRIBUTION = 60000 * 10 ** 18;
  address public EMISSION_ADMIN;
  address public constant override DEFAULT_INCENTIVES_CONTROLLER =
    AaveV3Polygon.DEFAULT_INCENTIVES_CONTROLLER;

  // temp non const
  IPermissionedPayloadsController internal PAYLOADS_CONTROLLER;

  ITransferStrategyBase public constant override TRANSFER_STRATEGY =
    ITransferStrategyBase(0x53F57eAAD604307889D87b747Fc67ea9DE430B01);

  IEACAggregatorProxy public constant override REWARD_ORACLE =
    IEACAggregatorProxy(AaveV3PolygonAssets.MaticX_ORACLE);

  address constant vMaticX_WHALE = 0xd0F7cB3Bf8560b1D8E20792A79F4D3aD5406014e;

  function setUp() public virtual {
    vm.createSelectFork(vm.rpcUrl('polygon'), 60952423);

    tempFunctionality();
  }

  function buildActions() public view returns (IPayloadsControllerCore.ExecutionAction[] memory) {
    IPayloadsControllerCore.ExecutionAction[]
      memory actions = new IPayloadsControllerCore.ExecutionAction[](1);
    actions[0].target = AaveV3Polygon.EMISSION_MANAGER;
    actions[0].accessLevel = PayloadsControllerUtils.AccessControl.Level_1;
    actions[0].callData = abi.encodeWithSelector(
      IEmissionManager.configureAssets.selector,
      _getAssetConfigs()
    );
    return actions;
  }

  function test_activation() public {
    address payloadsManager = PAYLOADS_CONTROLLER.payloadsManager();

    IPayloadsControllerCore.ExecutionAction[] memory actions = buildActions();

    uint40 initialTimestamp = uint40(block.timestamp);
    uint40 delay = PAYLOADS_CONTROLLER
      .getExecutorSettingsByAccessControl(PayloadsControllerUtils.AccessControl.Level_1)
      .delay;

    // solium-disable-next-line
    vm.warp(initialTimestamp - delay - 1);
    vm.prank(payloadsManager);
    uint40 payloadId = PAYLOADS_CONTROLLER.createPayload(actions);
    // solium-disable-next-line
    vm.warp(initialTimestamp);

    PAYLOADS_CONTROLLER.executePayload(payloadId);

    _testClaimRewardsForWhale(
      vMaticX_WHALE,
      AaveV3PolygonAssets.WPOL_V_TOKEN,
      DURATION_DISTRIBUTION,
      7150 * 10 ** 18
    );
  }

  function _getAssetConfigs()
    internal
    view
    override
    returns (RewardsDataTypes.RewardsConfigInput[] memory)
  {
    uint32 distributionEnd = uint32(block.timestamp + DURATION_DISTRIBUTION);

    EmissionPerAsset[] memory emissionsPerAsset = _getEmissionsPerAsset();

    RewardsDataTypes.RewardsConfigInput[]
      memory configs = new RewardsDataTypes.RewardsConfigInput[](emissionsPerAsset.length);
    for (uint256 i = 0; i < emissionsPerAsset.length; i++) {
      configs[i] = RewardsDataTypes.RewardsConfigInput({
        emissionPerSecond: _toUint88(emissionsPerAsset[i].emission / DURATION_DISTRIBUTION),
        totalSupply: 0, // IMPORTANT this will not be taken into account by the contracts, so 0 is fine
        distributionEnd: distributionEnd,
        asset: emissionsPerAsset[i].asset,
        reward: REWARD_ASSET,
        transferStrategy: TRANSFER_STRATEGY,
        rewardOracle: REWARD_ORACLE
      });
    }

    return configs;
  }

  function _getEmissionsPerAsset() internal pure override returns (EmissionPerAsset[] memory) {
    EmissionPerAsset[] memory emissionsPerAsset = new EmissionPerAsset[](1);

    emissionsPerAsset[0] = EmissionPerAsset({
      asset: AaveV3PolygonAssets.WPOL_V_TOKEN,
      emission: 60000 * 10 ** 18
    });

    uint256 totalDistribution;
    for (uint256 i = 0; i < emissionsPerAsset.length; i++) {
      totalDistribution += emissionsPerAsset[i].emission;
    }
    require(totalDistribution == TOTAL_DISTRIBUTION, 'INVALID_SUM_OF_EMISSIONS');

    return emissionsPerAsset;
  }

  // todo: remove
  function tempFunctionality() internal {
    Executor executor = new Executor();
    PermissionedPayloadsController permissionedPayloadsControllerImpl = new PermissionedPayloadsController();

    IPayloadsControllerCore.UpdateExecutorInput[]
      memory executorInput = new IPayloadsControllerCore.UpdateExecutorInput[](1);
    executorInput[0].accessLevel = PayloadsControllerUtils.AccessControl.Level_1;
    executorInput[0].executorConfig.executor = address(executor);
    executorInput[0].executorConfig.delay = 1 days;

    TransparentProxyFactory proxyFactory = new TransparentProxyFactory();
    PAYLOADS_CONTROLLER = IPermissionedPayloadsController(
      proxyFactory.create(
        address(permissionedPayloadsControllerImpl),
        ProxyAdmin(address(728)),
        abi.encodeWithSelector(
          IPermissionedPayloadsController.initialize.selector,
          address(490),
          address(659),
          executorInput
        )
      )
    );

    address emissionManagerOwner = IOwnable(AaveV3Polygon.EMISSION_MANAGER).owner();
    vm.prank(emissionManagerOwner);
    IEmissionManager(AaveV3Polygon.EMISSION_MANAGER).setEmissionAdmin(
      REWARD_ASSET,
      address(executor)
    );
    EMISSION_ADMIN = address(executor);

    IOwnable(address(executor)).transferOwnership(address(PAYLOADS_CONTROLLER));

    address rewardsVault = TRANSFER_STRATEGY.getRewardsVault();
    deal(REWARD_ASSET, rewardsVault, TOTAL_DISTRIBUTION);

    vm.prank(rewardsVault);
    IERC20(REWARD_ASSET).approve(address(TRANSFER_STRATEGY), TOTAL_DISTRIBUTION);
  }
}
