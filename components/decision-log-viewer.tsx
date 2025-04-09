"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Brain, Info, BarChart, AlertTriangle, Clock } from "lucide-react"

type Decision = {
  id: string
  timestamp: string
  agent: string
  deviceType: string
  type: "optimization" | "maintenance" | "alert" | "revenue"
  description: string
}

const decisions: Decision[] = [
  {
    id: "dec-1",
    timestamp: "Today, 14:23",
    agent: "SolarOptimizer",
    deviceType: "solar-node",
    type: "optimization",
    description: "Adjusted panel orientation by 12° to maximize afternoon sun exposure, estimated +4.2% daily yield",
  },
  {
    id: "dec-2",
    timestamp: "Today, 12:05",
    agent: "ChargeMaster",
    deviceType: "ev-charger",
    type: "revenue",
    description: "Dynamically increased charging rates during peak demand, resulting in $18.42 additional revenue",
  },
  {
    id: "dec-3",
    timestamp: "Today, 09:17",
    agent: "NetGuard",
    deviceType: "helium-miner",
    type: "alert",
    description: "Detected signal interference from neighboring device, initiated automatic frequency adjustment",
  },
  {
    id: "dec-4",
    timestamp: "Yesterday, 19:45",
    agent: "SolarOptimizer",
    deviceType: "solar-node",
    type: "maintenance",
    description: "Scheduled cleaning service after detecting 8% efficiency drop due to dust accumulation",
  },
  {
    id: "dec-5",
    timestamp: "Yesterday, 15:30",
    agent: "ChargeMaster",
    deviceType: "ev-charger",
    type: "optimization",
    description: "Implemented smart queue management during high traffic period, improving throughput by 23%",
  },
]

export default function DecisionLogViewer() {
  const [filter, setFilter] = useState("all")

  const filteredDecisions =
    filter === "all"
      ? decisions
      : decisions.filter((d) => d.type === filter || d.agent.toLowerCase().includes(filter.toLowerCase()))

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Brain className="w-4 h-4 text-slate-400" />
          <span className="text-sm text-slate-500 dark:text-slate-400">Agent decisions and actions</span>
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Decisions</SelectItem>
            <SelectItem value="optimization">Optimization</SelectItem>
            <SelectItem value="maintenance">Maintenance</SelectItem>
            <SelectItem value="alert">Alerts</SelectItem>
            <SelectItem value="revenue">Revenue</SelectItem>
            <SelectItem value="SolarOptimizer">Solar Agent</SelectItem>
            <SelectItem value="ChargeMaster">EV Agent</SelectItem>
            <SelectItem value="NetGuard">Helium Agent</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        {filteredDecisions.map((decision) => (
          <div
            key={decision.id}
            className="p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
          >
            <div className="flex items-center justify-between mb-2">
              <Badge variant="outline" className={`text-xs ${getTypeBadgeStyles(decision.type)}`}>
                <span className="flex items-center gap-1">
                  {getTypeIcon(decision.type)}
                  {getTypeLabel(decision.type)}
                </span>
              </Badge>
              <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
                <Clock className="w-3.5 h-3.5 mr-1" />
                {decision.timestamp}
              </div>
            </div>
            <p className="text-sm">{decision.description}</p>
            <div className="flex items-center gap-1 mt-2 text-xs text-slate-500 dark:text-slate-400">
              <span>{decision.agent}</span>
              <span>•</span>
              <span>{getDeviceName(decision.deviceType)}</span>
            </div>
          </div>
        ))}

        {filteredDecisions.length === 0 && (
          <div className="py-8 flex flex-col items-center justify-center text-slate-400">
            <Info className="w-8 h-8 mb-2" />
            <p>No decisions found with the selected filter</p>
          </div>
        )}
      </div>
    </div>
  )
}

function getTypeIcon(type: string) {
  switch (type) {
    case "optimization":
      return <Brain className="w-3.5 h-3.5 mr-1" />
    case "maintenance":
      return <Info className="w-3.5 h-3.5 mr-1" />
    case "alert":
      return <AlertTriangle className="w-3.5 h-3.5 mr-1" />
    case "revenue":
      return <BarChart className="w-3.5 h-3.5 mr-1" />
    default:
      return null
  }
}

function getTypeLabel(type: string): string {
  switch (type) {
    case "optimization":
      return "Optimization"
    case "maintenance":
      return "Maintenance"
    case "alert":
      return "Alert"
    case "revenue":
      return "Revenue"
    default:
      return type
  }
}

function getTypeBadgeStyles(type: string): string {
  switch (type) {
    case "optimization":
      return "border-violet-200 bg-violet-50 text-violet-700 dark:bg-violet-950/30 dark:border-violet-800 dark:text-violet-400"
    case "maintenance":
      return "border-blue-200 bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:border-blue-800 dark:text-blue-400"
    case "alert":
      return "border-amber-200 bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:border-amber-800 dark:text-amber-400"
    case "revenue":
      return "border-emerald-200 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:border-emerald-800 dark:text-emerald-400"
    default:
      return "border-slate-200 bg-slate-50 text-slate-700 dark:bg-slate-950/30 dark:border-slate-800 dark:text-slate-400"
  }
}

function getDeviceName(deviceType: string): string {
  switch (deviceType) {
    case "ev-charger":
      return "EV Charger"
    case "helium-miner":
      return "Helium Miner"
    case "solar-node":
      return "Solar Node"
    case "iot-gateway":
      return "IoT Gateway"
    case "compute-node":
      return "Compute Node"
    case "energy-monitor":
      return "Energy Monitor"
    default:
      return deviceType
  }
}
