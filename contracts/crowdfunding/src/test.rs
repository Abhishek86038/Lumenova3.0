#![cfg(test)]
use super::*;
use soroban_sdk::{Env, Address, symbol_short, token};
use soroban_sdk::testutils::Address as _;

#[contract]
pub struct MockBadgeContract;

#[contractimpl]
impl MockBadgeContract {
    pub fn initialize(_env: Env, _admin: Address) {}
    pub fn mint_badge(env: Env, _donor: Address, tier: u32) {
        let key = symbol_short!("badge");
        env.storage().persistent().set(&key, &tier);
    }
    pub fn get_badge(env: Env, _donor: Address) -> u32 {
        let key = symbol_short!("badge");
        env.storage().persistent().get(&key).unwrap_or(0)
    }
}

#[test]
fn test_crowdfunding_and_badge_trigger() {
    let env = Env::default();
    env.mock_all_auths();

    // Register Token
    let token_admin = Address::generate(&env);
    let token_address = env.register_stellar_asset_contract(token_admin.clone());
    let token_client = token::StellarAssetClient::new(&env, &token_address);
    let token_token_client = token::Client::new(&env, &token_address);

    // Register Mock Badge Contract
    let badge_contract_id = env.register_contract(None, MockBadgeContract);
    
    // Register Crowdfunding
    let crowdfunding_id = env.register_contract(None, CrowdfundingContract);
    let crowdfunding_client = CrowdfundingContractClient::new(&env, &crowdfunding_id);

    let owner = Address::generate(&env);
    let donor = Address::generate(&env);

    // Initialize Crowdfunding
    crowdfunding_client.initialize(&owner, &token_address, &10_000_000_000);
    crowdfunding_client.set_badge_contract(&badge_contract_id);

    // Mint some initial tokens to donor
    token_client.mint(&donor, &10_000_000_000);
    assert_eq!(token_token_client.balance(&donor), 10_000_000_000);

    // Donate 40 XLM (400,000,000 stroops) - under Bronze threshold (50 XLM)
    crowdfunding_client.donate(&donor, &400_000_000);
    assert_eq!(crowdfunding_client.get_total_raised(), 400_000_000);
    assert_eq!(crowdfunding_client.get_donor_total(&donor), 400_000_000);
    
    // Verify badge is still 0
    let badge_client = MockBadgeContractClient::new(&env, &badge_contract_id);
    assert_eq!(badge_client.get_badge(&donor), 0);

    // Donate 20 XLM more (total 60 XLM) - crosses Bronze threshold (50 XLM)
    crowdfunding_client.donate(&donor, &200_000_000);
    assert_eq!(crowdfunding_client.get_total_raised(), 600_000_000);
    assert_eq!(crowdfunding_client.get_donor_total(&donor), 600_000_000);

    // Verify badge is now 1 (Bronze)
    assert_eq!(badge_client.get_badge(&donor), 1);
}
