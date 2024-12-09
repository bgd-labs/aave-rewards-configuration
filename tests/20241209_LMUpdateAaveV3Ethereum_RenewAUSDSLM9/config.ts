import {ConfigFile} from '../../generator/types';
export const config: ConfigFile = {
  rootOptions: {
    feature: 'UPDATE_LM',
    pool: 'AaveV3Ethereum',
    title: 'Renew aUSDS LM 9',
    shortName: 'RenewAUSDSLM9',
    date: '20241209',
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
          rewardAmount: '172990',
          whaleAddress: '0xC65236e35c1E0Dc9e2044f6f38C9c3497E95fFA2',
          whaleExpectedReward: '1775.62',
        },
      },
      cache: {blockNumber: 21366553},
    },
  },
};
