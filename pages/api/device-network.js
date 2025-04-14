import mockDeviceNetwork, { getUserTokenHoldings, getUserDailyRevenueFromHoldings } from '../../data/mockDeviceNetwork';

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
  
  const { wallet, format } = req.query;
  
  // If specific format is requested
  if (format === 'summary') {
    const tokenHoldings = getUserTokenHoldings(mockDeviceNetwork);
    const dailyRevenue = getUserDailyRevenueFromHoldings(mockDeviceNetwork);
    
    return res.status(200).json({
      ownedDevices: mockDeviceNetwork.devices.filter(d => d.ownerAddress === mockDeviceNetwork.userAddress),
      ownedAgents: mockDeviceNetwork.agents.filter(a => a.ownerAddress === mockDeviceNetwork.userAddress),
      tokenHoldings,
      dailyRevenue,
      totalDevices: mockDeviceNetwork.devices.length,
      totalAgents: mockDeviceNetwork.agents.length
    });
  }
  
  // Return full network data
  return res.status(200).json(mockDeviceNetwork);
} 