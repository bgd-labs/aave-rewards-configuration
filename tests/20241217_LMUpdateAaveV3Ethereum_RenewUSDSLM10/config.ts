import {ConfigFile} from '../../generator/types';
export const config: ConfigFile = {
  rootOptions: {
    feature: 'UPDATE_LM',
    pool: 'AaveV3Ethereum',
    title: 'Renew USDS LM 10',
    shortName: 'RenewUSDSLM10',
    date: '20241217',
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
          rewardAmount: '178600',
          whaleAddress: '0x832c30802054F60f0CeDb5BE1F9A0e3da2a0Cab4',
          whaleExpectedReward: '1775.64',
        },
      },
      cache: {blockNumber: 21421124},
    },
  },
};
