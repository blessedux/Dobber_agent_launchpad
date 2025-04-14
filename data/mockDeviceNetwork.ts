import { AgentType } from '@/lib/types/agent-token';

// Device types
export type DeviceType = 'solar-panel' | 'ev-charger' | 'compute-node' | 'helium-miner' | 'server-tower';

// Position on the isometric grid
export interface GridPosition {
  x: number;
  y: number;
}

// Device entity
export interface Device {
  id: string;
  name: string;
  type: DeviceType;
  position: GridPosition;
  ownerAddress: string;
  managingAgentId?: string;
  status: 'active' | 'inactive' | 'maintenance';
  revenuePerDay: number;
  verificationStatus?: 'verified' | 'pending' | 'failed';
}

// Agent entity
export interface NetworkAgent {
  id: string;
  name: string;
  type: AgentType;
  ownerAddress: string;
  position?: GridPosition; // Agents can move between devices
  targetDeviceId?: string; // The device the agent is heading to
  managedDeviceIds: string[];
  tokenSymbol: string;
  tokenSupply: number;
  tokenPrice: string;
  revenueGenerated: number;
  tokenHolders: {
    [address: string]: number;
  };
  verificationStatus: 'verified' | 'pending' | 'failed';
}

// The entire network
export interface DeviceNetwork {
  userAddress: string;
  devices: Device[];
  agents: NetworkAgent[];
  gridSize: { width: number; height: number };
}

// Mock wallet addresses
const USER_WALLET = '0x1234567890abcdef1234567890abcdef12345678';
const OTHER_WALLET1 = '0x2345678901abcdef2345678901abcdef23456789';
const OTHER_WALLET2 = '0x3456789012abcdef3456789012abcdef34567890';

// Mock device network data
const mockDeviceNetwork: DeviceNetwork = {
  userAddress: USER_WALLET,
  gridSize: { width: 10, height: 10 },
  devices: [
    // User's devices
    {
      id: 'device_solar_1',
      name: 'Solar Panel Alpha',
      type: 'solar-panel',
      position: { x: 2, y: 3 },
      ownerAddress: USER_WALLET,
      managingAgentId: 'agent_solar_1',
      status: 'active',
      revenuePerDay: 12.45,
      verificationStatus: 'verified'
    },
    {
      id: 'device_solar_2',
      name: 'Solar Panel Beta',
      type: 'solar-panel',
      position: { x: 3, y: 3 },
      ownerAddress: USER_WALLET,
      managingAgentId: 'agent_solar_1',
      status: 'active',
      revenuePerDay: 10.78,
      verificationStatus: 'verified'
    },
    {
      id: 'device_compute_1',
      name: 'Compute Node X1',
      type: 'compute-node',
      position: { x: 5, y: 2 },
      ownerAddress: USER_WALLET,
      managingAgentId: 'agent_compute_1',
      status: 'active',
      revenuePerDay: 18.92,
      verificationStatus: 'verified'
    },
    {
      id: 'device_helium_1',
      name: 'Helium Hotspot #1',
      type: 'helium-miner',
      position: { x: 7, y: 5 },
      ownerAddress: USER_WALLET,
      managingAgentId: 'agent_helium_1',
      status: 'maintenance',
      revenuePerDay: 5.22,
      verificationStatus: 'pending'
    },
    
    // Other user's devices that you have tokens in
    {
      id: 'device_ev_1',
      name: 'EV Charger Station',
      type: 'ev-charger',
      position: { x: 8, y: 2 },
      ownerAddress: OTHER_WALLET1,
      managingAgentId: 'agent_ev_1',
      status: 'active',
      revenuePerDay: 28.76,
      verificationStatus: 'verified'
    },
    {
      id: 'device_server_1',
      name: 'Server Tower Z9',
      type: 'server-tower',
      position: { x: 4, y: 6 },
      ownerAddress: OTHER_WALLET2,
      managingAgentId: 'agent_server_1',
      status: 'active',
      revenuePerDay: 35.14,
      verificationStatus: 'verified'
    },
    
    // More other devices you don't have tokens in
    {
      id: 'device_solar_3',
      name: 'Solar Array Gamma',
      type: 'solar-panel',
      position: { x: 1, y: 8 },
      ownerAddress: OTHER_WALLET1,
      managingAgentId: 'agent_solar_2',
      status: 'inactive',
      revenuePerDay: 0,
      verificationStatus: 'failed'
    },
    {
      id: 'device_compute_2',
      name: 'Compute Node Y3',
      type: 'compute-node',
      position: { x: 9, y: 7 },
      ownerAddress: OTHER_WALLET2,
      managingAgentId: 'agent_compute_2',
      status: 'active',
      revenuePerDay: 22.31,
      verificationStatus: 'verified'
    }
  ],
  agents: [
    // User's agents
    {
      id: 'agent_solar_1',
      name: 'SolarOptimizer',
      type: 'MaintenanceAgent',
      ownerAddress: USER_WALLET,
      position: { x: 2.5, y: 3 },
      managedDeviceIds: ['device_solar_1', 'device_solar_2'],
      tokenSymbol: 'SOLAR',
      tokenSupply: 10000,
      tokenPrice: '0.01733',
      revenueGenerated: 453.22,
      tokenHolders: {
        [USER_WALLET]: 6000,
        [OTHER_WALLET1]: 2500,
        [OTHER_WALLET2]: 1500
      },
      verificationStatus: 'verified'
    },
    {
      id: 'agent_compute_1',
      name: 'ComputeManager',
      type: 'RevenueDistributionAgent',
      ownerAddress: USER_WALLET,
      position: { x: 5, y: 2 },
      managedDeviceIds: ['device_compute_1'],
      tokenSymbol: 'COMPUTE',
      tokenSupply: 5000,
      tokenPrice: '0.02451',
      revenueGenerated: 387.65,
      tokenHolders: {
        [USER_WALLET]: 3500,
        [OTHER_WALLET1]: 1500
      },
      verificationStatus: 'verified'
    },
    {
      id: 'agent_helium_1',
      name: 'HeliumHelper',
      type: 'MaintenanceAgent',
      ownerAddress: USER_WALLET,
      position: { x: 7, y: 5 },
      targetDeviceId: 'device_helium_1',
      managedDeviceIds: ['device_helium_1'],
      tokenSymbol: 'HELIUM',
      tokenSupply: 3000,
      tokenPrice: '0.00987',
      revenueGenerated: 127.89,
      tokenHolders: {
        [USER_WALLET]: 2500,
        [OTHER_WALLET2]: 500
      },
      verificationStatus: 'pending'
    },
    
    // Other agents that user holds tokens in
    {
      id: 'agent_ev_1',
      name: 'ChargeMaster',
      type: 'LPOptimizationAgent',
      ownerAddress: OTHER_WALLET1,
      position: { x: 8, y: 2 },
      managedDeviceIds: ['device_ev_1'],
      tokenSymbol: 'CHARGE',
      tokenSupply: 8000,
      tokenPrice: '0.03542',
      revenueGenerated: 612.43,
      tokenHolders: {
        [OTHER_WALLET1]: 5000,
        [USER_WALLET]: 2000,
        [OTHER_WALLET2]: 1000
      },
      verificationStatus: 'verified'
    },
    {
      id: 'agent_server_1',
      name: 'ServerGuard',
      type: 'MaintenanceAgent',
      ownerAddress: OTHER_WALLET2,
      position: { x: 4, y: 6 },
      managedDeviceIds: ['device_server_1'],
      tokenSymbol: 'GUARD',
      tokenSupply: 7500,
      tokenPrice: '0.02876',
      revenueGenerated: 529.71,
      tokenHolders: {
        [OTHER_WALLET2]: 4500,
        [USER_WALLET]: 1500,
        [OTHER_WALLET1]: 1500
      },
      verificationStatus: 'verified'
    },
    
    // Other agents user doesn't hold tokens in
    {
      id: 'agent_solar_2',
      name: 'SolarMaster',
      type: 'MaintenanceAgent',
      ownerAddress: OTHER_WALLET1,
      position: { x: 1, y: 8 },
      managedDeviceIds: ['device_solar_3'],
      tokenSymbol: 'SOLARM',
      tokenSupply: 5000,
      tokenPrice: '0.00753',
      revenueGenerated: 142.38,
      tokenHolders: {
        [OTHER_WALLET1]: 3500,
        [OTHER_WALLET2]: 1500
      },
      verificationStatus: 'failed'
    },
    {
      id: 'agent_compute_2',
      name: 'ComputeWizard',
      type: 'RevenueDistributionAgent',
      ownerAddress: OTHER_WALLET2,
      position: { x: 9, y: 7 },
      managedDeviceIds: ['device_compute_2'],
      tokenSymbol: 'WIZARD',
      tokenSupply: 6000,
      tokenPrice: '0.01898',
      revenueGenerated: 356.92,
      tokenHolders: {
        [OTHER_WALLET2]: 4000,
        [OTHER_WALLET1]: 2000
      },
      verificationStatus: 'verified'
    }
  ]
};

