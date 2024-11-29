import {ConfigFile} from '../../generator/types';
export const config: ConfigFile = {
  rootOptions: {
    feature: 'UPDATE_LM',
    pool: 'AaveV3EthereumLido',
    title: 'Renew aWETH LM',
    shortName: 'RenewAWETHLM',
    date: '20241129',
  },
  poolOptions: {
    AaveV3EthereumLido: {
      configs: {
        UPDATE_LM: {
          emissionsAdmin: '0xac140648435d03f784879cd789130F22Ef588Fcd',
          rewardToken: 'AaveV3EthereumLidoAssets.WETH_A_TOKEN',
          rewardTokenDecimals: 18,
          asset: 'WETH_aToken',
          distributionEnd: '17',
          rewardAmount: '93.5',
          whaleAddress: '0x4A3322919b613781151aB84bBCe2D4520Bc51bCD',
          whaleExpectedReward: '0.93',
        },
      },
      cache: {blockNumber: 21294059},
    },
  },
};
