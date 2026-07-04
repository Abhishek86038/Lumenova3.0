#![cfg(test)]
use super::*;
use soroban_sdk::{Env, Address};
use soroban_sdk::testutils::Address as _;

#[test]
fn test_badge_minting_and_tiers() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register_contract(None, RewardsBadgeContract);
    let client = RewardsBadgeContractClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    let donor = Address::generate(&env);

    client.initialize(&admin);

    // Initial badge should be 0 (None)
    assert_eq!(client.get_badge(&donor), 0);

    // Mint Bronze badge (1)
    client.mint_badge(&donor, &1);
    assert_eq!(client.get_badge(&donor), 1);

    // Mint Gold badge (3)
    client.mint_badge(&donor, &3);
    assert_eq!(client.get_badge(&donor), 3);

    // Try to downgrade to Silver (2) - should remain Gold (3)
    client.mint_badge(&donor, &2);
    assert_eq!(client.get_badge(&donor), 3);
}
