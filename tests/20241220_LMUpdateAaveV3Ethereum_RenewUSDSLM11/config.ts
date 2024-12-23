import {ConfigFile} from '../../generator/types';
export const config: ConfigFile = {
  rootOptions: {
    feature: 'UPDATE_LM',
    pool: 'AaveV3Ethereum',
    title: 'Renew USDS LM 11',
    shortName: 'RenewUSDSLM11',
    date: '20241220',
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
          rewardAmount: '180713',
          whaleAddress: '0x06d486A38E1195fdEE147Fbe309821d72b06f197',
          whaleExpectedReward: '2003.98',
        },
      },
      cache: {blockNumber: 21445224},
    },
  },
};
