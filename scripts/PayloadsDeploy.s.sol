// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {PermissionedControllerEmissionTestMATICXPolygon, IPermissionedPayloadsController} from '../tests/PermissionedControllerEmissionTestMATICXPolygon.sol';
import {EthereumScript} from 'solidity-utils/contracts/utils/ScriptUtils.sol';

contract PayloadsDeploy is PermissionedControllerEmissionTestMATICXPolygon, EthereumScript {
  function run() public broadcast {
    address controller = address(123);
    IPermissionedPayloadsController(controller).createPayload(buildActions());
  }
}
