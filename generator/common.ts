import * as addressBook from '@bgd-labs/aave-address-book';
import {FEATURE, Options, PoolIdentifier, UmbrellaIdentifier} from './types';
import {
  arbitrum,
  avalanche,
  mainnet,
  metis,
  optimism,
  polygon,
  base,
  baseSepolia,
  bsc,
  gnosis,
  scroll,
  zkSync,
} from 'viem/chains';
import {Hex, getAddress, getContract} from 'viem';
import {CHAIN_ID_CLIENT_MAP} from '@bgd-labs/js-utils';
import {IERC20Detailed_ABI} from '@bgd-labs/aave-address-book/abis';
import BigNumber from 'bignumber.js';

export const AVAILABLE_CHAINS = [
  'Ethereum',
  'Optimism',
  'Arbitrum',
  'Polygon',
  'Avalanche',
  'Fantom',
  'Harmony',
  'Metis',
  'Base',
  'BaseSepolia',
  'BNB',
  'Gnosis',
  'Scroll',
  'ZkSync',
] as const;

export function getAssets(pool: PoolIdentifier): string[] {
  const assets = addressBook[pool].ASSETS;
  return Object.keys(assets);
}

export function getSupplyAssets(pool: PoolIdentifier): string[] {
  const assets = addressBook[pool].ASSETS;
  const supplyAssets: string[] = [];

  for (const underlying of Object.keys(assets)) {
    supplyAssets.push(underlying + '_aToken');
  }
  return supplyAssets;
}

export function getSupplyBorrowAssets(pool: PoolIdentifier): string[] {
  const assets = addressBook[pool].ASSETS;
  const supplyBorrowAssets: string[] = [];

  for (const underlying of Object.keys(assets)) {
    supplyBorrowAssets.push(underlying + '_variableDebtToken');
    supplyBorrowAssets.push(underlying + '_aToken');
  }
  return supplyBorrowAssets;
}

export function getAddressOfSupplyBorrowAsset(pool: PoolIdentifier, asset: string): Hex {
  const isBorrowAsset: boolean = asset.includes('_variableDebtToken');
  const underlyingAsset = isBorrowAsset
    ? asset.replace('_variableDebtToken', '')
    : asset.replace('_aToken', '');
  return isBorrowAsset
    ? addressBook[pool].ASSETS[underlyingAsset].V_TOKEN
    : addressBook[pool].ASSETS[underlyingAsset].A_TOKEN;
}

export async function calculateExpectedWhaleRewards(
  whaleAddress: Hex,
  asset: Hex,
  rewardAmount: string,
  chainId: number
) {
  const assetContract = getContract({
    abi: IERC20Detailed_ABI,
    client: CHAIN_ID_CLIENT_MAP[chainId],
    address: asset,
  });
  const assetTotalSupply = await assetContract.read.totalSupply();
  const whaleBalance = await assetContract.read.balanceOf([whaleAddress]);

  const whaleRewardsShare = new BigNumber(whaleBalance.toString()).div(
    new BigNumber(assetTotalSupply.toString())
  );
  return whaleRewardsShare.multipliedBy(new BigNumber(rewardAmount)).decimalPlaces(2).toString();
}

export async function getTokenDecimals(asset: Hex, chainId: number): Promise<number> {
  const assetContract = getContract({
    abi: IERC20Detailed_ABI,
    client: CHAIN_ID_CLIENT_MAP[chainId],
    address: asset,
  });
  return assetContract.read.decimals();
}

export async function getTokenSymbols(assets: Hex[], chainId: number): Promise<string[]> {
  const contracts = assets.map((asset) =>
    getContract({
      abi: IERC20Detailed_ABI,
      client: CHAIN_ID_CLIENT_MAP[chainId],
      address: asset,
    })
  );
  const symbols = await Promise.all(contracts.map((contract) => contract.read.symbol()));
  return symbols;
}

export function getPoolChain(pool: PoolIdentifier) {
  if (pool == 'AaveV3EthereumLido' || pool == 'AaveV3EthereumEtherFi') return 'Ethereum';
  const chainName = pool.replace('AaveV3', '');
  const chain = AVAILABLE_CHAINS.find((chain) => chainName === chain);
  if (!chain) throw new Error('cannot find chain for pool');
  return chain;
}

export function getDefaultCollector(pool: PoolIdentifier): string {
  return `address(${pool}.COLLECTOR)`;
}

export function getUmbrellaFromPoolChain(pool: PoolIdentifier) {
  const chain = AVAILABLE_CHAINS.find((chain) => pool.indexOf(chain) !== -1);
  if (!chain) throw new Error('cannot find chain for pool');
  return chain;
}

