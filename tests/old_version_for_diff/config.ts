import {ConfigFile} from '../../generator/types';
export const config: ConfigFile = {
  rootOptions: {
    feature: 'SETUP_LM',
    pool: 'AaveV3Ethereum',
    title: 'old_version',
    shortName: 'Old_version',
    date: '20241116',
  },
  poolOptions: {
    AaveV3Ethereum: {
      configs: {
        SETUP_LM: {
          emissionsAdmin: '0x0',
          rewardToken: 'AaveV3EthereumAssets.WETH_UNDERLYING',
          rewardTokenDecimals: 18,
          rewardOracle: 'AaveV3EthereumAssets.WETH_ORACLE',
          assets: ['WETH_variableDebtToken', 'WETH_aToken'],
          distributionEnd: '180',
          transferStrategy: '0xe40d278afD00E6187Db21ff8C96D572359Ef03bf',
          rewardAmounts: ['400', '2000'],
          totalReward: 2400,
          whaleAddresses: [
            '0xb054D7551BdA6676F2F812aaE2B2CD537df5CdEe',
            '0x9df8dd68C73b096Cd9C0c4963fe89613DF40a1Cf',
          ],
          whaleExpectedRewards: ['4.77', '12.72'],
        },
      },
      cache: {blockNumber: 21199955},
    },
  },
};
