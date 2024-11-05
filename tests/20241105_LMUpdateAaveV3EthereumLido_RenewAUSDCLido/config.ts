import {ConfigFile} from '../../generator/types';
export const config: ConfigFile = {
  rootOptions: {
    feature: 'UPDATE_LM',
    pool: 'AaveV3EthereumLido',
    title: 'Renew aUSDC Lido',
    shortName: 'RenewAUSDCLido',
    date: '20241105',
  },
  poolOptions: {
    AaveV3EthereumLido: {
      configs: {
        UPDATE_LM: {
          emissionsAdmin: '0xac140648435d03f784879cd789130F22Ef588Fcd',
          rewardToken: 'AaveV3EthereumLidoAssets.wstETH_A_TOKEN',
          rewardTokenDecimals: 18,
          asset: 'USDC_aToken',
          distributionEnd: '26',
          rewardAmount: '3.71',
          whaleAddress: '0xD11e845a3cFe69c88b6c1e36b1e933bc49373f29',
          whaleExpectedReward: '0.04',
        },
      },
      cache: {blockNumber: 21122093},
    },
  },
};
