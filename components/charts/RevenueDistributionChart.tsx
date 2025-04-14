"use client"

import React, { useState } from 'react';
import { 
  Card, 
  CardHeader, 
  Typography, 
  Box, 
  Button, 
  ButtonGroup, 
  Divider, 
  useTheme 
} from '@mui/material';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { TrendingUp, PieChart as PieChartIcon, BarChart2, LineChart as LineChartIcon } from 'lucide-react';

// Define types
type DeviceType = 'solar-node' | 'ev-charger' | 'helium-miner' | 'compute-node';

interface DeviceRevenue {
  name: string;
  type: DeviceType;
  revenue: number;
  percentage: number;
  color: string;
}

// Generate monthly data for a year
interface MonthlyData {
  name: string;
  solar: number;
  ev: number;
  helium: number;
  total: number;
  month: string;
}

interface RevenueDistributionChartProps {
  data: DeviceRevenue[];
  totalRevenue: number;
  weeklyGrowth: string;
  monthlyProjection: number;
}

// COLORS
const COLORS = {
  'solar-node': '#f59e0b',  // amber
  'ev-charger': '#10b981',  // emerald
  'helium-miner': '#8b5cf6', // violet
  'compute-node': '#3b82f6', // blue
};

// Custom tooltip for charts
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <Box sx={{ 
        bgcolor: 'background.paper', 
        p: 1.5, 
        boxShadow: 2, 
        borderRadius: 1
      }}>
        <Typography variant="subtitle2">{label}</Typography>
        {payload.map((entry: any, index: number) => (
          <Typography 
            key={`tooltip-${index}`} 
            variant="body2" 
            color="text.secondary"
            sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}
          >
            <Box 
              component="span" 
              sx={{ 
                display: 'inline-block', 
                width: 10, 
                height: 10, 
                borderRadius: '50%', 
                backgroundColor: entry.color,
                mr: 1 
              }} 
            />
            {entry.name}: ${entry.value.toFixed(2)}
          </Typography>
        ))}
      </Box>
    );
  }

  return null;
};

// Custom tooltip for pie chart
const CustomPieTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <Box sx={{ 
        bgcolor: 'background.paper', 
        p: 1.5, 
        boxShadow: 2, 
        borderRadius: 1
      }}>
        <Typography variant="subtitle2">{payload[0].name}</Typography>
        <Typography variant="body2" color="text.secondary">
          Revenue: ${payload[0].value.toFixed(2)}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Share: {payload[0].payload.percentage.toFixed(1)}%
        </Typography>
      </Box>
    );
  }

  return null;
};

