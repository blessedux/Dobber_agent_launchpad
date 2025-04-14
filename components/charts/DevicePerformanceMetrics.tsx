"use client"

import { useState } from 'react'
import { 
  Card, 
  CardHeader, 
  CardContent, 
  Grid, 
  Box, 
  Typography, 
  Chip, 
  LinearProgress, 
  IconButton, 
  Menu, 
  MenuItem, 
  Divider 
} from '@mui/material'
import { MoreVert, TrendingUp, Warning, CheckCircle } from '@mui/icons-material'
import { Sun, Plug, Radio, Network, Server } from 'lucide-react'

// Define types
type DeviceType = 'solar-node' | 'ev-charger' | 'helium-miner' | 'compute-node' | string;
type DeviceStatus = 'online' | 'warning' | 'offline';

interface Device {
  name: string;
  type: DeviceType;
  status: DeviceStatus;
  uptime: string;
  pool: string;
  lastReward: string;
  alert?: string;
}

// Device type icons mapped to components
const DeviceIcon = ({ type, size = 24 }: { type: DeviceType; size?: number }) => {
  switch (type) {
    case 'solar-node': 
      return <Sun className="text-amber-500" style={{ width: size, height: size }} />;
    case 'ev-charger': 
      return <Plug className="text-emerald-500" style={{ width: size, height: size }} />;
    case 'helium-miner': 
      return <Radio className="text-violet-500" style={{ width: size, height: size }} />;
    case 'compute-node': 
      return <Server className="text-blue-500" style={{ width: size, height: size }} />;
    default: 
      return <Network className="text-slate-500" style={{ width: size, height: size }} />;
  }
};

// Status indicator component
const StatusIndicator = ({ status }: { status: DeviceStatus }) => {
  const statusMap = {
    online: { color: 'success', icon: <CheckCircle fontSize="small" />, label: 'Online' },
    warning: { color: 'warning', icon: <Warning fontSize="small" />, label: 'Warning' },
    offline: { color: 'error', icon: <Warning fontSize="small" />, label: 'Offline' },
  };

  const statusConfig = statusMap[status] || statusMap.offline;

  return (
    <Chip 
      size="small"
      color={statusConfig.color as 'success' | 'warning' | 'error'}
      icon={statusConfig.icon}
      label={statusConfig.label}
      variant="outlined"
    />
  );
};

// Performance metric card
interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  percentage?: string;
}

const MetricCard = ({ title, value, icon, color, percentage }: MetricCardProps) => {
  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 2,
        bgcolor: 'background.paper',
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            bgcolor: `${color}.100`, 
            color: `${color}.800`,
            borderRadius: '50%',
            p: 1,
            mr: 2
          }}
        >
          {icon}
        </Box>
        <Typography variant="subtitle2" color="text.secondary">
          {title}
        </Typography>
      </Box>
      
      <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 1 }}>
        <Typography variant="h5" component="div">
          {value}
        </Typography>
        {percentage && (
          <Typography 
            variant="caption" 
            color="success.main" 
            sx={{ ml: 1, display: 'flex', alignItems: 'center' }}
          >
            <TrendingUp fontSize="inherit" sx={{ mr: 0.5 }} />
            {percentage}
          </Typography>
        )}
      </Box>
      
      <LinearProgress 
        variant="determinate" 
        value={75} 
        sx={{ 
          mt: 1, 
          height: 4, 
          borderRadius: 2,
          bgcolor: `${color}.100`,
          '& .MuiLinearProgress-bar': {
            bgcolor: `${color}.600`,
          }
        }} 
      />
    </Box>
  );
};

// Device Card component
const DeviceCard = ({ device }: { device: Device }) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);
  
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };
  
  const getStatusColor = (status: DeviceStatus) => {
    switch (status) {
      case 'online': return 'success.main';
      case 'warning': return 'warning.main';
      case 'offline': return 'error.main';
      default: return 'text.secondary';
    }
  };
  
  const utilization = Math.floor(Math.random() * 100);
  const efficiency = Math.floor(Math.random() * 100);
  
  return (
    <Card sx={{ height: '100%' }}>
      <CardHeader
        avatar={<DeviceIcon type={device.type} />}
        action={
          <>
            <IconButton 
              aria-label="settings" 
              aria-controls={open ? 'device-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              onClick={handleClick}
            >
              <MoreVert />
            </IconButton>
            <Menu
              id="device-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                'aria-labelledby': 'device-menu-button',
              }}
            >
              <MenuItem onClick={handleClose}>View Details</MenuItem>
              <MenuItem onClick={handleClose}>Optimize Resources</MenuItem>
              <Divider />
              <MenuItem onClick={handleClose}>Troubleshoot</MenuItem>
            </Menu>
          </>
        }
        title={device.name}
        subheader={<StatusIndicator status={device.status} />}
      />
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Utilization
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ width: '100%', mr: 1 }}>
                  <LinearProgress 
                    variant="determinate" 
                    value={utilization} 
                    sx={{ 
                      height: 6, 
                      borderRadius: 1,
                      bgcolor: 'background.default',
                    }} 
                  />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {utilization}%
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Efficiency
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ width: '100%', mr: 1 }}>
                  <LinearProgress 
                    variant="determinate" 
                    value={efficiency} 
                    sx={{ 
                      height: 6, 
                      borderRadius: 1,
                      bgcolor: 'background.default',
                    }} 
                  />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {efficiency}%
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Last Reward
          </Typography>
          <Typography variant="body1">
            ${(Math.random() * 10).toFixed(2)} ({device.lastReward})
          </Typography>
        </Box>
        
        {device.alert && (
          <Box sx={{ 
            mt: 2, 
            p: 1, 
            borderRadius: 1, 
            bgcolor: 'warning.light', 
            color: 'warning.dark',
            display: 'flex',
            alignItems: 'center',
          }}>
            <Warning fontSize="small" sx={{ mr: 1 }} />
            <Typography variant="caption">{device.alert}</Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

// Main component export
export default function DevicePerformanceMetrics({ devices = [] }: { devices: Device[] }) {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        Device Network Performance
      </Typography>
      
      {/* Summary metrics */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard 
            title="Total Devices" 
            value={devices.length} 
            icon={<Network />} 
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard 
            title="Online Rate" 
            value={`${Math.round(devices.filter(d => d.status === 'online').length / Math.max(devices.length, 1) * 100)}%`} 
            icon={<CheckCircle />} 
            color="success"
            percentage="+5% ↑"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard 
            title="Avg. Efficiency" 
            value="82%" 
            icon={<TrendingUp />} 
            color="info"
            percentage="+2.5% ↑"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard 
            title="Network Health" 
            value="Good" 
            icon={<CheckCircle />} 
            color="success"
          />
        </Grid>
      </Grid>
      
      {/* Device cards */}
      <Grid container spacing={2}>
        {devices.map((device, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <DeviceCard device={device} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
} 