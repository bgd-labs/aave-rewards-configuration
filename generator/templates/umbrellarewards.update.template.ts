import {generateContractName, generateFolderName, getPoolChain} from '../common';
import {Options, PoolConfig, PoolIdentifier} from '../types';
import {prefixWithImports} from '../utils/importsResolver';
import {prefixWithPragma} from '../utils/constants';

export const umbrellaRewardsUpdateTemplate = (
  options: Options,
  poolConfig: PoolConfig,
  pool: PoolIdentifier
) => {
  const chain = getPoolChain(pool);
  const contractName = generateContractName(options, pool);
  const folderName = generateFolderName(options);
  const path = `tests/${folderName}/${contractName}.t.sol`;

  const constants = poolConfig.artifacts
    .map((artifact) => artifact.code?.constants)
    .flat()
    .filter((f) => f !== undefined)
    .join('\n');
  const functions = poolConfig.artifacts
    .map((artifact) => artifact.code?.fn)
    .flat()
    .filter((f) => f !== undefined)
    .join('\n');

  const contract = `
  /**
   * emit calldata: forge test --mp ${path} --mt test_logCalldatas -vv
   */
  contract ${contractName} is UmbrellaRewardsBaseTest, Umbrella${chain}Config {
   ${constants}

   ${functions}
  }`;

  return prefixWithPragma(prefixWithImports(contract));
};
