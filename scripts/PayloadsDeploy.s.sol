// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {PermissionedControllerEmissionTestMATICXPolygon, IPermissionedPayloadsController} from '../tests/PermissionedControllerEmissionTestMATICXPolygon.sol';
import {Script} from 'forge-std/Script.sol';

contract PayloadsDeploy is PermissionedControllerEmissionTestMATICXPolygon, Script {
  // solium-disable-next-line
  function setUp() public override {}

  function run() public {
    // todo: specify address when permissioned payloads controller will be deployed
    address controller;
    IPermissionedPayloadsController.ExecutionAction[] memory actions = buildActions();
    vm.startBroadcast();
    IPermissionedPayloadsController(controller).createPayload(actions);
    vm.stopBroadcast();
  }
}
