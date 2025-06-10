import path from 'path';
import {Command, Option} from 'commander';
import {CHAIN_TO_CHAIN_ID, getDate, getPoolChain, pascalCase} from './common';
import {input, select} from '@inquirer/prompts';
import {ConfigFile, FEATURE, Options, POOLS, PoolCache, PoolConfigs, PoolIdentifier} from './types';
import {generateFiles, writeFiles} from './generator';
import {CHAIN_ID_CLIENT_MAP} from '@bgd-labs/js-utils';
import {getBlockNumber} from 'viem/actions';
import {setupLiquidityMining} from './features/setupLiquidityMining';
import {updateLiquidityMining} from './features/updateLiquidityMining';
import {updateUmbrellaRewards} from './features/updateUmbrellaRewards';
import {LiquidityMiningSetup, LiquidityMiningUpdate, UmbrellaRewardsUpdate} from './features/types';

const program = new Command();

program
  .name('aave-reward-configurations-generator')
  .description('CLI to generate scripts for updating umbrella rewards and LM on aave')
  .version('1.0.0')
  .addOption(new Option('-f, --force', 'force creation (might overwrite existing files)'))
  .addOption(new Option('-c, --configFile <string>', 'path to config file'))
  .allowExcessArguments(false)
  .parse(process.argv);

let options = program.opts<Options>();
let poolConfigs: PoolConfigs = {};

const FEATURE_MODULES = [setupLiquidityMining, updateLiquidityMining, updateUmbrellaRewards];

async function generateDeterministicPoolCache(pool: PoolIdentifier): Promise<PoolCache> {
  const chain = getPoolChain(pool);
  const client = CHAIN_ID_CLIENT_MAP[CHAIN_TO_CHAIN_ID[chain]];
  return {blockNumber: Number(await getBlockNumber(client))};
}

async function fetchLMSetupOptions(pool: PoolIdentifier) {
  poolConfigs[pool] = {
    configs: {},
    artifacts: [],
    cache: await generateDeterministicPoolCache(pool),
  };

  const feature = FEATURE.SETUP_LM;
  const module = setupLiquidityMining;
  poolConfigs[pool]!.configs[feature] = await module.cli({
    options,
    pool,
    cache: poolConfigs[pool]!.cache,
  });
  poolConfigs[pool]!.artifacts.push(
    await module.build({
      options,
      pool,
      cfg: poolConfigs[pool]!.configs[feature],
      cache: poolConfigs[pool]!.cache,
    })
  );
}

async function fetchLMUpdateOptions(pool: PoolIdentifier) {
  poolConfigs[pool] = {
    configs: {},
    artifacts: [],
    cache: await generateDeterministicPoolCache(pool),
  };

  const feature = FEATURE.UPDATE_LM;
  const module = updateLiquidityMining;
  poolConfigs[pool]!.configs[feature] = await module.cli({
    options,
    pool,
    cache: poolConfigs[pool]!.cache,
  });
  poolConfigs[pool]!.artifacts.push(
    await module.build({
      options,
      pool,
      cfg: poolConfigs[pool]!.configs[feature],
      cache: poolConfigs[pool]!.cache,
    })
  );
}

async function fetchUmbrellaRewardsOptions(pool: PoolIdentifier) {
  poolConfigs[pool] = {
    configs: {},
    artifacts: [],
    cache: await generateDeterministicPoolCache(pool),
  };

  const feature = FEATURE.UPDATE_UMBRELLA_REWARDS;
  const module = updateUmbrellaRewards;
  poolConfigs[pool]!.configs[feature] = await module.cli({
    options,
    pool,
    cache: poolConfigs[pool]!.cache,
  });
  poolConfigs[pool]!.artifacts.push(
    await module.build({
      options,
      pool,
      cfg: poolConfigs[pool]!.configs[feature],
      cache: poolConfigs[pool]!.cache,
    })
  );
}

if (options.configFile) {
  const {config: cfgFile}: {config: ConfigFile} = await import(
    path.join(process.cwd(), options.configFile)
  );
  options = {...options, ...cfgFile.rootOptions};
  poolConfigs = cfgFile.poolOptions as any;
  poolConfigs[options.pool]!.artifacts = [];

  if (options.feature == FEATURE.SETUP_LM) {
    poolConfigs[options.pool]!.artifacts.push(
      await setupLiquidityMining.build({
        options,
        pool: options.pool,
        cfg: poolConfigs[options.pool]!.configs[FEATURE.SETUP_LM] as LiquidityMiningSetup,
        cache: poolConfigs[options.pool]!.cache,
      })
    );
  } else if (options.feature == FEATURE.UPDATE_LM) {
    poolConfigs[options.pool]!.artifacts.push(
      await updateLiquidityMining.build({
        options,
        pool: options.pool,
        cfg: poolConfigs[options.pool]!.configs[FEATURE.UPDATE_LM] as LiquidityMiningUpdate,
        cache: poolConfigs[options.pool]!.cache,
      })
    );
  } else {
    poolConfigs[options.pool]!.artifacts.push(
      await updateUmbrellaRewards.build({
        options,
        pool: options.pool,
        cfg: poolConfigs[options.pool]!.configs[
          FEATURE.UPDATE_UMBRELLA_REWARDS
        ] as UmbrellaRewardsUpdate[],
        cache: poolConfigs[options.pool]!.cache,
      })
    );
  }
} else {
  options.feature = await select({
    message: 'Please select the reward action you want to do',
    choices: FEATURE_MODULES.map((m) => ({name: m.description, value: m.value})),
  });

  options.pool = await select({
    message: 'Select the Aave Pool:',
    choices:
      options.feature === FEATURE.UPDATE_UMBRELLA_REWARDS
        ? [
            {name: 'AaveV3Ethereum', value: 'AaveV3Ethereum'},
            {name: 'AaveV3BaseSepolia', value: 'AaveV3BaseSepolia'},
          ]
        : POOLS.map((v) => ({name: v, value: v})),
  });

  if (!options.title) {
    options.title = await input({
      message: 'Short title of the rewards program:',
      validate(input) {
        if (input.length == 0) return "Your title can't be empty";
        if (input.trim().length > 80) return 'Your title is to long';
        return true;
      },
    });
  }
  options.shortName = pascalCase(options.title);
  options.date = getDate();

  if (options.feature === FEATURE.SETUP_LM) {
    await fetchLMSetupOptions(options.pool);
  } else if (options.feature === FEATURE.UPDATE_LM) {
    await fetchLMUpdateOptions(options.pool);
  } else {
    await fetchUmbrellaRewardsOptions(options.pool);
  }
}

try {
  const files = await generateFiles(options, poolConfigs);
  await writeFiles(options, files);
} catch (e) {
  console.log(JSON.stringify({options, poolConfigs}, null, 2));
  throw e;
}
