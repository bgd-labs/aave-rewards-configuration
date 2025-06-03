# Aave Rewards Configuration Repository

This repository contains examples on how to configure Umbrella Rewards and Liquidity Mining and on Aave including:

- a [test](./tests/UmbrellaRewardsTestBaseSep.t.sol) simulating the configuration of updating umbrella rewards
- a [test](./tests/EmissionTestOpOptimism.t.sol) simulating the configuration of certain assets to receive liquidity mining
- a [test](./tests/EmissionConfigurationTestMATICXPolygon.t.sol) simulating the setting up of new configuration of certain assets after the liquidity mining program has been created
- an [example proposal](./src/contracts/AddEmissionAdminPayload.sol) payload which could be used to setup liquidity mining on a governance controlled aave v3 pool

<br/>

## Instructions to update Umbrella Rewards on Aave V3:

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

? Please input the maxEmissionsPerSecond you want to configure for the reward: USDC and asset: STK_WA_USDC_V1 (Use arrow keys)
❯ Keep maxEmissionsPerSecond the same as current
  Enter maxEmissionsPerSecond in token units / days
  Enter raw maxEmissionsPerSecond

? Enter the distributionEnd in days from current timestamp: 60 days

? Enter the address of the rewards payer you want to configure (Use arrow keys)
❯ Aave Collector (Default)
  Custom Address (Enter Manually)

