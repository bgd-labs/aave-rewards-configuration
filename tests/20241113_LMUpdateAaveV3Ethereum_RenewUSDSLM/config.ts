import {ConfigFile} from '../../generator/types';
export const config: ConfigFile = {
  rootOptions: {
    feature: 'UPDATE_LM',
    pool: 'AaveV3Ethereum',
    title: 'Renew USDS LM',
    shortName: 'RenewUSDSLM',
    date: '20241113',
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
          rewardAmount: '245158',
          whaleAddress: '0x18740A8020dC029B7b8156a7aF8Bd951B65029B0',
          whaleExpectedReward: '2456.7',
        },
      },
      cache: {blockNumber: 21173806},
    },
  },
};
