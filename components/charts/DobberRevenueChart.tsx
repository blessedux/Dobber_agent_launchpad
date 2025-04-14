import React from 'react';
import { 
  ResponsiveContainer,
  PieChart, 
  Pie, 
  Cell, 
  Tooltip,
  Legend
} from 'recharts';
import { Card } from "@/components/ui/card";

interface RevenueDistribution {
  treasury: number;
  liquidityPools: number;
  operatorYield: number;
}

interface DobberRevenueChartProps {
  data: RevenueDistribution;
  className?: string;
}

const DobberRevenueChart: React.FC<DobberRevenueChartProps> = ({ 
  data,
  className = '' 
}) => {
  // Format the data for the pie chart
  const chartData = [
    { name: 'Treasury', value: data.treasury, color: '#8b5cf6' },
    { name: 'Liquidity Pools', value: data.liquidityPools, color: '#10b981' },
    { name: 'Operator Yield', value: data.operatorYield, color: '#f59e0b' }
  ];

  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  const renderCustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const percentage = ((data.value / total) * 100).toFixed(1);
      
      return (
        <div className="bg-white dark:bg-slate-800 p-3 border border-gray-200 dark:border-gray-700 rounded-md shadow-md">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm">${data.value.toLocaleString()}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{percentage}% of total</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className={`p-4 ${className}`}>
      <div className="mb-2">
        <h3 className="text-lg font-medium">Revenue Distribution</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">Current allocation of funds</p>
      </div>
      
      <div className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
              label={({
                cx,
                cy,
                midAngle,
                innerRadius,
                outerRadius,
                percent,
              }) => {
                const radius = innerRadius + (outerRadius - innerRadius) * 1.4;
                const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
                return (
                  <text
                    x={x}
                    y={y}
                    fill="#888888"
                    textAnchor={x > cx ? 'start' : 'end'}
                    dominantBaseline="central"
                    className="text-xs"
                  >
                    {`${(percent * 100).toFixed(0)}%`}
                  </text>
                );
              }}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={renderCustomTooltip} />
            <Legend 
              layout="horizontal" 
              verticalAlign="bottom" 
              align="center"
              formatter={(value, entry, index) => (
                <span className="text-sm">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default DobberRevenueChart; 