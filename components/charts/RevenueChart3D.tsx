"use client"

import { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Text, Box, PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'
import { Button, Card, CardHeader, Typography, Box as MuiBox, Tooltip } from '@mui/material'
import { Sun, Plug, Radio } from 'lucide-react'

// Interface for agent data
interface Agent {
  name: string;
  deviceType: string;
  status: string;
  revenue: string;
  actions: number;
  alert?: string;
  description?: string;
}

// Device type icons mapped to colors
const deviceTypeColors = {
  'solar-node': '#f59e0b', // amber
  'ev-charger': '#10b981', // emerald
  'helium-miner': '#8b5cf6', // violet
  'compute-node': '#3b82f6', // blue
}

// Bar component that represents a device's revenue
function RevenueBar({ 
  position, 
  height, 
  color, 
  name, 
  revenue, 
  scale, 
  onClick, 
  isHighlighted 
}: {
  position: [number, number, number];
  height: number;
  color: string;
  name: string;
  revenue: string;
  scale: number;
  onClick: () => void;
  isHighlighted: boolean;
}) {
  const barRef = useRef<THREE.Mesh>(null)
  
  // Animation for hover effect
  useFrame(() => {
    if (barRef.current && isHighlighted) {
      barRef.current.scale.y = THREE.MathUtils.lerp(barRef.current.scale.y, 1.1, 0.1)
    } else if (barRef.current) {
      barRef.current.scale.y = THREE.MathUtils.lerp(barRef.current.scale.y, 1, 0.1)
    }
  })

  return (
    <group position={position} onClick={onClick}>
      <Box
        ref={barRef}
        args={[1, height, 1]}
        position={[0, height / 2, 0]}
        scale={[scale, 1, scale]}
      >
        <meshStandardMaterial color={color} metalness={0.5} roughness={0.2} />
      </Box>
      <Text
        position={[0, height + 0.5, 0]}
        color="white"
        fontSize={0.4}
        anchorX="center"
        anchorY="middle"
      >
        {name}
      </Text>
      <Text
        position={[0, height + 0.9, 0]}
        color="white"
        fontSize={0.3}
        anchorX="center"
        anchorY="middle"
      >
        ${revenue}
      </Text>
    </group>
  )
}

// Scene component that contains all the 3D elements
function RevenueScene({ data, onSelectAgent }: { data: Agent[]; onSelectAgent: (agent: Agent | null) => void }) {
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)
  
  const handleAgentClick = (agent: Agent) => {
    setSelectedAgent(agent === selectedAgent ? null : agent)
    if (onSelectAgent) onSelectAgent(agent === selectedAgent ? null : agent)
  }
  
  // Calculate the maximum revenue for scaling
  const maxRevenue = Math.max(...data.map(agent => parseFloat(agent.revenue))) || 1
  
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <PerspectiveCamera makeDefault position={[0, 6, 15]} />
      <OrbitControls 
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={5}
        maxDistance={30}
      />
      
      {/* Grid and axis helpers */}
      <gridHelper args={[20, 20, '#555555', '#222222']} position={[0, 0, 0]} />
      
      {/* Render revenue bars for each agent */}
      {data.map((agent, index) => {
        const height = (parseFloat(agent.revenue) / maxRevenue) * 5 || 0.1
        const color = deviceTypeColors[agent.deviceType as keyof typeof deviceTypeColors] || '#777777'
        const position: [number, number, number] = [
          (index - (data.length - 1) / 2) * 2, // spread across x-axis
          0, 
          0
        ]
        
        return (
          <RevenueBar
            key={agent.name}
            position={position}
            height={height}
            color={color}
            name={agent.name}
            revenue={agent.revenue}
            scale={1}
            onClick={() => handleAgentClick(agent)}
            isHighlighted={agent === selectedAgent}
          />
        )
      })}
    </>
  )
}

// Tip button component
function TipAgentButton({ agent, onTip }: { agent: Agent | null; onTip: (agent: Agent) => void }) {
  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'solar-node': return <Sun className="h-4 w-4 text-amber-500" />;
      case 'ev-charger': return <Plug className="h-4 w-4 text-emerald-500" />;
      case 'helium-miner': return <Radio className="h-4 w-4 text-violet-500" />;
      default: return null;
    }
  };

  if (!agent) return null;

  return (
    <Tooltip title="Allocate additional resources to this agent">
      <Button 
        variant="contained" 
        color="primary" 
        size="small"
        onClick={() => onTip && onTip(agent)}
        startIcon={getDeviceIcon(agent.deviceType)}
        sx={{ 
          mt: 2, 
          backgroundColor: deviceTypeColors[agent.deviceType as keyof typeof deviceTypeColors] || '#6366f1',
          '&:hover': {
            backgroundColor: deviceTypeColors[agent.deviceType as keyof typeof deviceTypeColors] 
              ? `${deviceTypeColors[agent.deviceType as keyof typeof deviceTypeColors]}dd` 
              : '#4f46e5'
          }
        }}
      >
        Boost {agent.name}
      </Button>
    </Tooltip>
  );
}

// Main component export
export default function RevenueChart3D({ data = [] }: { data: Agent[] }) {
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)
  
  const handleTipAgent = (agent: Agent) => {
    // Here you would implement the logic to "tip" or allocate more resources to the agent
    console.log(`Boosting agent: ${agent.name}`)
    // Display a toast or feedback
    alert(`You've allocated additional computing resources to ${agent.name}. This agent will now have priority in the swarm.`)
  }
  
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardHeader 
        title={
          <Typography variant="h6" component="div">
            Agent Revenue Performance (3D)
          </Typography>
        } 
        subheader={
          selectedAgent ? (
            <Typography variant="body2" color="text.secondary">
              {selectedAgent.name}: ${selectedAgent.revenue} revenue · {selectedAgent.actions} actions
            </Typography>
          ) : "Click on an agent to select and view details"
        }
      />
      
      <MuiBox sx={{ flexGrow: 1, height: 400, position: 'relative' }}>
        <Canvas>
          <RevenueScene 
            data={data} 
            onSelectAgent={setSelectedAgent}
          />
        </Canvas>
        
        {/* Tip button shown when an agent is selected */}
        <MuiBox sx={{ position: 'absolute', bottom: 16, right: 16 }}>
          <TipAgentButton agent={selectedAgent} onTip={handleTipAgent} />
        </MuiBox>
      </MuiBox>
    </Card>
  )
} 