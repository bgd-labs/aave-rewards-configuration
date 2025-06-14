import {Options, FEATURE} from '../../types';
import {LiquidityMiningSetup, LiquidityMiningUpdate, UmbrellaRewardsUpdate} from '../types';

export const MOCK_OPTIONS_SETUP: Options = {
  pool: 'AaveV3EthereumLido',
  title: 'test',
  shortName: 'Test',
  date: '20231023',
  feature: FEATURE.SETUP_LM,
};

export const MOCK_OPTIONS_UPDATE: Options = {
  pool: 'AaveV3EthereumLido',
  title: 'test',
  shortName: 'Test',
  date: '20231023',
  feature: FEATURE.UPDATE_LM,
};

export const MOCK_OPTIONS_UMBRELLA: Options = {
  pool: 'AaveV3BaseSepolia',
  title: 'test',
  shortName: 'Test',
  date: '20250602',
  feature: FEATURE.UPDATE_UMBRELLA_REWARDS,
};

export const liquidityMiningSetupConfig: LiquidityMiningSetup = {
  emissionsAdmin: '0xac140648435d03f784879cd789130F22Ef588Fcd',
  rewardToken: 'AaveV3EthereumLidoAssets.wstETH_A_TOKEN',
  rewardTokenDecimals: 18,
  rewardOracle: 'AaveV3EthereumLidoAssets.wstETH_ORACLE',
  assets: ['wstETH_aToken'],
  distributionEnd: '14',
  transferStrategy: '0x0605a898535E9116Ff820347c536E3442F216Eb8',
  rewardAmounts: ['100'],
  totalReward: 100,
  whaleAddresses: ['0x07833EAdF87CD3079da281395f2fBA24b61F90f7'],
  whaleExpectedRewards: ['21.6'],
};

export const liquidityMiningUpdateConfig: LiquidityMiningUpdate = {
  emissionsAdmin: '0xac140648435d03f784879cd789130F22Ef588Fcd',
  rewardToken: 'AaveV3EthereumLidoAssets.wstETH_A_TOKEN',
  rewardTokenDecimals: 18,
  asset: 'wstETH_aToken',
  distributionEnd: '20',
  rewardAmount: '150',
  whaleAddress: '0x07833EAdF87CD3079da281395f2fBA24b61F90f7',
  whaleExpectedReward: '32.4',
};

export const umbrellaRewardsUpdateConfig: UmbrellaRewardsUpdate[] = [
  {
    asset: 'STK_WETH_V1',
    reward: '0x73a5bB60b0B0fc35710DDc0ea9c407031E31Bdbb',
    rewardPayer: '0x24f321Cd3742B7a191e5ED7cE1be8059DEe91424',
    maxEmissionsPerSecond: 'EngineFlags.KEEP_CURRENT',
    distributionEnd: 'block.timestamp + 120 days',
  },
];
