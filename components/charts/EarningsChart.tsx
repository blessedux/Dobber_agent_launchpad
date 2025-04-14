import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { Card } from '@/components/ui/card';

interface EarningsChartProps {
  data: number[];
  className?: string;
}

const EarningsChart: React.FC<EarningsChartProps> = ({ 
  data,
  className = ''
}) => {
  // Format the data for the line chart
  const chartData = data.map((value, index) => ({
    day: `Day ${index + 1}`,
    earnings: value
  }));

  return (
    <Card className={`p-4 ${className}`}>
      <div className="mb-2">
        <h3 className="text-lg font-medium">Weekly Earnings</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">Last 7 days performance</p>
      </div>

      <div className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{
              top: 10,
              right: 10,
              left: 10,
              bottom: 20,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="day" 
              tick={{ fontSize: 12 }}
              tickMargin={10}
            />
            <YAxis 
              tickFormatter={(value) => `$${value}`}
              tick={{ fontSize: 12 }}
            />
            <Tooltip 
              formatter={(value) => [`$${value}`, 'Earnings']}
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '0.375rem',
                padding: '0.5rem',
              }}
            />
            <Legend wrapperStyle={{ paddingTop: '10px' }} />
            <Line
              type="monotone"
              dataKey="earnings"
              stroke="#8b5cf6"
              strokeWidth={2}
              activeDot={{ r: 8 }}
              name="Daily Earnings"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default EarningsChart; 