import {ConfigFile} from '../../generator/types';
export const config: ConfigFile = {
  rootOptions: {
    feature: 'UPDATE_LM',
    pool: 'AaveV3EthereumLido',
    title: 'Renew aUSDC LM',
    shortName: 'RenewAUSDCLM',
    date: '20241129',
  },
  poolOptions: {
    AaveV3EthereumLido: {
      configs: {
        UPDATE_LM: {
          emissionsAdmin: '0xac140648435d03f784879cd789130F22Ef588Fcd',
          rewardToken: 'AaveV3EthereumLidoAssets.wstETH_A_TOKEN',
          rewardTokenDecimals: 18,
          asset: 'USDC_aToken',
          distributionEnd: '24',
          rewardAmount: '3.71',
          whaleAddress: '0x6c4d27d3aE62B6C1eAa9b732377F7Ddf3cF2B1E6',
          whaleExpectedReward: '0.04',
        },
      },
      cache: {blockNumber: 21294155},
    },
  },
};
