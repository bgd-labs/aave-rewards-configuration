import {ConfigFile} from '../../generator/types';
export const config: ConfigFile = {
  rootOptions: {
    feature: 'UPDATE_LM',
    pool: 'AaveV3Ethereum',
    title: 'test',
    shortName: 'Test',
    date: '20241114',
  },
  poolOptions: {
    AaveV3Ethereum: {
      configs: {
        UPDATE_LM: {
          emissionsAdmin: '0xac140648435d03f784879cd789130F22Ef588Fcd',
          rewardToken: 'AaveV3EthereumAssets.WETH_UNDERLYING',
          rewardTokenDecimals: 18,
          asset: 'WETH_aToken',
          distributionEnd: '6',
          rewardAmount: '400',
          whaleAddress: '0x34780C209D5C575cc1C1cEB57aF95D4d2a69ddCF',
          whaleExpectedReward: '8.89',
        },
      },
      cache: {blockNumber: 21186966},
    },
  },
};
