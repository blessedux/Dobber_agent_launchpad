"use client"

import { Suspense, useEffect, useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useSearchParams } from "next/navigation"
import AgentCard from "@/components/agent-card"
import EarningsWidget from "@/components/earnings-widget"
import DecisionLogViewer from "@/components/decision-log-viewer"
import DeviceHealthPanel from "@/components/device-health-panel"
import EmptyDashboard from "@/components/empty-dashboard"
import LoadingSpinner from "@/components/loading-spinner"
import { Plus, ArrowRight, BarChart2, Clock, ActivitySquare, Network, Sun, Plug, Radio, PieChart, DollarSign, Activity } from "lucide-react"
import { LineChart as LineChartIcon } from "lucide-react"
import { TransitionLink } from "@/components/ui/transition-link"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle2 } from "lucide-react"
import RevenueDistributionChart from "@/components/charts/RevenueDistributionChart"
import FallbackChart from "@/components/charts/FallbackChart"
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import useLiveDashboardData from "@/hooks/useLiveDashboardData"
import EcosystemAgentCard from "@/components/charts/EcosystemAgentCard"
import { motion } from "framer-motion"

// Define types for live data
interface DeviceTypeData {
  name: string;
  type: string;
  revenue: number;
  percentage: number;
  color: string;
  uptime?: string;
}

interface AgentActivity {
  agent: string;
  action: string;
  timestamp: string;
  revenue: string;
}

interface LiveData {
  totalEarnings: string;
  weeklyGrowth: string;
  monthlyProjection: string;
  deviceTypes: DeviceTypeData[];
  revenueHistory: any[];
  agentActivity: AgentActivity[];
  devices: any[];
}

// Define types
type AgentDeviceType = 'solar-node' | 'ev-charger' | 'helium-miner' | 'compute-node';

// This is a mock to simulate a new user with no agents
const userHasAgents = true

