// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {PermissionedControllerEmissionTestMATICXPolygon, IPermissionedPayloadsController} from '../tests/PermissionedControllerEmissionTestMATICXPolygon.sol';
import {Script} from 'forge-std/Script.sol';

contract PayloadsDeploy is PermissionedControllerEmissionTestMATICXPolygon, Script {
  function setUp() public override {}

  function run() public {
    uint256 ownerKey = 0x47e179ec197488593b187f80a00eb0da91f1b9d0b13f8733639f19c30a34926a;
    address controller = 0x75537828f2ce51be7289709686A69CbFDbB714F1;
    IPermissionedPayloadsController.ExecutionAction[] memory actions = buildActions();
    vm.startBroadcast(ownerKey);
    IPermissionedPayloadsController(controller).createPayload(actions);
    vm.stopBroadcast();
  }
}
