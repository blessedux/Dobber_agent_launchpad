"use client"

import React, { useState, useRef, useEffect } from 'react';
import { 
  Card, 
  CardHeader, 
  Typography, 
  Box, 
  Button, 
  ButtonGroup, 
  Divider, 
  useTheme,
  ToggleButtonGroup,
  ToggleButton,
  Chip
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
import { TrendingUp, PieChart as PieChartIcon, BarChart2, LineChart as LineChartIcon, Activity, Clock } from 'lucide-react';

// Define types
type DeviceType = 'solar-node' | 'ev-charger' | 'helium-miner' | 'compute-node';
type MetricType = 'revenue' | 'uptime';

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
  // Uptime data (percentage)
  solarUptime: number;
  evUptime: number;
  heliumUptime: number;
  avgUptime: number;
  // Earnings per device
  solarEarnings: number;
  evEarnings: number;
  heliumEarnings: number;
  // Device counts
  solarCount: number;
  evCount: number;
  heliumCount: number;
}

interface RevenueDistributionChartProps {
  data: DeviceRevenue[];
  totalRevenue: number;
  weeklyGrowth: string;
  monthlyProjection: number;
}

// COLORS
const COLORS = {
  'solar-node': '#8b5cf6',  // violet/purple
  'ev-charger': '#a78bfa',  // medium purple
  'helium-miner': '#c4b5fd', // light purple
  'compute-node': '#6b46fe', // bright purple
};

