// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {AaveV3Ethereum, AaveV3EthereumAssets} from 'aave-address-book/AaveV3Ethereum.sol';
import {IEmissionManager, ITransferStrategyBase, RewardsDataTypes, IEACAggregatorProxy} from '../../src/interfaces/IEmissionManager.sol';
import {LMSetupBaseTest} from '../utils/LMSetupBaseTest.sol';

contract AaveV3Ethereum_LMSetupOld_version_20241116 is LMSetupBaseTest {
  address public constant override REWARD_ASSET =
    AaveV3EthereumAssets.WETH_UNDERLYING;
  uint88 constant DURATION_DISTRIBUTION = 180 days;
  uint256 public constant override TOTAL_DISTRIBUTION = 2400 * 10 ** 18;
  address public constant EMISSION_ADMIN = 0xac140648435d03f784879cd789130F22Ef588Fcd;
  address public constant override DEFAULT_INCENTIVES_CONTROLLER =
    AaveV3Ethereum.DEFAULT_INCENTIVES_CONTROLLER;

  ITransferStrategyBase public constant override TRANSFER_STRATEGY =
    ITransferStrategyBase(0xe40d278afD00E6187Db21ff8C96D572359Ef03bf);

  IEACAggregatorProxy public constant override REWARD_ORACLE =
    IEACAggregatorProxy(AaveV3EthereumAssets.WETH_ORACLE);

  address constant vWETH_WHALE = 0xb054D7551BdA6676F2F812aaE2B2CD537df5CdEe;
  address constant aWETH_WHALE = 0x9df8dd68C73b096Cd9C0c4963fe89613DF40a1Cf;

  function setUp() public {
    vm.createSelectFork(vm.rpcUrl('mainnet'), 21199955);
  }

  function test_activation() public {
    vm.prank(EMISSION_ADMIN);
    IEmissionManager(AaveV3Ethereum.EMISSION_MANAGER).configureAssets(_getAssetConfigs());

    emit log_named_bytes(
      'calldata to submit from Gnosis Safe',
      abi.encodeWithSelector(
        IEmissionManager(AaveV3Ethereum.EMISSION_MANAGER).configureAssets.selector,
        _getAssetConfigs()
      )
    );

    _testClaimRewardsForWhale(
      vWETH_WHALE,
      AaveV3EthereumAssets.WETH_V_TOKEN,
      DURATION_DISTRIBUTION,
      4.77 * 10 ** 18
    );

    _testClaimRewardsForWhale(
      aWETH_WHALE,
      AaveV3EthereumAssets.WETH_A_TOKEN,
      DURATION_DISTRIBUTION,
      12.72 * 10 ** 18
    );
  }

  function _getAssetConfigs()
    internal
    view
    override
    returns (RewardsDataTypes.RewardsConfigInput[] memory)
  {
    uint32 distributionEnd = uint32(block.timestamp + DURATION_DISTRIBUTION);

    EmissionPerAsset[] memory emissionsPerAsset = _getEmissionsPerAsset();

    RewardsDataTypes.RewardsConfigInput[]
      memory configs = new RewardsDataTypes.RewardsConfigInput[](emissionsPerAsset.length);
    for (uint256 i = 0; i < emissionsPerAsset.length; i++) {
      configs[i] = RewardsDataTypes.RewardsConfigInput({
        emissionPerSecond: _toUint88(emissionsPerAsset[i].emission / DURATION_DISTRIBUTION),
        totalSupply: 0, // IMPORTANT this will not be taken into account by the contracts, so 0 is fine
        distributionEnd: distributionEnd,
        asset: emissionsPerAsset[i].asset,
        reward: REWARD_ASSET,
        transferStrategy: TRANSFER_STRATEGY,
        rewardOracle: REWARD_ORACLE
      });
    }

    return configs;
  }

  function _getEmissionsPerAsset() internal pure override returns (EmissionPerAsset[] memory) {
    EmissionPerAsset[] memory emissionsPerAsset = new EmissionPerAsset[](2);

    emissionsPerAsset[0] = EmissionPerAsset({
      asset: AaveV3EthereumAssets.WETH_V_TOKEN,
      emission: 400 * 10 ** 18
    });

    emissionsPerAsset[1] = EmissionPerAsset({
      asset: AaveV3EthereumAssets.WETH_A_TOKEN,
      emission: 2000 * 10 ** 18
    });

    uint256 totalDistribution;
    for (uint256 i = 0; i < emissionsPerAsset.length; i++) {
      totalDistribution += emissionsPerAsset[i].emission;
    }
    require(totalDistribution == TOTAL_DISTRIBUTION, 'INVALID_SUM_OF_EMISSIONS');

    return emissionsPerAsset;
  }
}
