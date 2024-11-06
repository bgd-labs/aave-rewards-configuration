import {ConfigFile} from '../../generator/types';
export const config: ConfigFile = {
  rootOptions: {
    feature: 'UPDATE_LM',
    pool: 'AaveV3Avalanche',
    title: 'Renew sAVAX LM',
    shortName: 'RenewSAVAXLM',
    date: '20241106',
  },
  poolOptions: {
    AaveV3Avalanche: {
      configs: {
        UPDATE_LM: {
          emissionsAdmin: '0xac140648435d03f784879cd789130F22Ef588Fcd',
          rewardToken: 'AaveV3AvalancheAssets.sAVAX_UNDERLYING',
          rewardTokenDecimals: 18,
          asset: 'BTCb_aToken',
          distributionEnd: '14',
          rewardAmount: '1800',
          whaleAddress: '0xF579C0aaFc828DAD272bd1Ff07A0FCBd08828907',
          whaleExpectedReward: '19.27',
        },
      },
      cache: {blockNumber: 52708885},
    },
  },
};
