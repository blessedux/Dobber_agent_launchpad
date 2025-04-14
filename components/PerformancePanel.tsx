import React from 'react';
import { Activity, Clock, Cpu, DollarSign, Users } from 'lucide-react';
import { Card } from '@/components/ui/card';
import MetricCard from './MetricCard';
import DobberRevenueChart from './charts/DobberRevenueChart';
import EarningsChart from './charts/EarningsChart';
import useMockAnalyticsData from '@/hooks/useMockAnalyticsData';

interface PerformancePanelProps {
  showAgentStatusOnly?: boolean;
}

const PerformancePanel: React.FC<PerformancePanelProps> = ({ showAgentStatusOnly = false }) => {
  const { data, loading, error } = useMockAnalyticsData(5000); // Refresh every 5 seconds

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="text-gray-400">Loading dashboard data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-4 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
        <div className="text-red-600 dark:text-red-400">Error loading dashboard: {error}</div>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card className="p-4">
        <div className="text-gray-500">No data available</div>
      </Card>
    );
  }

  // Format values for display
  const formattedUptime = data.uptime ? data.uptime.toFixed(1) : '0.0';
  const formattedProfitLoss = data.profitLoss ? data.profitLoss.toFixed(2) : '0.00';
  
  // Calculate profit/loss trend
  const isProfitable = data.profitLoss > 0;
  const profitLossTrend = {
    value: 8.2, // This could be calculated from historical data
    isPositive: isProfitable
  };

  // If showAgentStatusOnly is true, only show the agent status section
  if (showAgentStatusOnly) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <MetricCard
            title="Agents Online"
            value={data.agentsOnline}
            icon={Users}
            className="bg-slate-50 dark:bg-slate-800/50"
          />
          
          <MetricCard
            title="Active Devices"
            value={data.activeDevices}
            icon={Cpu}
            className="bg-slate-50 dark:bg-slate-800/50"
          />
          
          <MetricCard
            title="Today's Actions"
            value={data.todaysActions}
            icon={Activity}
            className="bg-slate-50 dark:bg-slate-800/50"
          />
        </div>
        
        <div className="space-y-2">
          {data.rawData.agentHistory.map((agent, index) => (
            <div 
              key={agent.id}
              className="flex justify-between items-center p-3 rounded-md bg-slate-50 dark:bg-slate-800/70"
            >
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${agent.status === 'online' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                <span className="font-medium">{agent.id}</span>
              </div>
              <div className="text-sm text-gray-500">
                Last ping: {new Date(agent.lastPing).toLocaleTimeString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">DOBBER Framework Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Uptime"
          value={`${formattedUptime}%`}
          icon={Clock}
          className="bg-slate-50 dark:bg-slate-800/50"
        />
        
        <MetricCard
          title="Today's Actions"
          value={data.todaysActions}
          icon={Activity}
          className="bg-slate-50 dark:bg-slate-800/50"
        />
        
        <MetricCard
          title="Profit/Loss"
          value={formattedProfitLoss}
          valuePrefix="$"
          icon={DollarSign}
          trend={profitLossTrend}
          className="bg-slate-50 dark:bg-slate-800/50"
        />
        
        <MetricCard
          title="Agents Online"
          value={data.agentsOnline}
          icon={Users}
          className="bg-slate-50 dark:bg-slate-800/50"
        />
        
        <MetricCard
          title="Active Devices"
          value={data.activeDevices}
          icon={Cpu}
          className="bg-slate-50 dark:bg-slate-800/50 lg:col-span-1"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <EarningsChart 
          data={data.rawData.earnings.weekly}
          className="col-span-1"
        />
        
        <DobberRevenueChart 
          data={data.rawData.revenueDistribution}
          className="col-span-1"
        />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card className="p-4">
          <h3 className="text-lg font-medium mb-2">Agent Activity</h3>
          <div className="space-y-2">
            {data.rawData.agentHistory.map((agent, index) => (
              <div 
                key={agent.id}
                className="flex justify-between items-center p-2 rounded-md bg-slate-50 dark:bg-slate-800/70"
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${agent.status === 'online' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                  <span className="font-medium">{agent.id}</span>
                </div>
                <div className="text-sm text-gray-500">
                  Last ping: {new Date(agent.lastPing).toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="text-lg font-medium mb-2">Recent Actions</h3>
          {data.rawData.actionsToday && data.rawData.actionsToday.length > 0 ? (
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {data.rawData.actionsToday.slice(0, 10).map((action, index) => (
                <div 
                  key={`${action.type}-${index}`}
                  className="flex justify-between items-center p-2 rounded-md bg-slate-50 dark:bg-slate-800/70"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
                      <Activity className="w-4 h-4 text-violet-700 dark:text-violet-300" />
                    </div>
                    <div>
                      <span className="font-medium capitalize">{action.type.replace(/_/g, ' ')}</span>
                      <div className="text-xs text-gray-500">
                        {new Date(action.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-4 text-gray-500">No recent actions recorded</div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default PerformancePanel; 