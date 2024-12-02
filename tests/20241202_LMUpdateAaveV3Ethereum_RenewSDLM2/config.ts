import {ConfigFile} from '../../generator/types';
export const config: ConfigFile = {
  rootOptions: {
    feature: 'UPDATE_LM',
    pool: 'AaveV3Ethereum',
    title: 'Renew SD LM 2',
    shortName: 'RenewSDLM2',
    date: '20241202',
  },
  poolOptions: {
    AaveV3Ethereum: {
      configs: {
        UPDATE_LM: {
          emissionsAdmin: '0x0000000000000000000000000000000000000000',
          rewardToken: 'AaveV3EthereumAssets.ETHx_A_TOKEN',
          rewardTokenDecimals: 18,
          asset: 'ETHx_aToken',
          distributionEnd: '7',
          rewardAmount: '12500',
          whaleAddress: '0x64EAe281740e61d8dD34AC3B2131B26329eC2078',
          whaleExpectedReward: '186.71',
        },
      },
      cache: {blockNumber: 21316033},
    },
  },
};
