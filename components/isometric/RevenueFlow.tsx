import React, { useState, useEffect } from 'react';
import { Device, NetworkAgent, GridPosition } from '@/data/mockDeviceNetwork';
import { gridToScreen } from '@/lib/utils/isometric';

interface RevenueFlowProps {
  device: Device;
  agent: NetworkAgent;
  userPosition: GridPosition;
  isUserOwned: boolean;
  hasUserTokens: boolean;
}

const RevenueFlow: React.FC<RevenueFlowProps> = ({
  device,
  agent,
  userPosition,
  isUserOwned,
  hasUserTokens
}) => {
  const [animatingRevenue, setAnimatingRevenue] = useState(false);
  const [particles, setParticles] = useState<Array<{id: number, progress: number}>>([]);
  
  // Convert grid positions to screen coordinates
  const deviceScreenPos = gridToScreen(device.position.x, device.position.y, 1);
  const agentScreenPos = gridToScreen(agent.position?.x || 0, agent.position?.y || 0, 2);
  const userScreenPos = gridToScreen(userPosition.x, userPosition.y, 0);
  
  // Determine if this flow should animate to the user (for token holdings)
  const flowsToUser = (isUserOwned || hasUserTokens) && device.status === 'active';
  
  // Set up periodic revenue flow animation
  useEffect(() => {
    if (!flowsToUser) return;
    
    // Only create flows for active devices
    if (device.status !== 'active') return;
    
    // Periodically trigger revenue flow animations
    const interval = setInterval(() => {
      const flowRate = device.revenuePerDay / 20; // Higher revenue = more frequent flows
      if (Math.random() < (flowRate / 100)) {
        // Start a new revenue flow animation
        setAnimatingRevenue(true);
        setParticles(prev => [...prev, { id: Date.now(), progress: 0 }]);
      }
    }, 2000);
    
    return () => clearInterval(interval);
  }, [device, flowsToUser]);
  
  // Animate particles
  useEffect(() => {
    if (particles.length === 0) return;
    
    const animationInterval = setInterval(() => {
      setParticles(prev => {
        // Update progress for each particle
        const updated = prev.map(p => ({...p, progress: p.progress + 0.02}));
        // Remove particles that have completed their animation
        const filtered = updated.filter(p => p.progress <= 1);
        
        if (filtered.length === 0) {
          setAnimatingRevenue(false);
        }
        
        return filtered;
      });
    }, 50);
    
    return () => clearInterval(animationInterval);
  }, [particles]);
  
  // Determine flow colors
  const getFlowColor = () => {
    if (isUserOwned) return 'rgba(107, 70, 254, 0.8)'; // Purple for user-owned
    if (hasUserTokens) return 'rgba(14, 165, 233, 0.8)'; // Blue for token holdings
    return 'rgba(107, 114, 128, 0.5)'; // Gray for others
  };
  
  // Draw SVG paths for flow lines
  const getDeviceToAgentPath = () => {
    return `M ${deviceScreenPos.x} ${deviceScreenPos.y} L ${agentScreenPos.x} ${agentScreenPos.y}`;
  };
  
  const getAgentToUserPath = () => {
    return `M ${agentScreenPos.x} ${agentScreenPos.y} L ${userScreenPos.x} ${userScreenPos.y}`;
  };
  
  if (!flowsToUser) return null;
  
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1000 }}>
      {/* Base flow paths */}
      <path
        d={getDeviceToAgentPath()}
        stroke={getFlowColor()}
        strokeWidth="2"
        fill="none"
        strokeDasharray="4 4"
        opacity={0.3}
      />
      
      {isUserOwned && (
        <path
          d={getAgentToUserPath()}
          stroke={getFlowColor()}
          strokeWidth="2"
          fill="none"
          strokeDasharray="4 4"
          opacity={0.3}
        />
      )}
      
      {/* Animated particles */}
      {particles.map(particle => {
        // For the first half of animation, go from device to agent
        // For the second half, go from agent to user
        const deviceToAgentProgress = Math.min(particle.progress * 2, 1);
        const agentToUserProgress = particle.progress <= 0.5 ? 0 : (particle.progress - 0.5) * 2;
        
        // Calculate positions along the paths
        const deviceToAgentX = deviceScreenPos.x + (agentScreenPos.x - deviceScreenPos.x) * deviceToAgentProgress;
        const deviceToAgentY = deviceScreenPos.y + (agentScreenPos.y - deviceScreenPos.y) * deviceToAgentProgress;
        
        // Only calculate second path if needed
        let particleX = deviceToAgentX;
        let particleY = deviceToAgentY;
        
        if (isUserOwned && agentToUserProgress > 0) {
          particleX = agentScreenPos.x + (userScreenPos.x - agentScreenPos.x) * agentToUserProgress;
          particleY = agentScreenPos.y + (userScreenPos.y - agentScreenPos.y) * agentToUserProgress; 
        }
        
        return (
          <circle
            key={particle.id}
            cx={particleX}
            cy={particleY}
            r={4}
            fill={getFlowColor()}
            filter="drop-shadow(0 0 3px rgba(255, 255, 255, 0.8))"
          >
            <animate
              attributeName="opacity"
              values="0.9;0.4;0.9"
              dur="1.5s"
              repeatCount="indefinite"
            />
          </circle>
        );
      })}
    </svg>
  );
};

export default RevenueFlow; 