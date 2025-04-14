# DOBBER Framework

DOBBER Framework is a decentralized autonomous business platform that enables users to deploy and manage intelligent agents for various DeFi operations.

## Overview

The DOBBER Framework provides a dashboard for tracking agent performance, device health, and revenue distribution. Users can deploy agents to handle various tasks within the DeFi ecosystem, such as maintenance, liquidity pool optimization, and revenue distribution.

## Tokenomics System

The DOBBER Framework implements a tokenomics model where each deployed agent mints its own ERC-20 or ERC-1155 token, representing ownership and yield rights.

### Token System Rules

1. **Agent Token Types**

   - MaintenanceAgentToken
   - LPOptimizationAgentToken
   - RevenueDistributionAgentToken

2. **Fixed Token Supply per Agent**

   - Each agent mints 1,000 tokens on creation
   - Tokens represent a percentage share in that agent's yield

3. **Yield Distribution**

   - Revenue flows as follows:
     - X% to Tokenholders (typically 90%)
     - Y% to Agent Creator (royalty, typically 5-10%)
     - Z% to Treasury or Protocol (typically 2%)

4. **Creator Royalty**

   - Each time the agent generates revenue, a percentage (e.g., 5-10%) goes to the wallet that deployed the agent
   - This royalty is permanent and encoded at agent creation time

5. **Revenue Distribution Logic**

   - Handles token balances (on-chain or via offchain indexer)
   - Tracks agent's revenue-producing actions
   - Manages periodic or per-event yield distribution

6. **Token Transferability**
   - Tokens are tradable via marketplaces
   - Agents function as "digital businesses" that can be bought and sold

### Example Agent Token Structure

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
  "revenueEvents": [
    {
      "amount": 1000,
      "timestamp": "2025-04-13T19:00:00Z"
    }
  ],
  "distribution": {
    "tokenHolders": 0.9,
    "creatorRoyalty": 0.08,
    "protocolFee": 0.02
  }
}
```

## Getting Started

1. Connect your wallet
2. Deploy an agent with your desired parameters
3. Monitor performance in the dashboard
4. Receive yield based on your token ownership

## Dashboard Features

- Live metrics and analytics
- Revenue tracking
- Agent performance monitoring
- Token ownership and yield information
- Revenue distribution tracking
