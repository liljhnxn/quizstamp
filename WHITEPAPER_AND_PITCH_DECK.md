# QuizStamp: Technical Whitepaper & Pitch Deck

**Web3 Knowledge Verification & Academic Attestation Protocol on Botchain**  
**Ecosystem:** Botchain Mainnet (Chain ID: `677`)  
**Contract Address:** `0xA240ab0065Bdc9E5A1271318166Dc5d17e5c2100`  
**BotchainScan Explorer:** [https://scan.botchain.ai/address/0xA240ab0065Bdc9E5A1271318166Dc5d17e5c2100](https://scan.botchain.ai/address/0xA240ab0065Bdc9E5A1271318166Dc5d17e5c2100)  
**Date:** October 2026  
**Document Version:** 2.0.0 (Mainnet Release)  

---

## Part 1: Technical Whitepaper

### 1. Abstract
The intersection of decentralized ledger technology and digital education introduces new opportunities to prove, verify, and celebrate learner competence without reliance on siloed credentialing authorities. Contemporary educational platforms lock student progression behind proprietary databases, vulnerable to data loss, unauthorized alteration, and administrative expiration.

**QuizStamp** introduces a lightweight, accessible Web3 educational attestation decentralized application (dApp) deployed natively on **Botchain Mainnet**. By combining interactive, multi-subject assessments with immutable, on-chain state stamping via Solidity smart contracts, QuizStamp enables learners to establish verifiable on-chain records of their computing and web development knowledge. QuizStamp functions both as an educational assessment tool and an on-ramp mechanism for introducing mainstream learners to Web3 wallet interaction, transaction signing, and blockchain-based state persistence.

---

### 2. Problem Statement
1. **Centralized & Fragile Educational Credentials**: Traditional quiz and assessment engines store score achievements in centralized SQL/NoSQL databases, offering zero verifiable ownership or portability for learners.
2. **Steep Onboarding Barriers to Web3**: Most Web3 applications involve complex DeFi mechanisms, liquidity pools, or costly NFT speculation, creating an intimidating threshold for newcomers.
3. **Absence of Micro-Utility Consumer dApps**: Emerging Layer-1 networks like Botchain require fast, intuitive, low-gas consumer applications that encourage routine wallet activity and contract interactions.
4. **Lack of Transparent Attestation**: Free educational platforms rarely offer verifiable cryptographic proof of completion or progress, making gamified learning feel transient.

---

### 3. The QuizStamp Solution
QuizStamp delivers an elegant, decentralized assessment experience:
- **Zero-Friction Wallet Onboarding**: 1-click connectivity via browser-injected wallets (MetaMask, OKX, Rabby) with built-in network validation for Botchain Mainnet (Chain ID `677`).
- **Interactive Knowledge Assessment**: Focused curriculum testing fundamental computing, web architecture, and programming principles.
- **On-Chain Score Stamping**: Direct execution of the `saveScore(score)` smart contract method, recording scores (0–5), personal best milestones, and submission counts permanently into EVM state.
- **Public & Verifiable Ledger**: Every stamped score emits a transparent `ScoreSubmitted` event indexed on the BotchainScan explorer, creating an immutable timeline of learning progress.
- **Global Network Metrics**: Real-time aggregation of worldwide learner submissions and community participation stats.

---

### 4. Technical Architecture & System Design

```
+-------------------------------------------------------------------------+
|                           CLIENT TIER (Next.js 15)                       |
|                                                                         |
|  +--------------------+   +-----------------------+   +---------------+ |
|  |  Interactive Quiz  |   | Scoring Engine (0-5)  |   | Dark Academic | |
|  |  (5 Questions)     |-->| & Validation Guard    |-->| UI / Gold     | |
|  +--------------------+   +-----------------------+   +---------------+ |
|                                       |                                 |
|                                       v                                 |
|                         +---------------------------+                   |
|                         |  Wagmi v2 & Viem Provider |                   |
|                         +---------------------------+                   |
+---------------------------------------|---------------------------------+
                                        | RPC Calls (JSON-RPC)
                                        v
+-------------------------------------------------------------------------+
|                      BOTCHAIN MAINNET (Chain ID: 677)                   |
|                      RPC Endpoint: https://rpc.botchain.ai              |
|                                                                         |
|   +-----------------------------------------------------------------+   |
|   |                   QuizStamp Smart Contract                     |   |
|   |           0xA240ab0065Bdc9E5A1271318166Dc5d17e5c2100            |   |
|   |                                                                 |   |
|   |   State Variables:                                              |   |
|   |   - totalSubmissions: uint256                                   |   |
|   |   - bestScores: mapping(address => uint256)                     |   |
|   |   - submissionCounts: mapping(address => uint256)              |   |
|   |                                                                 |   |
|   |   Functions:                                                    |   |
|   |   - saveScore(uint256 score) [Checks: score <= 5]              |   |
|   |   - getMyBestScore() -> uint256                                 |   |
|   |   - getMySubmissions() -> uint256                               |   |
|   |   - getTotalSubmissions() -> uint256                            |   |
|   |                                                                 |   |
|   |   Events:                                                       |   |
|   |   - ScoreSubmitted(address indexed user, uint256, uint256)      |   |
|   +-----------------------------------------------------------------+   |
+-------------------------------------------------------------------------+
                                        |
                                        v
+-------------------------------------------------------------------------+
|                EXPLORER & VERIFICATION (BotchainScan)                   |
|    https://scan.botchain.ai/address/0xA240ab0065Bdc9E5A1271318166...    |
+-------------------------------------------------------------------------+
```

---

### 5. Smart Contract Specifications

#### Core Functions:
1. **`saveScore(uint256 score)`**
   - **Access**: Public / External.
   - **Preconditions**: `require(score <= 5, "Score must be between 0 and 5")`.
   - **State Updates**:
     - Increments `submissionCounts[msg.sender]` by 1.
     - Increments `totalSubmissions` by 1.
     - Compares `score > bestScores[msg.sender]`; if higher, overwrites `bestScores[msg.sender]`.
   - **Event**: Emits `ScoreSubmitted(address indexed user, uint256 score, uint256 personalBest)`.

2. **`getMyBestScore()`**: Returns `bestScores[msg.sender]` for the active caller.
3. **`getMySubmissions()`**: Returns total assessment submissions for `msg.sender`.
4. **`getTotalSubmissions()`**: Returns global attestation counter across the entire network.

---

### 6. Security Analysis & Threat Model
- **Boundary Verification**: Input validation strictly enforces `score <= 5`.
- **Reentrancy Immunity**: The contract contains no ETH transfers, external calls, or callbacks.
- **Gas Optimized Execution**: Storage slots are minimal (one scalar uint256 and two mappings), guaranteeing low gas consumption at the network floor of 20 gwei.

---

### 7. Technology Stack Summary

| Layer | Component | Specification |
|---|---|---|
| **Blockchain** | Network | Botchain Mainnet (Chain ID: `677`) |
| **Smart Contract** | Language & Tooling | Solidity `^0.8.20`, Hardhat, Ethers.js v6 |
| **Web3 Interface** | Client Libraries | Wagmi v2, Viem, TanStack React Query v5 |
| **Frontend Framework** | UI Core | Next.js 15 (App Router), React 19, TypeScript |
| **Styling & Design** | Design System | Tailwind CSS, Dark Academic Palette (`#15171C`, `#D4B06A`) |
| **Icons & Typography** | Assets | Lucide React, Modern Monospace & Sans typography |

---

### 8. Development Roadmap
- **Phase 1 (Completed)**: Core smart contract deployment, verified on BotchainScan, full Next.js dApp integration on Botchain Mainnet.
- **Phase 2 (Current)**: Ecosystem grant submission, co-marketing with Botchain, expanding quiz question banks.
- **Phase 3 (Upcoming)**: On-chain Soulbound Token (SBT) Certificate minting upon scoring 5/5.
- **Phase 4 (Future)**: Decentralized quiz creation portal allowing community educators to deploy sponsored quizzes with native BOT prize pools.

---

## Part 2: 10-Slide Pitch Deck

### Slide 1: Title & Overview
* **Headline**: QuizStamp 📜
* **Subtitle**: On-Chain Knowledge Attestation & Gamified Learning on Botchain
* **Network**: Botchain Mainnet (Chain ID: `677`)
* **Contract**: `0xA240ab0065Bdc9E5A1271318166Dc5d17e5c2100`
* **Explorer**: [scan.botchain.ai](https://scan.botchain.ai/address/0xA240ab0065Bdc9E5A1271318166Dc5d17e5c2100)

---

### Slide 2: The Problem
* Centralized certificates are easily lost, falsified, or expired.
* Web3 education lacks interactive, low-friction, on-chain reward loops.
* New users are hesitant to execute transactions involving complex financial protocols.
* Emerging Layer-1 blockchains lack approachable consumer micro-apps for everyday wallet interaction.

---

### Slide 3: The Solution
* **QuizStamp**: A browser-first educational platform where users answer tech questions and stamp verified scores directly on Botchain.
* **1-Click Web3 Attestation**: Converts everyday learning into permanent on-chain milestones.
* **Zero Financial Barrier**: Built for accessible, gas-efficient micro-transactions.
* **Transparent Verification**: Every score is verifiable by employers, peers, and communities via BotchainScan.

---

### Slide 4: Market Opportunity
* **EdTech & Web3 Onboarding**: The global digital learning market exceeds $300B, with verifiable credentials (SBTs, verifiable badges) growing at >40% CAGR.
* **Consumer Web3 Micro-Apps**: Millions of prospective Web3 users demand simple, engaging, non-financial touchpoints to begin using on-chain wallets.
* **Ecosystem Catalyst**: Driving daily active wallets (DAW) and persistent contract transactions on Botchain.

---

### Slide 5: Product Features & User Journey
1. **Connect**: Seamless wallet connection with auto-detection for Botchain Mainnet (Chain ID 677).
2. **Assess**: 5 curated questions spanning web architecture, computing fundamentals, and protocols.
3. **Review**: Instant client-side score evaluation and performance breakdown.
4. **Stamp**: 1-click on-chain submission writing the score, personal record, and attempt count to the blockchain.
5. **Track**: Live dashboard showing personal best score, personal attempts, and network total submissions.

---

### Slide 6: Technology Architecture
* **Frontend**: Next.js 15 (App Router), React 19, TypeScript.
* **Styling**: Tailwind CSS with an academic dark theme and gold accents.
* **Web3 Integration**: Wagmi v2 + Viem for reactive blockchain RPC interaction.
* **Smart Contract**: Solidity `^0.8.20` deployed and verified on Botchain Mainnet.

---

### Slide 7: Why Botchain?
* **High Throughput & Low Fees**: Perfect for high-frequency learner attestation without punishing users with high gas costs.
* **EVM Compatibility**: Enables standard tooling (Hardhat, Wagmi, MetaMask) for friction-free onboarding.
* **Ecosystem Growth**: QuizStamp provides a tangible showcase of Botchain's consumer dApp capabilities.

---

### Slide 8: Security & Trust
* **Bounded Input Validation**: Mathematical requirement `score <= 5` enforced at EVM level.
* **Zero External Dependencies**: Self-contained smart contract with no external calls or proxy delegate risks.
* **Transparent Source Code**: Fully verified and readable on BotchainScan.
* **Non-Custodial**: Holds no user funds or tokens; 100% permissionless.

---

### Slide 9: Growth & Roadmap
* **Q4 2026**: Multi-category quiz packs (Solidity fundamentals, Botchain architecture, Web3 security).
* **Q1 2027**: Dynamic Soulbound Token (SBT) graduation diplomas minted on-chain.
* **Q2 2027**: Quiz Creator Portal & sponsored prize pools funded by ecosystem partners.

---

### Slide 10: Call to Action & Ecosystem Links
* **Try the dApp**: Connect and stamp your quiz score today on Botchain Mainnet.
* **Smart Contract**: `0xA240ab0065Bdc9E5A1271318166Dc5d17e5c2100`
* **Verified Contract**: [BotchainScan Explorer Link](https://scan.botchain.ai/address/0xA240ab0065Bdc9E5A1271318166Dc5d17e5c2100#code)
* **RPC Endpoint**: `https://rpc.botchain.ai` | Chain ID: `677`
* **Contact & Team**: Isaac / Progressive Development Team
