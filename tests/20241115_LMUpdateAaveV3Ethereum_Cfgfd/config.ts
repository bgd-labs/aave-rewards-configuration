import {ConfigFile} from '../../generator/types';
export const config: ConfigFile = {
  rootOptions: {
    feature: 'UPDATE_LM',
    pool: 'AaveV3Ethereum',
    title: 'cfgfd',
    shortName: 'Cfgfd',
    date: '20241115',
  },
  poolOptions: {
    AaveV3Ethereum: {
      configs: {
        UPDATE_LM: {
          emissionsAdmin: '0xac140648435d03f784879cd789130F22Ef588Fcd',
          rewardToken: 'AaveV3EthereumAssets.USDS_A_TOKEN',
          rewardTokenDecimals: 18,
          asset: 'USDS_aToken',
          distributionEnd: '4',
          rewardAmount: '234',
          whaleAddress: '0x89b0A5e2863B1aA6b321b17E3e7F632A46b4b941',
          whaleExpectedReward: '1.8',
        },
      },
      cache: {blockNumber: 21194540},
    },
  },
};
