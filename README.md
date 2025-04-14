# DOBBER Framework

DOBBER Framework is a decentralized autonomous business platform that enables users to **deploy, manage, and tokenize intelligent agents** for operating real-world infrastructure and DeFi strategies.

Built for the **agentic economy**, DOBBER transforms devices into yield-producing digital businesses and empowers users to manage them visually, transparently, and programmatically.

---

## 🧠 Overview

DOBBER provides a Web3-native dashboard to:

- Track DePIN device performance
- Deploy agents for autonomous operations
- Distribute yield to tokenized stakeholders
- Monitor infrastructure visually like a strategy game

---

## ⚙️ Agent Types

Users can deploy 3 distinct agent types:

| Agent Type               | Description                                                       |
| ------------------------ | ----------------------------------------------------------------- |
| 🛠 Maintenance Agent      | Monitors device health, uptime, and schedules maintenance         |
| 💧 LP Optimization Agent | Optimizes yield by moving funds between liquidity pools           |
| 💸 Revenue Agent         | Automates revenue distribution among token holders, DAOs, and LPs |

---

## 🪙 Agent Tokenomics

Each agent deployed on DOBBER mints a unique token that represents **ownership in the agent's future revenue**. These tokens align financial incentives between creators, users, and infrastructure operators.

### Token System Rules

1. **Agent Token Types**

   - `MaintenanceAgentToken`, `LPOptimizationAgentToken`, `RevenueDistributionAgentToken`

2. **Fixed Token Supply per Agent**

   - Each agent mints 1,000 tokens on creation
   - Tokens represent % ownership in the agent’s yield

3. **Yield Distribution Logic**

   - 90% to token holders
   - 5–10% as **creator royalty**
   - 2% protocol treasury (configurable)

4. **Token Creator Royalty**

   - Every revenue event pays a royalty to the wallet that deployed the agent
   - Encoded on creation, permanent

5. **Transferability**
   - Tokens are fully tradable
   - Agents are digital businesses you can co-own, sell, or invest in

### Token Metadata Example

```json
{
  "agentId": "agent_07A1",
  "type": "RevenueDistributionAgent",
  "token": {
    "name": "RevShare Agent Token",
    "symbol": "RSAT",
    "supply": 1000,
    "holders": {
      "0xUserA": 500,
      "0xUserB": 300,
      "0xUserC": 200
    },
    "creator": "0xCreatorWallet",
    "royalty": 0.08
  },
  "distribution": {
    "tokenHolders": 0.9,
    "creatorRoyalty": 0.08,
    "protocolFee": 0.02
  }
}
```

---

## 🧩 Agent Deployment Flow

1. **Choose Agent Type**
2. **Configure Agent Parameters**
3. **Assign Devices or LPs**
4. **Mint Agent Token**
5. **Preview Revenue Simulations**
6. **Deploy Agent to Network**

---

## 🛰 Visual Network Map (Game-Style Dashboard)

The **Device Network Tab** shows your infrastructure and revenue flows as a **playable isometric map** — inspired by _Age of Empires_ or _StarCraft_.

### Visual Elements

| Symbol            | Represents                                       |
| ----------------- | ------------------------------------------------ |
| 🧱 Device         | Your DePIN node (solar, compute, sensor, etc.)   |
| 🧠 Agent          | Automated unit walking between devices           |
| ✨ Revenue Flow   | Spark lines representing yield generation        |
| 🪙 Token Holdings | Glowing floor underneath partially-owned devices |
| 🏠 Command Hub    | Your wallet's base                               |

### Filters

- 🔍 View: My Devices / My Agents / My Tokens / All
- 🎯 Click agent or device for stats & token ownership
- 💸 Earnings flow animated in real time

---

## 🔐 Zero-Knowledge Data Verification

DOBBER agents provide transparent, verifiable performance via **zero-knowledge proofs** (ZKPs).

### Features

- Displays **proof verification status** (✅ Verified, ⚠️ Pending, ❌ Failed)
- Shows proof logs and timestamps
- Verifies:
  - Device uptime
  - Sensor integrity
  - Revenue authenticity

### Example

```json
{
  "agentId": "agent_001",
  "verification": {
    "status": "verified",
    "proofType": "zk-SNARK",
    "proofHash": "0xabc123...",
    "verifiedFields": ["uptime", "location", "revenueGenerated"]
  }
}
```

---

## 🧪 Getting Started (MVP)

1. Connect your wallet (via Privy)
2. If you're a new user:
   - Walkthrough: Create or invest in agents
3. If you're a returning user:
   - View your agent farm and live earnings
4. Deploy new agents from the dashboard
5. Withdraw simulated revenue to wallet

---

## 🧰 Tech Stack

- **Frontend**: React / Tailwind / Zustand / React Three Fiber
- **Wallet Auth**: Privy
- **Agent Simulation**: Virtuals/Game Framework
- **Data Integrity**: zkSync / ZK Proof Modules
- **Smart Contracts**: ERC-20/ERC-1155 Token Minting, Agent Royalty Distribution

---

## 👷 Developer Notes

If you're integrating or extending the backend:

- `GET /api/dashboard?wallet=0x...`  
  → Returns device, agent, token, and earnings data
- Agent creation mints tokens + registers metadata
- Revenue simulator available in `mock-agent-engine.js`
- Agent visual logic is grid-based, uses `agentsMap[]` and `deviceGrid[]`

---

## 🌐 Coming Soon

- On-chain agent orchestration
- Token resale marketplace
- Carbon offset gamification for energy-positive farms
- ZK proof generator + verifier integration
- Multi-agent DAOs managing collective farms

---

DOBBER is your interface to the future of autonomous infrastructure and programmable yield.

Join the agentic economy. 🧠⚙️📈