export default function Dashboard() {
  const searchParams = useSearchParams() || null;
  const [showSuccess, setShowSuccess] = useState(false)
  const [selectedTab, setSelectedTab] = useState("analytics")
  const [agents, setAgents] = useState([
    {
      name: "SolarOptimizer",
      deviceType: "solar-node" as AgentDeviceType,
      status: "online",
      revenue: "342.87",
      actions: 15
    },
    {
      name: "ChargeMaster",
      deviceType: "ev-charger" as AgentDeviceType,
      status: "online",
      revenue: "128.34",
      actions: 8
    },
    {
      name: "NetGuard",
      deviceType: "helium-miner" as AgentDeviceType,
      status: "warning",
      revenue: "72.19",
      actions: 4,
      alert: "Connection intermittent"
    }
  ])
  const [showFallbackChart, setShowFallbackChart] = useState(false);
  const chartCanvasRef = useRef<HTMLCanvasElement>(null);
  const [chartMetric, setChartMetric] = useState<'revenue' | 'uptime'>('revenue');
  const [chartType, setChartType] = useState<'area' | 'pie'>('area');
  
  // Fetch live dashboard data with type annotation
  const { data: liveData, loading, error } = useLiveDashboardData(5000) as { 
    data: LiveData | null; 
    loading: boolean; 
    error: string | null 
  };
  
  useEffect(() => {
    // Check if agent was just created
    if (searchParams && searchParams.get('agentCreated') === 'true') {
      setShowSuccess(true)
      // Don't change the selected tab when agent is created
      // setSelectedTab("agents") // Ensure "agents" tab is selected
      
      // Get the agent data from URL parameters
      const agentName = searchParams.get('name') || generateAgentName()
      const deviceType = searchParams.get('type') || "compute-node"
      const agentDescription = searchParams.get('desc') || ""
      
      // Create the new agent with actual data
      const newAgent = {
        name: agentName,
        deviceType: deviceType as AgentDeviceType,
        status: "online",
        revenue: "0.00",
        actions: 0,
        description: agentDescription
      }
      
      // Add the new agent to the list
      setAgents(prev => [newAgent, ...prev])
      
      // Hide the success message after 5 seconds
      const timer = setTimeout(() => {
        setShowSuccess(false)
      }, 5000)
      
      return () => clearTimeout(timer)
    }
  }, [searchParams])

  // Generate a random agent name as fallback
  const generateAgentName = () => {
    const nameOptions = ["EnergyBot", "PowerGuardian", "NodeWatcher", "ResourceMaster", "FlowKeeper", "GridSentry"]
    return nameOptions[Math.floor(Math.random() * nameOptions.length)]
  }

  // Calculate total revenue for display
  const calculateTotalRevenue = () => {
    return agents.reduce((sum, agent) => sum + parseFloat(agent.revenue), 0).toFixed(2)
  }

  // Prepare revenue data for the chart
  const revenueData = [
    {
      name: "Solar Nodes",
      type: "solar-node" as AgentDeviceType,
      revenue: 645.20,
      percentage: 48,
      color: '#8b5cf6'  // violet/purple
    },
    {
      name: "EV Chargers",
      type: "ev-charger" as AgentDeviceType,
      revenue: 413.65,
      percentage: 31,
      color: '#a78bfa'  // medium purple
    },
    {
      name: "Helium Miners",
      type: "helium-miner" as AgentDeviceType,
      revenue: 284.34,
      percentage: 21,
      color: '#c4b5fd'  // light purple
    }
  ];

  // Create Material UI theme
  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: '#6b46fe',
      },
      secondary: {
        main: '#10b981',
      },
      background: {
        paper: '#1e2030',
        default: '#131525',
      },
      text: {
        primary: '#e2e8f0',
        secondary: '#94a3b8',
      },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            '& .recharts-surface': {
              overflow: 'visible',
            },
          },
        },
      },
    },
  });

  // Check if charts have rendered after a short delay
  useEffect(() => {
    const timer = setTimeout(() => {
      const chartElements = document.querySelectorAll('.recharts-surface');
      if (chartElements.length === 0) {
        setShowFallbackChart(true);
      } else {
        setShowFallbackChart(false);
      }
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [selectedTab]);

  // Use live data for cards if available, otherwise use static data
  const totalRevenue = liveData ? parseFloat(liveData.totalEarnings) : parseFloat(calculateTotalRevenue());
  const weeklyGrowth = liveData ? liveData.weeklyGrowth : "14.8";
  const monthlyProjection = liveData ? parseFloat(liveData.monthlyProjection) : parseFloat(calculateTotalRevenue()) * 4.3;
  
  // Use live device types data if available
  const deviceTypesData = liveData?.deviceTypes || revenueData;
  
  // Draw chart when component mounts, window resizes, or chart type changes, or when live data updates
  useEffect(() => {
    if (liveData || !loading) {
      drawChart();
    }
    
    const handleResize = () => {
      drawChart();
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [chartType, chartMetric, liveData]);
  
  // Function to draw chart directly using canvas API with live data
  const drawChart = () => {
    if (!chartCanvasRef.current) return;
    
    const canvas = chartCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Chart margins
    const margin = {
      top: 50,
      right: 100,
      bottom: 50,
      left: 80
    };
    
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;
    
    // Background
    ctx.fillStyle = '#1e2030';
    ctx.fillRect(0, 0, width, height);
    
    // Draw chart title
    ctx.fillStyle = '#e2e8f0';
    ctx.font = 'bold 18px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(chartMetric === 'revenue' ? 'Revenue Distribution by Device Type' : 'Device Uptime Percentage', width / 2, 30);
    
    // Draw axes
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2;
    
    // X-axis
    ctx.beginPath();
    ctx.moveTo(margin.left, height - margin.bottom);
    ctx.lineTo(width - margin.right, height - margin.bottom);
    ctx.stroke();
    
    // Y-axis
    ctx.beginPath();
    ctx.moveTo(margin.left, margin.top);
    ctx.lineTo(margin.left, height - margin.bottom);
    ctx.stroke();
    
    // Month labels
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const xStep = chartWidth / (months.length - 1);
    
    ctx.fillStyle = '#94a3b8';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    
    months.forEach((month, i) => {
      const x = margin.left + i * xStep;
      ctx.fillText(month, x, height - margin.bottom + 20);
    });
    
    // Y-axis label and ticks
    ctx.save();
    ctx.translate(20, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = 'center';
    ctx.fillStyle = '#94a3b8';
    ctx.font = '14px sans-serif';
    ctx.fillText(chartMetric === 'revenue' ? 'Revenue ($)' : 'Uptime (%)', 0, 0);
    ctx.restore();
    
    // Add ticks and values on y-axis
    if (chartMetric === 'revenue') {
      const maxValue = 1200; // Increased to accommodate growing revenue
      const yStep = chartHeight / 4;
      
      for (let i = 0; i <= 4; i++) {
        const y = height - margin.bottom - i * yStep;
        const value = (i * maxValue / 4).toFixed(0);
        
        // Tick mark
        ctx.beginPath();
        ctx.moveTo(margin.left - 5, y);
        ctx.lineTo(margin.left, y);
        ctx.stroke();
        
        // Value
        ctx.fillStyle = '#94a3b8';
        ctx.textAlign = 'right';
        ctx.font = '12px sans-serif';
        ctx.fillText(`$${value}`, margin.left - 10, y + 4);
        
        // Grid line
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.2)';
        ctx.beginPath();
        ctx.moveTo(margin.left, y);
        ctx.lineTo(width - margin.right, y);
        ctx.stroke();
        ctx.strokeStyle = '#94a3b8';
      }
    } else {
      // Uptime percentages (80-100%)
      const maxValue = 100;
      const minValue = 80;
      const range = maxValue - minValue;
      const yStep = chartHeight / 4;
      
      for (let i = 0; i <= 4; i++) {
        const y = height - margin.bottom - i * yStep;
        const value = (minValue + (i * range / 4)).toFixed(0);
        
        // Tick mark
        ctx.beginPath();
        ctx.moveTo(margin.left - 5, y);
        ctx.lineTo(margin.left, y);
        ctx.stroke();
        
        // Value
        ctx.fillStyle = '#94a3b8';
        ctx.textAlign = 'right';
        ctx.font = '12px sans-serif';
        ctx.fillText(`${value}%`, margin.left - 10, y + 4);
        
        // Grid line
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.2)';
        ctx.beginPath();
        ctx.moveTo(margin.left, y);
        ctx.lineTo(width - margin.right, y);
        ctx.stroke();
        ctx.strokeStyle = '#94a3b8';
      }
    }
    
    // Use live data for chart if available
    const historyData = liveData?.revenueHistory || [];
    
    // Generate data points for each device type
    // Using trends that ensure cumulative growth for revenue
    const solarPoints = [];
    const evPoints = [];
    const heliumPoints = [];
    
    for (let i = 0; i < months.length; i++) {
      const x = margin.left + i * xStep;
      
      if (chartMetric === 'revenue') {
        // Generate base values that always increase with time but at variable rates
        // Solar data with steady, strong growth
        const solarValueBase = 300 + (i * 30);
        // Add some monthly variation but ensure overall upward trend
        const solarVariation = 50 * Math.sin(i / 11 * Math.PI * 2);
        const solarValue = solarValueBase + solarVariation;
        const solarY = height - margin.bottom - (solarValue / 1200) * chartHeight;
        solarPoints.push({ x, y: solarY, value: solarValue });
        
        // EV data with moderate growth
        const evValueBase = 200 + (i * 20);
        const evVariation = 40 * Math.cos(i / 11 * Math.PI * 2 + 1);
        const evValue = evValueBase + evVariation;
        const evY = height - margin.bottom - (evValue / 1200) * chartHeight;
        evPoints.push({ x, y: evY, value: evValue });
        
        // Helium data with slower growth
        const heliumValueBase = 100 + (i * 15);
        const heliumVariation = 30 * Math.sin(i / 11 * Math.PI * 2 + 2);
        const heliumValue = heliumValueBase + heliumVariation;
        const heliumY = height - margin.bottom - (heliumValue / 1200) * chartHeight;
        heliumPoints.push({ x, y: heliumY, value: heliumValue });
      } else {
        // Uptime percentages (80-100% range)
        const scale = chartHeight / 20; // Scale for the 80-100% range
        
        // Solar uptime (high)
        const solarValue = 99 - Math.sin(i / 12 * Math.PI) * 1.5;
        const solarY = height - margin.bottom - ((solarValue - 80) * scale);
        solarPoints.push({ x, y: solarY, value: solarValue });
        
        // EV uptime (medium)
        const evValue = 97 - Math.cos((i + 1) / 12 * Math.PI) * 2;
        const evY = height - margin.bottom - ((evValue - 80) * scale);
        evPoints.push({ x, y: evY, value: evValue });
        
        // Helium uptime (lower)
        const heliumValue = 92 - Math.sin((i + 2) / 12 * Math.PI) * 4;
        const heliumY = height - margin.bottom - ((heliumValue - 80) * scale);
        heliumPoints.push({ x, y: heliumY, value: heliumValue });
      }
    }
    
    // Define device colors
    const solarColor = '#8b5cf6';  // violet/purple
    const evColor = '#a78bfa';     // medium purple
    const heliumColor = '#c4b5fd'; // light purple
    
    if (chartType === 'area') {
      // For area charts
      // Draw Helium area (bottom)
      ctx.fillStyle = heliumColor;
      ctx.globalAlpha = 0.6;
      ctx.beginPath();
      ctx.moveTo(margin.left, height - margin.bottom);
      heliumPoints.forEach(point => {
        ctx.lineTo(point.x, point.y);
      });
      ctx.lineTo(width - margin.right, height - margin.bottom);
      ctx.closePath();
      ctx.fill();
      
      // Draw EV area (middle)
      ctx.fillStyle = evColor;
      ctx.globalAlpha = 0.6;
      ctx.beginPath();
      ctx.moveTo(margin.left, heliumPoints[0].y);
      evPoints.forEach((point, i) => {
        ctx.lineTo(point.x, point.y);
      });
      ctx.lineTo(width - margin.right, heliumPoints[heliumPoints.length - 1].y);
      
      // Connect back through helium points in reverse
      for (let i = heliumPoints.length - 1; i >= 0; i--) {
        ctx.lineTo(heliumPoints[i].x, heliumPoints[i].y);
      }
      
      ctx.closePath();
      ctx.fill();
      
      // Draw Solar area (top)
      ctx.fillStyle = solarColor;
      ctx.globalAlpha = 0.6;
      ctx.beginPath();
      ctx.moveTo(margin.left, evPoints[0].y);
      solarPoints.forEach((point, i) => {
        ctx.lineTo(point.x, point.y);
      });
      ctx.lineTo(width - margin.right, evPoints[evPoints.length - 1].y);
      
      // Connect back through EV points in reverse
      for (let i = evPoints.length - 1; i >= 0; i--) {
        ctx.lineTo(evPoints[i].x, evPoints[i].y);
      }
      
      ctx.closePath();
      ctx.fill();
      
      // Reset alpha
      ctx.globalAlpha = 1.0;
    }
    // Pie chart
    else if (chartType === 'pie') {
      // Draw simple pie chart
      const centerX = width / 2;
      const centerY = height / 2;
      const radius = Math.min(chartWidth, chartHeight) / 2.5;
      
      let data;
      if (chartMetric === 'revenue') {
        // Use cumulative values that reflect total earnings
        data = [
          { name: 'Solar Nodes', value: 645.20, color: solarColor },
          { name: 'EV Chargers', value: 413.65, color: evColor },
          { name: 'Helium Miners', value: 284.34, color: heliumColor }
        ];
      } else {
        data = [
          { name: 'Solar Nodes', value: 99.2, color: solarColor },
          { name: 'EV Chargers', value: 97.8, color: evColor },
          { name: 'Helium Miners', value: 92.4, color: heliumColor }
        ];
      }
      
      // Calculate total for percentages
      const total = data.reduce((sum, item) => sum + item.value, 0);
      
      let startAngle = 0;
      
      // Draw each pie slice
      data.forEach(item => {
        const percentage = item.value / total;
        const endAngle = startAngle + percentage * Math.PI * 2;
        
        ctx.fillStyle = item.color;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.closePath();
        ctx.fill();
        
        // Draw label connector and text
        const midAngle = startAngle + (endAngle - startAngle) / 2;
        const labelRadius = radius * 1.3;
        const labelX = centerX + Math.cos(midAngle) * labelRadius;
        const labelY = centerY + Math.sin(midAngle) * labelRadius;
        
        ctx.fillStyle = '#a0aec0';
        ctx.textAlign = 'center';
        ctx.font = '14px sans-serif';
        
        if (chartMetric === 'revenue') {
          ctx.fillText(`${item.name}: $${item.value.toFixed(2)} (${Math.round(percentage * 100)}%)`, labelX, labelY);
        } else {
          ctx.fillText(`${item.name}: ${item.value.toFixed(1)}% uptime`, labelX, labelY);
        }
        
        startAngle = endAngle;
      });
    }
    
    // Add legend
    const legendX = width - margin.right + 20;
    const legendY = margin.top + 20;
    const legends = [
      { label: 'Solar Nodes', color: solarColor },
      { label: 'EV Chargers', color: evColor },
      { label: 'Helium Miners', color: heliumColor }
    ];
    
    legends.forEach((legend, i) => {
      const y = legendY + i * 30;
      
      // Color box
      ctx.fillStyle = legend.color;
      ctx.fillRect(legendX, y, 16, 16);
      
      // Label
      ctx.fillStyle = '#e2e8f0';
      ctx.textAlign = 'left';
      ctx.font = '14px sans-serif';
      ctx.fillText(legend.label, legendX + 24, y + 12);
    });
  };
  
  // Sample ecosystem agents data that mimics the virtuals.io format
  const ecosystemAgents = [
    {
      id: "0x1CdC...F463a3",
      name: "SolarHarvester Prime",
      ticker: "HARVEST",
      category: "Productivity",
      marketCap: "3.25m",
      change24h: -26.98,
      volume24h: "309.2k",
      tokenPrice: "0.01621",
      holders: 271885,
      deviceType: "solar-node",
      mindshare: "0.05%"
    },
    {
      id: "0x55cD...247ee4",
      name: "ChargeMaster Flux",
      ticker: "FLUX",
      category: "Optimization",
      marketCap: "1.67m",
      change24h: -9.54,
      volume24h: "201.1k",
      tokenPrice: "0.00741",
      holders: 302831,
      level: 3,
      deviceType: "ev-charger",
      mindshare: "0.31%"
    },
    {
      id: "0x4F9F...d1A825",
      name: "WindGuardian",
      ticker: "WGRD",
      category: "Productivity",
      marketCap: "1.54m",
      change24h: -7.45,
      volume24h: "80.18k",
      tokenPrice: "0.08473",
      holders: 325983,
      deviceType: "compute-node",
      mindshare: "2.34%"
    },
    {
      id: "0xa096...569c0D",
      name: "FarmSentinel",
      ticker: "FARM",
      category: "Productivity",
      marketCap: "1.08m",
      change24h: -13.28,
      volume24h: "46.87k",
      tokenPrice: "0.00191",
      holders: 113132,
      deviceType: "compute-node",
      mindshare: "0%"
    },
    {
      id: "0xA4A2...3C6e00",
      name: "HydroPump Oracle",
      ticker: "HYDRA",
      category: "Optimization",
      marketCap: "621.98k",
      change24h: -10.6,
      volume24h: "150.53k",
      tokenPrice: "0.01871",
      holders: 47470,
      level: 3,
      deviceType: "solar-node",
      mindshare: "0.21%"
    },
    {
      id: "0xd017...782cd5",
      name: "SignalKeeper",
      ticker: "SIGNAL",
      category: "Optimization",
      marketCap: "592.48k",
      change24h: -25.29,
      volume24h: "52.74k",
      tokenPrice: "0.01709",
      holders: 93503,
      deviceType: "helium-miner",
      mindshare: "0.01%"
    },
    {
      id: "0x7318...8f4870",
      name: "BatteryMaster",
      ticker: "BATT",
      category: "Productivity",
      marketCap: "519.34k",
      change24h: -12.9,
      volume24h: "65.71k",
      tokenPrice: "0.00920",
      holders: 206163,
      deviceType: "compute-node",
      mindshare: "0.09%"
    },
    {
      id: "0x6d5C...5bA83E",
      name: "GridWatcher",
      ticker: "GRID",
      category: "Optimization",
      marketCap: "439.53k",
      change24h: -6.29,
      volume24h: "53.2",
      tokenPrice: "0.00034",
      holders: 99797,
      level: 3,
      deviceType: "ev-charger",
      mindshare: "0%"
    }
  ];
  
  return (
    <main className="container px-4 py-8 md:py-12">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-100">Mission Control</h1>
          <p className="text-slate-600 dark:text-slate-300 mt-1">Your autonomous agent swarm ecosystem</p>
        </div>

        {/* Use a regular link as backup if TransitionLink fails in production */}
        <div className="relative">
          <TransitionLink href="/launch-agent">
            <Button className="bg-violet-600 hover:bg-violet-700">
              <Plus className="w-4 h-4 mr-2" />
              Deploy Agent
            </Button>
          </TransitionLink>
          {/* Hidden backup link that will be shown via JS if TransitionLink fails */}
          <a 
            href="/launch-agent" 
            className="hidden absolute inset-0" 
            id="deploy-agent-backup"
            onClick={(e) => {
              console.log("Backup link clicked");
            }}
          >
            <Button className="bg-violet-600 hover:bg-violet-700">
              <Plus className="w-4 h-4 mr-2" />
              Deploy Agent
            </Button>
          </a>
        </div>

        {/* Add a script to ensure the button works */}
        <script dangerouslySetInnerHTML={{ __html: `
          setTimeout(() => {
            const backupLink = document.getElementById('deploy-agent-backup');
            const mainLink = backupLink?.previousElementSibling;
            
            if (backupLink && mainLink) {
              // Test if the main link is working by checking for event listeners
              const hasListeners = (mainLink.__proto__.hasOwnProperty('_events') && 
                                   Object.keys(mainLink._events || {}).length > 0);
              
              if (!hasListeners) {
                console.log("TransitionLink seems broken, activating backup");
                backupLink.style.display = 'block';
                mainLink.style.display = 'none';
              }
            }
          }, 1000);
        `}} />
      </div>

      {showSuccess && (
        <Alert className="mb-6 bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-700">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          <AlertDescription className="text-emerald-800 dark:text-emerald-300 ml-2">
            {`Agent "${agents[0]?.name}" successfully launched! Your new agent has been added to your swarm and will start managing your device.`}
          </AlertDescription>
        </Alert>
      )}

      {loading && (
        <div className="flex justify-center my-4">
          <LoadingSpinner />
        </div>
      )}
      
      {error && (
        <Alert className="mb-6 bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-700">
          <AlertDescription className="text-red-800 dark:text-red-300 ml-2">
            {`Error loading dashboard data: ${error}`}
          </AlertDescription>
        </Alert>
      )}

      {!userHasAgents ? (
        <EmptyDashboard />
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* KPIs and Resources - Left Side */}
          <div className="xl:col-span-3 space-y-6">
            <Card className="p-6 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border-slate-200/70 dark:border-slate-700/70">
              <h2 className="text-xl font-semibold mb-4">Total Earnings</h2>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-4xl font-bold text-slate-800 dark:text-slate-100">${totalRevenue.toFixed(2)}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">From {agents.length} devices</p>
                </div>
                <div className="text-xs bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 px-2 py-1 rounded-full">
                  +{weeklyGrowth}% growth rate
                </div>
              </div>
            </Card>
            
            <Card className="p-6 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border-slate-200/70 dark:border-slate-700/70">
              <h2 className="text-xl font-semibold mb-4">Performance Metrics</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col items-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                  <Clock className="h-6 w-6 text-emerald-500 mb-2" />
                  <span className="text-lg font-bold">98.7%</span>
                  <span className="text-xs text-slate-500">Uptime</span>
                </div>
                <div className="flex flex-col items-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                  <ActivitySquare className="h-6 w-6 text-blue-500 mb-2" />
                  <span className="text-lg font-bold">58</span>
                  <span className="text-xs text-slate-500">Actions Today</span>
                </div>
                <div className="flex flex-col items-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                  <BarChart2 className="h-6 w-6 text-violet-500 mb-2" />
                  <span className="text-lg font-bold">+12.4%</span>
                  <span className="text-xs text-slate-500">Week/Week</span>
                </div>
                <div className="flex flex-col items-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                  <Network className="h-6 w-6 text-amber-500 mb-2" />
                  <span className="text-lg font-bold">{agents.length}/{agents.length}</span>
                  <span className="text-xs text-slate-500">Agents Online</span>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border-slate-200/70 dark:border-slate-700/70">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Resources</h2>
                <TransitionLink href="/help">
                  <Button variant="ghost" size="sm" className="flex items-center gap-1">
                    View all
                    <ArrowRight className="w-3 h-3" />
                  </Button>
                </TransitionLink>
              </div>
              <div className="space-y-3">
                <TransitionLink href="/help/getting-started">
                  <div className="p-3 rounded-lg border border-slate-200/70 dark:border-slate-700/70 hover:bg-slate-50/70 dark:hover:bg-slate-800/70 transition-colors backdrop-blur-sm bg-white/80 dark:bg-slate-900/80">
                    <h3 className="font-medium mb-1">Agent Swarm Guide</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      Learn about decentralized autonomous businesses
                    </p>
                  </div>
                </TransitionLink>
                <TransitionLink href="/help/optimization">
                  <div className="p-3 rounded-lg border border-slate-200/70 dark:border-slate-700/70 hover:bg-slate-50/70 dark:hover:bg-slate-800/70 transition-colors backdrop-blur-sm bg-white/80 dark:bg-slate-900/80">
                    <h3 className="font-medium mb-1">Revenue Optimization</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      Maximize returns from your device fleet
                    </p>
                  </div>
                </TransitionLink>
                <TransitionLink href="/help/troubleshooting">
                  <div className="p-3 rounded-lg border border-slate-200/70 dark:border-slate-700/70 hover:bg-slate-50/70 dark:hover:bg-slate-800/70 transition-colors backdrop-blur-sm bg-white/80 dark:bg-slate-900/80">
                    <h3 className="font-medium mb-1">Troubleshooting</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      Solutions for common device and agent issues
                    </p>
                  </div>
                </TransitionLink>
              </div>
            </Card>
          </div>

          {/* Main Content - Right Side */}
          <div className="xl:col-span-9 space-y-6">
            <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
              <TabsList className="w-full mb-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm">
                <TabsTrigger value="analytics" className="flex-1">
                  Revenue Streams
                </TabsTrigger>
                <TabsTrigger value="agents" className="flex-1">
                  Agent Swarm
                </TabsTrigger>
                <TabsTrigger value="devices" className="flex-1">
                  Device Network
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="analytics" className="space-y-4">
                <Suspense fallback={<LoadingSpinner />}>
                  <Card className="p-6 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border-slate-200/70 dark:border-slate-700/70">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                          {chartMetric === 'revenue' ? 'Cumulative Revenue' : 'Device Uptime'}
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          {chartMetric === 'revenue' ? 'Total earnings by device type' : 'Monthly uptime percentage by device type'}
                        </p>
                      </div>
                      
                      <div className="flex space-x-4">
                        {/* Metric Type Selector */}
                        <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-1 flex">
                          <button 
                            className={`p-2 flex items-center justify-center rounded-md transition-colors ${
                              chartMetric === 'revenue' 
                                ? 'bg-indigo-500 text-white' 
                                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                            }`}
                            onClick={() => setChartMetric('revenue')}
                            aria-label="Show revenue metrics"
                            title="Revenue"
                          >
                            <DollarSign className="h-5 w-5" />
                          </button>
                          <button 
                            className={`p-2 flex items-center justify-center rounded-md transition-colors ${
                              chartMetric === 'uptime' 
                                ? 'bg-indigo-500 text-white' 
                                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                            }`}
                            onClick={() => setChartMetric('uptime')}
                            aria-label="Show uptime metrics"
                            title="Uptime"
                          >
                            <Clock className="h-5 w-5" />
                          </button>
                        </div>
                        
                        {/* Chart Type Selector */}
                        <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-1 flex">
                          <button 
                            className={`p-2 flex items-center justify-center rounded-md transition-colors ${
                              chartType === 'area' 
                                ? 'bg-indigo-500 text-white' 
                                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                            }`}
                            onClick={() => setChartType('area')}
                            aria-label="Show area chart"
                            title="Area Chart"
                          >
                            <BarChart2 className="h-5 w-5" />
                          </button>
                          <button 
                            className={`p-2 flex items-center justify-center rounded-md transition-colors ${
                              chartType === 'pie' 
                                ? 'bg-indigo-500 text-white' 
                                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                            }`}
                            onClick={() => setChartType('pie')}
                            aria-label="Show pie chart"
                            title="Pie Chart"
                          >
                            <PieChart className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      {chartMetric === 'revenue' ? (
                        <>
                          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                            <p className="text-sm text-slate-600 dark:text-slate-300">Total Earnings</p>
                            <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">${totalRevenue.toFixed(2)}</p>
                          </div>
                          
                          <div className="p-4 bg-violet-50 dark:bg-violet-900/20 rounded-lg">
                            <p className="text-sm text-slate-600 dark:text-slate-300">Growth Rate</p>
                            <p className="text-2xl font-bold text-violet-600 dark:text-violet-400">+{weeklyGrowth}%</p>
                          </div>
                          
                          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                            <p className="text-sm text-slate-600 dark:text-slate-300">30-Day Forecast</p>
                            <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">${monthlyProjection.toFixed(2)}</p>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                            <p className="text-sm text-slate-600 dark:text-slate-300">Best Performer</p>
                            <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">Solar Nodes</p>
                            <p className="text-sm text-slate-500">{liveData?.deviceTypes?.[0]?.uptime || "99.2"}% Uptime</p>
                          </div>
                          
                          <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                            <p className="text-sm text-slate-600 dark:text-slate-300">Average Uptime</p>
                            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                              {liveData && liveData.deviceTypes 
                                ? (parseFloat(liveData.deviceTypes[0]?.uptime || "0") + 
                                   parseFloat(liveData.deviceTypes[1]?.uptime || "0") + 
                                   parseFloat(liveData.deviceTypes[2]?.uptime || "0")) / 3
                                : "96.5"}%
                            </p>
                          </div>
                          
                          <div className="p-4 bg-violet-50 dark:bg-violet-900/20 rounded-lg">
                            <p className="text-sm text-slate-600 dark:text-slate-300">Needs Attention</p>
                            <p className="text-2xl font-bold text-violet-600 dark:text-violet-400">Helium Miners</p>
                            <p className="text-sm text-slate-500">{liveData?.deviceTypes?.[2]?.uptime || "92.4"}% Uptime</p>
                          </div>
                        </>
                      )}
                    </div>
                    
                    <div className="h-[500px] w-full">
                      <canvas 
                        ref={chartCanvasRef} 
                        className="w-full h-full" 
                        style={{ minHeight: "500px" }}
                      />
                    </div>
                  </Card>
                  
                  <Card className="p-6 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border-slate-200/70 dark:border-slate-700/70">
                    <h3 className="text-lg font-medium mb-4">Total Earnings by Device Type</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {deviceTypesData.map((device, index) => (
                        <motion.div 
                          key={device.type} 
                          className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-lg flex flex-col items-center relative overflow-hidden"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ 
                            duration: 0.6, 
                            delay: index * 0.2,
                            ease: [0.25, 0.46, 0.45, 0.94]
                          }}
                        >
                          <motion.div 
                            className="absolute bottom-0 left-0 w-full h-1 bg-opacity-30" 
                            style={{ backgroundColor: device.color }}
                          />
                          <motion.div 
                            className="w-full h-1 absolute bottom-0 left-0" 
                            style={{ backgroundColor: device.color }}
                            initial={{ width: 0 }}
                            animate={{ width: `${device.percentage}%` }}
                            transition={{ 
                              duration: 1.5, 
                              delay: 0.5 + (index * 0.2),
                              ease: "easeOut"
                            }}
                          />
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ 
                              duration: 0.5, 
                              delay: 0.3 + (index * 0.2),
                              type: "spring", 
                              stiffness: 260, 
                              damping: 20 
                            }}
                          >
                            {device.type === 'solar-node' && <Sun className="h-8 w-8 mb-2" style={{ color: device.color }} />}
                            {device.type === 'ev-charger' && <Plug className="h-8 w-8 mb-2" style={{ color: device.color }} />}
                            {device.type === 'helium-miner' && <Radio className="h-8 w-8 mb-2" style={{ color: device.color }} />}
                          </motion.div>
                          <motion.span 
                            className="font-bold text-xl"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.7 + (index * 0.2) }}
                          >
                            ${parseFloat(device.revenue.toString()).toFixed(2)}
                          </motion.span>
                          <motion.span 
                            className="text-xs text-slate-500"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.8 + (index * 0.2) }}
                          >
                            {device.name}
                          </motion.span>
                          <motion.span 
                            className="text-xs mt-2 font-medium" 
                            style={{ color: device.color }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.9 + (index * 0.2) }}
                          >
                            {device.percentage}% of total
                          </motion.span>
                        </motion.div>
                      ))}
                    </div>
                  </Card>
                  
                  {/* Replace Decision Log Viewer with Ecosystem Agent Card */}
                  <ThemeProvider theme={darkTheme}>
                    <CssBaseline />
                    <div className="w-full overflow-hidden">
                      <EcosystemAgentCard agents={ecosystemAgents} />
                    </div>
                  </ThemeProvider>
                </Suspense>
              </TabsContent>
              
              <TabsContent value="agents" className="space-y-4">
                <Suspense fallback={<LoadingSpinner />}>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {agents.map((agent, index) => (
                      <div 
                        key={`${agent.name}-${index}`}
                        className={index === 0 && showSuccess ? "animate-pulse-soft" : ""}
                      >
                        <AgentCard
                          name={agent.name}
                          deviceType={agent.deviceType}
                          status={agent.status as any}
                          revenue={agent.revenue}
                          actions={agent.actions}
                          alert={agent.alert}
                          isNew={index === 0 && showSuccess}
                        />
                      </div>
                    ))}
                    <TransitionLink href="/launch-agent">
                      <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg p-6 h-full flex flex-col items-center justify-center bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm hover:bg-white/70 dark:hover:bg-slate-800/70 transition-all">
                        <div className="bg-violet-100 dark:bg-violet-900/40 p-3 rounded-full mb-4">
                          <Plus className="h-6 w-6 text-violet-600 dark:text-violet-400" />
                        </div>
                        <h3 className="font-medium text-center">Deploy New Agent</h3>
                        <p className="text-sm text-center text-slate-500 dark:text-slate-400 mt-2">Add to your autonomous swarm</p>
                      </div>
                    </TransitionLink>
                    {/* Backup link for Deploy New Agent */}
                    <a 
                      href="/launch-agent" 
                      className="hidden" 
                      id="deploy-new-agent-backup"
                    >
                      <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg p-6 h-full flex flex-col items-center justify-center bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm hover:bg-white/70 dark:hover:bg-slate-800/70 transition-all">
                        <div className="bg-violet-100 dark:bg-violet-900/40 p-3 rounded-full mb-4">
                          <Plus className="h-6 w-6 text-violet-600 dark:text-violet-400" />
                        </div>
                        <h3 className="font-medium text-center">Deploy New Agent</h3>
                        <p className="text-sm text-center text-slate-500 dark:text-slate-400 mt-2">Add to your autonomous swarm</p>
                      </div>
                    </a>
                    {/* Script to check and enable backup if needed */}
                    <script dangerouslySetInnerHTML={{ __html: `
                      setTimeout(() => {
                        const backupLink = document.getElementById('deploy-new-agent-backup');
                        const mainLink = backupLink?.previousElementSibling;
                        
                        if (backupLink && mainLink) {
                          if (!mainLink.__proto__.hasOwnProperty('_events') || 
                              Object.keys(mainLink._events || {}).length === 0) {
                            console.log("Agent tab TransitionLink seems broken, activating backup");
                            backupLink.style.display = 'block';
                            mainLink.style.display = 'none';
                          }
                        }
                      }, 1200);
                    `}} />
                  </div>

                  <Card className="p-6 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border-slate-200/70 dark:border-slate-700/70">
                    <h3 className="text-xl font-semibold mb-4">Agent Action History</h3>
                    {liveData?.agentActivity && liveData.agentActivity.length > 0 ? (
                      <div className="space-y-3 max-h-[400px] overflow-y-auto">
                        {liveData.agentActivity.map((activity, index) => (
                          <div 
                            key={`${activity.agent}-${index}`}
                            className="p-3 border border-slate-200 dark:border-slate-700 rounded-lg flex items-start gap-3"
                          >
                            <div className="p-2 rounded-full bg-violet-100 dark:bg-violet-900/30 flex-shrink-0">
                              <Activity className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-start gap-2">
                                <span className="font-medium truncate">{activity.agent}</span>
                                <span className="text-emerald-600 dark:text-emerald-400 text-sm whitespace-nowrap">{activity.revenue}</span>
                              </div>
                              <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{activity.action}</p>
                              <p className="text-xs text-slate-500 mt-1">
                                {new Date(activity.timestamp).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center p-6 border border-dashed border-slate-200 dark:border-slate-700 rounded-lg">
                        <p className="text-slate-500 dark:text-slate-400">No recent agent activity recorded</p>
                      </div>
                    )}
                  </Card>
                </Suspense>
              </TabsContent>
              
              <TabsContent value="devices" className="space-y-4">
                <Suspense fallback={<LoadingSpinner />}>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <DeviceHealthPanel
                      name="Solar Panel Array A"
                      type="solar-node"
                      status="online"
                      uptime="99.7%"
                      pool="0x7a23...45df"
                      lastReward="12 hours ago"
                    />
                    <DeviceHealthPanel
                      name="Downtown EV Station"
                      type="ev-charger"
                      status="online"
                      uptime="98.2%"
                      pool="0x8b12...f67a"
                      lastReward="3 hours ago"
                    />
                    <DeviceHealthPanel
                      name="Helium Hotspot #42"
                      type="helium-miner"
                      status="warning"
                      uptime="78.4%"
                      pool="0x3d45...921c"
                      lastReward="2 days ago"
                      alert="Signal strength degraded"
                    />
                    <TransitionLink href="/devices/add">
                      <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg p-6 h-full flex flex-col items-center justify-center bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm hover:bg-white/70 dark:hover:bg-slate-800/70 transition-all">
                        <div className="bg-slate-100 dark:bg-slate-800/80 p-3 rounded-full mb-4">
                          <Plus className="h-6 w-6 text-slate-600 dark:text-slate-400" />
                        </div>
                        <h3 className="font-medium text-center">Connect New Device</h3>
                        <p className="text-sm text-center text-slate-500 dark:text-slate-400 mt-2">Expand your decentralized network</p>
                      </div>
                    </TransitionLink>
                  </div>
                </Suspense>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      )}
    </main>
  )
} 