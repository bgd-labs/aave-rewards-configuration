// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {UmbrellaRewardsBaseTest} from './utils/UmbrellaRewardsBaseTest.sol';
import {AaveV3BaseSepoliaAssets} from 'aave-address-book/AaveV3BaseSepolia.sol';
import {UmbrellaBaseSepoliaAssets} from 'aave-address-book/UmbrellaBaseSepolia.sol';
import {EngineFlags} from 'aave-v3-origin/contracts/extensions/v3-config-engine/EngineFlags.sol';
import {UmbrellaBaseSepoliaConfig} from './utils/networkConfig/UmbrellaBaseSepoliaConfig.sol';

/**
 * private-key: forge test --mp tests/UmbrellaRewardsTestBaseSep.t.sol --mt test_sendTransactionViaPrivateKey -vv
 * ledger: forge test --mp tests/UmbrellaRewardsTestBaseSep.t.sol --mt test_sendTransactionViaLedger -vv
 * emit Calldata only: forge test --mp tests/UmbrellaRewardsTestBaseSep.t.sol --mt test_logCalldatas -vv
 */
contract UmbrellaRewardsTestBaseSep is UmbrellaRewardsBaseTest, UmbrellaBaseSepoliaConfig {
  function configureUpdates() public view override returns (RewardConfig[] memory) {
    RewardConfig[] memory newConfig = new RewardConfig[](1);
    newConfig[0] = RewardConfig({
      asset: UmbrellaBaseSepoliaAssets.STK_WETH_V1,
      reward: AaveV3BaseSepoliaAssets.WETH_A_TOKEN,
      rewardPayer: 0x24f321Cd3742B7a191e5ED7cE1be8059DEe91424,
      maxEmissionPerSecond: EngineFlags.KEEP_CURRENT,
      distributionEnd: block.timestamp + 120 days
    });

    return newConfig;
  }
}