export default function RevenueDistributionChart({ data, totalRevenue, weeklyGrowth, monthlyProjection }: RevenueDistributionChartProps) {
  const [chartType, setChartType] = useState<'line' | 'area' | 'pie'>('area');
  
  // Format data for pie chart
  const formattedData = data.map(item => ({
    ...item,
    color: COLORS[item.type] || '#9ca3af',
  }));

  // Generate monthly data for the year
  const generateMonthlyData = (): MonthlyData[] => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const getRandomValue = (min: number, max: number, seed: number = 1) => {
      return Math.floor(min + (Math.sin(seed) * 0.5 + 0.5) * (max - min));
    };
    
    const getWavePattern = (month: number, amplitude: number, phase: number, baseline: number) => {
      return baseline + amplitude * Math.sin((month / 11) * Math.PI * 2 + phase);
    };

    return months.map((month, idx) => {
      // Create wave patterns with different phases
      const solarValue = getWavePattern(idx, 150, 0, 300);
      const evValue = getWavePattern(idx, 100, Math.PI / 2, 250); 
      const heliumValue = getWavePattern(idx, 80, Math.PI, 200);
      
      return {
        name: month,
        month,
        solar: Math.max(50, solarValue),
        ev: Math.max(50, evValue),
        helium: Math.max(50, heliumValue),
        total: Math.max(50, solarValue) + Math.max(50, evValue) + Math.max(50, heliumValue)
      };
    });
  };

  const monthlyData = generateMonthlyData();

  return (
    <Card sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      bgcolor: 'background.paper',
      borderRadius: 2,
      boxShadow: 'rgba(0, 0, 0, 0.05) 0px 20px 27px 0px'
    }}>
      <CardHeader
        title={
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Revenue Distribution</Typography>
            <ButtonGroup size="small" variant="outlined">
              <Button 
                startIcon={<LineChartIcon size={16} />}
                onClick={() => setChartType('line')}
                variant={chartType === 'line' ? 'contained' : 'outlined'}
                sx={{ 
                  bgcolor: chartType === 'line' ? 'primary.main' : 'transparent',
                  borderColor: 'primary.main',
                  '&:hover': {
                    bgcolor: chartType === 'line' ? 'primary.dark' : 'rgba(67, 24, 255, 0.1)',
                  }
                }}
              >
                Line
              </Button>
              <Button 
                startIcon={<BarChart2 size={16} />}
                onClick={() => setChartType('area')}
                variant={chartType === 'area' ? 'contained' : 'outlined'}
                sx={{ 
                  bgcolor: chartType === 'area' ? 'primary.main' : 'transparent',
                  borderColor: 'primary.main',
                  '&:hover': {
                    bgcolor: chartType === 'area' ? 'primary.dark' : 'rgba(67, 24, 255, 0.1)',
                  }
                }}
              >
                Area
              </Button>
              <Button 
                startIcon={<PieChartIcon size={16} />}
                onClick={() => setChartType('pie')}
                variant={chartType === 'pie' ? 'contained' : 'outlined'}
                sx={{ 
                  bgcolor: chartType === 'pie' ? 'primary.main' : 'transparent',
                  borderColor: 'primary.main',
                  '&:hover': {
                    bgcolor: chartType === 'pie' ? 'primary.dark' : 'rgba(67, 24, 255, 0.1)',
                  }
                }}
              >
                Pie
              </Button>
            </ButtonGroup>
          </Box>
        }
      />
      
      <Box sx={{ display: 'flex', p: 2, justifyContent: 'space-between' }}>
        <Box sx={{ p: 2, borderRadius: 2, bgcolor: 'rgba(67, 24, 255, 0.1)', width: '30%' }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Total Revenue
          </Typography>
          <Typography variant="h4" color="primary.main" sx={{ fontWeight: 'bold' }}>
            ${totalRevenue.toFixed(2)}
          </Typography>
        </Box>
        
        <Box sx={{ p: 2, borderRadius: 2, bgcolor: 'rgba(159, 122, 234, 0.1)', width: '30%' }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Weekly Growth
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="h4" color="#9f7aea" sx={{ fontWeight: 'bold' }}>
              {weeklyGrowth}
            </Typography>
            <TrendingUp size={20} color="#9f7aea" style={{ marginLeft: '8px' }} />
          </Box>
        </Box>
        
        <Box sx={{ p: 2, borderRadius: 2, bgcolor: 'rgba(67, 24, 255, 0.05)', width: '30%' }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Monthly Projection
          </Typography>
          <Typography variant="h4" color="primary.main" sx={{ fontWeight: 'bold' }}>
            ${monthlyProjection.toFixed(2)}
          </Typography>
        </Box>
      </Box>
      
      <Divider sx={{ my: 1 }} />
      
      <Box sx={{ flexGrow: 1, p: 2, height: 400 }}>
        {chartType === 'line' && (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={monthlyData}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <defs>
                <linearGradient id="colorSolar" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS['solar-node']} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={COLORS['solar-node']} stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorEV" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS['ev-charger']} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={COLORS['ev-charger']} stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorHelium" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS['helium-miner']} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={COLORS['helium-miner']} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(160, 174, 192, 0.2)" />
              <XAxis 
                dataKey="name" 
                tick={{ fill: '#a0aec0' }}
                axisLine={{ stroke: 'rgba(160, 174, 192, 0.3)' }}
              />
              <YAxis 
                tick={{ fill: '#a0aec0' }}
                axisLine={{ stroke: 'rgba(160, 174, 192, 0.3)' }}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="solar" 
                stroke={COLORS['solar-node']} 
                strokeWidth={3}
                dot={false}
                name="Solar Nodes"
                activeDot={{ r: 8 }}
              />
              <Line 
                type="monotone" 
                dataKey="ev" 
                stroke={COLORS['ev-charger']} 
                strokeWidth={3}
                dot={false}
                name="EV Chargers"
                activeDot={{ r: 8 }}
              />
              <Line 
                type="monotone" 
                dataKey="helium" 
                stroke={COLORS['helium-miner']} 
                strokeWidth={3}
                dot={false}
                name="Helium Miners"
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
        
        {chartType === 'area' && (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={monthlyData}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <defs>
                <linearGradient id="colorSolar" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS['solar-node']} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={COLORS['solar-node']} stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="colorEV" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS['ev-charger']} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={COLORS['ev-charger']} stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="colorHelium" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS['helium-miner']} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={COLORS['helium-miner']} stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(160, 174, 192, 0.1)" />
              <XAxis 
                dataKey="name" 
                tick={{ fill: '#a0aec0' }}
                axisLine={{ stroke: 'rgba(160, 174, 192, 0.2)' }}
              />
              <YAxis 
                tick={{ fill: '#a0aec0' }}
                axisLine={{ stroke: 'rgba(160, 174, 192, 0.2)' }}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="solar" 
                stackId="1"
                stroke={COLORS['solar-node']} 
                fill="url(#colorSolar)" 
                name="Solar Nodes"
                activeDot={{ r: 8 }}
              />
              <Area 
                type="monotone" 
                dataKey="ev" 
                stackId="1"
                stroke={COLORS['ev-charger']} 
                fill="url(#colorEV)" 
                name="EV Chargers"
                activeDot={{ r: 8 }}
              />
              <Area 
                type="monotone" 
                dataKey="helium" 
                stackId="1"
                stroke={COLORS['helium-miner']} 
                fill="url(#colorHelium)" 
                name="Helium Miners"
                activeDot={{ r: 8 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
        
        {chartType === 'pie' && (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={formattedData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={120}
                fill="#8884d8"
                dataKey="revenue"
              >
                {formattedData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomPieTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </Box>
    </Card>
  );
} 