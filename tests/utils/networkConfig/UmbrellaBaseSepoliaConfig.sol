// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {UmbrellaRewardsBaseTest} from '../UmbrellaRewardsBaseTest.sol';
import {UmbrellaBaseSepolia} from 'aave-address-book/UmbrellaBaseSepolia.sol';

abstract contract UmbrellaBaseSepoliaConfig is UmbrellaRewardsBaseTest {
  function networkConfig()
    public
    pure
    override
    returns (UmbrellaRewardsBaseTest.NetworkConfig memory)
  {
    return
      UmbrellaRewardsBaseTest.NetworkConfig({
        networkName: 'base_sepolia',
        rewardsController: UmbrellaBaseSepolia.UMBRELLA_REWARDS_CONTROLLER,
        permissionedPayloadsController: UmbrellaBaseSepolia.PERMISSIONED_PAYLOADS_CONTROLLER
      });
  }
}
