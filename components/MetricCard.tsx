import React from 'react';
import { Card } from "@/components/ui/card";
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  valuePrefix?: string;
  valueSuffix?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  icon: Icon,
  trend,
  className = '',
  valuePrefix = '',
  valueSuffix = ''
}) => {
  return (
    <Card className={`p-4 ${className}`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
          <h3 className="text-2xl font-bold mt-1">
            {valuePrefix}{value}{valueSuffix}
          </h3>
          {trend && (
            <div className={`flex items-center text-xs font-medium mt-1 ${
              trend.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
            }`}>
              {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
            </div>
          )}
        </div>
        <div className="p-2 rounded-full bg-slate-100 dark:bg-slate-800">
          <Icon className="h-5 w-5 text-slate-700 dark:text-slate-300" />
        </div>
      </div>
    </Card>
  );
};

export default MetricCard; 