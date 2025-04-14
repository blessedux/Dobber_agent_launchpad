import type { AgentData } from "@/components/agent-launchpad"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Cpu, Zap, Radio, Wifi, Sun, Plug, Check, Coins } from "lucide-react"

interface LaunchAgentProps {
  agentData: AgentData
}

export default function LaunchAgent({ agentData }: LaunchAgentProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">Launch Agent</h2>
        <p className="text-slate-600 dark:text-slate-300">
          You are now the founder of an autonomous business. Your device is online and intelligent.
        </p>
      </div>

      <Card className="border border-slate-200 dark:border-slate-700">
        <CardContent className="p-6 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              {getDeviceIcon(agentData.deviceType)}
              <div>
                <h3 className="text-lg font-medium text-slate-800 dark:text-slate-100">{agentData.agentName}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">{getDeviceName(agentData.deviceType)}</p>
              </div>
              <Badge className="ml-auto bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900">
                Ready to Launch
              </Badge>
            </div>

            <p className="text-slate-700 dark:text-slate-300 text-sm border-l-2 border-slate-200 dark:border-slate-700 pl-3 py-1">
              {agentData.agentDescription}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-slate-800 dark:text-slate-200">Agent Configuration</h4>
              <ul className="space-y-1">
                <li className="text-sm flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500" />
                  <span className="text-slate-600 dark:text-slate-400">Model: </span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">
                    {getLLMName(agentData.llmModel)}
                  </span>
                </li>
                <li className="text-sm flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500" />
                  <span className="text-slate-600 dark:text-slate-400">Collaboration: </span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">
                    {agentData.enableCollaboration ? "Enabled" : "Disabled"}
                  </span>
                </li>
                <li className="text-sm flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500" />
                  <span className="text-slate-600 dark:text-slate-400">Self-optimization: </span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">
                    {agentData.allowSelfOptimize ? "Enabled" : "Disabled"}
                  </span>
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium text-slate-800 dark:text-slate-200">On-Chain Details</h4>
              <ul className="space-y-1">
                <li className="text-sm flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500" />
                  <span className="text-slate-600 dark:text-slate-400">Profit Pool: </span>
                  <span className="font-mono text-xs text-slate-800 dark:text-slate-200">
                    {truncateAddress(agentData.profitPoolAddress)}
                  </span>
                </li>
                <li className="text-sm flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500" />
                  <span className="text-slate-600 dark:text-slate-400">Reward Destination: </span>
                  <span className="font-mono text-xs text-slate-800 dark:text-slate-200">
                    {truncateAddress(agentData.rewardDestination)}
                  </span>
                </li>
                <li className="text-sm flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500" />
                  <span className="text-slate-600 dark:text-slate-400">Permissions: </span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">
                    {getPermissionsText(agentData.permissions)}
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {agentData.tokenSettings.enabled && (
            <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Coins className="h-5 w-5 text-violet-500" />
                  <h4 className="text-sm font-medium text-slate-800 dark:text-slate-200">Agent Token</h4>
                </div>
                
                <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                  <div className="col-span-2 md:col-span-1">
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600 dark:text-slate-400">Name:</span>
                      <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                        {agentData.tokenSettings.name}
                      </span>
                    </div>
                  </div>
                  
                  <div className="col-span-2 md:col-span-1">
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600 dark:text-slate-400">Symbol:</span>
                      <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                        {agentData.tokenSettings.symbol}
                      </span>
                    </div>
                  </div>
                  
                  <div className="col-span-2 md:col-span-1">
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600 dark:text-slate-400">Supply:</span>
                      <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                        {agentData.tokenSettings.supply.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="col-span-2 md:col-span-1">
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600 dark:text-slate-400">Initial Price:</span>
                      <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                        ${agentData.tokenSettings.initialPrice.toFixed(2)} USDC
                      </span>
                    </div>
                  </div>
                  
                  <div className="col-span-2 md:col-span-1">
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600 dark:text-slate-400">Creator Royalty:</span>
                      <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                        {agentData.tokenSettings.creatorRoyalty}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="col-span-2 md:col-span-1">
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600 dark:text-slate-400">Token Holder Rewards:</span>
                      <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                        {agentData.tokenSettings.holderRewards}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="bg-violet-50 dark:bg-violet-900/20 p-4 rounded-lg border border-violet-100 dark:border-violet-800">
        <p className="text-sm text-violet-700 dark:text-violet-300">
          <span className="font-medium">Next steps:</span> After launching, your agent will begin managing your{" "}
          {getDeviceName(agentData.deviceType).toLowerCase()}. You can monitor its performance and earnings in the
          DOBBER dashboard.
          {agentData.tokenSettings.enabled && (
            <> Your agent token will be available for investment, allowing others to share in your agent's success.</>
          )}
        </p>
      </div>
    </div>
  )
}

function getDeviceIcon(deviceType: string) {
  switch (deviceType) {
    case "ev-charger":
      return <Plug className="w-6 h-6 text-emerald-500" />
    case "helium-miner":
      return <Radio className="w-6 h-6 text-emerald-500" />
    case "solar-node":
      return <Sun className="w-6 h-6 text-emerald-500" />
    case "iot-gateway":
      return <Wifi className="w-6 h-6 text-emerald-500" />
    case "compute-node":
      return <Cpu className="w-6 h-6 text-emerald-500" />
    case "energy-monitor":
      return <Zap className="w-6 h-6 text-emerald-500" />
    default:
      return <Cpu className="w-6 h-6 text-emerald-500" />
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
      return "Device"
  }
}

function getLLMName(llmModel: string): string {
  switch (llmModel) {
    case "gpt-4o":
      return "GPT-4o (Balanced)"
    case "claude-3":
      return "Claude 3 (Analytical)"
    case "llama-3":
      return "Llama 3 (Efficient)"
    case "depin-specialist":
      return "DePIN Specialist (Fine-tuned)"
    case "device-expert":
      return "Device Expert (Domain-specific)"
    default:
      return llmModel
  }
}

function truncateAddress(address: string): string {
  if (!address) return ""
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
}

function getPermissionsText(permissions: { monitor: boolean; deposit: boolean; manage: boolean }): string {
  const enabled = []
  if (permissions.monitor) enabled.push("Monitor")
  if (permissions.deposit) enabled.push("Deposit")
  if (permissions.manage) enabled.push("Manage")

  return enabled.join(", ")
}
