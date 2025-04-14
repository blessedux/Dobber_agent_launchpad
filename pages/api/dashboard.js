import initialData, { getUpdatedData } from '../../data/mockDobberData';

// Store data between requests to simulate a "live" server
let currentData = {...initialData};
let lastUpdate = Date.now();

export default function handler(req, res) {
  // Set CORS headers if needed
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
  
  // Update the data if it's been more than 1 second since the last update
  // This prevents generating new data on every API call
  const now = Date.now();
  if (now - lastUpdate > 1000) {
    currentData = getUpdatedData();
    lastUpdate = now;
  }
  
  // Make sure all numeric fields are properly formatted
  const formattedData = {
    ...currentData,
    performance: {
      ...currentData.performance,
      uptime: parseFloat(currentData.performance.uptime),
      profitLoss: parseFloat(currentData.performance.profitLoss)
    },
    earnings: {
      ...currentData.earnings,
      totalEarnings: parseFloat(currentData.earnings.totalEarnings),
      totalEarningsToday: parseFloat(currentData.earnings.totalEarningsToday),
      monthlyProjection: parseFloat(currentData.earnings.monthlyProjection)
    },
    costs: {
      ...currentData.costs,
      operatingToday: parseFloat(currentData.costs.operatingToday)
    }
  };
  
  // Return the formatted data
  res.status(200).json(formattedData);
} 