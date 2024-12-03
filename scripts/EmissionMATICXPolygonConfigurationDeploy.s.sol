// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {IPermissionedPayloadsController} from 'aave-address-book/governance-v3/IPermissionedPayloadsController.sol';
import {PermissionedControllerEmissionTestMATICXPolygon} from '../tests/PermissionedControllerEmissionTestMATICXPolygon.t.sol';
import {PolygonScript} from '../../lib/aave-address-book/lib/aave-v3-origin/lib/solidity-utils/src/contracts/utils/ScriptUtils.sol';

/**
 * @dev Deploy Polygon
 * deploy-command: make deploy-ledger contract=scripts/EmissionMATICXPolygonConfigurationDeploy.s.sol chain=polygon args="-s \"run(address)\" ${PERMISSIONED_PAYLOADS_CONTROLLER_ADDRESS}"
 */
contract EmissionMATICXPolygonConfigurationDeploy is
  PermissionedControllerEmissionTestMATICXPolygon,
  PolygonScript
{
  // solium-disable-next-line
  function setUp() public override {}

  // todo: once the new payloadsController deployed, it'll be added to the address book and imported here without function param
  function run() public {
    IPermissionedPayloadsController.ExecutionAction[] memory actions = buildActions();
    vm.startBroadcast();
    PAYLOADS_CONTROLLER.createPayload(actions);
    vm.stopBroadcast();
  }
}
