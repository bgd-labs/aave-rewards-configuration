import * as addressBook from '@bgd-labs/aave-address-book';
import {IUmbrellaRewardsController_ABI} from '@bgd-labs/aave-address-book/abis';
import {CHAIN_ID_CLIENT_MAP} from '@bgd-labs/js-utils';
import {select} from '@inquirer/prompts';
import {Hex, getContract} from 'viem';
import {CodeArtifact, FEATURE, FeatureModule} from '../types';
import {UmbrellaRewardsUpdate} from './types';
import {addressPrompt} from '../prompts/addressPrompt';
import {numberPrompt, numberPromptInDays, numberPromptNoTransform} from '../prompts/numberPrompt';
import {
  umbrellaStkAssetsSelectPrompt,
  addressCheckboxPromptWithSymbol,
  translateUmbrellaAssetLibUnderlying,
} from '../prompts/assetsSelectPrompt';
import {
  getTokenDecimals,
  getUmbrellaFromPool,
  getPoolChain,
  CHAIN_TO_CHAIN_ID,
  getTokenSymbols,
  getDefaultCollector,
  getMaxEmissionsPerSecondToReadable,
} from '../common';

export async function fetchUmbrellaRewardsUpdateParams({pool}): Promise<UmbrellaRewardsUpdate[]> {
  const chainId: number = CHAIN_TO_CHAIN_ID[getPoolChain(pool)];
  const umbrella = getUmbrellaFromPool(pool);

  let asset = await umbrellaStkAssetsSelectPrompt({
    message: 'Select the umbrella asset for which rewards needs to be updated:',
    pool,
    required: true,
  });
  let assetAddress: Hex;
  if (asset == 'custom') {
    asset = await addressPrompt({
      message: 'Enter the address of the umbrella asset manually:',
      required: true,
    });
    assetAddress = asset as Hex;
  } else {
    assetAddress = addressBook[umbrella].UMBRELLA_STAKE_ASSETS[asset].STAKE_TOKEN;
  }

  const rewardsControllerContract = getContract({
    abi: IUmbrellaRewardsController_ABI,
    client: CHAIN_ID_CLIENT_MAP[chainId],
    address: addressBook[umbrella].UMBRELLA_REWARDS_CONTROLLER,
  });
  const availableRewardAddresses = await rewardsControllerContract.read.getAllRewards([
    assetAddress,
  ]);
  const symbols = await getTokenSymbols(availableRewardAddresses as Hex[], chainId);

  const rewardsAddresses = await addressCheckboxPromptWithSymbol(
    availableRewardAddresses as Hex[],
    symbols,
    'Select the rewards you wish to update for the asset'
  );
  const input: UmbrellaRewardsUpdate[] = [];

  for (const reward of rewardsAddresses) {
    const currentConfig = await rewardsControllerContract.read.getRewardData([
      assetAddress,
      reward.asset,
    ]);
    console.log('----------------------------------------------------------');
    console.log(
      `Current on-chain configuration for the reward: ${reward.symbol} and asset: ${asset}:`
    );
    console.log(
      `maxEmissionsPerSecond: ${
        currentConfig.maxEmissionPerSecond
      } (${await getMaxEmissionsPerSecondToReadable(
        chainId,
        reward.asset,
        Number(currentConfig.maxEmissionPerSecond)
      )})`
    );
    console.log(
      `distributionEnd: ${currentConfig.distributionEnd} (${new Date(
        Number(currentConfig.distributionEnd) * 1000
      ).toDateString()})`
    );
    console.log('----------------------------------------------------------');

    const maxEmissionsPerSecondChoice = await select({
      message: `Please input the maxEmissionsPerSecond you want to configure for the reward: ${reward.symbol} and asset: ${asset}`,
      choices: [
        {name: 'Keep maxEmissionsPerSecond the same as current', value: 'current'},
        {name: 'Enter maxEmissionsPerSecond in token units / days', value: 'units'},
        {name: 'Enter raw maxEmissionsPerSecond', value: 'raw'},
      ],
    });

    let maxEmissionsPerSecond: string;
    if (maxEmissionsPerSecondChoice == 'units') {
      const tokenUnits = await numberPrompt({
        message: 'Enter the token units for maxEmissionsPerSecond',
        required: true,
      });
      const days = await numberPromptInDays({
        message: 'Enter the days for maxEmissionsPerSecond:',
        required: true,
      });
      const tokenDecimals = await getTokenDecimals(reward.asset, chainId);
      maxEmissionsPerSecond = `uint256(${tokenUnits} * 1e${tokenDecimals}) / ${days} days`;
    } else if (maxEmissionsPerSecondChoice == 'raw') {
      maxEmissionsPerSecond = await numberPromptNoTransform(
        {message: 'Enter the maxEmissionsPerSecond raw value', required: true},
        {
          skipTransform: true,
        }
      );
    } else {
      maxEmissionsPerSecond = 'EngineFlags.KEEP_CURRENT';
    }

    const distributionEndChoice = await select({
      message: `Please input the distributionEnd you want to configure for the reward: ${reward.symbol} and asset: ${asset}`,
      choices: [
        {name: 'Keep distributionEnd the same as current', value: 'current'},
        {name: 'Enter distributionEnd in days from current timestamp', value: 'units'},
        {name: 'Enter raw maxEmissionsPerSecond in unix timestamp', value: 'raw'},
      ],
    });

    let distributionEnd: string;
    if (distributionEndChoice == 'units') {
      distributionEnd = await numberPromptInDays({
        message: 'Enter the distributionEnd in days from current timestamp:',
        required: true,
      });
      distributionEnd = `block.timestamp + ${distributionEnd} days`;
    } else if (distributionEndChoice == 'raw') {
      distributionEnd = await numberPromptNoTransform(
        {message: 'Enter the distributionEnd in unix timestamp', required: true},
        {
          skipTransform: true,
        }
      );
    } else {
      distributionEnd = 'EngineFlags.KEEP_CURRENT';
    }

    let rewardPayer = await select({
      message: 'Enter the address of the rewards payer you want to configure',
      choices: [
        {name: 'Aave Collector (Default)', value: getDefaultCollector(pool)},
        {name: 'Custom Address (Enter Manually)', value: 'custom'},
      ],
    });
    if (rewardPayer == 'custom') {
      rewardPayer = await addressPrompt({
        message: 'Enter the address of the new rewards payer you want to configure:',
        required: true,
      });
    }

    input.push({
      asset,
      reward: reward.asset,
      rewardPayer,
      maxEmissionsPerSecond,
      distributionEnd,
    });
  }

  return input;
}

