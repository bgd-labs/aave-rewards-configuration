// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {AaveV3Ethereum, AaveV3EthereumAssets} from 'aave-address-book/AaveV3Ethereum.sol';
import {UmbrellaRewardsBaseTest} from './utils/UmbrellaRewardsBaseTest.sol';
import {UmbrellaEthereum} from 'aave-address-book/UmbrellaEthereum.sol';
import {UmbrellaEthereumConfig} from './utils/networkConfig/UmbrellaEthereumConfig.sol';
import {EngineFlags} from 'aave-v3-origin/contracts/extensions/v3-config-engine/EngineFlags.sol';

/**
 * private-key: forge test --mp tests/UmbrellaRewardsTestEth.t.sol --mt test_sendTransactionViaPrivateKey -vv
 * ledger: forge test --mp tests/UmbrellaRewardsTestEth.t.sol --mt test_sendTransactionViaLedger -vv
 * emit calldata only: forge test --mp tests/UmbrellaRewardsTestEth.t.sol --mt test_logCalldatas -vv
 */
contract UmbrellaRewardsTestEth is UmbrellaRewardsBaseTest, UmbrellaEthereumConfig {
  function configureUpdates() public pure override returns (RewardConfig[] memory) {
    RewardConfig[] memory newConfig = new RewardConfig[](1);
    newConfig[0] = RewardConfig({
      asset: address(0), // STK_WA_WETH (not deployed yet)
      reward: AaveV3EthereumAssets.WETH_A_TOKEN,
      rewardPayer: address(AaveV3Ethereum.COLLECTOR),
      maxEmissionPerSecond: uint256(400 * 1e18) / 365 days,
      distributionEnd: EngineFlags.KEEP_CURRENT
    });

    return newConfig;
  }
}
