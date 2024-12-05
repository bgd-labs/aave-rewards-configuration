// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {IPermissionedPayloadsController} from 'aave-address-book/governance-v3/IPermissionedPayloadsController.sol';
import {EmissionTestMATICXPolygon} from './EmissionTestMATICXPolygon.t.sol';
import {Script} from 'forge-std/Script.sol';

/**
 * @dev Deploy Polygon
 * deploy-command: make deploy-ledger contract=scripts/EmissionMATICXPolygonConfigurationDeploy.s.sol chain=polygon
 */

/**
 * @dev Deploy Polygon
 * deploy-command:
 * make deploy-ledger contract=scripts/EmissionMATICXPolygonConfigurationDeploy.s.sol chain=polygon
 * or
 * make deploy-private-key contract=scripts/EmissionMATICXPolygonConfigurationDeploy.s.sol chain=polygon private_key=$\{PRIVATE_KEY\}
 */
contract EmissionMATICXPolygonConfigurationDeploy is
  EmissionTestMATICXPolygon,
  Script
{
  // solium-disable-next-line
  function setUp() public override {}

  function run() public {
    IPermissionedPayloadsController.ExecutionAction[] memory actions = buildActions();
    vm.startBroadcast();
    PAYLOADS_CONTROLLER.createPayload(actions);
    vm.stopBroadcast();
  }
}