export const updateUmbrellaRewards: FeatureModule<UmbrellaRewardsUpdate[]> = {
  value: FEATURE.UPDATE_UMBRELLA_REWARDS,
  description: 'Updating existing Umbrella Rewards',
  async cli({pool}) {
    console.log(`Fetching information for updating existing umbrella rewards on ${pool}`);
    const response: UmbrellaRewardsUpdate[] = await fetchUmbrellaRewardsUpdateParams({pool});
    return response;
  },
  async build({pool, cfg}) {
    const rewardSymbols = await getTokenSymbols(
      cfg.map((s) => s.reward as Hex),
      CHAIN_TO_CHAIN_ID[getPoolChain(pool)]
    );
    const response: CodeArtifact = {
      code: {
        fn: [
          `
          function configureUpdates() public view override returns (RewardConfig[] memory) {
          RewardConfig[] memory newConfig = new RewardConfig[](${cfg.length});

          ${cfg
            .map(
              (cfg, ix) => `newConfig[${ix}] = RewardConfig({
               asset: ${translateUmbrellaAssetLibUnderlying(cfg.asset, pool)},
               reward: ${cfg.reward}, // ${rewardSymbols[ix]}
               rewardPayer: ${cfg.rewardPayer},
               maxEmissionPerSecond: ${cfg.maxEmissionsPerSecond},
               distributionEnd: ${cfg.distributionEnd}
             });`
            )
            .join('\n')}

          return newConfig;
        }
        `,
        ],
      },
    };
    return response;
  },
};
