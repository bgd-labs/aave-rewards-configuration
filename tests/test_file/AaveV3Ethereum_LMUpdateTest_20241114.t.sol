// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {AaveV3Ethereum, AaveV3EthereumAssets} from 'aave-address-book/AaveV3Ethereum.sol';
import {IEmissionManager, ITransferStrategyBase, RewardsDataTypes, IEACAggregatorProxy} from '../../src/interfaces/IEmissionManager.sol';
import {LMUpdateBaseTest} from '../utils/LMUpdateBaseTest.sol';
// uncomment when aave-governance-v3 dependency is removed
// import {IPayloadsControllerCore, PayloadsControllerUtils} from 'aave-address-book/GovernanceV3.sol';
import {IOwnable} from 'solidity-utils/contracts/transparent-proxy/interfaces/IOwnable.sol';
import {TransparentProxyFactory} from 'solidity-utils/contracts/transparent-proxy/TransparentProxyFactory.sol';
import {Executor} from 'aave-governance-v3/contracts/payloads/Executor.sol';
import {PermissionedPayloadsController, IPayloadsControllerCore, PayloadsControllerUtils, IPermissionedPayloadsController} from 'aave-governance-v3/contracts/payloads/PermissionedPayloadsController.sol';

contract AaveV3Ethereum_LMUpdateTest_20241114 is LMUpdateBaseTest {
  address public constant override REWARD_ASSET = AaveV3EthereumAssets.WETH_UNDERLYING;
  uint256 public constant override NEW_TOTAL_DISTRIBUTION = 400 * 10 ** 18;
  address public override EMISSION_ADMIN;
  address public constant override EMISSION_MANAGER = AaveV3Ethereum.EMISSION_MANAGER;
  uint256 public constant NEW_DURATION_DISTRIBUTION_END = 6 days;
  address public constant aWETH_WHALE = 0x34780C209D5C575cc1C1cEB57aF95D4d2a69ddCF;

  address public constant override DEFAULT_INCENTIVES_CONTROLLER =
    AaveV3Ethereum.DEFAULT_INCENTIVES_CONTROLLER;

  IPermissionedPayloadsController internal permissionedPayloadsController;

  function setUp() public {
    vm.createSelectFork(vm.rpcUrl('mainnet'), 21186966);

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
        address(101112),
        abi.encodeWithSelector(
          IPermissionedPayloadsController.initialize.selector,
          address(456),
          address(789),
          address(123),
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

    IOwnable(address(executor)).transferOwnership(address(permissionedPayloadsController));
  }

  function buildActions() public view returns (IPayloadsControllerCore.ExecutionAction[] memory) {
    NewEmissionPerAsset memory newEmissionPerAsset = _getNewEmissionPerSecond();
    NewDistributionEndPerAsset memory newDistributionEndPerAsset = _getNewDistributionEnd();

    bytes memory newEmissionPerAssetUpdatePayload = abi.encodeWithSelector(
      IEmissionManager.setEmissionPerSecond.selector,
      newEmissionPerAsset.asset,
      newEmissionPerAsset.rewards,
      newEmissionPerAsset.newEmissionsPerSecond
    );

    bytes memory newDistributionEndPerAssetUpdatePayload = abi.encodeWithSelector(
      IEmissionManager.setDistributionEnd.selector,
      newDistributionEndPerAsset.asset,
      newDistributionEndPerAsset.reward,
      newDistributionEndPerAsset.newDistributionEnd
    );

    IPayloadsControllerCore.ExecutionAction[]
      memory executionActions = new IPayloadsControllerCore.ExecutionAction[](2);

    for (uint256 i = 0; i < 2; i++) {
      executionActions[i] = IPayloadsControllerCore.ExecutionAction({
        target: AaveV3Ethereum.EMISSION_MANAGER,
        withDelegateCall: false,
        accessLevel: PayloadsControllerUtils.AccessControl.Level_1,
        value: 0,
        signature: '',
        callData: i == 0
          ? newEmissionPerAssetUpdatePayload
          : newDistributionEndPerAssetUpdatePayload
      });
    }

    return executionActions;
  }

  function test_claimRewards() public {
    address payloadsManager = permissionedPayloadsController.payloadsManager();

    IPayloadsControllerCore.ExecutionAction[] memory actions = buildActions();

    vm.prank(payloadsManager);
    uint40 payloadId = permissionedPayloadsController.createPayload(actions);
    uint40 delay = permissionedPayloadsController.getExecutorSettingsByAccessControl(
      PayloadsControllerUtils.AccessControl.Level_1
    ).delay;
    // solium-disable-next-line
    vm.warp(block.timestamp + delay + 1);

    permissionedPayloadsController.executePayload(payloadId);

    _testClaimRewardsForWhale(
      aWETH_WHALE,
      AaveV3EthereumAssets.WETH_A_TOKEN,
      NEW_DURATION_DISTRIBUTION_END,
      8.89 * 10 ** 18
    );
  }

  function _getNewEmissionPerSecond() internal pure override returns (NewEmissionPerAsset memory) {
    NewEmissionPerAsset memory newEmissionPerAsset;

    address[] memory rewards = new address[](1);
    rewards[0] = REWARD_ASSET;
    uint88[] memory newEmissionsPerSecond = new uint88[](1);
    newEmissionsPerSecond[0] = _toUint88(NEW_TOTAL_DISTRIBUTION / NEW_DURATION_DISTRIBUTION_END);

    newEmissionPerAsset.asset = AaveV3EthereumAssets.WETH_A_TOKEN;
    newEmissionPerAsset.rewards = rewards;
    newEmissionPerAsset.newEmissionsPerSecond = newEmissionsPerSecond;

    return newEmissionPerAsset;
  }

  function _getNewDistributionEnd()
    internal
    view
    override
    returns (NewDistributionEndPerAsset memory)
  {
    NewDistributionEndPerAsset memory newDistributionEndPerAsset;

    newDistributionEndPerAsset.asset = AaveV3EthereumAssets.WETH_A_TOKEN;
    newDistributionEndPerAsset.reward = REWARD_ASSET;
    newDistributionEndPerAsset.newDistributionEnd = _toUint32(
      block.timestamp + NEW_DURATION_DISTRIBUTION_END
    );

    return newDistributionEndPerAsset;
  }
}
