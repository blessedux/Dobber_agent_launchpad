"use client"

import type { AgentData } from "@/components/agent-launchpad"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Cpu, Zap, Radio, Wifi, Sun, Plug } from "lucide-react"

interface DeviceSelectionProps {
  agentData: AgentData
  updateAgentData: (data: Partial<AgentData>) => void
}

const deviceTypes = [
  { value: "ev-charger", label: "EV Charger", icon: <Plug className="w-5 h-5 mr-2" /> },
  { value: "helium-miner", label: "Helium Miner", icon: <Radio className="w-5 h-5 mr-2" /> },
  { value: "solar-node", label: "Solar Node", icon: <Sun className="w-5 h-5 mr-2" /> },
  { value: "iot-gateway", label: "IoT Gateway", icon: <Wifi className="w-5 h-5 mr-2" /> },
  { value: "compute-node", label: "Compute Node", icon: <Cpu className="w-5 h-5 mr-2" /> },
  { value: "energy-monitor", label: "Energy Monitor", icon: <Zap className="w-5 h-5 mr-2" /> },
]

export default function DeviceSelection({ agentData, updateAgentData }: DeviceSelectionProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">
          What type of device will your agent manage?
        </h2>
        <p className="text-slate-600 dark:text-slate-300">
          Each device is a potential revenue stream. Let your agent take control.
        </p>
      </div>

      <div className="space-y-4 pt-4">
        <div className="space-y-2">
          <Label htmlFor="device-type">Device Type</Label>
          <Select value={agentData.deviceType} onValueChange={(value) => updateAgentData({ deviceType: value })}>
            <SelectTrigger id="device-type" className="w-full">
              <SelectValue placeholder="Select a device type" />
            </SelectTrigger>
            <SelectContent>
              {deviceTypes.map((device) => (
                <SelectItem key={device.value} value={device.value} className="flex items-center">
                  <div className="flex items-center">
                    {device.icon}
                    {device.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {agentData.deviceType && (
          <div className="p-4 bg-violet-50 dark:bg-violet-900/20 rounded-lg border border-violet-100 dark:border-violet-800 mt-6">
            <p className="text-sm text-violet-700 dark:text-violet-300">
              <span className="font-medium">Tip:</span> {getDeviceTip(agentData.deviceType)}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

function getDeviceTip(deviceType: string): string {
  switch (deviceType) {
    case "ev-charger":
      return "EV chargers can generate revenue through usage fees while your agent optimizes charging schedules based on energy prices."
    case "helium-miner":
      return "Helium miners earn HNT tokens by providing network coverage. Your agent will monitor performance and optimize placement."
    case "solar-node":
      return "Solar nodes can sell excess energy to the grid. Your agent will maximize energy production and storage efficiency."
    case "iot-gateway":
      return "IoT gateways connect devices to the internet. Your agent will ensure uptime and manage data routing efficiently."
    case "compute-node":
      return "Compute nodes can rent out processing power. Your agent will allocate resources to maximize returns."
    case "energy-monitor":
      return "Energy monitors track consumption patterns. Your agent will identify savings opportunities and optimize usage."
    default:
      return "Your agent will autonomously manage this device to maximize its potential and revenue."
  }
}