export function getExplorerLink(chainId: number, address: Hex) {
  const client = CHAIN_ID_CLIENT_MAP[chainId];
  let url = client.chain?.blockExplorers?.default.url;
  if (url && url.endsWith('/')) {
    url = url.slice(0, -1); // sanitize explorer url
  }
  return `${url}/address/${getAddress(address)}`;
}

export function getExplorerTokenHoldersLink(chainId: number, address: Hex) {
  const client = CHAIN_ID_CLIENT_MAP[chainId];
  let url = client.chain?.blockExplorers?.default.url;
  if (url && url.endsWith('/')) {
    url = url.slice(0, -1); // sanitize explorer url
  }
  return `${url}/token/${getAddress(address)}#balances`;
}

export function getDate() {
  const date = new Date();
  const years = date.getFullYear();
  const months = date.getMonth() + 1; // it's js so months are 0 indexed
  const day = date.getDate();
  const time = `${date.getHours()}${date.getMinutes()}${date.getHours()}`;
  return `${years}${months <= 9 ? '0' : ''}${months}${day <= 9 ? '0' : ''}${day}_${time}`;
}

/**
 * Prefix with the date for proper sorting
 * @param {*} options
 * @returns
 */
export function generateFolderName(options: Options) {
  let featureString: string;

  if (options.feature == FEATURE.SETUP_LM) {
    featureString = '_LMSetup';
  } else if (options.feature == FEATURE.UPDATE_LM) {
    featureString = '_LMUpdate';
  } else {
    featureString = '_UmbrellaUpdate';
  }
  return `${options.date}${featureString}${options.pool}`;
}

/**
 * Suffix with the date as prefixing would generate invalid contract names
 * @param {*} options
 * @param {*} chain
 * @returns
 */
export function generateContractName(options: Options, pool?: PoolIdentifier) {
  let name = pool ? `${pool}_` : '';
  if (options.feature == FEATURE.SETUP_LM) {
    name += 'LMSetup';
  } else if (options.feature == FEATURE.UPDATE_LM) {
    name += 'LMUpdate';
  } else {
    name += 'UmbrellaRewardsUpdate';
  }
  name += `_${options.date}`;
  return name;
}

export function getChainAlias(chain) {
  return chain === 'Ethereum' ? 'mainnet' : chain.toLowerCase();
}

export function pascalCase(str: string) {
  return str
    .replace(/[\W]/g, ' ') // remove special chars as this is used for solc contract name
    .replace(/(\w)(\w*)/g, function (g0, g1, g2) {
      return g1.toUpperCase() + g2;
    })
    .replace(/ /g, '');
}

export const CHAIN_TO_CHAIN_ID = {
  Ethereum: mainnet.id,
  Polygon: polygon.id,
  Optimism: optimism.id,
  Arbitrum: arbitrum.id,
  Avalanche: avalanche.id,
  Metis: metis.id,
  Base: base.id,
  BaseSepolia: baseSepolia.id,
  BNB: bsc.id,
  Gnosis: gnosis.id,
  Scroll: scroll.id,
  ZkSync: zkSync.id,
};

export async function getMaxEmissionsPerSecondToReadable(
  chainId: number,
  reward: Hex,
  emission: number
): Promise<string> {
  const rewardDecimals = await getTokenDecimals(reward, chainId);
  const emissionsPerMonth = (emission * (30 * 24 * 3600)) / 10 ** rewardDecimals;
  return `~${emissionsPerMonth.toFixed(2)} token units per month`;
}

export function getUmbrellaStkAssets(pool: PoolIdentifier): string[] {
  return Object.keys(addressBook[getUmbrellaFromPool(pool)].UMBRELLA_STAKE_ASSETS);
}

export function getUmbrellaFromPool(pool: PoolIdentifier): UmbrellaIdentifier {
  const chain = getPoolChain(pool);
  // Map of normal pools to their Umbrella counterparts
  const poolToUmbrellaMap: Partial<Record<PoolIdentifier, UmbrellaIdentifier>> = {
    AaveV3Ethereum: 'UmbrellaEthereum',
    AaveV3BaseSepolia: 'UmbrellaBaseSepolia',
  };

  const umbrellaPool = poolToUmbrellaMap[pool];
  if (!umbrellaPool) {
    throw new Error(`No Umbrella pool found for ${pool}`);
  }

  return umbrellaPool;
}

export function flagAsRequired(message: string, required?: boolean) {
  return required ? `${message}*` : message;
}
