import {ConfigFile} from '../../generator/types';
export const config: ConfigFile = {
  rootOptions: {
    feature: 'UPDATE_LM',
    pool: 'AaveV3Ethereum',
    title: 'Renew USDS LM 12',
    shortName: 'RenewUSDSLM12',
    date: '20241231',
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
          rewardAmount: '185948',
          whaleAddress: '0x6b28fb12EE41baA9d1Df16971DE53ADDE6d1bE5b',
          whaleExpectedReward: '1852.19',
        },
      },
      cache: {blockNumber: 21521521},
    },
  },
};
