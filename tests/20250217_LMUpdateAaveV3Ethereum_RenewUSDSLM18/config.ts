import {ConfigFile} from '../../generator/types';
export const config: ConfigFile = {
  rootOptions: {
    feature: 'UPDATE_LM',
    pool: 'AaveV3Ethereum',
    title: 'Renew USDS LM 18',
    shortName: 'RenewUSDSLM18',
    date: '20250211',
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
          rewardAmount: '768318',
          whaleAddress: '0x65AE0ed283fA71fd0d22f13512d7e0BD9E54c14A',
          whaleExpectedReward: '7896.46',
        },
      },
      cache: {blockNumber: 21819446},
    },
  },
};
