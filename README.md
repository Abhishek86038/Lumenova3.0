# Lumenova-L3 🟠 — Production-Ready Crowdfunding dApp with On-Chain Rewards

An advanced, production-ready decentralized crowdfunding and sponsor rewards dApp on the Stellar Testnet.

---

## 2. Overview
**Lumenova-L3** is an upgraded, full-featured decentralized crowdfunding platform built for the Stellar Builder Challenge. In this level, we introduce multi-contract coordination:
1. **Donors** contribute XLM to the **Crowdfunding Contract** via their connected Stellar wallets.
2. The **Crowdfunding Contract** tracks the donor's lifetime contributions on-chain.
3. Once specific thresholds are crossed, the Crowdfunding contract makes a cross-contract client call directly to the **RewardsBadge Contract** to mint a sponsor badge tier for the donor's address.
4. Both contracts emit on-chain events (`donate` and `mint`) which are streamed in real-time by the frontend to update the metrics and dual activity feeds live without manual browser refreshes.

---

## 3. Architecture Diagram
```
                     +---------------------------------------+
                     |                User                   |
                     +-------------------+-------------------+
                                         |
                                         v
                     +-------------------+-------------------+
                     |              Frontend                 |
                     +-------------------+-------------------+
                                         | (1) Selects Wallet & Amount
                                         v
                     +-------------------+-------------------+
                     |         Stellar Wallet Kit            |
                     |     (Freighter / xBull / Albedo)      |
                     +-------------------+-------------------+
                                         | (2) Sign & Submit Tx
                                         v
                     +-------------------+-------------------+
                     |       Crowdfunding Contract           |
                     | (Goal & lifetime contributions check) |
                     +-------------------+-------------------+
                                         | (3) Cross-Contract Call
                                         |     if threshold crossed
                                         v
                     +-------------------+-------------------+
                     |       RewardsBadge Contract           |
                     |   (Mints Badge: Bronze/Silver/Gold)   |
                     +-------------------+-------------------+
                                         | (4) Emits on-chain events
                                         v
                     +-------------------+-------------------+
                     |            Stellar Event              |
                     |          rpc.getEvents()              |
                     +-------------------+-------------------+
                                         | (5) Streamed live
                                         v
                     +-------------------+-------------------+
                     |        Frontend Dual Feed             |
                     | (Donations & Badges update instantly) |
                     +-------------------+-------------------+
```

---

## 4. Features
- **Multi-Wallet Support:** Seamlessly connect Freighter, xBull, and Albedo wallets via `@creit.tech/stellar-wallets-kit`.
- **Two Interconnected Smart Contracts:** Cleanly separates the core crowdfunding financial logic from the rewards/badge gamification system.
- **Inter-Contract Communication:** The Crowdfunding contract invokes the RewardsBadge contract dynamically using a Rust client instance.
- **Real-Time Event Streaming:** Filters and streams events for both contract IDs, updating the progress metrics and dual history panels live.
- **Automated Testing:** Standardized unit tests for contract conditions (4 tests) and frontend modules (4 tests).
- **CI/CD Pipeline:** Fully configured GitHub Actions workflow verifying dependencies, linting, tests, and builds.
- **Mobile-Responsive Design:** Tailored Tailwind CSS grid configurations supporting mobile viewports (320px-480px), tablets, and desktop displays.
- **Production-Grade Error Handling:** Visual alerts for out-of-funds states, user signature declines, and RPC failures with manual retry triggers.

---

## 5. Tech Stack
- **Frontend Framework:** React 19 (Vite)
- **Styling:** TailwindCSS v4
- **Smart Contract SDK:** Soroban SDK v22 (Rust)
- **Wallet Connection:** `@creit.tech/stellar-wallets-kit`
- **Network Interface:** `@stellar/stellar-sdk` & Soroban RPC Client
- **Testing Frameworks:** Vitest, React Testing Library, and Cargo Test (Rust)
- **CI/CD:** GitHub Actions
- **Hosting / Deployment:** Vercel / Netlify

---

## 6. Smart Contracts

### A. Crowdfunding Contract
- **Contract ID:** `CDLU7V7V2WFQB7EXJMY6S76IRJHGV3QGTMAC3UGU46UNRBWQIDDIOWMY`
- **Functions:**
  - `initialize(owner: Address, token: Address, goal: i128)`: Sets the project owner, native token, and campaign goal in stroops.
  - `donate(donor: Address, amount: i128)`: Deposits XLM into escrow, updates total raised, tracks lifetime donor contributions, and triggers badge minting when thresholds are met.
  - `get_total_raised() -> i128`: Returns the total amount of stroops contributed.
  - `get_goal() -> i128`: Returns the target goal amount in stroops.
