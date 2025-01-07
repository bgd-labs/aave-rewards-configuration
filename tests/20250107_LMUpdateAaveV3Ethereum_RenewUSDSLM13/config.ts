import {ConfigFile} from '../../generator/types';
export const config: ConfigFile = {
  rootOptions: {
    feature: 'UPDATE_LM',
    pool: 'AaveV3Ethereum',
    title: 'Renew USDS LM 13',
    shortName: 'RenewUSDSLM13',
    date: '20250107',
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
          rewardAmount: '229731',
          whaleAddress: '0xdD84Ce1aDcb3A4908Db61A1dFA3353C3974c5a2B',
          whaleExpectedReward: '2401.03',
        },
      },
      cache: {blockNumber: 21571566},
    },
  },
};
