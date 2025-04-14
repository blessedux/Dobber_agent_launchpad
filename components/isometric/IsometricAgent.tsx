import React, { useEffect, useState } from 'react';
import { NetworkAgent } from '@/data/mockDeviceNetwork';
import { getIsometricTransform, calculateZIndex } from '@/lib/utils/isometric';
import { Shield, Wrench, Coins } from 'lucide-react';

interface IsometricAgentProps {
  agent: NetworkAgent;
  isSelected: boolean;
  onSelect: (id: string) => void;
  isUserOwned: boolean;
  hasUserTokens: boolean;
}

const IsometricAgent: React.FC<IsometricAgentProps> = ({
  agent,
  isSelected,
  onSelect,
  isUserOwned,
  hasUserTokens
}) => {
  // Animation state for movement
  const [position, setPosition] = useState(agent.position || { x: 0, y: 0 });
  const [animationProgress, setAnimationProgress] = useState(0);
  
  // Get agent color based on type and ownership
  const getAgentColor = () => {
    // Base color by agent type
    let baseColor;
    switch (agent.type) {
      case 'MaintenanceAgent':
        baseColor = '#10b981'; // Green for maintenance
        break;
      case 'LPOptimizationAgent':
        baseColor = '#8b5cf6'; // Purple for optimization
        break;
      case 'RevenueDistributionAgent':
        baseColor = '#f59e0b'; // Amber for revenue
        break;
      default:
        baseColor = '#6b7280'; // Gray default
    }
    
    // Adjust for ownership
    if (isUserOwned) {
      return baseColor; // Full brightness for user owned
    } else if (hasUserTokens) {
      return `${baseColor}90`; // Semi-transparent for token holdings
    } else {
      return `${baseColor}60`; // More transparent for other agents
    }
  };
  
  // Get agent icon based on type
  const getAgentIcon = () => {
    const iconSize = 16;
    const iconColor = "white";
    
    switch (agent.type) {
      case 'MaintenanceAgent':
        return <Wrench size={iconSize} color={iconColor} />;
      case 'LPOptimizationAgent':
        return <Coins size={iconSize} color={iconColor} />;
      case 'RevenueDistributionAgent':
        return <Shield size={iconSize} color={iconColor} />;
      default:
        return <Shield size={iconSize} color={iconColor} />;
    }
  };
  
  // Animation effect for agent movement
  useEffect(() => {
    if (!agent.position || !agent.targetDeviceId) return;
    
    // Reset animation when position or target changes
    setAnimationProgress(0);
    setPosition(agent.position);
    
    // Simulate agent movement with animation
    const interval = setInterval(() => {
      setAnimationProgress(prev => {
        const newProgress = prev + 0.01;
        if (newProgress >= 1) {
          clearInterval(interval);
          return 1;
        }
        return newProgress;
      });
    }, 50);
    
    return () => clearInterval(interval);
  }, [agent.position, agent.targetDeviceId]);
  
  // Calculate z-index for rendering order
  const zIndex = calculateZIndex(position.x, position.y, 2); // Agents above devices
  
  // Render verification status badge
  const renderVerificationBadge = () => {
    const getStatusColor = () => {
      switch (agent.verificationStatus) {
        case 'verified': return 'bg-emerald-500';
        case 'pending': return 'bg-amber-500';
        case 'failed': return 'bg-red-500';
        default: return 'bg-gray-500';
      }
    };
    
    return (
      <div className={`absolute -top-1 -right-1 w-2 h-2 rounded-full ${getStatusColor()}`} />
    );
  };
  
  // Calculate transform for agent position
  const transform = getIsometricTransform(position.x, position.y, 2);
  
  return (
    <div 
      className="absolute"
      style={{
        transform,
        zIndex,
        cursor: 'pointer',
        transition: 'transform 0.5s ease-in-out',
      }}
      onClick={() => onSelect(agent.id)}
    >
      <div 
        className={`relative p-1.5 rounded-full flex items-center justify-center transition-all ${
          isSelected ? 'scale-125 ring-2 ring-yellow-400' : ''
        }`}
        style={{
          backgroundColor: getAgentColor(),
          boxShadow: isUserOwned ? '0 0 10px rgba(107, 70, 254, 0.5)' : 'none',
        }}
      >
        {getAgentIcon()}
        
        {/* Token badge */}
        {hasUserTokens && !isUserOwned && (
          <div className="absolute -top-1 -left-1 w-3 h-3 bg-yellow-400 rounded-full border border-white flex items-center justify-center">
            <span className="text-[6px] font-bold">$</span>
          </div>
        )}
        
        {/* Verification badge */}
        {renderVerificationBadge()}
      </div>
      
      {/* Agent name tooltip */}
      {isSelected && (
        <div className="absolute left-1/2 transform -translate-x-1/2 -mt-6 bg-black/75 text-white px-2 py-0.5 rounded text-xs whitespace-nowrap z-50">
          {agent.name}
          <div className="text-[10px] opacity-80 flex items-center gap-1">
            <span className="font-bold">${agent.tokenSymbol}</span>
            <span className="text-gray-300">•</span>
            <span>${agent.tokenPrice}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default IsometricAgent; 