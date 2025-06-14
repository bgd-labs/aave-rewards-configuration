// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {AaveV3Ethereum, AaveV3EthereumAssets} from 'aave-address-book/AaveV3Ethereum.sol';
import {UmbrellaRewardsBaseTest} from './utils/UmbrellaRewardsBaseTest.sol';
import {UmbrellaEthereumAssets} from 'aave-address-book/UmbrellaEthereum.sol';
import {UmbrellaEthereumConfig} from './utils/networkConfig/UmbrellaEthereumConfig.sol';
import {EngineFlags} from 'aave-v3-origin/contracts/extensions/v3-config-engine/EngineFlags.sol';

/**
 * emit calldata only: forge test --mp tests/UmbrellaRewardsTestEth.t.sol -vv
 */
contract UmbrellaRewardsTestEth is UmbrellaRewardsBaseTest, UmbrellaEthereumConfig {
  function configureUpdates() public pure override returns (RewardConfig[] memory) {
    RewardConfig[] memory newConfig = new RewardConfig[](1);
    newConfig[0] = RewardConfig({
      asset: UmbrellaEthereumAssets.STK_WA_WETH_V1,
      reward: AaveV3EthereumAssets.WETH_A_TOKEN,
      rewardPayer: address(AaveV3Ethereum.COLLECTOR),
      maxEmissionPerSecond: uint256(400 * 1e18) / 365 days,
      distributionEnd: EngineFlags.KEEP_CURRENT
    });

    return newConfig;
  }
}
