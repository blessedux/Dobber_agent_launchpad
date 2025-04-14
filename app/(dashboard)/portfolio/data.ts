export interface TokenHolding {
  id: string;
  name: string;
  symbol: string;
  amount: number;
  value: number;
  purchaseDate: Date;
  earnings: number;
  lastEarningDate: Date;
  agentId: string;
  agentName: string;
  agentIcon?: string;
}

export interface Portfolio {
  totalValue: number;
  totalEarnings: number;
  lastWithdrawal: {
    amount: number;
    date: Date;
  } | null;
  withdrawalFrequency: WithdrawalFrequency;
  holdings: TokenHolding[];
  earningsHistory: EarningRecord[];
}

export interface EarningRecord {
  id: string;
  date: Date;
  amount: number;
  tokenId: string;
  tokenSymbol: string;
  agentId: string;
  agentName: string;
  withdrawn: boolean;
}

export type WithdrawalFrequency = 'manual' | 'daily' | 'weekly' | 'monthly';

// Mock data for development
export const mockPortfolio: Portfolio = {
  totalValue: 12450.75,
  totalEarnings: 1345.28,
  lastWithdrawal: {
    amount: 500,
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
  },
  withdrawalFrequency: 'manual',
  holdings: [
    {
      id: 'token-1',
      name: 'AI Search Agent Token',
      symbol: 'AISAT',
      amount: 100,
      value: 5450.25,
      purchaseDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      earnings: 645.28,
      lastEarningDate: new Date(Date.now() - 24 * 60 * 60 * 1000),
      agentId: 'agent-1',
      agentName: 'Search Agent Alpha',
      agentIcon: '/icons/search-agent.svg',
    },
    {
      id: 'token-2',
      name: 'Data Processing Agent Token',
      symbol: 'DPAT',
      amount: 75,
      value: 3800.50,
      purchaseDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
      earnings: 420.00,
      lastEarningDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      agentId: 'agent-2',
      agentName: 'Data Cruncher Beta',
      agentIcon: '/icons/data-agent.svg',
    },
    {
      id: 'token-3',
      name: 'Network Optimization Agent Token',
      symbol: 'NOAT',
      amount: 50,
      value: 3200.00,
      purchaseDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
      earnings: 280.00,
      lastEarningDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      agentId: 'agent-3',
      agentName: 'Network Optimizer Gamma',
      agentIcon: '/icons/network-agent.svg',
    },
  ],
  earningsHistory: [
    {
      id: 'earning-1',
      date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      amount: 45.28,
      tokenId: 'token-1',
      tokenSymbol: 'AISAT',
      agentId: 'agent-1',
      agentName: 'Search Agent Alpha',
      withdrawn: false,
    },
    {
      id: 'earning-2',
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      amount: 42.00,
      tokenId: 'token-2',
      tokenSymbol: 'DPAT',
      agentId: 'agent-2',
      agentName: 'Data Cruncher Beta',
      withdrawn: false,
    },
    {
      id: 'earning-3',
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      amount: 38.00,
      tokenId: 'token-3',
      tokenSymbol: 'NOAT',
      agentId: 'agent-3',
      agentName: 'Network Optimizer Gamma',
      withdrawn: false,
    },
    {
      id: 'earning-4',
      date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
      amount: 120.00,
      tokenId: 'token-1',
      tokenSymbol: 'AISAT',
      agentId: 'agent-1',
      agentName: 'Search Agent Alpha',
      withdrawn: true,
    },
    {
      id: 'earning-5',
      date: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000),
      amount: 85.00,
      tokenId: 'token-2',
      tokenSymbol: 'DPAT',
      agentId: 'agent-2',
      agentName: 'Data Cruncher Beta',
      withdrawn: true,
    },
  ],
};

// Utility functions for portfolio operations
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
}

export function getUnwithdrawnEarningsTotal(earnings: EarningRecord[]): number {
  return earnings
    .filter(record => !record.withdrawn)
    .reduce((total, record) => total + record.amount, 0);
}

// API simulation functions
export async function fetchUserPortfolio(): Promise<Portfolio> {
  // Simulate API request delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Return mock data
  return mockPortfolio;
}

export async function updateWithdrawalFrequency(
  frequency: WithdrawalFrequency
): Promise<WithdrawalFrequency> {
  // Simulate API request delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Return the new frequency (in a real app, this would be confirmed by the server)
  return frequency;
}

export async function withdrawEarnings(): Promise<{
  success: boolean;
  amount: number;
  timestamp: Date;
}> {
  // Simulate API request delay
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  const unwithdrawnAmount = getUnwithdrawnEarningsTotal(mockPortfolio.earningsHistory);
  
  // Return success response
  return {
    success: true,
    amount: unwithdrawnAmount,
    timestamp: new Date(),
  };
} 