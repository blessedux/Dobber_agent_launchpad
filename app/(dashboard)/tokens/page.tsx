'use client';

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import useAgentTokens from '@/hooks/useAgentTokens';
import TokenCard from '@/components/TokenCard';
import UserPortfolio from '@/components/UserPortfolio';
import VerificationSummary from '@/components/VerificationSummary';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Wallet, Coins, Shield } from 'lucide-react';

// Mock wallet address - in a real app this would come from authentication
const MOCK_WALLET_ADDRESS = '0x1234567890abcdef1234567890abcdef12345678';

export default function TokensPage() {
  const { allTokens, loading, error } = useAgentTokens();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('revenue');
  
  // Filter tokens based on search query
  const filteredTokens = allTokens?.filter(token => 
    token.token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    token.agentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    token.type.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];
  
  // Sort tokens based on selected criteria
  const sortedTokens = [...filteredTokens].sort((a, b) => {
    switch (sortBy) {
      case 'revenue':
        return (b.revenueEvents.reduce((sum, event) => sum + event.amount, 0)) - 
               (a.revenueEvents.reduce((sum, event) => sum + event.amount, 0));
      case 'name':
        return a.token.name.localeCompare(b.token.name);
      case 'type':
        return a.type.localeCompare(b.type);
      case 'verification':
        // Sort by verification status (verified > pending > failed > undefined)
        const statusOrder = { verified: 0, pending: 1, failed: 2, undefined: 3 };
        const statusA = a.verification?.status || 'undefined';
        const statusB = b.verification?.status || 'undefined';
        return statusOrder[statusA as keyof typeof statusOrder] - statusOrder[statusB as keyof typeof statusOrder];
      default:
        return 0;
    }
  });

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Agent Tokens</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-3">
          <Tabs defaultValue="explore" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-3 mb-6">
              <TabsTrigger value="explore" className="flex items-center gap-2">
                <Coins className="w-4 h-4" />
                <span>Explore Tokens</span>
              </TabsTrigger>
              <TabsTrigger value="portfolio" className="flex items-center gap-2">
                <Wallet className="w-4 h-4" />
                <span>My Portfolio</span>
              </TabsTrigger>
              <TabsTrigger value="verified" className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span>Verified Only</span>
              </TabsTrigger>
            </TabsList>
          
            <TabsContent value="explore">
              <div className="flex items-center gap-4 mb-6">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Search tokens by name, type, or ID..." 
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="w-48">
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="revenue">Highest Revenue</SelectItem>
                      <SelectItem value="name">Token Name</SelectItem>
                      <SelectItem value="type">Agent Type</SelectItem>
                      <SelectItem value="verification">Verification Status</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {loading ? (
                <Card className="p-6 text-center">Loading agent tokens...</Card>
              ) : error ? (
                <Card className="p-6 text-center text-red-500">Error: {error}</Card>
              ) : sortedTokens.length === 0 ? (
                <Card className="p-6 text-center">
                  {searchQuery 
                    ? `No tokens found matching "${searchQuery}"` 
                    : "No agent tokens available"}
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {sortedTokens.map(token => (
                    <TokenCard 
                      key={token.agentId} 
                      token={token} 
                      walletAddress={MOCK_WALLET_ADDRESS}
                      showActions={true}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="portfolio">
              <UserPortfolio walletAddress={MOCK_WALLET_ADDRESS} />
            </TabsContent>
            
            <TabsContent value="verified">
              {loading ? (
                <Card className="p-6 text-center">Loading verified tokens...</Card>
              ) : error ? (
                <Card className="p-6 text-center text-red-500">Error: {error}</Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {sortedTokens
                    .filter(token => token.verification?.status === 'verified')
                    .map(token => (
                      <TokenCard 
                        key={token.agentId} 
                        token={token} 
                        walletAddress={MOCK_WALLET_ADDRESS}
                        showActions={true}
                      />
                    ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="md:col-span-1">
          <VerificationSummary />
        </div>
      </div>
    </div>
  );
} 