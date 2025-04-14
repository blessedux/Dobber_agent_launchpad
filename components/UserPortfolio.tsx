import React, { useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { UserTokenPortfolio } from '@/lib/types/agent-token';
import useAgentTokens from '@/hooks/useAgentTokens';
import { Wallet, DollarSign, LineChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import TokenCard from './TokenCard';

interface UserPortfolioProps {
  walletAddress: string;
  className?: string;
}

const UserPortfolio: React.FC<UserPortfolioProps> = ({ 
  walletAddress,
  className = ''
}) => {
  const { userPortfolio, allTokens, loading, error, fetchUserPortfolio } = useAgentTokens();
  
  useEffect(() => {
    if (walletAddress) {
      fetchUserPortfolio(walletAddress);
    }
  }, [walletAddress, fetchUserPortfolio]);
  
  if (loading) {
    return (
      <Card className={`p-4 ${className}`}>
        <div className="text-center py-4 text-gray-500">Loading portfolio data...</div>
      </Card>
    );
  }
  
  if (error) {
    return (
      <Card className={`p-4 ${className}`}>
        <div className="text-center py-4 text-red-500">Error: {error}</div>
      </Card>
    );
  }
  
  if (!userPortfolio || Object.keys(userPortfolio.holdings).length === 0) {
    return (
      <Card className={`p-4 ${className}`}>
        <div className="text-center py-8">
          <Wallet className="w-12 h-12 mx-auto mb-3 text-gray-400" />
          <h3 className="text-lg font-medium mb-1">No Agent Tokens</h3>
          <p className="text-sm text-gray-500 mb-4">
            You don't own any agent tokens yet. Deploy an agent or purchase tokens to get started.
          </p>
          <Button className="bg-violet-600 hover:bg-violet-700">
            Deploy New Agent
          </Button>
        </div>
      </Card>
    );
  }
  
  // Get full token data for tokens in portfolio
  const userTokens = Object.keys(userPortfolio.holdings).map(agentId => {
    const token = allTokens?.find(t => t.agentId === agentId);
    return {
      agentId,
      token,
      holding: userPortfolio.holdings[agentId]
    };
  }).filter(item => item.token); // Filter out any undefined tokens
  
  return (
    <div className={className}>
      {/* Portfolio Summary */}
      <Card className="p-4 mb-4">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Wallet className="w-5 h-5" />
          <span>Your Agent Token Portfolio</span>
        </h2>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
              Total Tokens Owned
            </p>
            <p className="text-xl font-bold">
              {Object.values(userPortfolio.holdings).reduce((sum, holding) => sum + holding.tokenAmount, 0)}
            </p>
          </div>
          
          <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
              Agent Investments
            </p>
            <p className="text-xl font-bold">
              {Object.keys(userPortfolio.holdings).length}
            </p>
          </div>
          
          <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg col-span-2">
            <div className="flex justify-between">
              <div>
                <div className="flex items-center text-gray-500 dark:text-gray-400 mb-1">
                  <DollarSign className="w-4 h-4 mr-1" />
                  <p className="text-sm">Total Yield Earned</p>
                </div>
                <p className="text-xl font-bold">${userPortfolio.totalYieldEarned.toFixed(2)}</p>
              </div>
              
              {userPortfolio.totalUnclaimedYield > 0 && (
                <div>
                  <div className="flex items-center text-gray-500 dark:text-gray-400 mb-1">
                    <LineChart className="w-4 h-4 mr-1" />
                    <p className="text-sm">Unclaimed Yield</p>
                  </div>
                  <div className="flex items-center">
                    <p className="text-xl font-bold mr-2">${userPortfolio.totalUnclaimedYield.toFixed(2)}</p>
                    <Button variant="default" size="sm" className="bg-green-600 hover:bg-green-700 text-xs">
                      Claim All
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
      
      {/* Agent Tokens */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium pl-1">Your Agent Tokens</h3>
        
        {userTokens.map(({ token, holding }) => token && (
          <TokenCard 
            key={token.agentId}
            token={token}
            walletAddress={walletAddress}
          />
        ))}
      </div>
    </div>
  );
};

export default UserPortfolio; 