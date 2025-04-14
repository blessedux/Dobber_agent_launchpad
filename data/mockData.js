// Mock data for the dashboard
// This simulates data from various DePIN devices and their earnings

// Helper function to get random value within a range with slight variation
const getRandomValue = (base, variance) => {
  return (base + (Math.random() * 2 - 1) * variance).toFixed(2);
};

// Initial data values
const initialData = {
  totalEarnings: 543.40,
  weeklyGrowth: 14.8,
  monthlyProjection: 2336.62,
  devices: {
    total: 10,
    online: 9,
    offline: 1,
    warning: 2
  },
  deviceTypes: [
    {
      name: "Solar Nodes",
      type: "solar-node",
      revenue: 342.87,
      percentage: 63,
      color: '#f59e0b',
      count: 5,
      uptime: 99.2,
      earningsPerDevice: 68.57
    },
    {
      name: "EV Chargers",
      type: "ev-charger",
      revenue: 128.34,
      percentage: 24,
      color: '#10b981',
      count: 3,
      uptime: 97.8,
      earningsPerDevice: 42.78
    },
    {
      name: "Helium Miners",
      type: "helium-miner",
      revenue: 72.19,
      percentage: 13,
      color: '#8b5cf6',
      count: 2,
      uptime: 92.4,
      earningsPerDevice: 36.09
    }
  ],
  revenueHistory: generateHistoricalData(30),
  agentActivity: [
    {
      timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      agent: "SolarOptimizer",
      action: "Optimized panel angle for maximum yield",
      revenue: "+0.42"
    },
    {
      timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      agent: "ChargeMaster",
      action: "Adjusted pricing based on grid demand",
      revenue: "+0.37"
    },
    {
      timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      agent: "NetGuard",
      action: "Resolved connectivity issue",
      revenue: "+0.21"
    }
  ],
  pools: {
    userWallet: 70,
    communityPool: 20,
    treasuryPool: 10
  }
};

// Generate historical data for charts
function generateHistoricalData(days) {
  const data = [];
  const now = new Date();
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Create some realistic patterns with variance
    const dayOfMonth = date.getDate();
    let baseValue;
    
    // Simulate weekend spikes for EV chargers
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    const evMultiplier = isWeekend ? 1.4 : 1.0;
    
    // Simulate solar being better during middle of month (sunny days)
    const solarMultiplier = Math.sin((dayOfMonth / 31) * Math.PI) * 0.3 + 1.0;
    
    // Simulate helium being relatively constant
    const heliumMultiplier = 1.0 + (Math.random() * 0.2 - 0.1);
    
    const solar = parseFloat(getRandomValue(10 * solarMultiplier, 2));
    const ev = parseFloat(getRandomValue(4 * evMultiplier, 1));
    const helium = parseFloat(getRandomValue(2 * heliumMultiplier, 0.5));
    
    data.push({
      date: date.toISOString().split('T')[0],
      solar,
      ev, 
      helium,
      total: solar + ev + helium
    });
  }
  
  return data;
}

