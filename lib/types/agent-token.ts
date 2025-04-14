// Agent Token Types
export type AgentType = 'MaintenanceAgent' | 'LPOptimizationAgent' | 'RevenueDistributionAgent';

// Verification Status
export type VerificationStatus = 'verified' | 'pending' | 'failed';

// Verification Data
export interface VerificationData {
  status: VerificationStatus;
  lastProofTime: string;
  proofType: string;
  proofHash: string;
  valid: boolean;
  verifiedFields: string[];
  verificationTime?: number; // in milliseconds
}

// Token Holder Record (address to balance mapping)
export interface TokenHolders {
  [address: string]: number;
}

// Revenue Event tracking
export interface RevenueEvent {
  amount: number;
  timestamp: string;
  distributed?: boolean;
}

// Distribution configuration
export interface DistributionConfig {
  tokenHolders: number; // Percentage as decimal (e.g., 0.9 for 90%)
  creatorRoyalty: number; // Percentage as decimal (e.g., 0.08 for 8%)
  protocolFee: number; // Percentage as decimal (e.g., 0.02 for 2%)
}

// Token Structure
export interface AgentToken {
  name: string;
  symbol: string;
  supply: number;
  holders: TokenHolders;
  creator: string; // Creator wallet address
  royalty: number; // Percentage as decimal (e.g., 0.08 for 8%)
}

// Complete Agent Token Record
export interface AgentTokenRecord {
  agentId: string;
  type: AgentType;
  token: AgentToken;
  revenueEvents: RevenueEvent[];
  distribution: DistributionConfig;
  totalRevenue?: number;
  unclaimedRevenue?: number;
  verification?: VerificationData; // ZK verification data
}

// User's Token Portfolio
export interface UserTokenPortfolio {
  address: string;
  holdings: {
    [agentId: string]: {
      tokenAmount: number;
      percentOwnership: number;
      unclaimedYield: number;
      totalYieldEarned: number;
    }
  };
  totalUnclaimedYield: number;
  totalYieldEarned: number;
} 