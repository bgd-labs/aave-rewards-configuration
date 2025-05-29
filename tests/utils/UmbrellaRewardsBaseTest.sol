// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {Test, console} from 'forge-std/Test.sol';
import {strings} from 'solidity-stringutils/src/strings.sol';
import {IRewardsController} from 'aave-umbrella/src/contracts/rewards/interfaces/IRewardsController.sol';
import {IRewardsStructs} from 'aave-umbrella/src/contracts/rewards/interfaces/IRewardsStructs.sol';
import {EngineFlags} from 'aave-v3-origin/contracts/extensions/v3-config-engine/EngineFlags.sol';
import {Safe} from 'safe-utils/Safe.sol';

import {IPermissionedPayloadsController, PayloadsControllerUtils} from '../../src/interfaces/IPermissionedPayloadsController.sol';

abstract contract UmbrellaRewardsBaseTest is Test {
  using Safe for *;
  using strings for *;

  Safe.Client internal _safe;

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

    address payloadsManager = IPermissionedPayloadsController(
      networkConfig().permissionedPayloadsController
    ).payloadsManager();
    _safe.initialize(payloadsManager);
  }

  function configureUpdates() public virtual returns (RewardConfig[] memory);

  function networkConfig() public virtual returns (NetworkConfig memory);

  function test_sendTransactionViaPrivateKey() public {
    (address[] memory targets, bytes[] memory calldatas) = _getCalldata();
    vm.rememberKey(vm.envUint('PRIVATE_KEY'));

    for (uint256 i = 0; i < targets.length; i++) {
      _safe.proposeTransaction(targets[i], calldatas[i], vm.envAddress('SENDER'));
    }
  }

  function test_sendTransactionViaLedger() public {
    (address[] memory targets, bytes[] memory calldatas) = _getCalldata();

    _safe.proposeTransactions(
      targets,
      calldatas,
      vm.envAddress('LEDGER_SENDER'),
      string.concat("m/44'/60'/0'/0/", vm.envString('MNEMONIC_INDEX'))
    );
  }

  function test_logCalldatas() public {
    _getCalldata();
  }

  function _getCalldata() internal returns (address[] memory targets, bytes[] memory calldatas) {
    RewardConfig[] memory config = configureUpdates();
    NetworkConfig memory network = networkConfig();

    calldatas = new bytes[](config.length);
    targets = new address[](config.length);

    for (uint256 i = 0; i < config.length; i++) {
      RewardConfig memory cfg = config[i];

      if (
        cfg.maxEmissionPerSecond == EngineFlags.KEEP_CURRENT ||
        cfg.distributionEnd == EngineFlags.KEEP_CURRENT
      ) {
        IRewardsStructs.RewardDataExternal memory currentRewardData = IRewardsController(
          network.rewardsController
        ).getRewardData(cfg.asset, cfg.reward);

        if (cfg.maxEmissionPerSecond == EngineFlags.KEEP_CURRENT) {
          cfg.maxEmissionPerSecond = currentRewardData.maxEmissionPerSecond;
        }

        if (cfg.distributionEnd == EngineFlags.KEEP_CURRENT) {
          cfg.distributionEnd = currentRewardData.distributionEnd;
        }

        if (cfg.rewardPayer == EngineFlags.KEEP_CURRENT_ADDRESS) {
          revert('REWARD_PAYER_CANNOT_BE_KEEP_CURRENT');
        }
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

      console.log(
        'Safe Address',
        IPermissionedPayloadsController(network.permissionedPayloadsController).payloadsManager()
      );
      console.log('Target Contract', network.permissionedPayloadsController);
      console.log('Calldata ', i, ' :');
      console.logBytes(calldatas[i]);
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
