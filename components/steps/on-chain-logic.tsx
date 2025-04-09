"use client"

import type { AgentData } from "@/components/agent-launchpad"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { PlusCircle, Info } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface OnChainLogicProps {
  agentData: AgentData
  updateAgentData: (data: Partial<AgentData>) => void
}

export default function OnChainLogic({ agentData, updateAgentData }: OnChainLogicProps) {
  const generateRandomAddress = () => {
    const chars = "0123456789abcdef"
    let result = "0x"
    for (let i = 0; i < 40; i++) {
      result += chars[Math.floor(Math.random() * chars.length)]
    }
    return result
  }

  const handleCreateNewPool = () => {
    const newAddress = generateRandomAddress()
    updateAgentData({ profitPoolAddress: newAddress })
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">Set Up On-Chain Logic</h2>
        <p className="text-slate-600 dark:text-slate-300">
          The agent will collect rewards and route them into the decentralized treasury of your choosing.
        </p>
      </div>

      <div className="space-y-4 pt-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label htmlFor="profit-pool">Profit Pool Address</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-slate-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">This is where your agent will store collected rewards before distribution</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex gap-2">
            <Input
              id="profit-pool"
              placeholder="0x..."
              value={agentData.profitPoolAddress}
              onChange={(e) => updateAgentData({ profitPoolAddress: e.target.value })}
              className="font-mono text-sm"
            />
            <Button variant="outline" size="sm" onClick={handleCreateNewPool} className="whitespace-nowrap">
              <PlusCircle className="h-4 w-4 mr-2" />
              Create New
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="reward-destination">Reward Destination Wallet</Label>
          <Input
            id="reward-destination"
            placeholder="0x..."
            value={agentData.rewardDestination}
            onChange={(e) => updateAgentData({ rewardDestination: e.target.value })}
            className="font-mono text-sm"
          />
        </div>

        <div className="space-y-3 pt-2">
          <Label>Agent Permissions</Label>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="permission-monitor" className="text-sm font-normal">
                Monitor
              </Label>
              <p className="text-xs text-slate-500 dark:text-slate-400">View device status and performance metrics</p>
            </div>
            <Switch
              id="permission-monitor"
              checked={agentData.permissions.monitor}
              onCheckedChange={(checked) =>
                updateAgentData({
                  permissions: { ...agentData.permissions, monitor: checked },
                })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="permission-deposit" className="text-sm font-normal">
                Deposit
              </Label>
              <p className="text-xs text-slate-500 dark:text-slate-400">Collect and deposit rewards to profit pool</p>
            </div>
            <Switch
              id="permission-deposit"
              checked={agentData.permissions.deposit}
              onCheckedChange={(checked) =>
                updateAgentData({
                  permissions: { ...agentData.permissions, deposit: checked },
                })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="permission-manage" className="text-sm font-normal">
                Manage
              </Label>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Make operational decisions and optimize settings
              </p>
            </div>
            <Switch
              id="permission-manage"
              checked={agentData.permissions.manage}
              onCheckedChange={(checked) =>
                updateAgentData({
                  permissions: { ...agentData.permissions, manage: checked },
                })
              }
            />
          </div>
        </div>
      </div>
    </div>
  )
}
