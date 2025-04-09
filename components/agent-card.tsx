"use client"

import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Cpu, Zap, Radio, Wifi, Sun, Plug, ArrowRight, AlertTriangle } from "lucide-react"

interface AgentCardProps {
  name: string
  deviceType: string
  status: "online" | "offline" | "warning"
  revenue: string
  actions: number
  alert?: string
}

export default function AgentCard({ name, deviceType, status, revenue, actions, alert }: AgentCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="bg-gradient-to-br from-violet-50 to-slate-50 dark:from-slate-800 dark:to-violet-950/30 border-b border-slate-200 dark:border-slate-700 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`rounded-full p-2 ${
              status === "online"
                ? "bg-emerald-100 dark:bg-emerald-900/40"
                : status === "warning"
                  ? "bg-amber-100 dark:bg-amber-900/40"
                  : "bg-slate-100 dark:bg-slate-800"
            }`}
          >
            {getDeviceIcon(deviceType)}
          </div>
          <div>
            <h3 className="font-medium text-lg">{name}</h3>
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className={`text-xs ${
                  status === "online"
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:border-emerald-800 dark:text-emerald-400"
                    : status === "warning"
                      ? "border-amber-200 bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:border-amber-800 dark:text-amber-400"
                      : "border-red-200 bg-red-50 text-red-700 dark:bg-red-950/30 dark:border-red-800 dark:text-red-400"
                }`}
              >
                <span className="flex items-center gap-1">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      status === "online" ? "bg-emerald-500" : status === "warning" ? "bg-amber-500" : "bg-red-500"
                    }`}
                  ></span>
                  {status === "online" ? "Online" : status === "warning" ? "Warning" : "Offline"}
                </span>
              </Badge>
              <span className="text-xs text-slate-500 dark:text-slate-400">{getDeviceName(deviceType)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4">
        {alert && (
          <div className="flex items-center gap-2 p-2 mb-3 bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300 text-sm rounded-md border border-amber-200 dark:border-amber-900/50">
            <AlertTriangle className="w-4 h-4" />
            <p>{alert}</p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Weekly Revenue</p>
            <div className="flex items-baseline">
              <p className="text-2xl font-bold">${revenue}</p>
              <span className="text-xs text-emerald-600 dark:text-emerald-400 ml-1">+2.4%</span>
            </div>
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Actions Taken</p>
            <div className="flex items-baseline">
              <p className="text-2xl font-bold">{actions}</p>
              <span className="text-xs text-slate-500 dark:text-slate-400 ml-1">last 24h</span>
            </div>
          </div>
        </div>

        <Link href={`/agents/${name.toLowerCase()}`}>
          <Button variant="outline" className="w-full">
            <span>Manage Agent</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>
    </Card>
  )
}

function getDeviceIcon(deviceType: string) {
  switch (deviceType) {
    case "ev-charger":
      return <Plug className="w-5 h-5 text-violet-600 dark:text-violet-400" />
    case "helium-miner":
      return <Radio className="w-5 h-5 text-violet-600 dark:text-violet-400" />
    case "solar-node":
      return <Sun className="w-5 h-5 text-violet-600 dark:text-violet-400" />
    case "iot-gateway":
      return <Wifi className="w-5 h-5 text-violet-600 dark:text-violet-400" />
    case "compute-node":
      return <Cpu className="w-5 h-5 text-violet-600 dark:text-violet-400" />
    case "energy-monitor":
      return <Zap className="w-5 h-5 text-violet-600 dark:text-violet-400" />
    default:
      return <Cpu className="w-5 h-5 text-violet-600 dark:text-violet-400" />
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
