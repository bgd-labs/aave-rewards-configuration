import {ConfigFile} from '../../generator/types';
export const config: ConfigFile = {
  rootOptions: {
    feature: 'UPDATE_LM',
    pool: 'AaveV3Ethereum',
    title: 'Renew USDS LM 17',
    shortName: 'RenewUSDSLM17',
    date: '20250204',
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
          rewardAmount: '632453',
          whaleAddress: '0x89b0A5e2863B1aA6b321b17E3e7F632A46b4b941',
          whaleExpectedReward: '6691.1',
        },
      },
      cache: {blockNumber: 21774312},
    },
  },
};
