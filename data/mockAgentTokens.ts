import { AgentTokenRecord, AgentType, VerificationData } from '@/lib/types/agent-token';

// Generate a mock distribution config with slight variations
const createDistributionConfig = (customRoyalty?: number) => {
  const royalty = customRoyalty || 0.08; // 8% default royalty
  const protocolFee = 0.02; // 2% protocol fee
  const tokenHolders = 1 - royalty - protocolFee; // Remaining goes to token holders
  
  return {
    tokenHolders,
    creatorRoyalty: royalty,
    protocolFee
  };
};

// Mock verification data generator
const createVerificationData = (status: 'verified' | 'pending' | 'failed', fields: string[]): VerificationData => {
  const now = new Date();
  const lastProofTime = new Date(now.getTime() - Math.floor(Math.random() * 24 * 60 * 60 * 1000)).toISOString();
  
  return {
    status,
    lastProofTime,
    proofType: Math.random() > 0.5 ? 'zk-SNARK' : 'zk-STARK',
    proofHash: `0x${Math.random().toString(16).substring(2)}${Math.random().toString(16).substring(2)}`,
    valid: status === 'verified',
    verifiedFields: fields,
    verificationTime: Math.floor(Math.random() * 1000) + 500 // 500-1500ms
  };
};

// Mock data for agent tokens
const mockAgentTokens: AgentTokenRecord[] = [
  {
    agentId: "agent_MA01",
    type: "MaintenanceAgent" as AgentType,
    token: {
      name: "Maintenance Agent Token",
      symbol: "MAT",
      supply: 1000,
      holders: {
        "0xUserA": 600,
        "0xUserB": 250,
        "0xUserC": 150
      },
      creator: "0xCreatorAlpha",
      royalty: 0.08 // 8%
    },
    revenueEvents: [
      { amount: 850, timestamp: "2025-04-10T12:00:00Z", distributed: true },
      { amount: 920, timestamp: "2025-04-11T12:00:00Z", distributed: true },
      { amount: 1050, timestamp: "2025-04-12T12:00:00Z", distributed: false }
    ],
    distribution: createDistributionConfig(0.08),
    totalRevenue: 2820,
    unclaimedRevenue: 1050,
    verification: createVerificationData('verified', ['uptime', 'maintenance_logs', 'revenueGenerated'])
  },
  {
    agentId: "agent_LPO01",
    type: "LPOptimizationAgent" as AgentType,
    token: {
      name: "LP Optimization Token",
      symbol: "LPOT",
      supply: 1000,
      holders: {
        "0xUserB": 400,
        "0xUserD": 350,
        "0xUserE": 250
      },
      creator: "0xCreatorBeta",
      royalty: 0.1 // 10%
    },
    revenueEvents: [
      { amount: 1200, timestamp: "2025-04-10T14:00:00Z", distributed: true },
      { amount: 1350, timestamp: "2025-04-11T14:00:00Z", distributed: true },
      { amount: 1420, timestamp: "2025-04-12T14:00:00Z", distributed: false }
    ],
    distribution: createDistributionConfig(0.1),
    totalRevenue: 3970,
    unclaimedRevenue: 1420,
    verification: createVerificationData('pending', ['liquidity_positions', 'trade_history', 'revenueGenerated'])
  },
  {
    agentId: "agent_RD01",
    type: "RevenueDistributionAgent" as AgentType,
    token: {
      name: "RevShare Agent Token",
      symbol: "RSAT",
      supply: 1000,
      holders: {
        "0xUserA": 300,
        "0xUserC": 300,
        "0xUserF": 400
      },
      creator: "0xCreatorGamma",
      royalty: 0.07 // 7%
    },
    revenueEvents: [
      { amount: 2200, timestamp: "2025-04-10T16:00:00Z", distributed: true },
      { amount: 2450, timestamp: "2025-04-11T16:00:00Z", distributed: true },
      { amount: 2650, timestamp: "2025-04-12T16:00:00Z", distributed: false }
    ],
    distribution: createDistributionConfig(0.07),
    totalRevenue: 7300,
    unclaimedRevenue: 2650,
    verification: createVerificationData('failed', ['distribution_accuracy', 'payment_proofs', 'revenueGenerated'])
  }
];

// Calculate yields for a specific wallet
export const calculateWalletYields = (walletAddress: string) => {
  const holdings: { [agentId: string]: any } = {};
  let totalUnclaimedYield = 0;
  let totalYieldEarned = 0;
  
  mockAgentTokens.forEach(record => {
    const walletTokens = record.token.holders[walletAddress] || 0;
    
    if (walletTokens > 0) {
      const percentOwnership = walletTokens / record.token.supply;
      
      // Calculate yields
      let unclaimedYield = 0;
      let totalYield = 0;
      
      record.revenueEvents.forEach(event => {
        const userShare = event.amount * percentOwnership * record.distribution.tokenHolders;
        
        if (!event.distributed) {
          unclaimedYield += userShare;
        }
        
        totalYield += userShare;
      });
      
      holdings[record.agentId] = {
        tokenAmount: walletTokens,
        percentOwnership: percentOwnership * 100, // Convert to percentage
        unclaimedYield: parseFloat(unclaimedYield.toFixed(2)),
        totalYieldEarned: parseFloat(totalYield.toFixed(2))
      };
      
      totalUnclaimedYield += unclaimedYield;
      totalYieldEarned += totalYield;
    }
  });
  
  return {
    address: walletAddress,
    holdings,
    totalUnclaimedYield: parseFloat(totalUnclaimedYield.toFixed(2)),
    totalYieldEarned: parseFloat(totalYieldEarned.toFixed(2))
  };
};

// Get verification summary data
export const getVerificationSummary = () => {
  const verifiedCount = mockAgentTokens.filter(
    token => token.verification?.status === 'verified'
  ).length;
  
  const totalVerificationTime = mockAgentTokens.reduce(
    (sum, token) => sum + (token.verification?.verificationTime || 0), 
    0
  );
  
  const avgVerificationTime = totalVerificationTime / mockAgentTokens.length;
  
  const allVerifiedFields = mockAgentTokens.reduce((fields, token) => {
    if (token.verification?.status === 'verified') {
      token.verification.verifiedFields.forEach(field => {
        if (!fields.includes(field)) fields.push(field);
      });
    }
    return fields;
  }, [] as string[]);
  
  return {
    validProofsLast24h: verifiedCount,
    avgVerificationTime,
    verifiedFields: allVerifiedFields,
    totalAgents: mockAgentTokens.length
  };
};

export default mockAgentTokens; 