// Helper function: Get user's token holdings in other agents
export const getUserTokenHoldings = (network: DeviceNetwork) => {
  const { userAddress, agents } = network;
  
  return agents.filter(agent => 
    agent.ownerAddress !== userAddress && 
    agent.tokenHolders[userAddress] && 
    agent.tokenHolders[userAddress] > 0
  ).map(agent => ({
    agentId: agent.id,
    name: agent.name,
    tokenSymbol: agent.tokenSymbol,
    tokenAmount: agent.tokenHolders[userAddress],
    percentOwnership: (agent.tokenHolders[userAddress] / agent.tokenSupply) * 100,
    value: parseFloat(agent.tokenPrice) * agent.tokenHolders[userAddress]
  }));
};

// Helper function: Calculate daily revenue from token holdings
export const getUserDailyRevenueFromHoldings = (network: DeviceNetwork) => {
  const { userAddress, devices, agents } = network;
  let totalDailyRevenue = 0;
  
  // Calculate revenue from owned devices
  const ownedDevices = devices.filter(device => device.ownerAddress === userAddress);
  totalDailyRevenue += ownedDevices.reduce((sum, device) => sum + device.revenuePerDay, 0);
  
  // Calculate revenue from token holdings in other agents
  agents.forEach(agent => {
    if (agent.ownerAddress !== userAddress && agent.tokenHolders[userAddress]) {
      const userShare = agent.tokenHolders[userAddress] / agent.tokenSupply;
      
      // Find all devices managed by this agent
      const managedDevices = devices.filter(device => agent.managedDeviceIds.includes(device.id));
      const deviceRevenue = managedDevices.reduce((sum, device) => sum + device.revenuePerDay, 0);
      
      // Add user's share of the revenue (assuming 90% to token holders)
      totalDailyRevenue += deviceRevenue * userShare * 0.9;
    }
  });
  
  return totalDailyRevenue;
};

export default mockDeviceNetwork; 