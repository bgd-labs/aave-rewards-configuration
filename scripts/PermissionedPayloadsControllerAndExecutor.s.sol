// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Script} from 'forge-std/Script.sol';
import {TransparentProxyFactory} from 'solidity-utils/contracts/transparent-proxy/TransparentProxyFactory.sol';
import {Executor} from 'aave-governance-v3/contracts/payloads/Executor.sol';
import {PermissionedPayloadsController, IPayloadsControllerCore, PayloadsControllerUtils, IPermissionedPayloadsController}
  from 'aave-governance-v3/contracts/payloads/PermissionedPayloadsController.sol';
import {TransparentProxyFactory} from 'solidity-utils/contracts/transparent-proxy/TransparentProxyFactory.sol';
import {IOwnable} from 'solidity-utils/contracts/transparent-proxy/interfaces/IOwnable.sol';

contract PermissionedPayloadsControllerAndExecutorDeploy is Script {
  function run(
    address proxyOwner,
    address guardian,
    address payloadsManager,
    uint40 executionDelay
  ) public {
    vm.startBroadcast();
    Executor executor = new Executor();

    IPayloadsControllerCore.UpdateExecutorInput[]
      memory executorInput = new IPayloadsControllerCore.UpdateExecutorInput[](1);
    executorInput[0].accessLevel = PayloadsControllerUtils.AccessControl.Level_1;
    executorInput[0].executorConfig.executor = address(executor);
    executorInput[0].executorConfig.delay = executionDelay;
    IPermissionedPayloadsController permissionedPayloadsController = new PermissionedPayloadsController();

    TransparentProxyFactory proxyFactory = new TransparentProxyFactory();

    permissionedPayloadsController = IPermissionedPayloadsController(
      proxyFactory.create(
        address(permissionedPayloadsController),
        proxyOwner,
        abi.encodeWithSelector(
          IPermissionedPayloadsController.initialize.selector,
          guardian,
          payloadsManager,
          executorInput
        )
      )
    );

    IOwnable(address(executor)).transferOwnership(address(permissionedPayloadsController));
    vm.stopBroadcast();
  }
}
