import { useState, useEffect } from 'react';

interface Agent {
  id: string;
  status: string;
  lastPing: string;
}

interface Device {
  deviceId: string;
  status: string;
  uptimeMinutes: number;
}

interface Action {
  type: string;
  timestamp: string;
}

interface RevenueDistribution {
  treasury: number;
  liquidityPools: number;
  operatorYield: number;
}

interface Earnings {
  totalEarnings: number;
  totalEarningsToday: number;
  weekly: number[];
  monthlyProjection: number;
}

interface Costs {
  operatingToday: number;
}

interface DashboardData {
  performance: {
    uptime: number | string;
    todaysActions: number;
    profitLoss: number | string;
    agentsOnline: number;
    activeDevices: number;
  };
  earnings: {
    totalEarnings: number | string;
    totalEarningsToday: number | string;
    weekly: number[];
    monthlyProjection: number | string;
  };
  revenueDistribution: RevenueDistribution;
  agents: Agent[];
  actionsToday: Action[];
  deviceLogs: Device[];
  costs: {
    operatingToday: number | string;
  };
}

interface ProcessedMetrics {
  uptime: number;
  todaysActions: number;
  profitLoss: number;
  agentsOnline: number;
  activeDevices: number;
  rawData: {
    earnings: Earnings;
    revenueDistribution: RevenueDistribution;
    agentHistory: Agent[];
    actionsToday: Action[];
  };
}

// Helper function to safely parse numbers
const safeParseFloat = (value: any): number => {
  if (value === null || value === undefined) return 0;
  
  if (typeof value === 'number') return value;
  
  if (typeof value === 'string') {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? 0 : parsed;
  }
  
  return 0;
};

export function useMockAnalyticsData(refreshInterval = 5000) {
  const [data, setData] = useState<ProcessedMetrics | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchDashboard = async () => {
      try {
        // Use relative URL to work in both development and production
        const res = await fetch('/api/dashboard');
        
        if (!res.ok) {
          throw new Error('Failed to fetch dashboard data');
        }
        
        const json: DashboardData = await res.json();
        
        if (isMounted) {
          // Process the data with safe parsing
          const processedData: ProcessedMetrics = {
            // Direct metrics from performance object
            uptime: safeParseFloat(json.performance.uptime),
            todaysActions: json.performance.todaysActions || 0,
            profitLoss: safeParseFloat(json.performance.profitLoss),
            agentsOnline: json.performance.agentsOnline || 0,
            activeDevices: json.performance.activeDevices || 0,
            
            // Raw data for charts and detailed components
            rawData: {
              earnings: {
                totalEarnings: safeParseFloat(json.earnings.totalEarnings),
                totalEarningsToday: safeParseFloat(json.earnings.totalEarningsToday),
                weekly: Array.isArray(json.earnings.weekly) ? 
                  json.earnings.weekly.map(value => typeof value === 'number' ? value : safeParseFloat(value)) : 
                  [0, 0, 0, 0, 0, 0, 0],
                monthlyProjection: safeParseFloat(json.earnings.monthlyProjection)
              },
              revenueDistribution: {
                treasury: safeParseFloat(json.revenueDistribution.treasury),
                liquidityPools: safeParseFloat(json.revenueDistribution.liquidityPools),
                operatorYield: safeParseFloat(json.revenueDistribution.operatorYield)
              },
              agentHistory: json.agents || [],
              actionsToday: json.actionsToday || []
            }
          };
          
          // Log for debugging
          console.log('Processed data:', processedData);
          
          setData(processedData);
          setLoading(false);
        }
      } catch (err: any) {
        console.error('Error fetching dashboard data:', err);
        if (isMounted) {
          setError(err.message);
          setLoading(false);
        }
      }
    };

    // Initial fetch
    fetchDashboard();
    
    // Set up interval for periodic updates
    const interval = setInterval(fetchDashboard, refreshInterval);

    // Clean up interval and prevent state updates if component unmounts
    return () => {
      clearInterval(interval);
      isMounted = false;
    };
  }, [refreshInterval]);

  return { data, loading, error };
}

export default useMockAnalyticsData; 