import {ConfigFile} from '../../generator/types';
export const config: ConfigFile = {
  rootOptions: {
    feature: 'UPDATE_LM',
    pool: 'AaveV3Ethereum',
    title: 'Renew USDS LM',
    shortName: 'RenewUSDSLM',
    date: '20241030',
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
          rewardAmount: '119953',
          whaleAddress: '0x3c66133A7fD29ab1E551db9E8832DCA0cEAd7a16',
          whaleExpectedReward: '1461.78',
        },
      },
      cache: {blockNumber: 21077647},
    },
  },
};
