#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, symbol_short, token, Address, Env};

#[soroban_sdk::contractclient(name = "BadgeClient")]
pub trait BadgeContract {
    fn mint_badge(env: Env, donor: Address, tier: u32);
}

#[contracttype]
#[derive(Clone)]
pub enum DataKey {
    Owner,
    Token,
    Goal,
    Raised,
    BadgeContract,
    DonorTotal(Address),
}

#[contract]
pub struct CrowdfundingContract;

#[contractimpl]
impl CrowdfundingContract {
    pub fn initialize(env: Env, owner: Address, token: Address, goal: i128) {
        assert!(!env.storage().instance().has(&DataKey::Owner), "Already initialized");
        env.storage().instance().set(&DataKey::Owner, &owner);
        env.storage().instance().set(&DataKey::Token, &token);
        env.storage().instance().set(&DataKey::Goal, &goal);
        env.storage().instance().set(&DataKey::Raised, &0i128);
    }

    pub fn set_badge_contract(env: Env, badge_contract: Address) {
        let owner: Address = env.storage().instance().get(&DataKey::Owner).unwrap();
        owner.require_auth();
        env.storage().instance().set(&DataKey::BadgeContract, &badge_contract);
    }

    pub fn get_badge_contract(env: Env) -> Option<Address> {
        env.storage().instance().get(&DataKey::BadgeContract)
    }

    pub fn donate(env: Env, donor: Address, amount: i128) {
        donor.require_auth();
        assert!(amount > 0, "Donation amount must be positive");
        
        let token_address: Address = env.storage().instance().get(&DataKey::Token).unwrap();
        let token_client = token::Client::new(&env, &token_address);
        
        // Transfer native tokens (XLM) from the donor to the contract address
        token_client.transfer(&donor, &env.current_contract_address(), &amount);
        
        let mut raised: i128 = env.storage().instance().get(&DataKey::Raised).unwrap_or(0);
        raised += amount;
        env.storage().instance().set(&DataKey::Raised, &raised);
        
        // Update donor total
        let mut donor_total = env.storage().persistent().get(&DataKey::DonorTotal(donor.clone())).unwrap_or(0i128);
        donor_total += amount;
        env.storage().persistent().set(&DataKey::DonorTotal(donor.clone()), &donor_total);
        
        // Emit donation event
        let topics = (symbol_short!("donate"), donor.clone());
        env.events().publish(topics, (amount, raised));
        
        // Badge thresholds:
        // Bronze: 50+ XLM (500,000,000 stroops)
        // Silver: 200+ XLM (2,000,000,000 stroops)
        // Gold: 500+ XLM (5,000,000,000 stroops)
        let mut tier = 0u32;
        if donor_total >= 5_000_000_000 {
            tier = 3;
        } else if donor_total >= 2_000_000_000 {
            tier = 2;
        } else if donor_total >= 500_000_000 {
            tier = 1;
        }
        
        if tier > 0 {
            if let Some(badge_address) = env.storage().instance().get::<_, Address>(&DataKey::BadgeContract) {
                let badge_client = BadgeClient::new(&env, &badge_address);
                badge_client.mint_badge(&donor, &tier);
            }
        }
    }

    pub fn withdraw(env: Env) {
        let owner: Address = env.storage().instance().get(&DataKey::Owner).unwrap();
        owner.require_auth();

        let token_address: Address = env.storage().instance().get(&DataKey::Token).unwrap();
        let token_client = token::Client::new(&env, &token_address);

        let balance = token_client.balance(&env.current_contract_address());
        assert!(balance > 0, "No funds to withdraw");

        token_client.transfer(&env.current_contract_address(), &owner, &balance);
    }

    pub fn get_total_raised(env: Env) -> i128 {
        env.storage().instance().get(&DataKey::Raised).unwrap_or(0)
    }

    pub fn get_goal(env: Env) -> i128 {
        env.storage().instance().get(&DataKey::Goal).unwrap_or(0)
    }

    pub fn get_donor_total(env: Env, donor: Address) -> i128 {
        env.storage().persistent().get(&DataKey::DonorTotal(donor)).unwrap_or(0)
    }
}

#[cfg(test)]
mod test;
