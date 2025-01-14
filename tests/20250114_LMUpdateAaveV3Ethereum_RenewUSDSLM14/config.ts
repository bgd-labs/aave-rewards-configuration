import {ConfigFile} from '../../generator/types';
export const config: ConfigFile = {
  rootOptions: {
    feature: 'UPDATE_LM',
    pool: 'AaveV3Ethereum',
    title: 'Renew USDS LM 14',
    shortName: 'RenewUSDSLM14',
    date: '20250114',
  },
  poolOptions: {
    AaveV3Ethereum: {
      configs: {
        UPDATE_LM: {
          emissionsAdmin: '0xac140648435d03f784879cd789130F22Ef588Fcd',
          rewardToken: 'AaveV3EthereumAssets.USDS_A_TOKEN',
          rewardTokenDecimals: 18,
          asset: 'USDS_aToken',
          distributionEnd: '7',
          rewardAmount: '356142',
          whaleAddress: '0x7439004f73c4e7776AeA456AAc7d4BE2F5AfaEbF',
          whaleExpectedReward: '3579.72',
        },
      },
      cache: {blockNumber: 21621804},
    },
  },
};
