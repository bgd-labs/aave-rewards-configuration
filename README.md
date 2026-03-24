# Aave Rewards Configuration Repository

This repository contains examples and CLI generator on how to configure Umbrella Rewards and Liquidity Mining and on Aave including:

- a [test](./tests/UmbrellaRewardsTestBaseSep.t.sol) simulating the configuration of updating umbrella rewards
- a [test](./tests/EmissionTestOpOptimism.t.sol) simulating the configuration of certain assets to receive liquidity mining
- a [test](./tests/EmissionConfigurationTestMATICXPolygon.t.sol) simulating the setting up of new configuration of certain assets after the liquidity mining program has been created
- an [example proposal](./src/contracts/AddEmissionAdminPayload.sol) payload which could be used to setup liquidity mining on a governance controlled aave v3 pool

## Umbrella Rewards

Detailed information to update Umbrella rewards can be found [HERE](./docs/UmbrellaRewards.md).

## Aave v3 incentives

Detailed information to activate / update liquidity mining can be found [HERE](./docs/AaveV3Incentives.md).

<br/>

### Setup

```sh
cp .env.example .env
forge install
```

<details>
  <summary><h4>Guide to setting up your Tenderly keys for seatbelt report:</h4></summary>

  - To use the Seatbelt Report for umbrella rewards, you need these three access tokens from Tenderly:

    - `TENDERLY_ACCESS_TOKEN`
    - `TENDERLY_PROJECT_SLUG`
    - `TENDERLY_ACCOUNT_SLUG`

    Below is a guide on how you can get these from your Tenderly dashboard:

    1. Make sure you have a [tenderly](https://dashboard.tenderly.co/) account created. Next, you need to select the project you wish to use, If you don’t have a project setup you can create a new one.
        ![sc-1](https://github.com/user-attachments/assets/4f4c4ff0-64d7-45ef-b024-4031c5317858)


    2.  Inside your project section, head over to settings and click on Generate Access Token. An access token will be generated. Please save this token in a safe place, as we will need it later. This token generated will be your `TENDERLY_ACCESS_TOKEN`
        <img width="1512" height="788" alt="sc-2" src="https://github.com/user-attachments/assets/ba223066-27c9-4183-9416-6df7f2662778" />


    3. You can save these tokens on your .env. `TENDERLY_PROJECT_SLUG` will be the Project Slug as show on the settings in the above screenshot and `TENDERLY_ACCOUNT_SLUG` will be your Account Slug.
    In the above case for example, the `TENDERLY_PROJECT_SLUG` will be *ink-seatbelt* and `TENDERLY_ACCOUNT_SLUG` will be *sleepandcoffee*

</details>

### Test

```sh
forge test
```

## License

Copyright © 2026 BGD Labs

This repository is covered by [MIT](./LICENSE) license.
