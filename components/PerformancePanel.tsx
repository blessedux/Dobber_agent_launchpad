import React from 'react';
import { Activity, Clock, Cpu, DollarSign, Users } from 'lucide-react';
import { Card } from '@/components/ui/card';
import MetricCard from './MetricCard';
import DobberRevenueChart from './charts/DobberRevenueChart';
import EarningsChart from './charts/EarningsChart';
import useMockAnalyticsData from '@/hooks/useMockAnalyticsData';

const PerformancePanel: React.FC = () => {
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

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">DOBBER Framework Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Uptime"
          value={`${data.uptime}%`}
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
          value={data.profitLoss}
          valuePrefix="$"
          icon={DollarSign}
          trend={data.profitLoss > 0 ? { value: 8.2, isPositive: true } : { value: 4.1, isPositive: false }}
          className="bg-slate-50 dark:bg-slate-800/50"
        />
        
        <MetricCard
          title="Agents Online"
          value={`${data.agentsOnline}`}
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
      </div>
    </div>
  );
};

export default PerformancePanel; 