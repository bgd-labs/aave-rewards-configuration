// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {Test, console} from 'forge-std/Test.sol';
import {IERC20} from 'forge-std/interfaces/IERC20.sol';
import {IRewardsController} from 'aave-umbrella/src/contracts/rewards/interfaces/IRewardsController.sol';
import {IRewardsStructs} from 'aave-umbrella/src/contracts/rewards/interfaces/IRewardsStructs.sol';
import {EngineFlags} from 'aave-v3-origin/contracts/extensions/v3-config-engine/EngineFlags.sol';

import {IPermissionedPayloadsController, PayloadsControllerUtils} from '../../src/interfaces/IPermissionedPayloadsController.sol';

abstract contract UmbrellaRewardsBaseTest is Test {
  struct RewardConfig {
    address asset;
    address reward;
    address rewardPayer;
    uint256 maxEmissionPerSecond;
    uint256 distributionEnd;
  }

  struct NetworkConfig {
    string networkName;
    address rewardsController;
    address permissionedPayloadsController;
  }

  function setUp() public {
    vm.createSelectFork(networkConfig().networkName);
  }

  function configureUpdates() public virtual returns (RewardConfig[] memory);

  function networkConfig() public virtual returns (NetworkConfig memory);

  function test_logCalldatas() public {
    _getCalldata();
  }

  function test_sanity() public {
    RewardConfig[] memory config = configureUpdates();

    for (uint256 i = 0; i < config.length; i++) {
      RewardConfig memory cfg = config[i];
      IRewardsStructs.RewardDataExternal memory currentRewardData = IRewardsController(
        networkConfig().rewardsController
      ).getRewardData(cfg.asset, cfg.reward);

      if (cfg.maxEmissionPerSecond != EngineFlags.KEEP_CURRENT && currentRewardData.maxEmissionPerSecond != 0) {
        vm.assertApproxEqRel(
          cfg.maxEmissionPerSecond,
          currentRewardData.maxEmissionPerSecond,
          0.75e18 // 75%
          ,
          'maxEmissionPerSecond change more than 75% than currently configured'
        );
      }

      if (cfg.distributionEnd != EngineFlags.KEEP_CURRENT && currentRewardData.distributionEnd != 0) {
        vm.assertLt(
          cfg.distributionEnd,
          currentRewardData.distributionEnd + 366 days,
          'distributionEnd increased by more than 1 year than currently configured'
        );
      }
    }
  }

  function _getCalldata() internal returns (address[] memory targets, bytes[] memory calldatas) {
    RewardConfig[] memory config = configureUpdates();
    NetworkConfig memory network = networkConfig();

    calldatas = new bytes[](config.length);
    targets = new address[](config.length);

    console.log('------------------------------------------------------------------------------------');
    console.log(
        'Safe Address',
        IPermissionedPayloadsController(network.permissionedPayloadsController).payloadsManager()
      );
    console.log('Target Contract', network.permissionedPayloadsController);
    console.log('------------------------------------------------------------------------------------');

    for (uint256 i = 0; i < config.length; i++) {
      RewardConfig memory cfg = config[i];

      bool maxEmissionsSame;
      bool distributionEndSame;

      IRewardsStructs.RewardDataExternal memory currentRewardData = IRewardsController(
        network.rewardsController
      ).getRewardData(cfg.asset, cfg.reward);

      if (cfg.maxEmissionPerSecond == EngineFlags.KEEP_CURRENT) {
        maxEmissionsSame = true;
        cfg.maxEmissionPerSecond = currentRewardData.maxEmissionPerSecond;
      }

      if (cfg.distributionEnd == EngineFlags.KEEP_CURRENT) {
        distributionEndSame = true;
        cfg.distributionEnd = currentRewardData.distributionEnd;
      }

      if (cfg.rewardPayer == EngineFlags.KEEP_CURRENT_ADDRESS) {
        revert('REWARD_PAYER_CANNOT_BE_KEEP_CURRENT');
      }

      IRewardsStructs.RewardSetupConfig[]
        memory rewardConfigs = new IRewardsStructs.RewardSetupConfig[](1);
      rewardConfigs[0] = IRewardsStructs.RewardSetupConfig({
        reward: cfg.reward,
        rewardPayer: cfg.rewardPayer,
        maxEmissionPerSecond: cfg.maxEmissionPerSecond,
        distributionEnd: cfg.distributionEnd
      });

      bytes memory rewardsCalldata = abi.encodeCall(
        IRewardsController.configureRewards,
        (cfg.asset, rewardConfigs)
      );

      // mock execution
      IPermissionedPayloadsController.ExecutorConfig
        memory executorConfig = IPermissionedPayloadsController(
          network.permissionedPayloadsController
        ).getExecutorSettingsByAccessControl(PayloadsControllerUtils.AccessControl.Level_1);

      vm.prank(executorConfig.executor);
      (bool status, ) = network.rewardsController.call(rewardsCalldata);
      assertTrue(status, 'Call to rewards controller reverted');

      targets[i] = network.permissionedPayloadsController;
      calldatas[i] = abi.encodeCall(
        IPermissionedPayloadsController.createPayload,
        _createAction(network.rewardsController, rewardsCalldata)
      );

      console.log('Changelog for reward', IERC20(cfg.reward).symbol(), ' asset', IERC20(cfg.asset).symbol());
      if (maxEmissionsSame) {
        console.log('maxEmissionsPerSecond: UNCHANGED');
      } else {
        console.log('maxEmissionsPerSecond: Changed from', currentRewardData.maxEmissionPerSecond, ' to', cfg.maxEmissionPerSecond);
      }
      if (distributionEndSame) {
        console.log('distributionEnd: UNCHANGED');
      } else {
        console.log('distributionEnd: Changed from', currentRewardData.distributionEnd, ' to', cfg.distributionEnd);
      }

      console.log('Calldata: ');
      console.logBytes(calldatas[i]);
      console.log('');
    }
  }

  function _createAction(
    address target,
    bytes memory txCalldata
  ) internal pure returns (IPermissionedPayloadsController.ExecutionAction[] memory actions) {
    actions = new IPermissionedPayloadsController.ExecutionAction[](1);
    actions[0] = IPermissionedPayloadsController.ExecutionAction({
      target: target,
      withDelegateCall: false,
      value: 0,
      accessLevel: PayloadsControllerUtils.AccessControl.Level_1,
      signature: '',
      callData: txCalldata
    });
  }
}
