import {ConfigFile} from '../../generator/types';
export const config: ConfigFile = {
  rootOptions: {
    feature: 'UPDATE_LM',
    pool: 'AaveV3EthereumLido',
    title: 'Renew Lido USDC awstETH LM',
    shortName: 'RenewLidoUSDCAwstETHLM',
    date: '20241220',
  },
  poolOptions: {
    AaveV3EthereumLido: {
      configs: {
        UPDATE_LM: {
          emissionsAdmin: '0xac140648435d03f784879cd789130F22Ef588Fcd',
          rewardToken: 'AaveV3EthereumLidoAssets.wstETH_A_TOKEN',
          rewardTokenDecimals: 18,
          asset: 'USDC_aToken',
          distributionEnd: '21',
          rewardAmount: '3',
          whaleAddress: '0x7F77d4193Ee9307BEC638b6c819aBfFF7BC37b03',
          whaleExpectedReward: '0.03',
        },
      },
      cache: {blockNumber: 21445046},
    },
  },
};
