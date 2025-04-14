"use client"

import type { AgentData } from "@/components/agent-launchpad"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  LineChart, 
  BarChart3,
  Building2, 
  PieChart, 
  NetworkIcon
} from "lucide-react"

interface AgentTypeSelectionProps {
  agentData: AgentData & { agentType?: string }
  updateAgentData: (data: Partial<AgentData> & { agentType?: string }) => void
}

export const agentTypes = [
  { 
    id: "distributor", 
    name: "Distributor Agent", 
    description: "Manages revenue distribution and optimizes payment streams",
    icon: <BarChart3 className="w-5 h-5 text-violet-600" />,
    badge: "Distribution",
    color: "bg-violet-100 dark:bg-violet-900/30",
  },
  { 
    id: "farm-manager", 
    name: "Farm Manager Agent", 
    description: "Manages and optimizes device operations and maintenance",
    icon: <Building2 className="w-5 h-5 text-emerald-600" />,
    badge: "Management",
    color: "bg-emerald-100 dark:bg-emerald-900/30",
  },
  { 
    id: "portfolio", 
    name: "Portfolio Optimizer Agent", 
    description: "Manages investments and optimizes yield across multiple tokens",
    icon: <PieChart className="w-5 h-5 text-amber-600" />,
    badge: "Optimization",
    color: "bg-amber-100 dark:bg-amber-900/30",
  },
  { 
    id: "network", 
    name: "Network Orchestrator Agent", 
    description: "Coordinates multiple agents and ensures optimal system performance",
    icon: <NetworkIcon className="w-5 h-5 text-blue-600" />,
    badge: "Orchestration",
    color: "bg-blue-100 dark:bg-blue-900/30",
  }
];

export default function AgentTypeSelection({ agentData, updateAgentData }: AgentTypeSelectionProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">
          What type of agent do you want to create?
        </h2>
        <p className="text-slate-600 dark:text-slate-300">
          Different agents specialize in different tasks. Choose the one that fits your needs.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
        {agentTypes.map((type) => (
          <Card
            key={type.id}
            className={`p-4 cursor-pointer border hover:border-violet-400 dark:hover:border-violet-600 transition-colors ${
              agentData.agentType === type.id
                ? "border-violet-400 dark:border-violet-600 ring-2 ring-violet-400 dark:ring-violet-600"
                : "border-slate-200 dark:border-slate-700"
            }`}
            onClick={() => updateAgentData({ agentType: type.id })}
          >
            <div className="flex items-start space-x-4">
              <div className={`p-3 rounded-lg ${type.color}`}>
                {type.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{type.name}</h3>
                  <Badge variant="outline" className="ml-2 text-xs">
                    {type.badge}
                  </Badge>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  {type.description}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {agentData.agentType && (
        <div className="p-4 bg-violet-50 dark:bg-violet-900/20 rounded-lg border border-violet-100 dark:border-violet-800 mt-6">
          <p className="text-sm text-violet-700 dark:text-violet-300">
            <span className="font-medium">Tip:</span> {getAgentTip(agentData.agentType)}
          </p>
        </div>
      )}
    </div>
  )
}

function getAgentTip(agentType: string): string {
  switch (agentType) {
    case "distributor":
      return "Distributor agents excel at optimizing revenue flows and ensuring fair distribution of earnings across token holders."
    case "farm-manager":
      return "Farm manager agents are ideal for users with multiple devices, optimizing each device's performance and maintenance schedules."
    case "portfolio":
      return "Portfolio optimizer agents analyze market conditions and reallocate resources to maximize your yield across multiple token investments."
    case "network":
      return "Network orchestrator agents coordinate multiple agents to ensure they work together efficiently as a system."
    default:
      return "Each agent type has unique capabilities. Choose the one that best aligns with your strategic goals."
  }
} 