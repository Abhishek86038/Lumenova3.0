# Lumenova-L3 🟢 — Production-Ready Crowdfunding & Sponsor Badges Stellar dApp

A production-ready, full-featured decentralized crowdfunding dApp on the Stellar Testnet. Features inter-contract communication, automated sponsor badge minting, comprehensive unit and frontend test suites, and continuous integration.

---

## 1. Overview
**Lumenova-L3** upgrades the crowdfunding contract to support inter-contract communication. When a donor contributes XLM to the **Crowdfunding** contract, the contract automatically tracks their lifetime donations. If the donor crosses specific thresholds, the Crowdfunding contract makes a cross-contract client call to the **RewardsBadge** contract to mint a sponsor badge:
- **🥉 Bronze Badge:** 50+ XLM (500,000,000 stroops)
- **🥈 Silver Badge:** 200+ XLM (2,000,000,000 stroops)
- **🥇 Gold Badge:** 500+ XLM (5,000,000,000 stroops)

The frontend shows the connected user's current badge tier in real-time, features a live dual feed streaming both donations and minted badges side-by-side without manual refreshes, and handles error states robustly with loading skeletons and retry capabilities.

---

## 2. Features
- **Inter-Contract Communication:** The Crowdfunding contract calls the RewardsBadge contract dynamically to manage badge levels.
- **Visual Badge Indicators:** Shiny sponsor badges are displayed alongside the connected user's wallet address.
- **Dual Live Activity Feeds:** Parallel activity columns tracking recent donations and newly minted sponsor badges in real-time.
- **RPC Retry Mechanisms:** Instant retry triggers on failed campaign or badge fetches.
- **Loading Skeletons:** Skeleton overlays during state queries to prevent sudden layout shifts.
- **Unit & UI Test Suites:** High-coverage tests for both Rust contracts and React UI components.
- **CI/CD Pipeline:** Fully configured GitHub Actions pipeline validating linting, testing, and building.

---

## 3. Tech Stack
- **Frontend Framework:** React 19 (Vite)
- **Styling:** TailwindCSS v4
- **Testing Runner:** Vitest & React Testing Library (Frontend) / Cargo Test (Contracts)
- **Wallet Connection:** `@creit.tech/stellar-wallets-kit`
- **Contract SDK & SDK Client:** `@stellar/stellar-sdk` & Soroban RPC Client
- **Smart Contract Language:** Rust (Soroban SDK v22)
- **Network:** Stellar Testnet (Soroban RPC: `https://soroban-testnet.stellar.org`)

---

## 4. Deployed Contract Details
Both contracts are deployed and initialized on the Stellar Testnet:

- **Crowdfunding Contract ID:** `CDLU7V7V2WFQB7EXJMY6S76IRJHGV3QGTMAC3UGU46UNRBWQIDDIOWMY`
- **RewardsBadge Contract ID:** `CDBRYLG3XQN744X7MUB6T4V5KUIBTPCJCEWCKD6CBLL6UOOVWADHIFUL`
- **Native XLM Token Contract ID:** `CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC`

### Verification Links:
- [Verify Crowdfunding on Stellar.Expert](https://stellar.expert/explorer/testnet/contract/CDLU7V7V2WFQB7EXJMY6S76IRJHGV3QGTMAC3UGU46UNRBWQIDDIOWMY)
- [Verify RewardsBadge on Stellar.Expert](https://stellar.expert/explorer/testnet/contract/CDBRYLG3XQN744X7MUB6T4V5KUIBTPCJCEWCKD6CBLL6UOOVWADHIFUL)

---

## 5. Prerequisites
- **Node.js:** v18.0.0 or higher
- **Rust & Cargo:** To compile and run smart contract unit tests.
- **Stellar CLI:** To execute deployments or invokes.
- **Stellar Wallet Extension:** Freighter, xBull, or Albedo.

---

## 6. How to Run Tests

### 1. Smart Contract Tests (Rust)
Run the Rust cargo test suite verifying thresholds, cross-contract calls, admin checks, and double-initialization blocks:
```bash
npm run test:contracts
```
*(Or manually: `cargo test --target-dir .target_test --jobs 1`)*

### 2. Frontend Tests (React)
Run the Vitest suite validating the `WalletModal` and `DonateForm` rendering and click handlers:
```bash
npm run test:frontend
```

---

## 7. Deployment Instructions
If you want to build and redeploy the contracts on Testnet:
1. Ensure you have a configured identity called `deployer` in the Stellar CLI.
2. Grant executing permissions to the deployment script:
   ```bash
   chmod +x deploy.sh
   ```
3. Run the automated script:
   ```bash
   ./deploy.sh
   ```
The script compiles the crates, uploads/deploys the WASM binaries, initializes both contracts, and links them together.

---

## 8. Setup & Local Dev

1. **Install Dependencies:**
   ```bash
   npm install --ignore-scripts
   ```

2. **Run Development Server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` (or the port specified by Vite) in your browser.

---

## 9. Folder Structure
```
├── .github/workflows/   # CI/CD pipelines
├── contracts/           # Rust workspace
│   ├── crowdfunding/    # Crowdfunding contract & unit tests
│   └── rewards_badge/   # RewardsBadge contract & unit tests
├── src/
│   ├── components/      # Reusable UI components & ErrorBoundary
│   ├── services/        # Stellar SDK operations & contract links
│   └── test/            # Frontend unit tests
├── deploy.sh            # Automated deployment script
├── Cargo.toml           # Workspace manifest
└── package.json         # Node manifest
```

---

## 10. Walkthrough Video
A walkthrough video demonstrating wallet connection, donation processing, live event streams, badge minting, and error handling will be uploaded here.

---

## 11. License
This project is licensed under the MIT License.
