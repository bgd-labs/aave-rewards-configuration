import {ConfigFile} from '../../generator/types';
export const config: ConfigFile = {
  rootOptions: {
    feature: 'UPDATE_LM',
    pool: 'AaveV3Ethereum',
    title: 'Renew USDS LM 16',
    shortName: 'RenewUSDSLM16',
    date: '20250127',
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
          rewardAmount: '538958',
          whaleAddress: '0xA701b1315168F2CD290c3F3df3427e88E946f91c',
          whaleExpectedReward: '5605.96',
        },
      },
      cache: {blockNumber: 21717655},
    },
  },
};
