import {ConfigFile} from '../../generator/types';
export const config: ConfigFile = {
  rootOptions: {
    feature: 'UPDATE_LM',
    pool: 'AaveV3Ethereum',
    title: 'sdfsdf',
    shortName: 'Sdfsdf',
    date: '20241115',
  },
  poolOptions: {
    AaveV3Ethereum: {
      configs: {
        UPDATE_LM: {
          emissionsAdmin: '0xac140648435d03f784879cd789130F22Ef588Fcd',
          rewardToken: '0xC035a7cf15375cE2706766804551791aD035E0C2',
          rewardTokenDecimals: 18,
          asset: 'WETH_aToken',
          distributionEnd: '5',
          rewardAmount: '200',
          whaleAddress: '0xA339d279E0A3a9EDe11ecEAC2ec9529EeBDAE12C',
          whaleExpectedReward: '8.31',
        },
      },
      cache: {blockNumber: 21194480},
    },
  },
};
