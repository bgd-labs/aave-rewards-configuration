import {ConfigFile} from '../../generator/types';
export const config: ConfigFile = {
  rootOptions: {
    feature: 'UPDATE_LM',
    pool: 'AaveV3EthereumLido',
    title: 'Renew aEthLidoWeth LM',
    shortName: 'RenewAEthLidoWethLM',
    date: '20241218',
  },
  poolOptions: {
    AaveV3EthereumLido: {
      configs: {
        UPDATE_LM: {
          emissionsAdmin: '0xac140648435d03f784879cd789130F22Ef588Fcd',
          rewardToken: 'AaveV3EthereumLidoAssets.WETH_A_TOKEN',
          rewardTokenDecimals: 18,
          asset: 'WETH_aToken',
          distributionEnd: '21',
          rewardAmount: '107.5',
          whaleAddress: '0x6AF235d2Bbe050e6291615B71CA5829658810142',
          whaleExpectedReward: '1.13',
        },
      },
      cache: {blockNumber: 21428530},
    },
  },
};
