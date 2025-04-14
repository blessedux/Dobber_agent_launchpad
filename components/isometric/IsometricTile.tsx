import React from 'react';
import { getIsometricTransform, TILE_WIDTH, TILE_HEIGHT, TILE_DEPTH, calculateZIndex } from '@/lib/utils/isometric';

interface IsometricTileProps {
  x: number;
  y: number;
  z?: number;
  color?: string;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
  children?: React.ReactNode;
}

const IsometricTile: React.FC<IsometricTileProps> = ({
  x,
  y,
  z = 0,
  color = '#8dd1cf',
  selected = false,
  onClick,
  className = '',
  children
}) => {
  const zIndex = calculateZIndex(x, y, z);
  const transform = getIsometricTransform(x, y, z);
  
  // Tile colors
  const topColor = color;
  const leftColor = adjustBrightness(color, -15); // Darker for left face
  const rightColor = adjustBrightness(color, -30); // Darkest for right face
  
  // Selected outline color
  const selectedColor = 'rgba(255, 215, 0, 0.8)'; // Gold color
  
  return (
    <div 
      className={`absolute ${className}`}
      style={{
        transform,
        zIndex,
        width: TILE_WIDTH,
        height: TILE_HEIGHT,
        transformOrigin: 'center',
        cursor: onClick ? 'pointer' : 'default',
      }}
      onClick={onClick}
    >
      {/* Diamond shape */}
      <div 
        className="absolute" 
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          transformOrigin: 'center',
          filter: selected ? 'drop-shadow(0 0 10px gold)' : undefined,
        }}
      >
        {/* Top face */}
        <div
          className="absolute"
          style={{
            width: '100%',
            height: '100%',
            clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
            backgroundColor: topColor,
            border: selected ? `2px solid ${selectedColor}` : 'none',
          }}
        />
        
        {/* Left face (if we want to add 3D effect) */}
        {z > 0 && (
          <div
            className="absolute"
            style={{
              width: '50%',
              height: TILE_DEPTH,
              left: 0,
              top: '100%',
              transformOrigin: 'top left',
              transform: 'rotateX(45deg) skewY(45deg) translateY(-100%)',
              backgroundColor: leftColor,
              border: selected ? `2px solid ${selectedColor}` : 'none',
            }}
          />
        )}
        
        {/* Right face (if we want to add 3D effect) */}
        {z > 0 && (
          <div
            className="absolute"
            style={{
              width: '50%',
              height: TILE_DEPTH,
              right: 0,
              top: '100%',
              transformOrigin: 'top right',
              transform: 'rotateX(45deg) skewY(-45deg) translateY(-100%)',
              backgroundColor: rightColor,
              border: selected ? `2px solid ${selectedColor}` : 'none',
            }}
          />
        )}
      </div>
      
      {/* Content positioned in the center of the tile */}
      <div 
        className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
        style={{ zIndex: zIndex + 1 }}
      >
        {children}
      </div>
    </div>
  );
};

// Helper function to adjust color brightness
function adjustBrightness(color: string, percent: number): string {
  // For simple hex colors
  if (color.startsWith('#')) {
    const hex = color.slice(1);
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    const adjustedR = Math.max(0, Math.min(255, r + (r * percent / 100)));
    const adjustedG = Math.max(0, Math.min(255, g + (g * percent / 100)));
    const adjustedB = Math.max(0, Math.min(255, b + (b * percent / 100)));
    
    return `#${Math.round(adjustedR).toString(16).padStart(2, '0')}${Math.round(adjustedG).toString(16).padStart(2, '0')}${Math.round(adjustedB).toString(16).padStart(2, '0')}`;
  }
  
  // For complex colors, just return the original
  return color;
}

export default IsometricTile; 