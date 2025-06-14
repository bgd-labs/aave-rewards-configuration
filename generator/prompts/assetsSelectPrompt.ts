import {isAddress, Hex} from 'viem';
import {checkbox, select} from '@inquirer/prompts';
import {
  getAssets,
  getSupplyAssets,
  getSupplyBorrowAssets,
  getUmbrellaFromPool,
  getUmbrellaStkAssets,
} from '../common';
import {PoolIdentifier} from '../types';
import {GenericPoolPrompt} from './types';

/**
 * allows selecting multiple assets
 * TODO: enforce selection of at least one asset (next version of inquirer ships with required)
 * @param param0
 * @returns
 */
export async function assetsSelectPrompt({pool, message}: GenericPoolPrompt) {
  return await select({
    message,
    choices: [
      {name: 'Custom Address (Enter Manually)', value: 'custom'},
      ...getAssets(pool).map((asset) => ({name: asset, value: asset})),
    ],
  });
}

export async function addressCheckboxPromptWithSymbol(
  assets: Hex[],
  symbols: string[],
  message: string
) {
  return await checkbox({
    message,
    choices: assets.map((asset, i) => ({name: symbols[i], value: {asset, symbol: symbols[i]}})),
    required: true,
  });
}

export async function supplyUnderlyingAssetsSelectPrompt({pool, message}: GenericPoolPrompt) {
  return await select({
    message,
    choices: [
      {name: 'Custom Address (Enter Manually)', value: 'custom'},
      ...getAssets(pool).map((asset) => ({name: asset, value: asset})),
      ...getSupplyAssets(pool).map((asset) => ({name: asset, value: asset})),
    ],
  });
}

export async function umbrellaStkAssetsSelectPrompt({pool, message}: GenericPoolPrompt) {
  return await select({
    message,
    choices: [
      {name: 'Custom Address (Enter Manually)', value: 'custom'},
      ...getUmbrellaStkAssets(pool).map((asset) => ({name: asset, value: asset})),
    ],
  });
}

export async function supplyBorrowAssetsSelectPrompt({pool, message}: GenericPoolPrompt) {
  return await checkbox({
    message,
    choices: getSupplyBorrowAssets(pool).map((asset) => ({name: asset, value: asset})),
    required: true,
  });
}

export async function supplyBorrowAssetSelectPrompt({pool, message}: GenericPoolPrompt) {
  return await select({
    message,
    choices: getSupplyBorrowAssets(pool).map((asset) => ({name: asset, value: asset})),
  });
}

export function translateAssetToOracleLibUnderlying(value: string, pool: PoolIdentifier) {
  const isSupplyAsset: boolean = value.includes('_aToken');
  return isSupplyAsset
    ? `${pool}Assets.${value.replace('_aToken', '')}_ORACLE`
    : `${pool}Assets.${value}_ORACLE`;
}

export function translateAssetToAssetLibUnderlying(value: string, pool: PoolIdentifier) {
  const isBorrowAsset: boolean = value.includes('_variableDebtToken');
  const isSupplyAsset: boolean = value.includes('_aToken');

  if (isBorrowAsset) {
    return `${pool}Assets.${value.replace('_variableDebtToken', '')}_V_TOKEN`;
  } else if (isSupplyAsset) {
    return `${pool}Assets.${value.replace('_aToken', '')}_A_TOKEN`;
  } else {
    return `${pool}Assets.${value}_UNDERLYING`;
  }
}

export function translateSupplyBorrowAssetToWhaleConstant(value: string, pool: PoolIdentifier) {
  const isBorrowAsset: boolean = value.includes('_variableDebtToken');
  const underlyingAsset = isBorrowAsset
    ? value.replace('_variableDebtToken', '')
    : value.replace('_aToken', '');
  return isBorrowAsset ? `v${underlyingAsset}_WHALE` : `a${underlyingAsset}_WHALE`;
}

export function translateUmbrellaAssetLibUnderlying(value: string, pool: PoolIdentifier) {
  if (isAddress(value)) return value;

  const umbrella = getUmbrellaFromPool(pool);
  return `${umbrella}Assets.${value}`;
}
