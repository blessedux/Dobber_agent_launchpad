import mockAgentTokens, { calculateWalletYields, getVerificationSummary } from '../../data/mockAgentTokens';

export default function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Return options for preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  
  const { walletAddress, agentId, summary } = req.query;
  
  // If summary is requested, return verification summary
  if (summary === 'verification') {
    return res.status(200).json(getVerificationSummary());
  }
  
  // If agent ID is provided, return specific agent token data
  if (agentId) {
    const agentData = mockAgentTokens.find(token => token.agentId === agentId);
    
    if (!agentData) {
      return res.status(404).json({ error: 'Agent token not found' });
    }
    
    return res.status(200).json(agentData);
  }
  
  // If wallet address is provided, return user's portfolio
  if (walletAddress) {
    const portfolio = calculateWalletYields(walletAddress);
    return res.status(200).json(portfolio);
  }
  
  // Otherwise return all agent tokens
  return res.status(200).json(mockAgentTokens);
} 