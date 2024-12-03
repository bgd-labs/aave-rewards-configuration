import { CHAIN_TO_CHAIN_ID, generateContractName, generateFolderName, generateScriptName, getChainAlias, getPoolChain } from "../common";
import { Options } from "../types";

export const liquidityMiningPayloadDeploymentTemplate = (
  options: Options
) => {
  const testContractName = generateContractName(options, options.pool);
  const poolChain = getPoolChain(options.pool);
  const scriptName = generateScriptName(options, options.pool);
  const chainAlias = getChainAlias(poolChain);
  const folderName = generateFolderName(options);
  const chainId = CHAIN_TO_CHAIN_ID[poolChain];

  return`
  // SPDX-License-Identifier: MIT
  pragma solidity ^0.8.0;


import {${testContractName}, IPermissionedPayloadsController}
  from './${testContractName}.t.sol';
import {${poolChain}Script} from '../../lib/aave-address-book/lib/aave-v3-origin/lib/solidity-utils/src/contracts/utils/ScriptUtils.sol';

/**
 * @dev Deploy ${poolChain} 
 * deploy-command: make deploy-ledger contract=tests/${folderName}/${scriptName}.s.sol:${scriptName} chain=${chainAlias} args="-s \\"run(address)\\" \${PERMISSIONED_PAYLOADS_CONTROLLER_ADDRESS}"
 */
contract ${scriptName} is ${testContractName}, ${poolChain}Script {
  // solium-disable-next-line
  function setUp() public override {}

  // todo: once the new payloadsController deployed, it'll be added to the address book and imported here without function param
  function run(address controller) public {
    IPermissionedPayloadsController.ExecutionAction[] memory actions = buildActions();
    vm.startBroadcast();
    IPermissionedPayloadsController(controller).createPayload(actions);
    vm.stopBroadcast();
  }
}
`;
};
