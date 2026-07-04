#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, symbol_short, Address, Env};

#[contracttype]
#[derive(Clone)]
pub enum DataKey {
    Admin,
    Badge(Address),
}

#[contract]
pub struct RewardsBadgeContract;

#[contractimpl]
impl RewardsBadgeContract {
    pub fn initialize(env: Env, admin: Address) {
        assert!(!env.storage().instance().has(&DataKey::Admin), "Already initialized");
        env.storage().instance().set(&DataKey::Admin, &admin);
    }

    pub fn set_admin(env: Env, new_admin: Address) {
        let admin: Address = env.storage().instance().get(&DataKey::Admin).unwrap();
        admin.require_auth();
        env.storage().instance().set(&DataKey::Admin, &new_admin);
    }

    pub fn mint_badge(env: Env, donor: Address, tier: u32) {
        let admin: Address = env.storage().instance().get(&DataKey::Admin).unwrap();
        admin.require_auth();

        let current_tier = env.storage().persistent().get(&DataKey::Badge(donor.clone())).unwrap_or(0u32);
        if tier > current_tier {
            env.storage().persistent().set(&DataKey::Badge(donor.clone()), &tier);
            // Emit event
            env.events().publish((symbol_short!("mint"), donor), tier);
        }
    }

    pub fn get_badge(env: Env, donor: Address) -> u32 {
        env.storage().persistent().get(&DataKey::Badge(donor)).unwrap_or(0)
    }
}

#[cfg(test)]
mod test;
