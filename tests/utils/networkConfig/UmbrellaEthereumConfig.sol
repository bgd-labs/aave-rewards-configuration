// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {UmbrellaRewardsBaseTest} from '../UmbrellaRewardsBaseTest.sol';
import {UmbrellaEthereum} from 'aave-address-book/UmbrellaEthereum.sol';

abstract contract UmbrellaEthereumConfig is UmbrellaRewardsBaseTest {
  function networkConfig()
    public
    pure
    override
    returns (UmbrellaRewardsBaseTest.NetworkConfig memory)
  {
    return
      UmbrellaRewardsBaseTest.NetworkConfig({
        networkName: 'mainnet',
        rewardsController: UmbrellaEthereum.UMBRELLA_REWARDS_CONTROLLER,
        permissionedPayloadsController: UmbrellaEthereum.PERMISSIONED_PAYLOADS_CONTROLLER
      });
  }
}