// Update data function to simulate live changes
export function getUpdatedData() {
  // Create a copy of the last data
  const updatedData = JSON.parse(JSON.stringify(initialData));
  
  // Simulate small changes to total earnings
  const solarIncrease = parseFloat(getRandomValue(0.15, 0.05));
  const evIncrease = parseFloat(getRandomValue(0.08, 0.03));
  const heliumIncrease = parseFloat(getRandomValue(0.04, 0.02));
  
  // Update device type revenues
  updatedData.deviceTypes[0].revenue = (parseFloat(updatedData.deviceTypes[0].revenue) + solarIncrease).toFixed(2);
  updatedData.deviceTypes[1].revenue = (parseFloat(updatedData.deviceTypes[1].revenue) + evIncrease).toFixed(2);
  updatedData.deviceTypes[2].revenue = (parseFloat(updatedData.deviceTypes[2].revenue) + heliumIncrease).toFixed(2);
  
  // Update per-device earnings
  updatedData.deviceTypes[0].earningsPerDevice = (parseFloat(updatedData.deviceTypes[0].revenue) / updatedData.deviceTypes[0].count).toFixed(2);
  updatedData.deviceTypes[1].earningsPerDevice = (parseFloat(updatedData.deviceTypes[1].revenue) / updatedData.deviceTypes[1].count).toFixed(2);
  updatedData.deviceTypes[2].earningsPerDevice = (parseFloat(updatedData.deviceTypes[2].revenue) / updatedData.deviceTypes[2].count).toFixed(2);
  
  // Update total earnings
  const totalIncrease = solarIncrease + evIncrease + heliumIncrease;
  updatedData.totalEarnings = (parseFloat(updatedData.totalEarnings) + totalIncrease).toFixed(2);
  
  // Recalculate percentages
  const newTotal = parseFloat(updatedData.deviceTypes[0].revenue) +
                  parseFloat(updatedData.deviceTypes[1].revenue) +
                  parseFloat(updatedData.deviceTypes[2].revenue);
                  
  updatedData.deviceTypes[0].percentage = Math.round((parseFloat(updatedData.deviceTypes[0].revenue) / newTotal) * 100);
  updatedData.deviceTypes[1].percentage = Math.round((parseFloat(updatedData.deviceTypes[1].revenue) / newTotal) * 100);
  updatedData.deviceTypes[2].percentage = Math.round((parseFloat(updatedData.deviceTypes[2].revenue) / newTotal) * 100);
  
  // Adjust monthly projection 
  updatedData.monthlyProjection = (parseFloat(updatedData.totalEarnings) * 4.3).toFixed(2);
  
  // Small random fluctuation in weekly growth
  updatedData.weeklyGrowth = (parseFloat(updatedData.weeklyGrowth) + (Math.random() * 0.4 - 0.2)).toFixed(1);
  
  // Add a new recent activity
  const agents = ["SolarOptimizer", "ChargeMaster", "NetGuard"];
  const actions = [
    "Adjusted yield parameters",
    "Optimized energy consumption",
    "Executed market rate update",
    "Performed network optimization",
    "Processed payment transaction",
    "Updated routing configuration"
  ];
  
  const randomAgent = agents[Math.floor(Math.random() * agents.length)];
  const randomAction = actions[Math.floor(Math.random() * actions.length)];
  const randomRevenue = "+0." + (Math.floor(Math.random() * 50) + 10);
  
  updatedData.agentActivity.unshift({
    timestamp: new Date().toISOString(),
    agent: randomAgent,
    action: randomAction,
    revenue: randomRevenue
  });
  
  // Keep only the 10 most recent activities
  updatedData.agentActivity = updatedData.agentActivity.slice(0, 10);
  
  // Update random uptime values with small fluctuations
  updatedData.deviceTypes[0].uptime = Math.min(100, Math.max(90, parseFloat(updatedData.deviceTypes[0].uptime) + (Math.random() * 0.2 - 0.1))).toFixed(1);
  updatedData.deviceTypes[1].uptime = Math.min(100, Math.max(90, parseFloat(updatedData.deviceTypes[1].uptime) + (Math.random() * 0.2 - 0.1))).toFixed(1);
  updatedData.deviceTypes[2].uptime = Math.min(100, Math.max(90, parseFloat(updatedData.deviceTypes[2].uptime) + (Math.random() * 0.4 - 0.2))).toFixed(1);
  
  // Add latest data point to revenue history
  const latestDate = new Date();
  updatedData.revenueHistory.push({
    date: latestDate.toISOString().split('T')[0],
    solar: parseFloat(getRandomValue(10, 2)),
    ev: parseFloat(getRandomValue(4, 1)),
    helium: parseFloat(getRandomValue(2, 0.5)),
    total: totalIncrease
  });
  
  // Keep only last 30 days
  if (updatedData.revenueHistory.length > 31) {
    updatedData.revenueHistory.shift();
  }
  
  return updatedData;
}

export default initialData; 