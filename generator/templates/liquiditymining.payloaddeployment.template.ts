export const liquidityMiningPayloadDeploymentTemplate = (
  poolChain: string,
  testContractName: string,
  scriptName: string
) => {
  return`
  // SPDX-License-Identifier: MIT
  pragma solidity ^0.8.0;

import {${testContractName}, IPermissionedPayloadsController}
  from './${testContractName}.t.sol';
import {${poolChain}Script} from '../../lib/aave-address-book/lib/aave-v3-origin/lib/solidity-utils/src/contracts/utils/ScriptUtils.sol';

contract ${scriptName} is ${testContractName}, ${poolChain}Script {
  // solium-disable-next-line
  function setUp() public override {}

  // todo: specify address when permissioned payloads controller will be deployed
  function run(address controller) public {
    IPermissionedPayloadsController.ExecutionAction[] memory actions = buildActions();
    vm.startBroadcast();
    IPermissionedPayloadsController(controller).createPayload(actions);
    vm.stopBroadcast();
  }
}
`;
};
