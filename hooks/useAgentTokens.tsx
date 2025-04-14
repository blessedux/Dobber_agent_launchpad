import { useState, useEffect } from 'react';
import { AgentTokenRecord, UserTokenPortfolio } from '@/lib/types/agent-token';

interface AgentTokensHookResult {
  allTokens: AgentTokenRecord[] | null;
  userPortfolio: UserTokenPortfolio | null;
  agentToken: AgentTokenRecord | null;
  loading: boolean;
  error: string | null;
  fetchAgentToken: (agentId: string) => Promise<void>;
  fetchUserPortfolio: (walletAddress: string) => Promise<void>;
}

export function useAgentTokens(): AgentTokensHookResult {
  const [allTokens, setAllTokens] = useState<AgentTokenRecord[] | null>(null);
  const [userPortfolio, setUserPortfolio] = useState<UserTokenPortfolio | null>(null);
  const [agentToken, setAgentToken] = useState<AgentTokenRecord | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all agent tokens
  useEffect(() => {
    const fetchAllTokens = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('/api/agent-tokens');
        
        if (!response.ok) {
          throw new Error('Failed to fetch agent tokens');
        }
        
        const data = await response.json();
        setAllTokens(data);
      } catch (err: any) {
        console.error('Error fetching agent tokens:', err);
        setError(err.message || 'Failed to fetch agent tokens');
      } finally {
        setLoading(false);
      }
    };
    
    fetchAllTokens();
  }, []);

  // Fetch specific agent token data
  const fetchAgentToken = async (agentId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/agent-tokens?agentId=${agentId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch agent token data');
      }
      
      const data = await response.json();
      setAgentToken(data);
    } catch (err: any) {
      console.error('Error fetching agent token:', err);
      setError(err.message || 'Failed to fetch agent token data');
    } finally {
      setLoading(false);
    }
  };

  // Fetch user's token portfolio
  const fetchUserPortfolio = async (walletAddress: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/agent-tokens?walletAddress=${walletAddress}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch user portfolio');
      }
      
      const data = await response.json();
      setUserPortfolio(data);
    } catch (err: any) {
      console.error('Error fetching user portfolio:', err);
      setError(err.message || 'Failed to fetch user portfolio');
    } finally {
      setLoading(false);
    }
  };

  return {
    allTokens,
    userPortfolio,
    agentToken,
    loading,
    error,
    fetchAgentToken,
    fetchUserPortfolio
  };
}

export default useAgentTokens; 