Scripts generated...
```

Via the CLI generator, scripts will be generated in the `./tests` directory which can be used to send transaction to the gnosis safe (ex. ALC Multi-sig) and emit calldata which can be manaully used to plug into the safe UI. 

- To only emit calldata without sending any tx, following command could be run: `forge test --mp tests/UmbrellaRewardsTestBaseSep.t.sol --mt test_logCalldatas -vv`.
  
- To propose tx to the gnosis safe backend, please have either the following vars in your `.env`: `PRIVATE_KEY` `SENDER` if you wish to propose via private-key or `MNEMONIC_INDEX` `LEDGER_SENDER` if it via the ledger. The address in `.env` should be a proposer of the ALC Muti-sig to do this else please use the calldata method. The following is an example command to be used to send tx via: 
  - private-key `forge test --mp tests/UmbrellaRewardsTestBaseSep.t.sol --mt test_sendTransactionViaPrivateKey -vv`
  - ledger `forge test --mp tests/UmbrellaRewardsTestBaseSep.t.sol --mt test_sendTransactionViaLedger -vv`
    
_Please note: the exact command will be generated on the comments of your tests, sending directly to the safe backend via private-key and ledger is an expirmental feature and might have some limitations._

<br/>

## Instructions to activate Liquidity Mining on Aave V3:

<img width="924" alt="Screenshot 2023-04-10 at 11 27 10 AM" src="https://user-images.githubusercontent.com/22850280/230836420-7b5c4bba-d851-4258-90c6-602d33eaf845.png">

1. Make sure the rewards funds that are needed to be distributed for Liquidity Mining are present in the Rewards Vault.

   _Note: The Rewards Vault is your address which contains the reward asset._

2. Do an ERC-20 approve of the total rewards to be distributed to the Transfer Strategy contract, this is contract by Aave which helps to pull the Liquidity Mining rewards from the Rewards Vault address to distribute to the user. To know more about how Transfer Strategy contract works you can check [here](https://github.com/aave/aave-v3-periphery/blob/master/docs/rewards/rewards-transfer-strategies.md).

   _Note: The Emission Admin is an address which has access to manage and configure the reward emissions by calling the Emission Manager contract and the general type of Transfer Strategy contract used for Liquidity Mining is of type PullRewardsStrategy._

3. Finally we need to configure the Liquidity Mining emissions on the Emission Manager contract from the Emission Admin by calling the `configureAssets()` function which will take the array of the following struct to configure liquidity mining for mulitple assets for the same reward or multiple assets for mutiple rewards.

   ```
   EMISSION_MANAGER.configureAssets([{

     emissionPerSecond: The emission per second following rewards unit decimals.

     totalSupply: The total supply of the asset to incentivize. This should be kept as 0 as the Emissions Manager will fill this up.

     distributionEnd: The end of the distribution of rewards (in seconds).

     asset: The asset for which rewards should be given. Should be the address of the aave aToken (for deposit) or debtToken (for borrow).
            In case where the asset for reward is for debt token please put the address of stable debt token for rewards in stable borrow mode
            and address of variable debt token for rewards in variable borrow mode.

     reward: The reward token address to be used for Liquidity Mining for the asset.

     transferStrategy: The address of transfer strategy contract.

     rewardOracle: The Chainlink Aggregator compatible Price Oracle of the reward (used on off-chain infra like UI for price conversion).

   }])
   ```

Below is an example with the pseudo code to activate Liquidity Mining for the variable borrow of `wMatic` with `MaticX` as the reward token for the total amount of `60,000` `MaticX` for the total duration of `6 months`. For a more detailed explanation checkout this [test](./tests/EmissionTestMATICXPolygon.t.sol).

1. Make sure the Rewards Vault has sufficient balance of the MaticX token.

   ```
   IERC20(MATIC_X_ADDRESS).balanceOf(REWARDS_VAULT) > 60000 *1e18
   ```

2. Do an ERC-20 approve from the MaticX token from the Rewards Vault to the transfer strategy contract for the total amount.

   ```
   IERC20(MATIC_X_ADDRESS).approve(TRANSFER_STRATEGY_ADDRESS, 60000 *1e18);
   ```

3. Configure the Liquidity Mining emissions on the Emission Manager contract.

   ```
   EMISSION_MANAGER.configureAssets([{

     emissionPerSecond: 60000 * 1e18 / (180 days in seconds)

     totalSupply: 0

     distributionEnd: current timestamp + (180 days in seconds)

     asset: Aave Variable Debt Token of wMatic // 0x4a1c3aD6Ed28a636ee1751C69071f6be75DEb8B8

     reward: MaticX Token address // 0xfa68FB4628DFF1028CFEc22b4162FCcd0d45efb6

     transferStrategy: ITransferStrategyBase(STRATEGY_ADDRESS) // 0x53F57eAAD604307889D87b747Fc67ea9DE430B01

     rewardOracle: IEACAggregatorProxy(MaticX_ORACLE_ADDRESS) // 0x5d37E4b374E6907de8Fc7fb33EE3b0af403C7403

   }])
   ```

### How to modify emissions of the LM program?

The function `_getEmissionsPerAsset()` on [EmissionTestOpOptimism.t.sol](./tests/EmissionTestOpOptimism.t.sol) defines the exact emissions for the particular case of $OP as reward token and a total distribution of 5'000'000 $OP during exactly 90 days.
The emissions can be modified there, with the only requirement being that `sum(all-emissions) == TOTAL_DISTRIBUTION`

You can run the test via `forge test -vv` which will emit the selector encoded calldata for `configureAssets` on the emission admin which you can use to execute the configuration changes e.g. via Safe.

_Note: The test example above uses total distribution and duration distribution just for convenience to define emissions per second, in reality as we only pass emissions per second to `configureAssets()` we could define it in any way we wish._

### How to configure emissions after the LM program has been created?

After the LM program has been created, the emissions per second and the distribution end could be changed later on by the emissions admin to reduce the LM rewards or change the end date for the distribution. This can be done by calling `setEmissionPerSecond()` and `setDistributionEnd()` on the Emission Manager contract. The test examples on [EmissionConfigurationTestMATICXPolygon.t.sol](./tests/EmissionConfigurationTestMATICXPolygon.t.sol) shows how to do so.

The function `_getNewEmissionPerSecond()` and `_getNewDistributionEnd()` defines the new emissions per second and new distribution end for the particular case, which could be modified there to change to modified emissions per second and distribution end.

Similarly you can also run the test via `forge test -vv` which will emit the selector encoded calldata for `setEmissionPerSecond` and `setDistributionEnd` which can be used to make the configuration changes.

### FAQ's:

- Do we need to have and approve the whole liquidity mining reward initially?

  It is generally advisable to have and approve funds for the duration of the next 3 months of the Liquidity Mining Program. However it is the choice of the Emission Admin to do it progressively as well, as the users accrue rewards over time.

- Can we configure mutiple rewards for the same asset?

  Yes, Liquidity Mining could be configured for multiple rewards for the same asset.

- Why do we need to approve funds from the Rewards Vault to the Aave Transfer Strategy contract?

  This is needed so the Transfer Strategy contract can pull the rewards from the Rewards Vault to distribute it to the user when the user claims them.

- Can I reuse an already deployed transfer strategy?
  Yes, a transfer strategy could be reused if it has already been deployed for the given network (given that you want the rewards vault, rewards admin and the incentives controller to be the same).
- If a transfer strategy does not exist, how do I create one?

      The transfer strategy is an immutable contract which determines the logic of the rewards transfer. To create a new pull reward transfer strategy (most     common transfer strategy for liquidity mining) you could use the

  [PullRewardsTransferStrategy.sol](https://github.com/aave/aave-v3-periphery/blob/master/contracts/rewards/transfer-strategies/PullRewardsTransferStrategy.sol) contract with the following constructor params:

      - `incentivesController`: address of the incentives controller
      - `rewardsAdmin`: address of the incentives controller for access control
      - `rewardsVault`: address of the rewards vault containing the funds for the Liquidity Mining program.

      Example to deploy a transfer strategy can be found [here](./scripts/RewardsConfigHelpers.s.sol).

      _Note: All transfer strategy should inherit from the base contract [TransferStrategyBase.sol](https://github.com/aave/aave-v3-periphery/blob/master/contracts/rewards/transfer-strategies/TransferStrategyBase.sol) and you could also define your own custom transfer                   strategy even with NFT’s as rewards, given that you inherit from the base contract._

- Can we stop the liquidity mining program at any time?

  Yes, the liquidity mining program could be stopped at any moment by the Emission Admin.
  The duration of the Liquidity Mining program could be increased as well, totally the choice of Emission Admin.
  To stop the liquidity mining, we can either set the emissions per second to 0 or set the distribution end to the block we wish to stop liquiditiy mining at.

- Can we change the amount of liquidty mining rewards?

  Yes, the liquidity mining rewards could be increased or decreased by the Emission Admin. To do so, please refer
  [here](https://github.com/bgd-labs/example-liquidity-mining-aave-v3/tree/feat/configure-emissions#how-to-configure-emissions-after-the-lm-program-has-been-created)

### Setup

```sh
cp .env.example .env
forge install
```

### Test

```sh
forge test
```

## Copyright

2022 BGD Labs
