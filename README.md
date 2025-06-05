# Aave Rewards Configuration Repository

This repository contains examples and CLI generator on how to configure Umbrella Rewards and Liquidity Mining and on Aave including:

- a [test](./tests/UmbrellaRewardsTestBaseSep.t.sol) simulating the configuration of updating umbrella rewards
- a [test](./tests/EmissionTestOpOptimism.t.sol) simulating the configuration of certain assets to receive liquidity mining
- a [test](./tests/EmissionConfigurationTestMATICXPolygon.t.sol) simulating the setting up of new configuration of certain assets after the liquidity mining program has been created
- an [example proposal](./src/contracts/AddEmissionAdminPayload.sol) payload which could be used to setup liquidity mining on a governance controlled aave v3 pool

## Umbrella Rewards

Detailed information to update Umbrella rewards can be found [HERE](./docs/UmbrellaRewards.md).

## Aave v3 incentives

Detailed information to activate / update Aave v3 incentives (supply/borrow) can be found [HERE](./docs/LiquidityMining.md).

<br/>

### Setup

```sh
cp .env.example .env
forge install
```

### Test

```sh
forge test
```

## License

Copyright © 2025 BGD Labs

This repository is covered by [MIT](./LICENSE) license.
