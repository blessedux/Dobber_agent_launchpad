import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { AgentTokenRecord } from '@/lib/types/agent-token';
import { Clock, Coins, LineChart, Users, Wallet, Shield, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { format } from 'date-fns';

interface TokenCardProps {
  token: AgentTokenRecord;
  walletAddress?: string;
  className?: string;
  showActions?: boolean;
}

const TokenCard: React.FC<TokenCardProps> = ({ 
  token, 
  walletAddress,
  className = '',
  showActions = true
}) => {
  const [isProofLogsOpen, setIsProofLogsOpen] = useState(false);
  
  // Check if the current wallet is the creator
  const isCreator = walletAddress && token.token.creator === walletAddress;
  
  // Calculate user's ownership percentage if wallet is provided
  const userTokens = walletAddress ? (token.token.holders[walletAddress] || 0) : 0;
  const ownershipPercentage = userTokens > 0 ? (userTokens / token.token.supply) * 100 : 0;
  
  // Helper function to format percentage
  const formatPercentage = (value: number) => {
    return value.toFixed(2) + '%';
  };
  
  // Calculate unclaimed yield
  const calculateUnclaimedYield = (): number => {
    if (!walletAddress || userTokens === 0) return 0;
    
    const percentOwnership = userTokens / token.token.supply;
    let unclaimedYield = 0;
    
    token.revenueEvents.forEach(event => {
      if (!event.distributed) {
        unclaimedYield += event.amount * percentOwnership * token.distribution.tokenHolders;
      }
    });
    
    return unclaimedYield;
  };
  
  const unclaimedYield = calculateUnclaimedYield();
  
  // Determine agent type badge color
  const getAgentTypeColor = () => {
    switch (token.type) {
      case 'MaintenanceAgent':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'LPOptimizationAgent':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      case 'RevenueDistributionAgent':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };
  
  // Determine verification status badge
  const getVerificationBadge = () => {
    if (!token.verification) return null;
    
    const { status } = token.verification;
    
    switch (status) {
      case 'verified':
        return (
          <div className="flex items-center gap-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-300 px-2 py-1 rounded-full text-xs">
            <Shield className="w-3 h-3" />
            <span>Verified</span>
          </div>
        );
      case 'pending':
        return (
          <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300 px-2 py-1 rounded-full text-xs">
            <Shield className="w-3 h-3" />
            <span>Pending</span>
          </div>
        );
      case 'failed':
        return (
          <div className="flex items-center gap-1 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 px-2 py-1 rounded-full text-xs">
            <Shield className="w-3 h-3" />
            <span>Failed</span>
          </div>
        );
      default:
        return null;
    }
  };
  
  // Format date from ISO string to readable format
  const formatDate = (isoString: string) => {
    try {
      return format(new Date(isoString), 'PPp'); // Example: Apr 12, 2023, 10:30 AM
    } catch (e) {
      return isoString;
    }
  };

  return (
    <Card className={`p-5 overflow-hidden ${className}`}>
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold">{token.token.name}</h3>
            <span className={`text-xs px-2 py-0.5 rounded-full ${getAgentTypeColor()}`}>
              {token.type.replace('Agent', '')}
            </span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {token.token.symbol} • {token.token.supply.toLocaleString()} Supply
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isCreator && (
            <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300 px-2 py-1 rounded-full text-xs">
              <Wallet className="w-3 h-3" />
              <span>Creator</span>
            </div>
          )}
          {getVerificationBadge()}
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3 mt-4">
        <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg">
          <div className="flex items-center gap-1 text-sm font-medium mb-1 text-slate-600 dark:text-slate-300">
            <Coins className="w-4 h-4" />
            <span>Total Revenue</span>
          </div>
          <p className="text-xl font-bold">${token.totalRevenue?.toLocaleString() || '0'}</p>
        </div>
        
        <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg">
          <div className="flex items-center gap-1 text-sm font-medium mb-1 text-slate-600 dark:text-slate-300">
            <Clock className="w-4 h-4" />
            <span>Pending</span>
          </div>
          <p className="text-xl font-bold">${token.unclaimedRevenue?.toLocaleString() || '0'}</p>
        </div>
      </div>
      
      {walletAddress && (
        <div className="mt-4 p-3 rounded-lg bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-800">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1 text-sm font-medium text-violet-800 dark:text-violet-300">
              <Users className="w-4 h-4" />
              <span>Your Ownership</span>
            </div>
            <span className="font-bold text-violet-800 dark:text-violet-300">
              {formatPercentage(ownershipPercentage)}
            </span>
          </div>
          
          {userTokens > 0 && (
            <div className="mt-2 flex justify-between items-center">
              <div className="flex items-center gap-1 text-sm font-medium text-violet-800 dark:text-violet-300">
                <LineChart className="w-4 h-4" />
                <span>Unclaimed Yield</span>
              </div>
              <span className="font-bold text-violet-800 dark:text-violet-300">
                ${unclaimedYield.toFixed(2)}
              </span>
            </div>
          )}
        </div>
      )}
      
      {/* Proof Logs Section */}
      {token.verification && (
        <Collapsible 
          open={isProofLogsOpen} 
          onOpenChange={setIsProofLogsOpen}
          className="mt-4 border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden"
        >
          <CollapsibleTrigger className="flex w-full justify-between items-center p-3 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Shield className="w-4 h-4" />
              <span>View Proof Logs</span>
            </div>
            {isProofLogsOpen ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className="p-3 text-sm border-t border-slate-200 dark:border-slate-700">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Last Proof:</span>
                <span className="font-medium">{formatDate(token.verification.lastProofTime)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Proof Type:</span>
                <span className="font-medium">{token.verification.proofType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Verification:</span>
                <span className={`font-medium ${
                  token.verification.valid 
                    ? 'text-emerald-600 dark:text-emerald-400' 
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  {token.verification.valid ? 'Valid' : 'Invalid'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Proof Hash:</span>
                <span className="font-medium text-xs truncate max-w-[120px]">{token.verification.proofHash}</span>
              </div>
              <div>
                <span className="text-slate-600 dark:text-slate-400 block mb-1">Verified Fields:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {token.verification.verifiedFields.map((field, i) => (
                    <span 
                      key={i}
                      className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 rounded text-xs"
                    >
                      {field}
                    </span>
                  ))}
                </div>
              </div>
              <div className="pt-2">
                <a 
                  href="#" 
                  className="text-violet-600 dark:text-violet-400 hover:underline flex items-center gap-1 text-xs"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>View Raw Proof Data</span>
                </a>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}
      
      {showActions && (
        <div className="mt-4 flex gap-2">
          {userTokens > 0 && unclaimedYield > 0 && (
            <Button variant="default" className="flex-1 bg-violet-600 hover:bg-violet-700">
              Claim Yield
            </Button>
          )}
          <Button variant="outline" className="flex-1">
            {userTokens > 0 ? 'Trade Tokens' : 'Buy Tokens'}
          </Button>
          <Button variant="outline" className="flex-1">
            View Details
          </Button>
        </div>
      )}
      
      <div className="mt-4 text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
        <div>
          <span className="inline-block w-2 h-2 rounded-full bg-violet-500 mr-1"></span>
          Token Holders: {formatPercentage(token.distribution.tokenHolders * 100)}
        </div>
        <div className="mx-2">•</div>
        <div>
          <span className="inline-block w-2 h-2 rounded-full bg-amber-500 mr-1"></span>
          Creator: {formatPercentage(token.distribution.creatorRoyalty * 100)}
        </div>
        <div className="mx-2">•</div>
        <div>
          <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-1"></span>
          Protocol: {formatPercentage(token.distribution.protocolFee * 100)}
        </div>
      </div>
    </Card>
  );
};

export default TokenCard; 