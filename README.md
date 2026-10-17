# QuizStamp — Web3 Quiz Assessment App

QuizStamp is an educational decentralized application (dApp) built on the **Botchain Testnet**. It enables users to test their fundamental knowledge in computing and web technologies, view their score, and stamp their verified results permanently onto the blockchain through a dedicated Solidity smart contract.

---

## 1. Project Overview & Features

- **Interactive Quiz**: 5 multiple-choice questions focusing on computing and web development fundamentals (HTML, CSS, CPU, JavaScript, URLs).
- **Client-Side Assessment**: Questions are displayed sequentially, allowing navigation, validation, and real-time score calculation out of 5.
- **Web3 Wallet Integration**: Connect browser-injected wallets (such as MetaMask or OKX Wallet) to Botchain Testnet (Chain ID `968`).
- **On-Chain Score Stamping**: Record quiz submissions directly on Botchain Testnet via the `QuizStamp` smart contract.
- **On-Chain Statistics**: Live reading of personal best score, wallet submission count, and global submission count across all users.
- **Network Awareness**: Automatic network detection with one-click switching to Botchain Testnet.
- **Dark Academic Design**: Focused, calm aesthetic using curated color tokens:
  - Page Background: `#15171C`
  - Cards & Panels: `#20232B`
  - Borders: `#343741`
  - Accent / Gold: `#D4B06A`
  - Text: `#E8E8E8` / Subtext: `#9CA3AF`
  - Correct / Incorrect indicators: `#7DBE9A` / `#D98282`

---

## 2. Technology Stack

- **Smart Contract**: Solidity `^0.8.20`
- **Smart Contract Framework**: Hardhat, Ethers.js v6, Chai matchers
- **Frontend Framework**: Next.js 15 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS
- **Web3 Libraries**: Wagmi v2, Viem, TanStack React Query v5
- **Icons**: Lucide React

---

## 3. Botchain Testnet Configuration

| Parameter | Value |
| :--- | :--- |
| **Network Name** | Botchain Testnet |
| **Chain ID** | `968` |
| **RPC URL** | `https://rpc.bohr.life` |
| **Native Currency** | `BOT` |
| **Deployed Address** | `0x37399DAe8D08A6E836CA56273724eFE93811D709` |
| **Verified Contract** | [View Verified Contract on BohrScan](https://scan.bohr.life/address/0x37399DAe8D08A6E836CA56273724eFE93811D709#code) |
| **Block Explorer** | [https://scan.bohr.life](https://scan.bohr.life) |

---

## 4. Smart Contract Architecture (`contracts/QuizStamp.sol`)

The contract stores:
- `totalSubmissions` (uint256): Global count of submissions from all wallets.
- `bestScores(address => uint256)`: Highest score (0 to 5) achieved by a given wallet.
- `submissionCounts(address => uint256)`: Number of times a given wallet has submitted.

### Contract Methods

- `saveScore(uint256 score)`:
  - Validates `score <= 5`.
  - Increments caller's submission count and the global count.
  - Updates the caller's personal best if the new score is strictly higher.
  - Emits `ScoreSubmitted(address indexed user, uint256 score, uint256 personalBest)`.
- `getMyBestScore() external view returns (uint256)`: Returns caller's best score.
- `getMySubmissions() external view returns (uint256)`: Returns caller's total submissions.
- `getTotalSubmissions() external view returns (uint256)`: Returns total submissions made across all wallets.

---

## 5. Why Quiz Scores Are Not Verified by the Smart Contract

### Important Architectural Limitation
QuizStamp evaluates quiz responses on the client side in the user's web browser:
1. **On-Chain Privacy & Gas**: Storing questions, answer keys, and cryptographic hashes on-chain would incur substantial gas costs and expose answer hashes publicly in contract bytecode.
2. **Oracle Absence**: The smart contract verifies that any submitted score is a valid number between `0` and `5`, and prevents invalid values. However, it cannot cryptographically guarantee that the caller did not alter the score client-side or answer dishonestly.
3. **Educational Intent**: As an educational platform, QuizStamp emphasizes personal achievement and blockchain stamping rather than high-stakes financial competitions.

---

## 6. Installation & Local Development

### Prerequisites
- Node.js `v18+` or `v20+` (tested on Node v25)
- npm or pnpm

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Run Smart Contract Tests
Run the comprehensive Hardhat test suite covering all 8 functional and security requirements:
```bash
npm run test
```
The test suite verifies:
1. Saving a valid score (0–5).
2. Rejecting scores greater than 5 (`revert`).
3. Updating personal best on higher score.
4. Preserving personal best on lower or equal score.
5. Counting caller submissions accurately.
6. Maintaining separate records for different wallets.
7. Correctly tracking total global submissions.
8. Emitting the `ScoreSubmitted` event with correct indexed arguments.

---

## 7. Deploying to Botchain Testnet

### Step 1: Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Open `.env` and configure your deployment credentials securely:
```env
# DO NOT COMMIT YOUR REAL PRIVATE KEY TO SOURCE CONTROL
PRIVATE_KEY=your_wallet_private_key_without_0x_prefix
BOTCHAIN_RPC_URL=https://rpc.bohr.life
```

> **Security Note:** Never commit your `.env` file or disclose your private key. Ensure your deployer wallet holds a small amount of testnet `BOT` from the Botchain faucet.

### Step 2: Execute Deployment Script
Run the automated deployment script targeting Botchain Testnet:
```bash
npm run deploy:botchain
```
The deployment script will:
1. Connect to Botchain Testnet at `https://rpc.bohr.life`.
2. Deploy the `QuizStamp.sol` smart contract.
3. Log the deployed contract address and transaction hash with BohrScan explorer links.
4. Automatically update `src/config/contractInfo.json` with the deployed address and ABI.

### Step 3: Verify Frontend Configuration
You can also set the contract address directly in `.env.local` for the Next.js app:
```env
NEXT_PUBLIC_CONTRACT_ADDRESS=0xYourDeployedContractAddressHere
```

---

## 8. Running the Frontend Locally

Start the local development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

- You can play the quiz immediately without connecting a wallet.
- Connect MetaMask or your preferred browser wallet to save your score on Botchain Testnet and view your on-chain statistics.

---

## 9. Deploying to Vercel

1. Push your repository to GitHub or GitLab.
2. Sign in to [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Import your QuizStamp repository.
4. Under **Environment Variables**, add:
   - `NEXT_PUBLIC_CONTRACT_ADDRESS`: The deployed QuizStamp contract address on Botchain Testnet.
   - `NEXT_PUBLIC_BOTCHAIN_RPC_URL`: `https://rpc.bohr.life`
5. Click **Deploy**. Vercel will build and deploy your Next.js application.

---

## 10. Status Checklist

| Step | Status | Notes |
| :--- | :---: | :--- |
| Smart Contract (`QuizStamp.sol`) | **Completed** | Clean Solidity with validation, counters, mappings & events |
| Contract Tests (`QuizStamp.test.ts`) | **Completed** | 10/10 test coverage across all requirements |
| Deployment Script (`scripts/deploy.ts`) | **Completed** | Deploys & auto-updates `contractInfo.json` |
| Frontend Components & Wagmi Setup | **Completed** | Dark academic design, responsive, wagmi v2 hooks |
| Contract Deployment | **Completed** | Deployed to `0x37399DAe8D08A6E836CA56273724eFE93811D709` |
| Contract Verification | **Completed** | Verified source code on BohrScan |
| Set Contract Address | **Completed** | Configured in `contractInfo.json` & `.env` |
| Vercel Deployment | **Manual Action** | Deploy to Vercel following Section 9 instructions |
