import {ConfigFile} from '../../generator/types';
export const config: ConfigFile = {
  rootOptions: {
    feature: 'UPDATE_LM',
    pool: 'AaveV3EthereumLido',
    title: 'Extends wstETH LM',
    shortName: 'ExtendsWstETHLM',
    date: '20241104',
  },
  poolOptions: {
    AaveV3EthereumLido: {
      configs: {
        UPDATE_LM: {
          emissionsAdmin: '0xac140648435d03f784879cd789130F22Ef588Fcd',
          rewardToken: 'AaveV3EthereumLidoAssets.wstETH_A_TOKEN',
          rewardTokenDecimals: 18,
          asset: 'wstETH_aToken',
          distributionEnd: '7',
          rewardAmount: '5.25',
          whaleAddress: '0xd412107354ccD6e103443372946C985F31B09e5c',
          whaleExpectedReward: '0.05',
        },
      },
      cache: {blockNumber: 21113789},
    },
  },
};
