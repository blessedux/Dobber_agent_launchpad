import React from 'react';
import { Device } from '@/data/mockDeviceNetwork';
import IsometricTile from './IsometricTile';
import { Server, Cpu, Zap, Radio, Plug } from 'lucide-react';

interface IsometricDeviceProps {
  device: Device;
  isSelected: boolean;
  onSelect: (id: string) => void;
  isUserOwned: boolean;
  hasUserTokens: boolean;
}

const IsometricDevice: React.FC<IsometricDeviceProps> = ({
  device,
  isSelected,
  onSelect,
  isUserOwned,
  hasUserTokens
}) => {
  // Determine tile color based on ownership and status
  const getTileColor = () => {
    // Base color by owner
    let baseColor = isUserOwned 
      ? '#6b46fe' // User owned (violet)
      : hasUserTokens 
        ? '#0ea5e9' // User has tokens (blue)
        : '#94a3b8'; // Other (gray)
    
    // Adjust for device status
    switch (device.status) {
      case 'active':
        return baseColor;
      case 'maintenance':
        return '#f59e0b'; // Amber for maintenance
      case 'inactive':
        return '#ef4444'; // Red for inactive
      default:
        return baseColor;
    }
  };
  
  // Get device icon based on type
  const getDeviceIcon = () => {
    const iconSize = 24;
    const iconColor = "white";
    
    switch (device.type) {
      case 'server-tower':
        return <Server size={iconSize} color={iconColor} />;
      case 'compute-node':
        return <Cpu size={iconSize} color={iconColor} />;
      case 'solar-panel':
        return <Zap size={iconSize} color={iconColor} />;
      case 'helium-miner':
        return <Radio size={iconSize} color={iconColor} />;
      case 'ev-charger':
        return <Plug size={iconSize} color={iconColor} />;
      default:
        return <Cpu size={iconSize} color={iconColor} />;
    }
  };
  
  // Render verification status badge
  const renderVerificationBadge = () => {
    if (!device.verificationStatus) return null;
    
    const getStatusColor = () => {
      switch (device.verificationStatus) {
        case 'verified': return 'bg-emerald-500';
        case 'pending': return 'bg-amber-500';
        case 'failed': return 'bg-red-500';
        default: return 'bg-gray-500';
      }
    };
    
    return (
      <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${getStatusColor()}`} />
    );
  };
  
  return (
    <IsometricTile 
      x={device.position.x} 
      y={device.position.y}
      z={1} // Elevate devices
      color={getTileColor()}
      selected={isSelected}
      onClick={() => onSelect(device.id)}
    >
      <div className="relative">
        <div className="flex items-center justify-center bg-black/20 rounded-full p-2">
          {getDeviceIcon()}
        </div>
        
        {/* Token badge */}
        {hasUserTokens && !isUserOwned && (
          <div className="absolute -top-1 -left-1 w-4 h-4 bg-yellow-400 rounded-full border-2 border-white flex items-center justify-center">
            <span className="text-[8px] font-bold">$</span>
          </div>
        )}
        
        {/* Verification status badge */}
        {renderVerificationBadge()}
        
        {/* Glow effect for active devices */}
        {device.status === 'active' && (
          <div className="absolute inset-0 -z-10 animate-pulse opacity-50 rounded-full" style={{ 
            boxShadow: `0 0 15px 5px ${getTileColor()}`,
            animationDuration: '3s'
          }} />
        )}
      </div>
    </IsometricTile>
  );
};

export default IsometricDevice; 