// Custom tooltip for charts
const CustomTooltip = ({ active, payload, label, metricType }: any) => {
  if (active && payload && payload.length) {
    return (
      <Box sx={{ 
        bgcolor: 'background.paper', 
        p: 2, 
        boxShadow: 2, 
        borderRadius: 1,
        minWidth: '220px',
        zIndex: 9999 // Ensure tooltip is above other elements
      }}>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>{label}</Typography>
        
        <Divider sx={{ my: 1 }} />
        
        {payload.map((entry: any, index: number) => {
          const deviceKey = entry.dataKey;
          const deviceName = entry.name;
          const value = entry.value;
          
          // Extract additional data from payload
          const deviceCount = entry.payload[`${deviceKey}Count`] || 1;
          const earnings = entry.payload[`${deviceKey}Earnings`];
          
          return (
            <Box 
              key={`tooltip-${index}`} 
              sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                mt: 1,
                p: 1,
                borderRadius: 1,
                bgcolor: `${entry.color}10`
              }}
            >
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  mb: 0.5
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
                  <Typography variant="body2" fontWeight="bold">{deviceName}</Typography>
                </Box>
                <Chip 
                  label={`${deviceCount} ${deviceCount === 1 ? 'device' : 'devices'}`} 
                  size="small" 
                  sx={{ 
                    fontSize: '0.65rem', 
                    height: '18px',
                    bgcolor: `${entry.color}20`,
                    color: `${entry.color}`
                  }} 
                />
              </Box>
              
              <Box sx={{ mt: 0.5 }}>
                {metricType === 'revenue' ? (
                  <>
                    <Typography variant="body2" color="text.secondary">
                      Revenue: <strong>${value.toFixed(2)}</strong>
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Per device: <strong>${earnings.toFixed(2)}</strong>
                    </Typography>
                  </>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    Uptime: <strong>{value.toFixed(1)}%</strong>
                  </Typography>
                )}
              </Box>
            </Box>
          );
        })}
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
  const [chartType, setChartType] = useState<'area' | 'pie'>('area');
  const [metricType, setMetricType] = useState<MetricType>('revenue');
  const [chartsRendered, setChartsRendered] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Animation ref for tracking if first load animation has played
  const [animatedOnce, setAnimatedOnce] = useState(false);
  
  // Apply visibility fixes to charts after they're rendered
  useEffect(() => {
    const timer = setTimeout(() => {
      if (containerRef.current) {
        // Force visibility of chart elements
        const chartElements = containerRef.current.querySelectorAll('.recharts-surface, .recharts-wrapper, .recharts-line, .recharts-area');
        chartElements.forEach((el) => {
          (el as HTMLElement).style.visibility = 'visible';
          (el as HTMLElement).style.opacity = '1';
          (el as HTMLElement).style.zIndex = '100';
        });
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, [chartType, metricType]);
  
  // Check if charts are rendered after a short delay
  useEffect(() => {
    const timer = setTimeout(() => {
      if (containerRef.current) {
        const chartElements = containerRef.current.querySelectorAll('.recharts-surface');
        if (chartElements.length === 0) {
          setChartsRendered(false);
        } else {
          setChartsRendered(true);
        }
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, [chartType]);

  // Add animation when component mounts
  useEffect(() => {
    if (!animatedOnce) {
      // Find all chart elements to animate
      const timer = setTimeout(() => {
        const chartElements = containerRef.current?.querySelectorAll('.recharts-layer');
        if (chartElements && chartElements.length) {
          chartElements.forEach((el, index) => {
            // Stagger the animations
            const delay = index * 100;
            
            // Apply animation with CSS
            el.animate(
              [
                { opacity: 0, transform: 'translateY(20px)' },
                { opacity: 1, transform: 'translateY(0)' }
              ],
              {
                duration: 600,
                delay: delay,
                easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                fill: 'forwards'
              }
            );
          });
          
          // Specifically animate the pie chart if it's visible
          if (chartType === 'pie') {
            const pieSegments = containerRef.current?.querySelectorAll('.recharts-pie-sector');
            pieSegments?.forEach((segment, i) => {
              segment.style.transformOrigin = 'center';
              segment.animate(
                [
                  { opacity: 0, transform: 'scale(0)' },
                  { opacity: 1, transform: 'scale(1)' }
                ],
                {
                  duration: 800,
                  delay: i * 150,
                  easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
                  fill: 'forwards'
                }
              );
            });
          }
          
          // Mark as animated
          setAnimatedOnce(true);
        }
      }, 300); // Delay to ensure chart is rendered
      
      return () => clearTimeout(timer);
    }
  }, [chartType, animatedOnce]);

  // Format data for pie chart
  const formattedData = data.map(item => ({
    ...item,
    color: COLORS[item.type] || '#9ca3af',
  }));

  // Handle metric toggle
  const handleMetricChange = (event: React.MouseEvent<HTMLElement>, newMetric: MetricType | null) => {
    if (newMetric !== null) {
      setMetricType(newMetric);
    }
  };

  // Generate monthly data for the year
  const generateMonthlyData = (): MonthlyData[] => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    return months.map((month, idx) => {
      // Base values that grow each month (ensures total earnings always increase)
      const solarBase = 400 + (idx * 50); // Strong growth
      const evBase = 300 + (idx * 35);    // Moderate growth
      const heliumBase = 200 + (idx * 25); // Slower growth
      
      // Add some monthly variation to show different growth rates
      // but keep it small enough to ensure the trend is always upward
      const solarVariation = 20 * Math.sin((idx / 11) * Math.PI * 2);
      const evVariation = 15 * Math.cos((idx / 11) * Math.PI * 2 + 1);
      const heliumVariation = 10 * Math.sin((idx / 11) * Math.PI * 2 + 2);
      
      // Combine base and variation to get final monthly values
      const solarValue = Math.max(400, solarBase + solarVariation);
      const evValue = Math.max(300, evBase + evVariation);
      const heliumValue = Math.max(200, heliumBase + heliumVariation);
      
      // Device counts
      const solarCount = 5;
      const evCount = 3;
      const heliumCount = 2;
      
      // Calculate per-device earnings
      const solarEarnings = solarValue / solarCount;
      const evEarnings = evValue / evCount;
      const heliumEarnings = heliumValue / heliumCount;
      
      // Create different patterns for uptime (percentages)
      const solarUptime = 99 - (Math.sin(idx / 12 * Math.PI) * 2);
      const evUptime = 98 - (Math.cos((idx + 1) / 12 * Math.PI) * 3);
      const heliumUptime = 96 - (Math.sin((idx + 2) / 12 * Math.PI) * 5);
      const avgUptime = (solarUptime + evUptime + heliumUptime) / 3;
      
      return {
        name: month,
        month,
        // Revenue data - ensures always growing trend
        solar: solarValue,
        ev: evValue,
        helium: heliumValue,
        total: solarValue + evValue + heliumValue,
        // Device counts
        solarCount,
        evCount, 
        heliumCount,
        // Earnings per device
        solarEarnings,
        evEarnings,
        heliumEarnings,
        // Uptime data
        solarUptime,
        evUptime,
        heliumUptime,
        avgUptime
      };
    });
  };

  const monthlyData = generateMonthlyData();

  // Set up colors and device types for charts
  const colors = [COLORS['solar-node'], COLORS['ev-charger'], COLORS['helium-miner']];
  const deviceTypes = [
    { type: 'solar', label: 'Solar Nodes' },
    { type: 'ev', label: 'EV Chargers' },
    { type: 'helium', label: 'Helium Miners' }
  ];

  // Linear gradients for charts
  const areaChartGradients = (
    <>
      <linearGradient id="colorArea0" x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor={colors[0]} stopOpacity={0.8}/>
        <stop offset="95%" stopColor={colors[0]} stopOpacity={0.2}/>
      </linearGradient>
      <linearGradient id="colorArea1" x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor={colors[1]} stopOpacity={0.8}/>
        <stop offset="95%" stopColor={colors[1]} stopOpacity={0.2}/>
      </linearGradient>
      <linearGradient id="colorArea2" x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor={colors[2]} stopOpacity={0.8}/>
        <stop offset="95%" stopColor={colors[2]} stopOpacity={0.2}/>
      </linearGradient>
    </>
  );

  // Function to format data for pie chart
  const formatDataForPieChart = (data: any[], metricType: MetricType) => {
    if (metricType === 'revenue') {
      return data;
    } else {
      return [
        { name: 'Solar Nodes', value: 99.1, percentage: 34, color: colors[0] },
        { name: 'EV Chargers', value: 97.8, percentage: 33, color: colors[1] },
        { name: 'Helium Miners', value: 92.3, percentage: 33, color: colors[2] }
      ];
    }
  };

  // Custom pie chart label renderer
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);
    
    return (
      <text 
        x={x} 
        y={y} 
        fill="#fff" 
        textAnchor="middle" 
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  // Get the appropriate title based on metric
  const getMetricTitle = () => {
    if (metricType === 'revenue') {
      return 'Cumulative Earnings';
    } else {
      return 'Device Uptime';
    }
  };

  // Get appropriate y-axis labels based on metric
  const getYAxisLabel = (value: number) => {
    if (metricType === 'revenue') {
      return `$${value}`;
    } else {
      return `${value}%`;
    }
  };

  // Simple fallback SVG chart
  const renderFallbackChart = () => {
    if (chartType === 'area') {
      return (
        <svg width="100%" height="100%" viewBox="0 0 800 400" style={{ minHeight: 400 }}>
          <rect x="0" y="0" width="800" height="400" fill="#1e2030" />
          <text x="400" y="30" textAnchor="middle" fill="#a0aec0" fontSize="16">
            {metricType === 'revenue' ? 'Revenue Chart' : 'Uptime Chart'}
          </text>
          
          {/* X-axis */}
          <line x1="50" y1="350" x2="750" y2="350" stroke="#a0aec0" strokeWidth="2" />
          <text x="400" y="380" textAnchor="middle" fill="#a0aec0">Months (Jan-Dec)</text>
          
          {/* Y-axis */}
          <line x1="50" y1="50" x2="50" y2="350" stroke="#a0aec0" strokeWidth="2" />
          <text x="30" y="200" textAnchor="middle" fill="#a0aec0" transform="rotate(-90, 30, 200)">
            {metricType === 'revenue' ? 'Revenue ($)' : 'Uptime (%)'}
          </text>
          
          {/* Area charts for stacked view */}
          <path 
            fill={COLORS['helium-miner']} 
            fillOpacity="0.7"
            d="
              M50,350
              L50,300
              L110,290
              L170,280
              L230,290
              L290,285
              L350,270
              L410,275
              L470,260
              L530,270
              L590,260
              L650,250
              L710,240
              L750,230
              L750,350
              Z
            "
          />
          
          <path 
            fill={COLORS['ev-charger']} 
            fillOpacity="0.7"
            d="
              M50,300
              L50,280
              L110,260
              L170,240
              L230,250
              L290,240
              L350,220
              L410,230
              L470,210
              L530,200
              L590,210
              L650,200
              L710,180
              L750,170
              L750,230
              L710,240
              L650,250
              L590,260
              L530,270
              L470,260
              L410,275
              L350,270
              L290,285
              L230,290
              L170,280
              L110,290
              Z
            "
          />
          
          <path 
            fill={COLORS['solar-node']} 
            fillOpacity="0.7"
            d="
              M50,280
              L50,250
              L110,200
              L170,180
              L230,150
              L290,170
              L350,160
              L410,140
              L470,120
              L530,140
              L590,160
              L650,140
              L710,120
              L750,100
              L750,170
              L710,180
              L650,200
              L590,210
              L530,200
              L470,210
              L410,230
              L350,220
              L290,240
              L230,250
              L170,240
              L110,260
              Z
            "
          />
          
          {/* Legend */}
          <rect x="600" y="50" width="15" height="15" fill={COLORS['solar-node']} />
          <text x="625" y="62" fill="#a0aec0" fontSize="12">Solar Nodes</text>
          
          <rect x="600" y="75" width="15" height="15" fill={COLORS['ev-charger']} />
          <text x="625" y="87" fill="#a0aec0" fontSize="12">EV Chargers</text>
          
          <rect x="600" y="100" width="15" height="15" fill={COLORS['helium-miner']} />
          <text x="625" y="112" fill="#a0aec0" fontSize="12">Helium Miners</text>
        </svg>
      );
    }
    return null;
  };

  // Set up chart rendering logic based on chart type
  let chartToRender = null;
  
  // Only render area chart when chartType is 'area' and metric is selected
  if (chartType === 'area' && metricType) {
    chartToRender = (
      <ResponsiveContainer width="100%" height={450}>
        <AreaChart 
          data={monthlyData} 
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          style={{ zIndex: 100, visibility: 'visible', overflow: 'visible' }}
          width={600}
          height={400}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis 
            dataKey="month" 
            stroke="#94a3b8"
            tick={{ fill: '#94a3b8' }}
          />
          <YAxis 
            stroke="#94a3b8"
            tick={{ fill: '#94a3b8' }}
            tickFormatter={(value) => metricType === 'revenue' ? `$${value}` : `${value}%`}
          />
          <Tooltip content={<CustomTooltip metricType={metricType} />} />
          <Legend />
          <defs>
            {areaChartGradients}
          </defs>
          {deviceTypes.map((device, index) => (
            <Area
              key={device.type}
              type="monotone"
              dataKey={metricType === 'revenue' ? device.type : `${device.type}Uptime`}
              name={device.label}
              stroke={colors[index]}
              fillOpacity={0.8}
              fill={`url(#colorArea${index})`}
              stackId="1"
              style={{ visibility: 'visible', opacity: 1, zIndex: 100 }}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    );
  }
  // Only render pie chart when chartType is 'pie' and metric is selected
  else if (chartType === 'pie' && metricType) {
    const data = formatDataForPieChart(formattedData, metricType);
    chartToRender = (
      <ResponsiveContainer width="100%" height={450}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={180}
            fill="#8884d8"
            dataKey="value"
            nameKey="name"
            label={renderCustomizedLabel}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color || colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomPieTooltip />} />
          <Legend 
            layout="vertical" 
            verticalAlign="middle" 
            align="right"
            formatter={(value, entry, index) => (
              <span style={{ color: '#94a3b8' }}>{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    );
  }

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
            <Typography variant="h6">{getMetricTitle()}</Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <ToggleButtonGroup
                value={metricType}
                exclusive
                onChange={handleMetricChange}
                size="small"
                sx={{ mr: 2 }}
              >
                <ToggleButton 
                  value="revenue" 
                  sx={{ 
                    px: 1.5,
                    borderColor: COLORS['compute-node'],
                    color: metricType === 'revenue' ? 'white' : COLORS['compute-node'],
                    bgcolor: metricType === 'revenue' ? COLORS['compute-node'] : 'transparent',
                    '&:hover': {
                      bgcolor: metricType === 'revenue' 
                        ? `${COLORS['compute-node']}e0` 
                        : `${COLORS['compute-node']}20`
                    }
                  }}
                >
                  <Activity size={16} className="mr-1" /> Revenue
                </ToggleButton>
                <ToggleButton 
                  value="uptime" 
                  sx={{ 
                    px: 1.5,
                    borderColor: COLORS['compute-node'],
                    color: metricType === 'uptime' ? 'white' : COLORS['compute-node'],
                    bgcolor: metricType === 'uptime' ? COLORS['compute-node'] : 'transparent',
                    '&:hover': {
                      bgcolor: metricType === 'uptime' 
                        ? `${COLORS['compute-node']}e0` 
                        : `${COLORS['compute-node']}20`
                    }
                  }}
                >
                  <Clock size={16} className="mr-1" /> Uptime
                </ToggleButton>
              </ToggleButtonGroup>
              
              <ButtonGroup size="small" variant="outlined">
                <Button 
                  startIcon={<BarChart2 size={16} />}
                  onClick={() => setChartType('area')}
                  variant={chartType === 'area' ? 'contained' : 'outlined'}
                  sx={{ 
                    bgcolor: chartType === 'area' ? 'primary.main' : 'transparent',
                    borderColor: 'primary.main',
                    '&:hover': {
                      bgcolor: chartType === 'area' ? 'primary.dark' : 'rgba(67, 24, 255, 0.1)',
                    },
                    zIndex: 20
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
                    },
                    zIndex: 20
                  }}
                >
                  Pie
                </Button>
              </ButtonGroup>
            </Box>
          </Box>
        }
      />
      
      <Box sx={{ display: 'flex', p: 2, justifyContent: 'space-between' }}>
        {metricType === 'revenue' ? (
          <>
            <Box sx={{ p: 2, borderRadius: 2, bgcolor: 'rgba(67, 24, 255, 0.1)', width: '30%' }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Total Earnings (All Time)
              </Typography>
              <Typography variant="h4" color="primary.main" sx={{ fontWeight: 'bold' }}>
                ${totalRevenue.toFixed(2)}
              </Typography>
            </Box>
            
            <Box sx={{ p: 2, borderRadius: 2, bgcolor: 'rgba(159, 122, 234, 0.1)', width: '30%' }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Weekly Growth Rate
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="h4" color="#9f7aea" sx={{ fontWeight: 'bold' }}>
                  {weeklyGrowth}%
                </Typography>
                <TrendingUp size={20} color="#9f7aea" style={{ marginLeft: '8px' }} />
              </Box>
            </Box>
            
            <Box sx={{ p: 2, borderRadius: 2, bgcolor: 'rgba(67, 24, 255, 0.05)', width: '30%' }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                30-Day Projection
              </Typography>
              <Typography variant="h4" color="primary.main" sx={{ fontWeight: 'bold' }}>
                ${monthlyProjection.toFixed(2)}
              </Typography>
            </Box>
          </>
        ) : (
          <>
            <Box sx={{ p: 2, borderRadius: 2, bgcolor: 'rgba(67, 24, 255, 0.1)', width: '30%' }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Average Uptime
              </Typography>
              <Typography variant="h4" color="primary.main" sx={{ fontWeight: 'bold' }}>
                98.2%
              </Typography>
            </Box>
            
            <Box sx={{ p: 2, borderRadius: 2, bgcolor: 'rgba(245, 158, 11, 0.1)', width: '30%' }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Best Performing
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="h4" color={COLORS['solar-node']} sx={{ fontWeight: 'bold' }}>
                  Solar Nodes
                </Typography>
                <span style={{ color: COLORS['solar-node'], marginLeft: '8px', fontWeight: 'bold' }}>99.1%</span>
              </Box>
            </Box>
            
            <Box sx={{ p: 2, borderRadius: 2, bgcolor: 'rgba(139, 92, 246, 0.1)', width: '30%' }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Needs Attention
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="h4" color={COLORS['helium-miner']} sx={{ fontWeight: 'bold', fontSize: '1.5rem' }}>
                  Helium Miners
                </Typography>
                <span style={{ color: COLORS['helium-miner'], marginLeft: '8px', fontWeight: 'bold' }}>92.3%</span>
              </Box>
            </Box>
          </>
        )}
      </Box>
      
      <Divider sx={{ my: 1 }} />
      
      {/* Increased height for better visibility */}
      <Box 
        ref={containerRef}
        sx={{ 
          flexGrow: 1, 
          p: 2, 
          height: 500, 
          position: 'relative',
          '& .recharts-wrapper': {
            visibility: 'visible !important',
            opacity: '1 !important',
            zIndex: 10
          },
          '& .recharts-surface': {
            visibility: 'visible !important',
            opacity: '1 !important'
          },
          '& .recharts-line': {
            visibility: 'visible !important',
            opacity: '1 !important'
          },
          '& .recharts-line-curve': {
            visibility: 'visible !important',
            opacity: '1 !important'
          },
          '& .recharts-area': {
            visibility: 'visible !important',
            opacity: '1 !important'
          },
          '& .recharts-area-curve': {
            visibility: 'visible !important',
            opacity: '1 !important'
          },
          '& .recharts-layer': {
            visibility: 'visible !important',
            opacity: '1 !important'
          },
          '& .recharts-tooltip-wrapper': {
            zIndex: 1000
          },
          '& .recharts-default-tooltip': {
            backgroundColor: '#1e2030 !important',
            borderColor: '#94a3b8 !important'
          },
          '& .recharts-cartesian-axis-tick': {
            visibility: 'visible !important'
          }
        }}
      >
        {chartToRender ? (
          <div 
            className="w-full h-[450px] bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 shadow-sm" 
            style={{
              position: 'relative',
              zIndex: 5
            }}
          >
            {chartToRender}
          </div>
        ) : (
          <div className="w-full h-[450px] bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 shadow-sm flex items-center justify-center">
            <p className="text-slate-500 dark:text-slate-400">Select a metric and chart type to view data</p>
          </div>
        )}
      </Box>
    </Card>
  );
} 