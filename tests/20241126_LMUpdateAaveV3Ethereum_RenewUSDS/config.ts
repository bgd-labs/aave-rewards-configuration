import {ConfigFile} from '../../generator/types';
export const config: ConfigFile = {
  rootOptions: {
    feature: 'UPDATE_LM',
    pool: 'AaveV3Ethereum',
    title: 'Renew USDS',
    shortName: 'RenewUSDS',
    date: '20241126',
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
          rewardAmount: '249970',
          whaleAddress: '0x597568694FE6eE1b701EC8578bd57102C9A29abd',
          whaleExpectedReward: '17559.75',
        },
      },
      cache: {blockNumber: 21268804},
    },
  },
};
