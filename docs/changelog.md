# Project Development Changelog


## docs: document contract initialize function inputs
Added detailed documentation for the crowdfunding contract initialization parameters: owner, native token, and goal in stroops.


## docs: add inline comments explaining goal storage key
Documented the campaign goal storage key mapping in the Rust contract storage layout.


## docs: add inline comments explaining raised storage key
Documented the raised amount storage key mapping in the Rust contract storage layout.


## docs: add explanation for token storage key
Added documentation for the token storage key that represents the SAC native XLM address.


## docs: add explanation for badge contract storage key
Documented the badge contract ID mapping in the crowdfunding contract storage.


## refactor: optimize imports in crowdfunding contract
Cleaned up unused imports and organized crate imports in crowdfunding/src/lib.rs.


## refactor: simplify require_auth checks in crowdfunding contract
Aligned authorization checks with standard Stellar patterns in the Rust contracts.


## docs: explain panic error messages in crowdfunding contract
Added detailed comments on contract panic cases such as goal limits or unauthorized access.


## docs: add docstring for donate function in crowdfunding
Documented the donate function parameters, return values, and cross-contract call triggering logic.


## docs: document withdraw function logic in crowdfunding
Documented the withdraw function logic and target account routing for campaign owners.


## docs: document get_total_raised getter function
Documented the get_total_raised read-only function logic.


## docs: document get_goal getter function
Documented the get_goal read-only function logic.


## docs: add comments on rewards_badge admin authorization
Added comments in the rewards badge contract explaining admin minting privilege rules.


## docs: document mint_badge function inputs and constraints
Documented badge tiers and minting validation checks in rewards_badge/src/lib.rs.


## docs: document get_badge getter function logic
Documented the get_badge getter function used by the frontend to display sponsor levels.


