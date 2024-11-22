# include .env file and export its env vars
# (-include to ignore error if it does not exist)
-include .env

# deps
update:; forge update

# Build & test
build  :; forge build --sizes --via-ir
test   :; forge test -vvv
test-sd-rewards :; forge test -vvv --match-contract EmissionTestSDPolygon
test-stmatic-rewards :; forge test -vvv --match-contract EmissionTestSTMATICPolygon
test-maticx-rewards :; forge test -vvv --match-contract EmissionTestMATICXPolygon
deploy-ledger :; forge script ${contract} --rpc-url ${chain}  --ledger --mnemonic-indexes ${MNEMONIC_INDEX} --sender ${LEDGER_SENDER} --verify -vvvv --slow --broadcast ${args}

# scripts
deploy-sd-transfer-strategy :;  forge script scripts/RewardsConfigHelpers.s.sol:SDDeployTransferStrategy --rpc-url polygon --broadcast --legacy --ledger --mnemonic-indexes ${MNEMONIC_INDEX} --sender ${LEDGER_SENDER} --verify -vvvv
deploy-stmatic-transfer-strategy :;  forge script scripts/RewardsConfigHelpers.s.sol:STMATICDeployTransferStrategy --rpc-url polygon --broadcast --legacy --ledger --mnemonic-indexes ${MNEMONIC_INDEX} --sender ${LEDGER_SENDER} --verify -vvvv
