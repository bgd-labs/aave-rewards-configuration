import {ConfigFile} from '../../generator/types';
export const config: ConfigFile = {
  rootOptions: {
    feature: 'UPDATE_LM',
    pool: 'AaveV3Ethereum',
    title: 'Renew SD LM',
    shortName: 'RenewSDLM',
    date: '20241120',
  },
  poolOptions: {
    AaveV3Ethereum: {
      configs: {
        UPDATE_LM: {
          emissionsAdmin: '0xac140648435d03f784879cd789130F22Ef588Fcd',
          rewardToken: '0x30D20208d987713f46DFD34EF128Bb16C404D10f',
          rewardTokenDecimals: 18,
          asset: 'ETHx_aToken',
          distributionEnd: '14',
          rewardAmount: '29000',
          whaleAddress: '0xC3EE6Ddf545e31c68C9A6299098b51fe4DB52cd6',
          whaleExpectedReward: '301.53',
        },
      },
      cache: {blockNumber: 21226313},
    },
  },
};
