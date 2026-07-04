#!/bin/bash
# Exit immediately if a command exits with a non-zero status
set -e

echo "=== Step 1: Building Contracts ==="
# Using custom target-dir to bypass Windows file locks, compile all contracts in workspace
cargo build --target wasm32-unknown-unknown --release --target-dir .target_build

echo "=== Step 2: Deploying RewardsBadge Contract ==="
BADGE_ID=$(stellar contract deploy \
  --wasm .target_build/wasm32-unknown-unknown/release/rewards_badge.wasm \
  --source deployer \
  --network testnet)
echo "RewardsBadge Contract ID: $BADGE_ID"

echo "=== Step 3: Deploying Crowdfunding Contract ==="
CROWDFUNDING_ID=$(stellar contract deploy \
  --wasm .target_build/wasm32-unknown-unknown/release/crowdfunding_contract.wasm \
  --source deployer \
  --network testnet)
echo "Crowdfunding Contract ID: $CROWDFUNDING_ID"

echo "=== Step 4: Initializing RewardsBadge Contract ==="
# Set Crowdfunding contract as admin of RewardsBadge
stellar contract invoke \
  --id "$BADGE_ID" \
  --source deployer \
  --network testnet \
  -- initialize \
  --admin "$CROWDFUNDING_ID"

echo "=== Step 5: Initializing Crowdfunding Contract ==="
# Native XLM Token Contract ID on Testnet
TOKEN_ID="CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC"
# Owner address
OWNER_ADDRESS="GCYMLCJTY6KNGGWRXHNMPDVQIPJZDQKHU45W4TA3QUELIPCFKY3ARHF5"
# Goal: 10,000 XLM (in stroops = 100,000,000,000)
stellar contract invoke \
  --id "$CROWDFUNDING_ID" \
  --source deployer \
  --network testnet \
  -- initialize \
  --owner "$OWNER_ADDRESS" \
  --token "$TOKEN_ID" \
  --goal 100000000000

echo "=== Step 6: Linking Crowdfunding to RewardsBadge ==="
stellar contract invoke \
  --id "$CROWDFUNDING_ID" \
  --source deployer \
  --network testnet \
  -- set_badge_contract \
  --badge_contract "$BADGE_ID"

echo "=== Deployment Completed Successfully! ==="
echo "RewardsBadge: $BADGE_ID"
echo "Crowdfunding: $CROWDFUNDING_ID"
