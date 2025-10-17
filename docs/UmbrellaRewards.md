## Updating Umbrella Rewards on Aave V3:

Umbrella Rewards can be updated either via governance or an entity having the `REWARDS_ADMIN` role.
The `REWARDS_ADMIN` role has been given to the [permissioned-payloads-controller](https://github.com/bgd-labs/aave-governance-v3/blob/main/docs/permissioned-payloads-controller-overview.md) system, which allows to update rewards in a timelock manner.

### How it works:

The PayloadsManager i.e `ALC Multi-sig` calls `createPayload()` on the PermissionedPayloadsController contract with the calldata as function param to call `configureRewards()` on the Umbrella RewardsController.
Once the payload is created with the calldata, the payload is in queued state and it will be automatically executed by the Aave Robot once the delay has passed (1 day at time of configuration). Before the payload is executed, the guardian (BGD Labs) can check if there is any misconfiguration and if so can cancel the payload.

More extensive documentation about Umbrella RewardsController can be found [here](https://github.com/aave-dao/aave-umbrella/tree/main/src/contracts/rewards).

<img width="732" alt="Screenshot 2025-06-02 at 2 17 10 PM" src="https://github.com/user-attachments/assets/b1a518fe-7ad6-4298-b743-3672bbb7640a" />

<br/>

The following reward params can be updated for an Umbrella Asset and Reward pair:

- `maxEmissionsPerSecond`: It is the maximum possible emission, which will be reached by depositing `targetLiquidity` amount of assets.
- `distributionEnd`: It is the timestamp when reward emissions stop.
- `rewardPayer`: It is an address funding the rewards (in most cases is the Aave Collector)

_Please note: Before updating the umbrella rewards, make sure the rewardPayer (default is AaveCollector) has sufficient funds and approval for the new configuration and only the above params are allowed to be updated via the PermissionedPayloadsController infra, and other params like targetLiquidity can only be changed by the Aave Governance_

### How to use the cli generator to update Umbrella Rewards:

This repository includes a cli generator to help you bootstrap the required scripts for updating umbrella rewards.
To run the generator you need to run: `npm run generate`

To get a full list of available commands run: `npm run generate -- --help`

Below you can find an example on how to use the CLI generator:

```sh
npm run generate

> aave-reward-configurations@1.0.0 generate
> tsx generator/cli

? Please select the reward action you want to do
  Setup new liquidity mining
  Updating existing liquidity mining
❯ Updating existing Umbrella Rewards

? Select the Aave Pool:
  AaveV3Ethereum
❯ AaveV3BaseSepolia

? Short title of the rewards program TestTitle
Fetching information for updating existing umbrella rewards on AaveV3BaseSepolia
? Select the umbrella asset for which rewards needs to be updated:
  Custom Address (Enter Manually)
❯ STK_WA_USDC_V1
  STK_WA_USDT_V1
  STK_WA_WBTC_V1
  STK_WA_cbETH_V1
  STK_WA_LINK_V1
  STK_WETH_V1

? Select the rewards you wish to update for the asset
>◉ USDC
 ◯ USDT

----------------------------------------------------------
Current on-chain configuration for the reward: USDC and asset: STK_WA_USDC_V1:
maxEmissionsPerSecond: 160000 (~414720.00 token units per month)
distributionEnd: 1753788774 (Tue Jul 29 2025)
----------------------------------------------------------

? Please input the maxEmissionsPerSecond you want to configure for the reward: USDC and asset: STK_WA_USDC_V1 (Use arrow keys)
❯ Keep maxEmissionsPerSecond the same as current
  Enter maxEmissionsPerSecond in token units / 180 days
  Enter raw maxEmissionsPerSecond

? Enter the distributionEnd in days from current timestamp: 60 days

Scripts generated...
```

Via the CLI generator, scripts will be generated in the `./tests` directory which can be used to emit calldata which can be manually used to plug into the safe UI.

To only emit calldata without sending any tx, following command could be run: `forge test --mp tests/UmbrellaRewardsTestBaseSep.t.sol --mt test_logCalldatas -vv`. Please note: the exact command will be generated on the comments of your tests.

<br/>
