"use client"

import React, { useEffect, useRef } from 'react';
import { Card, CardHeader, Typography, Box, Divider } from '@mui/material';

type ChartType = 'line' | 'area' | 'pie';
type MetricType = 'revenue' | 'uptime';

interface FallbackChartProps {
  chartType: ChartType;
  metricType: MetricType;
  data: any[];
  totalRevenue: number;
  weeklyGrowth: string;
  monthlyProjection: number;
}

// Define colors matching the main chart
const COLORS = {
  'solar-node': '#f59e0b',  // amber
  'ev-charger': '#10b981',  // emerald
  'helium-miner': '#8b5cf6', // violet
};

export default function FallbackChart({ 
  chartType, 
  metricType, 
  data, 
  totalRevenue, 
  weeklyGrowth, 
  monthlyProjection 
}: FallbackChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Draw the chart when component mounts or props change
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Get canvas dimensions
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Set background
    ctx.fillStyle = '#1e2030';
    ctx.fillRect(0, 0, width, height);
    
    // Draw chart title
    ctx.fillStyle = '#a0aec0';
    ctx.font = '16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(metricType === 'revenue' ? 'Revenue Distribution' : 'Device Uptime', width / 2, 30);
    
    // Chart margins
    const margin = {
      top: 50,
      right: 50,
      bottom: 50,
      left: 80
    };
    
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;
    
    // Draw axes
    ctx.strokeStyle = '#a0aec0';
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
    
    // Add axis labels
    ctx.fillStyle = '#a0aec0';
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Months', width / 2, height - 10);
    
    // Y-axis label
    ctx.save();
    ctx.translate(20, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = 'center';
    ctx.fillText(metricType === 'revenue' ? 'Revenue ($)' : 'Uptime (%)', 0, 0);
    ctx.restore();
    
    // Month labels
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const xStep = chartWidth / (months.length - 1);
    
    months.forEach((month, i) => {
      const x = margin.left + i * xStep;
      ctx.fillStyle = '#a0aec0';
      ctx.textAlign = 'center';
      ctx.font = '12px sans-serif';
      ctx.fillText(month, x, height - margin.bottom + 20);
    });
    
    // Draw data
    if (chartType === 'line' || chartType === 'area') {
      // Sample data points for demonstration
      let solarPoints: { x: number, y: number }[] = [];
      let evPoints: { x: number, y: number }[] = [];
      let heliumPoints: { x: number, y: number }[] = [];
      
      // Generate points based on sine waves
      months.forEach((_, i) => {
        const x = margin.left + i * xStep;
        
        let solarY, evY, heliumY;
        
        if (metricType === 'revenue') {
          // Revenue values (scales from bottom to top)
          solarY = height - margin.bottom - (Math.sin(i / 11 * Math.PI * 2) * 80 + 140);
          evY = height - margin.bottom - (Math.cos(i / 11 * Math.PI * 2 + 1) * 60 + 100);
          heliumY = height - margin.bottom - (Math.sin(i / 11 * Math.PI * 2 + 2) * 40 + 80);
        } else {
          // Uptime percentages (80-100% range)
          const scale = chartHeight / 20; // Scale for the 80-100% range
          solarY = height - margin.bottom - ((99 - Math.sin(i / 12 * Math.PI) * 2) - 80) * scale;
          evY = height - margin.bottom - ((98 - Math.cos((i + 1) / 12 * Math.PI) * 3) - 80) * scale;
          heliumY = height - margin.bottom - ((96 - Math.sin((i + 2) / 12 * Math.PI) * 5) - 80) * scale;
        }
        
        solarPoints.push({ x, y: solarY });
        evPoints.push({ x, y: evY });
        heliumPoints.push({ x, y: heliumY });
      });
      
      // Draw lines or areas
      if (chartType === 'line') {
        // Draw Solar line
        ctx.strokeStyle = COLORS['solar-node'];
        ctx.lineWidth = 3;
        ctx.beginPath();
        solarPoints.forEach((point, i) => {
          if (i === 0) {
            ctx.moveTo(point.x, point.y);
          } else {
            ctx.lineTo(point.x, point.y);
          }
        });
        ctx.stroke();
        
        // Draw dots for Solar
        solarPoints.forEach(point => {
          ctx.fillStyle = COLORS['solar-node'];
          ctx.beginPath();
          ctx.arc(point.x, point.y, 4, 0, Math.PI * 2);
          ctx.fill();
        });
        
        // Draw EV line
        ctx.strokeStyle = COLORS['ev-charger'];
        ctx.lineWidth = 3;
        ctx.beginPath();
        evPoints.forEach((point, i) => {
          if (i === 0) {
            ctx.moveTo(point.x, point.y);
          } else {
            ctx.lineTo(point.x, point.y);
          }
        });
        ctx.stroke();
        
        // Draw dots for EV
        evPoints.forEach(point => {
          ctx.fillStyle = COLORS['ev-charger'];
          ctx.beginPath();
          ctx.arc(point.x, point.y, 4, 0, Math.PI * 2);
          ctx.fill();
        });
        
        // Draw Helium line
        ctx.strokeStyle = COLORS['helium-miner'];
        ctx.lineWidth = 3;
        ctx.beginPath();
        heliumPoints.forEach((point, i) => {
          if (i === 0) {
            ctx.moveTo(point.x, point.y);
          } else {
            ctx.lineTo(point.x, point.y);
          }
        });
        ctx.stroke();
        
        // Draw dots for Helium
        heliumPoints.forEach(point => {
          ctx.fillStyle = COLORS['helium-miner'];
          ctx.beginPath();
          ctx.arc(point.x, point.y, 4, 0, Math.PI * 2);
          ctx.fill();
        });
      } else if (chartType === 'area') {
        // Draw Helium area (bottom)
        ctx.fillStyle = COLORS['helium-miner'];
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
        ctx.fillStyle = COLORS['ev-charger'];
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
        ctx.fillStyle = COLORS['solar-node'];
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
    } else if (chartType === 'pie') {
      // Draw simple pie chart
      const centerX = width / 2;
      const centerY = height / 2;
      const radius = Math.min(chartWidth, chartHeight) / 2.5;
      
      // Calculate total for percentages
      const total = data.reduce((sum, item) => sum + item.revenue, 0);
      
      let startAngle = 0;
      
      // Draw each pie slice
      data.forEach(item => {
        const percentage = item.revenue / total;
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
        ctx.fillText(`${item.name}: ${Math.round(percentage * 100)}%`, labelX, labelY);
        
        startAngle = endAngle;
      });
    }
    
    // Draw legend
    const legendX = width - margin.right + 10;
    const legendY = margin.top;
    
    // Draw legend
    if (chartType !== 'pie') {
      const legends = [
        { label: 'Solar Nodes', color: COLORS['solar-node'] },
        { label: 'EV Chargers', color: COLORS['ev-charger'] },
        { label: 'Helium Miners', color: COLORS['helium-miner'] }
      ];
      
      legends.forEach((legend, i) => {
        const y = legendY + i * 25;
        
        // Draw color box
        ctx.fillStyle = legend.color;
        ctx.fillRect(legendX, y, 15, 15);
        
        // Draw label
        ctx.fillStyle = '#a0aec0';
        ctx.textAlign = 'left';
        ctx.font = '12px sans-serif';
        ctx.fillText(legend.label, legendX + 20, y + 12);
      });
    }
    
  }, [chartType, metricType, data, totalRevenue, weeklyGrowth, monthlyProjection]);

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
          <Typography variant="h6">
            {metricType === 'revenue' ? 'Revenue Distribution' : 'Device Uptime'}
          </Typography>
        }
      />
      
      <Box sx={{ display: 'flex', p: 2, justifyContent: 'space-between' }}>
        {metricType === 'revenue' ? (
          <>
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
              <Typography variant="h4" color="#9f7aea" sx={{ fontWeight: 'bold' }}>
                {weeklyGrowth}
              </Typography>
            </Box>
            
            <Box sx={{ p: 2, borderRadius: 2, bgcolor: 'rgba(67, 24, 255, 0.05)', width: '30%' }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Monthly Projection
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
              <Typography variant="h4" color={COLORS['solar-node']} sx={{ fontWeight: 'bold' }}>
                Solar Nodes
              </Typography>
            </Box>
            
            <Box sx={{ p: 2, borderRadius: 2, bgcolor: 'rgba(139, 92, 246, 0.1)', width: '30%' }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Needs Attention
              </Typography>
              <Typography variant="h4" color={COLORS['helium-miner']} sx={{ fontWeight: 'bold', fontSize: '1.5rem' }}>
                Helium Miners
              </Typography>
            </Box>
          </>
        )}
      </Box>
      
      <Divider sx={{ my: 1 }} />
      
      <Box sx={{ flexGrow: 1, p: 2, position: 'relative' }}>
        <canvas 
          ref={canvasRef} 
          width={800} 
          height={400} 
          style={{ width: '100%', height: '100%', minHeight: '400px' }}
        />
      </Box>
    </Card>
  );
} 