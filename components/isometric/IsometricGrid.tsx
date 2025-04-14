import React, { useState, useRef, useEffect } from 'react';
import { Device, NetworkAgent, DeviceNetwork } from '@/data/mockDeviceNetwork';
import IsometricTile from './IsometricTile';
import IsometricDevice from './IsometricDevice';
import IsometricAgent from './IsometricAgent';
import RevenueFlow from './RevenueFlow';
import { TILE_WIDTH, TILE_HEIGHT } from '@/lib/utils/isometric';
import { Home, Filter } from 'lucide-react';
import { Card } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface IsometricGridProps {
  networkData: DeviceNetwork;
}

const IsometricGrid: React.FC<IsometricGridProps> = ({ networkData }) => {
  // Reference for the container element
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Selection state
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  
  // View filters
  const [showMyDevices, setShowMyDevices] = useState(true);
  const [showMyAgents, setShowMyAgents] = useState(true);
  const [showMyTokens, setShowMyTokens] = useState(true);
  const [showAll, setShowAll] = useState(false); // Override to show everything
  
  // Position for user avatar (command center)
  const userPosition = { x: 5, y: 8 };
  
  // Handle device selection
  const handleSelectDevice = (deviceId: string) => {
    setSelectedDeviceId(deviceId === selectedDeviceId ? null : deviceId);
    setSelectedAgentId(null); // Deselect agent
  };
  
  // Handle agent selection
  const handleSelectAgent = (agentId: string) => {
    setSelectedAgentId(agentId === selectedAgentId ? null : agentId);
    setSelectedDeviceId(null); // Deselect device
  };
  
  // Filter devices based on view settings
  const visibleDevices = networkData.devices.filter(device => {
    if (showAll) return true;
    
    const isUserOwned = device.ownerAddress === networkData.userAddress;
    
    // Check if user has tokens in the managing agent
    const managingAgent = networkData.agents.find(agent => agent.id === device.managingAgentId);
    const hasUserTokens = managingAgent && 
                          managingAgent.ownerAddress !== networkData.userAddress &&
                          managingAgent.tokenHolders[networkData.userAddress] > 0;
    
    return (isUserOwned && showMyDevices) || 
           (hasUserTokens && showMyTokens);
  });
  
  // Filter agents based on view settings
  const visibleAgents = networkData.agents.filter(agent => {
    if (showAll) return true;
    
    const isUserOwned = agent.ownerAddress === networkData.userAddress;
    const hasUserTokens = !isUserOwned && agent.tokenHolders[networkData.userAddress] > 0;
    
    return (isUserOwned && showMyAgents) || 
           (hasUserTokens && showMyTokens);
  });
  
  // Determine grid dimensions based on the data
  const gridSize = networkData.gridSize;
  
  // Set up container dimensions
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Calculate container size based on grid dimensions
    const width = (gridSize.width + gridSize.height) * (TILE_WIDTH / 2) + 100;
    const height = (gridSize.width + gridSize.height) * (TILE_HEIGHT / 2) + 250;
    
    containerRef.current.style.width = `${width}px`;
    containerRef.current.style.height = `${height}px`;
  }, [gridSize]);
  
  // Get the selected device and agent
  const selectedDevice = selectedDeviceId 
    ? networkData.devices.find(d => d.id === selectedDeviceId)
    : null;
    
  const selectedAgent = selectedAgentId
    ? networkData.agents.find(a => a.id === selectedAgentId)
    : null;
  
  return (
    <div className="relative w-full overflow-auto">
      {/* Controls */}
      <div className="fixed top-4 right-4 z-[2000] flex gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 bg-slate-900/90 text-white px-3 py-2 rounded-lg text-sm">
              <Filter className="w-4 h-4" />
              <span>View Filter</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuCheckboxItem
              checked={showMyDevices}
              onCheckedChange={(checked: boolean) => setShowMyDevices(checked)}
            >
              My Devices
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={showMyAgents}
              onCheckedChange={(checked: boolean) => setShowMyAgents(checked)}
            >
              My Agents
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={showMyTokens}
              onCheckedChange={(checked: boolean) => setShowMyTokens(checked)}
            >
              My Token Holdings
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={showAll}
              onCheckedChange={(checked: boolean) => setShowAll(checked)}
            >
              Show All Network
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {/* Info panel for selected items */}
      {(selectedDevice || selectedAgent) && (
        <div className="fixed bottom-4 left-4 z-[2000] w-80 bg-slate-900/90 text-white rounded-lg overflow-hidden">
          {selectedDevice && (
            <Card className="p-4 bg-slate-900/90 text-white border-slate-700">
              <h3 className="text-lg font-semibold">{selectedDevice.name}</h3>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div>
                  <p className="text-xs text-slate-400">Status</p>
                  <p className="font-medium capitalize">{selectedDevice.status}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Type</p>
                  <p className="font-medium capitalize">{selectedDevice.type.replace('-', ' ')}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Revenue Per Day</p>
                  <p className="font-medium text-emerald-400">${selectedDevice.revenuePerDay.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Owner</p>
                  <p className="font-medium">
                    {selectedDevice.ownerAddress === networkData.userAddress
                      ? 'You'
                      : `${selectedDevice.ownerAddress.slice(0, 6)}...`}
                  </p>
                </div>
              </div>
              
              {selectedDevice.managingAgentId && (
                <div className="mt-3 pt-3 border-t border-slate-700">
                  <p className="text-xs text-slate-400">Managed By</p>
                  <p className="font-medium">
                    {networkData.agents.find(a => a.id === selectedDevice?.managingAgentId)?.name || 'Unknown Agent'}
                  </p>
                </div>
              )}
            </Card>
          )}
          
          {selectedAgent && (
            <Card className="p-4 bg-slate-900/90 text-white border-slate-700">
              <h3 className="text-lg font-semibold">{selectedAgent.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs px-2 py-0.5 bg-purple-500/30 text-purple-200 rounded-full">
                  {selectedAgent.type.replace('Agent', '')}
                </span>
                <span className="text-xs text-slate-300">
                  {selectedAgent.verificationStatus}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-2 mt-3">
                <div>
                  <p className="text-xs text-slate-400">Token</p>
                  <p className="font-medium">${selectedAgent.tokenSymbol}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Price</p>
                  <p className="font-medium">${selectedAgent.tokenPrice}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Supply</p>
                  <p className="font-medium">{selectedAgent.tokenSupply.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Revenue Generated</p>
                  <p className="font-medium text-emerald-400">${selectedAgent.revenueGenerated.toFixed(2)}</p>
                </div>
              </div>
              
              <div className="mt-3 pt-3 border-t border-slate-700">
                <p className="text-xs text-slate-400">Your Holdings</p>
                {selectedAgent.tokenHolders[networkData.userAddress] ? (
                  <div className="flex items-center justify-between">
                    <p className="font-medium">
                      {selectedAgent.tokenHolders[networkData.userAddress].toLocaleString()} tokens
                    </p>
                    <p className="text-xs text-emerald-400">
                      {((selectedAgent.tokenHolders[networkData.userAddress] / selectedAgent.tokenSupply) * 100).toFixed(1)}%
                    </p>
                  </div>
                ) : (
                  <p className="text-sm">You don't own any tokens in this agent</p>
                )}
              </div>
            </Card>
          )}
        </div>
      )}
      
      {/* Isometric grid container */}
      <div 
        ref={containerRef} 
        className="relative mx-auto my-12 touch-none"
        style={{ 
          perspective: '1000px',
          transformStyle: 'preserve-3d'
        }}
      >
        {/* Centered transformation container */}
        <div 
          className="absolute left-1/2 top-1/2 transform-gpu -translate-x-1/2 -translate-y-1/2" 
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Grid tiles */}
          {Array.from({ length: gridSize.width }).map((_, x) =>
            Array.from({ length: gridSize.height }).map((_, y) => (
              <IsometricTile 
                key={`tile-${x}-${y}`}
                x={x} 
                y={y}
                color={
                  (x + y) % 2 === 0 
                    ? '#dbeafe' // Light blue
                    : '#e0f2fe' // Even lighter blue
                }
                z={0}
              />
            ))
          )}
          
          {/* User command center */}
          <IsometricTile
            x={userPosition.x}
            y={userPosition.y}
            z={0}
            color="#6b46fe"
          >
            <div className="flex items-center justify-center bg-white/20 rounded-full p-2">
              <Home className="w-6 h-6 text-white" />
            </div>
          </IsometricTile>
          
          {/* Render devices */}
          {visibleDevices.map(device => {
            const isUserOwned = device.ownerAddress === networkData.userAddress;
            const managingAgent = networkData.agents.find(agent => agent.id === device.managingAgentId);
            const hasUserTokens = managingAgent && 
                                  managingAgent.ownerAddress !== networkData.userAddress &&
                                  managingAgent.tokenHolders[networkData.userAddress] > 0;
            
            return (
              <IsometricDevice
                key={device.id}
                device={device}
                isSelected={selectedDeviceId === device.id}
                onSelect={handleSelectDevice}
                isUserOwned={isUserOwned}
                hasUserTokens={hasUserTokens}
              />
            );
          })}
          
          {/* Render agents */}
          {visibleAgents.map(agent => {
            const isUserOwned = agent.ownerAddress === networkData.userAddress;
            const hasUserTokens = !isUserOwned && agent.tokenHolders[networkData.userAddress] > 0;
            
            return (
              <IsometricAgent
                key={agent.id}
                agent={agent}
                isSelected={selectedAgentId === agent.id}
                onSelect={handleSelectAgent}
                isUserOwned={isUserOwned}
                hasUserTokens={hasUserTokens}
              />
            );
          })}
          
          {/* Revenue flows */}
          {visibleDevices.map(device => {
            // Only render flow if device has a managing agent
            if (!device.managingAgentId) return null;
            
            const agent = networkData.agents.find(a => a.id === device.managingAgentId);
            if (!agent) return null;
            
            const isUserOwned = device.ownerAddress === networkData.userAddress;
            const hasUserTokens = agent.ownerAddress !== networkData.userAddress &&
                                  agent.tokenHolders[networkData.userAddress] > 0;
            
            return (
              <RevenueFlow
                key={`flow-${device.id}`}
                device={device}
                agent={agent}
                userPosition={userPosition}
                isUserOwned={isUserOwned}
                hasUserTokens={hasUserTokens}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default IsometricGrid; 