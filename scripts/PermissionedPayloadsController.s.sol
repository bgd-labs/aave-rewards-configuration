// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Script} from "forge-std/Script.sol";
import {TransparentProxyFactory} from 'solidity-utils/contracts/transparent-proxy/TransparentProxyFactory.sol';
import {Executor} from 'aave-governance-v3/contracts/payloads/Executor.sol';
import {PermissionedPayloadsController, IPayloadsControllerCore, PayloadsControllerUtils, IPermissionedPayloadsController} from 'aave-governance-v3/contracts/payloads/PermissionedPayloadsController.sol';
import {TransparentProxyFactory} from 'solidity-utils/contracts/transparent-proxy/TransparentProxyFactory.sol';
import {IOwnable} from 'solidity-utils/contracts/transparent-proxy/interfaces/IOwnable.sol';

contract PermissionedPayloadsControllerDeploy is Script {
  function run() public {
    address owner = 0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65;
    address proxyOwner = vm.addr(456);
    vm.startBroadcast();
    Executor executor = new Executor();
    
    IPayloadsControllerCore.UpdateExecutorInput[]
      memory executorInput = new IPayloadsControllerCore.UpdateExecutorInput[](1);
    executorInput[0].accessLevel = PayloadsControllerUtils.AccessControl.Level_1;
    executorInput[0].executorConfig.executor = address(executor);
    executorInput[0].executorConfig.delay = 1 days;
    IPermissionedPayloadsController permissionedPayloadsController = new PermissionedPayloadsController();
    
    TransparentProxyFactory proxyFactory = new TransparentProxyFactory();

    permissionedPayloadsController = IPermissionedPayloadsController(
      proxyFactory.create(
        address(permissionedPayloadsController),
        proxyOwner,
        abi.encodeWithSelector(
          IPermissionedPayloadsController.initialize.selector,
          owner,
          owner,
          owner,
          executorInput
        )
      )
    );

    IOwnable(address(executor)).transferOwnership(address(permissionedPayloadsController));
    vm.stopBroadcast();

  }
}