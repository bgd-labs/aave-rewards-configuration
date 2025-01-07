import {ConfigFile} from '../../generator/types';
export const config: ConfigFile = {
  rootOptions: {
    feature: 'UPDATE_LM',
    pool: 'AaveV3EthereumLido',
    title: 'Renew aWETH LM',
    shortName: 'RenewAWETHLM',
    date: '20250107',
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
          whaleAddress: '0x4624CB6d50EDfE9E4471dbf34B63AF2DBD2173b0',
          whaleExpectedReward: '0.62',
        },
      },
      cache: {blockNumber: 21574775},
    },
  },
};
