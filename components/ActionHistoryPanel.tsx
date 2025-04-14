import React from 'react';
import { Activity } from 'lucide-react';
import { Card } from '@/components/ui/card';
import useMockAnalyticsData from '@/hooks/useMockAnalyticsData';

const ActionHistoryPanel: React.FC = () => {
  const { data, loading, error } = useMockAnalyticsData(5000);

  if (loading) {
    return (
      <div className="text-center p-4 text-gray-500">
        Loading action history...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4 text-red-500">
        Error loading action history: {error}
      </div>
    );
  }

  if (!data || !data.rawData.actionsToday || data.rawData.actionsToday.length === 0) {
    return (
      <div className="text-center p-4 text-gray-500">
        No action history available
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="max-h-[500px] overflow-y-auto">
        {data.rawData.actionsToday.map((action, index) => (
          <div 
            key={`${action.type}-${index}`}
            className="flex items-start gap-3 p-3 border-b border-gray-100 dark:border-gray-800 last:border-0"
          >
            <div className="p-2 bg-violet-100 dark:bg-violet-900/30 rounded-full flex-shrink-0">
              <Activity className="h-5 w-5 text-violet-600 dark:text-violet-400" />
            </div>
            <div>
              <div className="font-medium capitalize">
                {action.type.replace(/_/g, ' ')}
              </div>
              <div className="text-sm text-gray-500 mt-1">
                {new Date(action.timestamp).toLocaleString()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActionHistoryPanel; 