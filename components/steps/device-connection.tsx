"use client"

import { useState } from "react"
import type { AgentData } from "@/components/agent-launchpad"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Copy, Check, ArrowDownToLine } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface DeviceConnectionProps {
  agentData: AgentData
  updateAgentData: (data: Partial<AgentData>) => void
}

export default function DeviceConnection({ agentData, updateAgentData }: DeviceConnectionProps) {
  const [copied, setCopied] = useState(false)

  // Generate a deterministic plugin address based on agent name and device type
  const pluginAddress = `dob:${Buffer.from(agentData.agentName + agentData.deviceType)
    .toString("base64")
    .substring(0, 32)}`

  const handleCopy = () => {
    navigator.clipboard.writeText(pluginAddress)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">Connect to Device</h2>
        <p className="text-slate-600 dark:text-slate-300">
          DOB connects directly to your DePIN device using native tooling and on-chain addresses.
        </p>
      </div>

      <div className="space-y-4 pt-4">
        <Alert className="bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-800">
          <AlertDescription className="text-amber-800 dark:text-amber-300">
            Install the DOB plugin in your device's dashboard or firmware settings.
          </AlertDescription>
        </Alert>

        <div className="space-y-2">
          <Label htmlFor="plugin-address">Agent Plugin Address</Label>
          <div className="flex">
            <Input id="plugin-address" value={pluginAddress} readOnly className="font-mono text-sm rounded-r-none" />
            <Button variant="outline" size="icon" className="rounded-l-none border-l-0" onClick={handleCopy}>
              {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Paste this address into your device's dashboard or firmware settings.
          </p>
        </div>

        <div className="pt-4">
          <Button variant="outline" className="w-full flex items-center justify-center gap-2 py-6">
            <ArrowDownToLine className="h-5 w-5" />
            <span>Download DOB Plugin for {getDeviceName(agentData.deviceType)}</span>
          </Button>
          <p className="text-xs text-center text-slate-500 dark:text-slate-400 mt-2">
            For manual installation on your device
          </p>
        </div>

        <div className="flex items-center space-x-2 pt-4">
          <Checkbox
            id="plugin-installed"
            checked={agentData.pluginInstalled}
            onCheckedChange={(checked) => updateAgentData({ pluginInstalled: checked === true })}
          />
          <Label htmlFor="plugin-installed" className="font-medium">
            I confirm the DOB plugin has been installed on my device
          </Label>
        </div>
      </div>
    </div>
  )
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
