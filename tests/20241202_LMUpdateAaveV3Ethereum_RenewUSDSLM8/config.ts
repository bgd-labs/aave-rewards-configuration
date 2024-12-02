import {ConfigFile} from '../../generator/types';
export const config: ConfigFile = {
  rootOptions: {
    feature: 'UPDATE_LM',
    pool: 'AaveV3Ethereum',
    title: 'Renew USDS LM 8',
    shortName: 'RenewUSDSLM8',
    date: '20241202',
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
          rewardAmount: '210130.86',
          whaleAddress: '0x961972a5c91E7237A3b02d2ee173ac3999e49480',
          whaleExpectedReward: '3143.01',
        },
      },
      cache: {blockNumber: 21315801},
    },
  },
};
