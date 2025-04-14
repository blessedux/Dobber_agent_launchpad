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
    uptime: number;
    todaysActions: number;
    profitLoss: number;
    agentsOnline: number;
    activeDevices: number;
  };
  earnings: Earnings;
  revenueDistribution: RevenueDistribution;
  agents: Agent[];
  actionsToday: Action[];
  deviceLogs: Device[];
  costs: Costs;
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
  };
}

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
          // Process the data
          const processedData: ProcessedMetrics = {
            // Direct metrics from performance object
            uptime: typeof json.performance.uptime === 'string' 
              ? parseFloat(json.performance.uptime) 
              : json.performance.uptime,
            todaysActions: json.performance.todaysActions,
            profitLoss: typeof json.performance.profitLoss === 'string' 
              ? parseFloat(json.performance.profitLoss) 
              : json.performance.profitLoss,
            agentsOnline: json.performance.agentsOnline,
            activeDevices: json.performance.activeDevices,
            
            // Raw data for charts and detailed components
            rawData: {
              earnings: {
                ...json.earnings,
                totalEarnings: typeof json.earnings.totalEarnings === 'string' 
                  ? parseFloat(json.earnings.totalEarnings) 
                  : json.earnings.totalEarnings,
                totalEarningsToday: typeof json.earnings.totalEarningsToday === 'string' 
                  ? parseFloat(json.earnings.totalEarningsToday) 
                  : json.earnings.totalEarningsToday,
                monthlyProjection: typeof json.earnings.monthlyProjection === 'string' 
                  ? parseFloat(json.earnings.monthlyProjection) 
                  : json.earnings.monthlyProjection
              },
              revenueDistribution: json.revenueDistribution,
              agentHistory: json.agents
            }
          };
          
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