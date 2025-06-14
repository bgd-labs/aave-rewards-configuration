import fs from 'fs';
import path from 'path';
import {generateContractName, generateFolderName} from './common';
import {liquidityMiningSetupTemplate} from './templates/liquiditymining.setup.template';
import {liquidityMiningUpdateTemplate} from './templates/liquiditymining.update.template';
import {umbrellaRewardsUpdateTemplate} from './templates/umbrellarewards.update.template';
import {confirm} from '@inquirer/prompts';
import {ConfigFile, Options, PoolConfigs, PoolIdentifier, Files, FEATURE} from './types';
import prettier from 'prettier';

const prettierSolCfg = await prettier.resolveConfig('foo.sol');
const prettierTsCfg = await prettier.resolveConfig('foo.ts');

/**
 * Generates all the file contents for aip/tests/payloads & script
 * @param options
 * @param poolConfigs
 * @returns
 */
export async function generateFiles(options: Options, poolConfigs: PoolConfigs): Promise<Files> {
  const jsonConfig = await prettier.format(
    `import {ConfigFile} from '../../generator/types';
    export const config: ConfigFile = ${JSON.stringify({
      rootOptions: options,
      poolOptions: (Object.keys(poolConfigs) as PoolIdentifier[]).reduce((acc, pool) => {
        acc[pool] = {configs: poolConfigs[pool]!.configs, cache: poolConfigs[pool]!.cache};
        return acc;
      }, {}),
    } as ConfigFile)}`,
    {...prettierTsCfg, filepath: 'foo.ts'}
  );

  async function createPayloadTest(options: Options, pool: PoolIdentifier) {
    const contractName = generateContractName(options, pool);
    let template: string;
    if (options.feature == FEATURE.SETUP_LM) {
      template = liquidityMiningSetupTemplate(options, poolConfigs[pool]!, pool);
    } else if (options.feature == FEATURE.UPDATE_LM) {
      template = liquidityMiningUpdateTemplate(options, poolConfigs[pool]!, pool);
    } else {
      template = umbrellaRewardsUpdateTemplate(options, poolConfigs[pool]!, pool);
    }

    return {
      pool,
      payloadTest: await prettier.format(template, {
        ...prettierSolCfg,
        filepath: 'foo.sol',
      }),
      contractName: contractName,
    };
  }

  return {
    jsonConfig,
    payloadTest: await createPayloadTest(options, options.pool),
  };
}

async function askBeforeWrite(options: Options, path: string, content: string) {
  if (!options.force && fs.existsSync(path)) {
    const currentContent = fs.readFileSync(path, {encoding: 'utf8'});
    // skip if content did not change
    if (currentContent === content) return;
    const force = await confirm({
      message: `A file already exists at ${path} do you want to overwrite`,
      default: false,
    });
    if (!force) return;
  }
  fs.writeFileSync(path, content);
}

/**
 * Writes the files according to defined folder/file format
 */
export async function writeFiles(options: Options, {jsonConfig, payloadTest}: Files) {
  const baseName = generateFolderName(options);
  const baseFolder = path.join(process.cwd(), 'tests', baseName);

  if (fs.existsSync(baseFolder)) {
    if (!options.force && fs.existsSync(baseFolder)) {
      const force = await confirm({
        message: 'A proposal already exists at that location, do you want to continue?',
        default: false,
      });
      if (!force) return;
    }
  } else {
    fs.mkdirSync(baseFolder, {recursive: true});
  }

  // write config
  await askBeforeWrite(options, path.join(baseFolder, 'config.ts'), jsonConfig);
  // write payloadTest
  await askBeforeWrite(
    options,
    path.join(baseFolder, `${payloadTest.contractName}.t.sol`),
    payloadTest.payloadTest
  );
}