- **Stellar.Expert Link:** [Verify Crowdfunding on Stellar.Expert](https://stellar.expert/explorer/testnet/contract/CDLU7V7V2WFQB7EXJMY6S76IRJHGV3QGTMAC3UGU46UNRBWQIDDIOWMY)

### B. RewardsBadge Contract
- **Contract ID:** `CDBRYLG3XQN744X7MUB6T4V5KUIBTPCJCEWCKD6CBLL6UOOVWADHIFUL`
- **Functions:**
  - `initialize(admin: Address)`: Establishes the admin address allowed to mint badges (set to the Crowdfunding contract ID).
  - `mint_badge(donor: Address, tier: u32)`: Mints or upgrades the sponsor badge for the donor.
  - `get_badge(donor: Address) -> u32`: Returns the badge tier (0 = None, 1 = Bronze, 2 = Silver, 3 = Gold).
- **Stellar.Expert Link:** [Verify RewardsBadge on Stellar.Expert](https://stellar.expert/explorer/testnet/contract/CDBRYLG3XQN744X7MUB6T4V5KUIBTPCJCEWCKD6CBLL6UOOVWADHIFUL)

### Cross-Contract Call Details
In `crowdfunding/src/lib.rs`, the contract initializes a client representing the RewardsBadge contract:
```rust
let badge_client = RewardsBadgeContractClient::new(&env, &badge_contract_id);
badge_client.mint_badge(&donor, &tier);
```
This is executed directly during the `donate()` invocation after resolving the donor's lifetime donation amount.

---

## 7. Live Demo
- **Live URL:** `<ADD REAL DEPLOYED LINK>` *(e.g., https://lumenova-l3.vercel.app)*
- **Demo Video (1-2 min):** `<ADD REAL YOUTUBE/LOOM LINK>`

---

## 8. Prerequisites
- **Node.js:** v18.0.0 or higher
- **Rust Toolchain:** Stable version with `wasm32-unknown-unknown` targets configured.
- **Stellar CLI:** For deployment and contract administration.
- **Stellar Wallet Extension:** Freighter, xBull, or Albedo installed in your browser.
- **Testnet XLM:** Funded via Friendbot to sign and send transactions.

---

## 9. Setup & Installation

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/your-username/Lumenova-L3.git
   cd Lumenova-L3
   ```

2. **Install Node Dependencies:**
   ```bash
   npm install --ignore-scripts
   ```

3. **Smart Contract Deployment & Linking:**
   The repository includes an automated script to build, deploy, and link both contracts. Make the script executable and run:
   ```bash
   chmod +x deploy.sh
   ./deploy.sh
   ```

4. **Launch Local Server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` (or the port outputted in the shell) in your browser.

---

## 10. Running Tests

### A. Smart Contract Tests (Rust)
To run the automated contract tests:
```bash
npm run test:contracts
```
*(Or directly: `cargo test --target-dir .target_test --jobs 1`)*

### B. Frontend Tests (React)
To run the Vitest frontend unit tests:
```bash
npm run test:frontend
```

### Test Results Summary

| Crate / Component | Test Name | Expected Behavior | Status |
|---|---|---|---|
| `rewards-badge` | `test_badge_minting_and_tiers` | Correctly upgrades tiers and prevents downgrades | **PASSED** |
| `rewards-badge` | `test_cannot_initialize_twice` | Panics with "Already initialized" on multiple setups | **PASSED** |
| `rewards-badge` | `test_only_admin_can_mint` | Restricts minting privileges to authorized admin | **PASSED** |
| `crowdfunding-contract` | `test_crowdfunding_and_badge_trigger` | Triggers badge upgrades at donation thresholds | **PASSED** |
| `WalletModal` | `does not render when isOpen is false` | Returns null when modal open state is inactive | **PASSED** |
| `WalletModal` | `renders options and calls handlers when open` | Calls `onConnect` with clicked provider identifier | **PASSED** |
| `DonateForm` | `renders connect prompt when wallet is not connected` | Prompts user to link wallet before showing input | **PASSED** |
| `DonateForm` | `renders amount input and donation form when connected` | Exposes amount input field and submission button | **PASSED** |

---

## 11. CI/CD Pipeline
A GitHub Actions workflow is configured in `.github/workflows/ci.yml`. On every PR or push:
1. **Contract Job:** Installs the Rust toolchain, caches target files, compiles WASMs, and runs `cargo test`.
2. **Frontend Job:** Installs Node packages, runs `oxlint` linting, executes Vitest unit tests, and verifies the production bundle using `npm run build`.

![CI/CD Passing](./screenshots/ci-pipeline.png) *(Placeholder: Update with repository screenshot after pushing)*

---

## 12. How to Use
1. **Connect Wallet:** Click "Connect Wallet" at the header and choose your preferred wallet.
2. **Review Campaign Stats:** The progress bar and raised totals indicate the current campaign progress.
3. **Make a Donation:** Input a value (e.g., 60 XLM) and click "Donate Now". Approve the transaction in your wallet prompt.
4. **Earn an On-Chain Badge:**
   - If your total donation is 50+ XLM, a **🥉 BRONZE SPONSOR** badge will display next to your address.
   - If you donate more, your badge will upgrade to **🥈 SILVER** (200+ XLM) or **🥇 GOLD** (500+ XLM) in real-time.
5. **Monitor Feeds:** Watch the side-by-side feeds dynamically update with your donation amount and new badge tier.

---

## 13. Sample Transaction
Below are verified transaction details on the Stellar Testnet:

- **RewardsBadge Deployment TX Hash:** `cb587d27273d9bbe1c0d1358856a4bf4ba2690f1e3fdb876835cf990ea9b0398`
  - [Verify Deployment on Stellar.Expert](https://stellar.expert/explorer/testnet/tx/cb587d27273d9bbe1c0d1358856a4bf4ba2690f1e3fdb876835cf990ea9b0398)
- **Crowdfunding Deployment TX Hash:** `aa4b01ecb0c64e644020e86535af05018ab0651f88663a43da96801701ca4657`
  - [Verify Deployment on Stellar.Expert](https://stellar.expert/explorer/testnet/tx/aa4b01ecb0c64e644020e86535af05018ab0651f88663a43da96801701ca4657)
- **Linking Contracts TX Hash (set_badge_contract):** `af6c9d6d245bc5626c43de5aa08d391d9eb3b37ada53022dc6730d81660bfdec`
  - [Verify Linking on Stellar.Expert](https://stellar.expert/explorer/testnet/tx/af6c9d6d245bc5626c43de5aa08d391d9eb3b37ada53022dc6730d81660bfdec)

---

## 14. Screenshots
- **Mobile Responsive View:**
  ![Mobile Responsive View](./screenshots/mobile-view.png) *(Placeholder)*
- **Desktop Campaign View:**
  ![Desktop Campaign View](./screenshots/desktop-view.png) *(Placeholder)*
- **Badge Earned:**
  ![Badge Earned](./screenshots/badge-earned.png) *(Placeholder)*
- **Test Output:**
  ![Test Output](./screenshots/test-results.png) *(Placeholder)*
- **CI/CD Run:**
  ![CI/CD Run](./screenshots/ci-pipeline.png) *(Placeholder)*

---

## 15. Project Structure
```
├── .github/workflows/
│   └── ci.yml               # Automated pipeline triggers
├── contracts/
│   ├── crowdfunding/
│   │   ├── src/
│   │   │   ├── lib.rs       # Crowdfunding logic & client triggers
│   │   │   └── test.rs      # Threshold unit tests
│   │   └── Cargo.toml
│   └── rewards_badge/
│       ├── src/
│       │   ├── lib.rs       # Badge storage & mint modifiers
│       │   └── test.rs      # Access and validation tests
│       └── Cargo.toml
├── src/
│   ├── components/
│   │   ├── BadgeIndicator.jsx
│   │   ├── CampaignProgress.jsx
│   │   ├── CampaignProgressSkeleton.jsx
│   │   ├── DonateForm.jsx
│   │   ├── DonationFeed.jsx
│   │   ├── ErrorBoundary.jsx
│   │   └── WalletModal.jsx
│   ├── services/
│   │   └── contract.js      # Stellar SDK integrations
│   └── test/
│       ├── DonateForm.test.jsx
│       ├── WalletModal.test.jsx
│       └── setup.js
├── deploy.sh                # Setup and deploy automation
├── Cargo.toml               # Workspace manager
└── package.json             # Node scripts & dependencies
```

---

## 16. Error Handling
- **Wallet Connectivity:** Catches missing/uninstalled extension states and guides the user to install them.
- **User Rejections:** Traps denied transaction sign prompts and displays `Transaction cancelled by user`.
- **Underfunded Accounts:** Validates XLM fees and triggers `Insufficient XLM balance for this donation` prior to submission.
- **RPC Failures:** Intercepts timeouts/errors on campaign state fetches, rendering retry prompts and fallback layouts.
- **Unexpected Application Crashes:** Handled by a React `ErrorBoundary` fallback dashboard.

---

## 17. Deployment Workflow
Deploying is handled by `deploy.sh`. It performs the following steps sequentially:
1. **Compilation:** Compiles the workspace using cargo release parameters into Rust WASM targets.
2. **Uploading & Deploying:** Uploads `rewards_badge.wasm` and `crowdfunding_contract.wasm` targets onto the testnet.
3. **Initialization:** Invokes `initialize` on the RewardsBadge contract, specifying the Crowdfunding contract as its mint authority.
4. **Setup:** Invokes `initialize` on the Crowdfunding contract with the owner, native XLM token address, and target goal.
5. **Linking:** Calls `set_badge_contract` in the Crowdfunding contract, storing the RewardsBadge contract address.

---

## 18. Commit History
> [!NOTE]
> This project contains 10+ meaningful commits documenting incremental feature development — see the repository's git history (`git log`) for full details of the step-by-step progress.

---

## 19. Known Limitations / Future Improvements
Planned enhancements for Level 4 (Blue Belt):
- **Custom Token Escrows:** Supporting user donations via arbitrary SEP-31/SAC custom assets (e.g. USDC) alongside native XLM.
- **Advanced Campaign Registry:** Transitioning from a single campaign deployment to a factory contract allowing anyone to deploy their own campaigns.
- **Multi-Badge Customization:** Allowing organizers to customize the visual assets and names of the badges minted by their campaigns.

---

## 20. License
This project is licensed under the MIT License - see the LICENSE file for details.
