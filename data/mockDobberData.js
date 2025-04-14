// Mock data for the DOBBER Framework dashboard
// This simulates data from the DOBBER Framework API

// Helper function to get random value within a range with slight variation
const getRandomValue = (base, variance) => {
  return (base + (Math.random() * 2 - 1) * variance).toFixed(2);
};

// Helper function to get a timestamp from minutes ago
const getTimestampMinutesAgo = (minutes) => {
  const date = new Date();
  date.setMinutes(date.getMinutes() - minutes);
  return date.toISOString();
};

// Initial data values
const initialData = {
  performance: {
    uptime: 98.6,
    todaysActions: 72,
    profitLoss: 324.50,
    agentsOnline: 4,
    activeDevices: 42
  },
  earnings: {
    totalEarnings: 12563.45,
    totalEarningsToday: 542.80,
    weekly: [1832, 1940, 2020, 2100, 2215, 2280, 2300],
    monthlyProjection: 13400.00
  },
  revenueDistribution: {
    treasury: 3500,
    liquidityPools: 6000,
    operatorYield: 2000
  },
  agents: [
    { id: "agent_01", status: "online", lastPing: getTimestampMinutesAgo(1) },
    { id: "agent_02", status: "online", lastPing: getTimestampMinutesAgo(2) },
    { id: "agent_03", status: "online", lastPing: getTimestampMinutesAgo(1) },
    { id: "agent_04", status: "online", lastPing: getTimestampMinutesAgo(1) },
    { id: "agent_05", status: "offline", lastPing: getTimestampMinutesAgo(125) },
    { id: "agent_06", status: "offline", lastPing: getTimestampMinutesAgo(240) }
  ],
  actionsToday: Array.from({ length: 72 }, (_, i) => ({
    type: ["revenue_distribution", "maintenance_alert", "price_adjustment", "yield_optimization"][Math.floor(Math.random() * 4)],
    timestamp: getTimestampMinutesAgo(Math.floor(Math.random() * 1000))
  })),
  deviceLogs: Array.from({ length: 50 }, (_, i) => ({
    deviceId: `dev_${String(i + 1).padStart(2, '0')}`,
    status: Math.random() > 0.15 ? "online" : "offline",
    uptimeMinutes: Math.floor(Math.random() * 500) + 1000
  })),
  costs: {
    operatingToday: 218.30
  }
};

// Store current data between updates
let currentData = JSON.parse(JSON.stringify(initialData));

// Update data function to simulate live changes
export function getUpdatedData() {
  // Create a copy of the current data
  const updatedData = JSON.parse(JSON.stringify(currentData));
  
  // Update agent ping times randomly
  updatedData.agents.forEach(agent => {
    if (agent.status === "online") {
      agent.lastPing = getTimestampMinutesAgo(Math.floor(Math.random() * 2));
    }
  });
  
  // Randomly toggle an agent's status
  if (Math.random() > 0.8) {
    const randomAgentIndex = Math.floor(Math.random() * updatedData.agents.length);
    updatedData.agents[randomAgentIndex].status = updatedData.agents[randomAgentIndex].status === "online" ? "offline" : "online";
    updatedData.agents[randomAgentIndex].lastPing = getTimestampMinutesAgo(updatedData.agents[randomAgentIndex].status === "online" ? 1 : 60);
  }
  
  // Update count of agents online based on current status
  updatedData.performance.agentsOnline = updatedData.agents.filter(agent => 
    agent.status === "online" && 
    new Date(agent.lastPing) > new Date(Date.now() - 2 * 60 * 1000)
  ).length;
  
  // Update device statuses randomly
  updatedData.deviceLogs.forEach(device => {
    if (Math.random() > 0.95) {
      device.status = device.status === "online" ? "offline" : "online";
    }
    
    // Adjust uptime minutes based on status
    if (device.status === "online") {
      device.uptimeMinutes += Math.floor(Math.random() * 5);
    }
  });
  
  // Update active devices count
  updatedData.performance.activeDevices = updatedData.deviceLogs.filter(device => device.status === "online").length;
  
  // Update uptime percentage
  const totalPossibleUptime = updatedData.deviceLogs.length * 1440; // 24 hours * 60 minutes
  const totalActualUptime = updatedData.deviceLogs.reduce((sum, device) => sum + device.uptimeMinutes, 0);
  updatedData.performance.uptime = (totalActualUptime / totalPossibleUptime * 100).toFixed(1);
  
  // Add a new random action
  const actionTypes = ["revenue_distribution", "maintenance_alert", "price_adjustment", "yield_optimization"];
  const newAction = {
    type: actionTypes[Math.floor(Math.random() * actionTypes.length)],
    timestamp: new Date().toISOString()
  };
  
  updatedData.actionsToday.push(newAction);
  updatedData.performance.todaysActions = updatedData.actionsToday.length;
  
  // Update earnings randomly
  const earningsIncrease = parseFloat(getRandomValue(5, 2));
  updatedData.earnings.totalEarningsToday += earningsIncrease;
  updatedData.earnings.totalEarnings += earningsIncrease;
  
  // Update operating costs slightly
  const costIncrease = parseFloat(getRandomValue(0.8, 0.3));
  updatedData.costs.operatingToday += costIncrease;
  
  // Update profit/loss
  updatedData.performance.profitLoss = (
    updatedData.earnings.totalEarningsToday - updatedData.costs.operatingToday
  ).toFixed(2);
  
  // Adjust revenue distribution slightly
  updatedData.revenueDistribution.treasury += Math.floor(Math.random() * 20) - 10;
  updatedData.revenueDistribution.liquidityPools += Math.floor(Math.random() * 30) - 15;
  updatedData.revenueDistribution.operatorYield += Math.floor(Math.random() * 15) - 7;
  
  // Update the stored data
  currentData = updatedData;
  
  return updatedData;
}

export default initialData; 