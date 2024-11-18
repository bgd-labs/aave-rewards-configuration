import {ConfigFile} from '../../generator/types';
export const config: ConfigFile = {
  rootOptions: {
    feature: 'UPDATE_LM',
    pool: 'AaveV3Ethereum',
    title: 'Renew USDS LM',
    shortName: 'RenewUSDSLM',
    date: '20241118',
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
          whaleAddress: '0x77CaD933774FcB8F66c6FB34a382E15Bb88857Fe',
          whaleExpectedReward: '2574.159',
        },
      },
      cache: {blockNumber: 21214421},
    },
  },
};
