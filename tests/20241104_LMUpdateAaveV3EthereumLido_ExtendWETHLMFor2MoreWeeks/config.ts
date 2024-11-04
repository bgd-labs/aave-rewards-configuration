import {ConfigFile} from '../../generator/types';
export const config: ConfigFile = {
  rootOptions: {
    feature: 'UPDATE_LM',
    pool: 'AaveV3EthereumLido',
    title: 'Extend WETH LM for 2 more weeks',
    shortName: 'ExtendWETHLMFor2MoreWeeks',
    date: '20241104',
  },
  poolOptions: {
    AaveV3EthereumLido: {
      configs: {
        UPDATE_LM: {
          emissionsAdmin: '0xac140648435d03f784879cd789130F22Ef588Fcd',
          rewardToken: 'AaveV3EthereumLidoAssets.WETH_A_TOKEN',
          rewardTokenDecimals: 18,
          asset: 'WETH_aToken',
          distributionEnd: '14',
          rewardAmount: '109',
          whaleAddress: '0x0c67f4FfC902140C972eCAb356c9993e6cE8caF3',
          whaleExpectedReward: '1.09',
        },
      },
      cache: {blockNumber: 21113361},
    },
  },
};
