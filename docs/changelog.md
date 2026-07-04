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


## style: add section dividers in rewards_badge src/lib.rs
Added clear visual divider comments separating storage keys, logic, and tests in rewards_badge.


## style: add section dividers in crowdfunding src/lib.rs
Added visual section divider comments in crowdfunding/src/lib.rs.


## refactor: simplify test assertions in rewards_badge test suite
Refactored test asserts in rewards_badge/src/test.rs for cleaner error reporting.


## refactor: expand assertion messages in crowdfunding test suite
Expanded assert descriptions in crowdfunding/src/test.rs.


## docs: update deploy.sh comments to explain friendbot pre-funding
Added details in deploy.sh explaining how to fund the deployer account using Friendbot.


## docs: document testnet Native XLM contract ID verification
Added documentation verification steps for native XLM token address on Testnet.


## docs: add comments on fetchContractState function error handling
Documented state serialization and parsing in services/contract.js.


## docs: add comments on fetchUserBadge helper in services/contract.js
Documented badge client call parameter formatting in services/contract.js.


## docs: add comments on submitDonation helper in services/contract.js
Added detailed documentation for the transaction submission pipeline in contract.js.


## docs: document checkTransactionStatus helper in services/contract.js
Documented status polling logic in services/contract.js.


## style: improve code formatting in services/contract.js
Formatted contract service JavaScript code for better readability.


## docs: add docstring to BadgeIndicator component properties
Documented props for BadgeIndicator component.


