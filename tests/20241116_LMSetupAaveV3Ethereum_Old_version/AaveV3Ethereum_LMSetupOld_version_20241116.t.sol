// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {AaveV3Ethereum, AaveV3EthereumAssets} from 'aave-address-book/AaveV3Ethereum.sol';
import {IEmissionManager, ITransferStrategyBase, RewardsDataTypes, IEACAggregatorProxy} from '../../src/interfaces/IEmissionManager.sol';
import {LMSetupBaseTest} from '../utils/LMSetupBaseTest.sol';
import {PullRewardsTransferStrategy} from 'aave-v3-origin/contracts/rewards/transfer-strategies/PullRewardsTransferStrategy.sol';

import {Executor} from 'aave-governance-v3/contracts/payloads/Executor.sol';
import {PermissionedPayloadsController, IPayloadsControllerCore, PayloadsControllerUtils, IPermissionedPayloadsController} from 'aave-governance-v3/contracts/payloads/PermissionedPayloadsController.sol';
import {TransparentProxyFactory} from 'solidity-utils/contracts/transparent-proxy/TransparentProxyFactory.sol';
import {IOwnable} from 'solidity-utils/contracts/transparent-proxy/interfaces/IOwnable.sol';

contract AaveV3Ethereum_LMSetupOld_version_20241116 is LMSetupBaseTest {
  address public constant override REWARD_ASSET = AaveV3EthereumAssets.WETH_UNDERLYING;
  uint88 constant DURATION_DISTRIBUTION = 180 days;
  uint256 public constant override TOTAL_DISTRIBUTION = 2400 * 10 ** 18;
  address public EMISSION_ADMIN;
  address public constant override DEFAULT_INCENTIVES_CONTROLLER =
    AaveV3Ethereum.DEFAULT_INCENTIVES_CONTROLLER;

  ITransferStrategyBase public override TRANSFER_STRATEGY;

  IEACAggregatorProxy public constant override REWARD_ORACLE =
    IEACAggregatorProxy(AaveV3EthereumAssets.WETH_ORACLE);

  address constant vWETH_WHALE = 0xb054D7551BdA6676F2F812aaE2B2CD537df5CdEe;
  address constant aWETH_WHALE = 0x9df8dd68C73b096Cd9C0c4963fe89613DF40a1Cf;

  IPermissionedPayloadsController permissionedPayloadsController;

  function setUp() public {
    vm.createSelectFork(vm.rpcUrl('mainnet'), 21199955);
    Executor executor = new Executor();

    permissionedPayloadsController = new PermissionedPayloadsController();

    IPayloadsControllerCore.UpdateExecutorInput[]
      memory executorInput = new IPayloadsControllerCore.UpdateExecutorInput[](1);
    executorInput[0].accessLevel = PayloadsControllerUtils.AccessControl.Level_1;
    executorInput[0].executorConfig.executor = address(executor);
    executorInput[0].executorConfig.delay = 1 days;

    TransparentProxyFactory proxyFactory = new TransparentProxyFactory();
    permissionedPayloadsController = IPermissionedPayloadsController(
      proxyFactory.create(
        address(permissionedPayloadsController),
        address(728),
        abi.encodeWithSelector(
          IPermissionedPayloadsController.initialize.selector,
          address(415),
          address(490),
          address(659),
          executorInput
        )
      )
    );

    address emissionManagerOwner = IOwnable(AaveV3Ethereum.EMISSION_MANAGER).owner();
    vm.prank(emissionManagerOwner);
    IEmissionManager(AaveV3Ethereum.EMISSION_MANAGER).setEmissionAdmin(
      REWARD_ASSET,
      address(executor)
    );
    EMISSION_ADMIN = address(executor);

    IOwnable(address(executor)).transferOwnership(address(permissionedPayloadsController));
    TRANSFER_STRATEGY = ITransferStrategyBase(
      address(new PullRewardsTransferStrategy(DEFAULT_INCENTIVES_CONTROLLER, address(737), address(780)))
    );
  }

  function buildActions() public view returns (IPayloadsControllerCore.ExecutionAction[] memory) {
    IPayloadsControllerCore.ExecutionAction[]
      memory actions = new IPayloadsControllerCore.ExecutionAction[](1);
    actions[0].target = AaveV3Ethereum.EMISSION_MANAGER;
    actions[0].accessLevel = PayloadsControllerUtils.AccessControl.Level_1;
    actions[0].callData = abi.encodeWithSelector(
      IEmissionManager.configureAssets.selector,
      _getAssetConfigs()
    );
    return actions;
  }

  function test_activation() public {
    address payloadsManager = permissionedPayloadsController.payloadsManager();

    IPayloadsControllerCore.ExecutionAction[] memory actions = buildActions();

    uint40 initialTimestamp = uint40(block.timestamp);
    uint40 delay = permissionedPayloadsController
      .getExecutorSettingsByAccessControl(PayloadsControllerUtils.AccessControl.Level_1)
      .delay;

    // solium-disable-next-line
    vm.warp(initialTimestamp - delay - 1);
    vm.prank(payloadsManager);
    uint40 payloadId = permissionedPayloadsController.createPayload(actions);
    // solium-disable-next-line
    vm.warp(initialTimestamp);

    permissionedPayloadsController.executePayload(payloadId);

    _testClaimRewardsForWhale(
      vWETH_WHALE,
      AaveV3EthereumAssets.WETH_V_TOKEN,
      DURATION_DISTRIBUTION,
      4.77 * 10 ** 18
    );

    _testClaimRewardsForWhale(
      aWETH_WHALE,
      AaveV3EthereumAssets.WETH_A_TOKEN,
      DURATION_DISTRIBUTION,
      12.72 * 10 ** 18
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
    EmissionPerAsset[] memory emissionsPerAsset = new EmissionPerAsset[](2);

    emissionsPerAsset[0] = EmissionPerAsset({
      asset: AaveV3EthereumAssets.WETH_V_TOKEN,
      emission: 400 * 10 ** 18
    });

    emissionsPerAsset[1] = EmissionPerAsset({
      asset: AaveV3EthereumAssets.WETH_A_TOKEN,
      emission: 2000 * 10 ** 18
    });

    uint256 totalDistribution;
    for (uint256 i = 0; i < emissionsPerAsset.length; i++) {
      totalDistribution += emissionsPerAsset[i].emission;
    }
    require(totalDistribution == TOTAL_DISTRIBUTION, 'INVALID_SUM_OF_EMISSIONS');

    return emissionsPerAsset;
  }
}
