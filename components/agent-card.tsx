"use client"

import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Cpu, Zap, Radio, Wifi, Sun, Plug, ArrowRight, AlertTriangle, Sparkles } from "lucide-react"

interface AgentCardProps {
  name: string
  deviceType: string
  status: "online" | "offline" | "warning"
  revenue: string
  actions: number
  alert?: string
  isNew?: boolean
}

export default function AgentCard({ name, deviceType, status, revenue, actions, alert, isNew = false }: AgentCardProps) {
  return (
    <Card className={`overflow-hidden bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border-slate-200/70 dark:border-slate-700/70 ${isNew ? 'ring-2 ring-emerald-400 dark:ring-emerald-600' : ''}`}>
      <div className="bg-gradient-to-br from-violet-50/95 to-slate-50/95 dark:from-slate-800/95 dark:to-violet-950/50 border-b border-slate-200/80 dark:border-slate-700/80 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`rounded-full p-2 ${
              status === "online"
                ? "bg-emerald-100/80 dark:bg-emerald-900/40"
                : status === "warning"
                  ? "bg-amber-100/80 dark:bg-amber-900/40"
                  : "bg-slate-100/80 dark:bg-slate-800/80"
            }`}
          >
            {getDeviceIcon(deviceType)}
          </div>
          <div>
            <div className="flex items-center gap-1">
              <h3 className="font-medium text-lg">{name}</h3>
              {isNew && <Sparkles className="h-4 w-4 text-amber-500 ml-1" />}
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className={`text-xs ${
                  status === "online"
                    ? "border-emerald-200/70 bg-emerald-50/70 text-emerald-700 dark:bg-emerald-950/30 dark:border-emerald-800/70 dark:text-emerald-400"
                    : status === "warning"
                      ? "border-amber-200/70 bg-amber-50/70 text-amber-700 dark:bg-amber-950/30 dark:border-amber-800/70 dark:text-amber-400"
                      : "border-red-200/70 bg-red-50/70 text-red-700 dark:bg-red-950/30 dark:border-red-800/70 dark:text-red-400"
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
          <div className="flex items-center gap-2 p-2 mb-3 bg-amber-50/70 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300 text-sm rounded-md border border-amber-200/70 dark:border-amber-900/50">
            <AlertTriangle className="w-4 h-4" />
            <p>{alert}</p>
          </div>
        )}

        {isNew && (
          <div className="flex items-center gap-2 p-2 mb-3 bg-emerald-50/70 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 text-sm rounded-md border border-emerald-200/70 dark:border-emerald-900/50">
            <Sparkles className="w-4 h-4" />
            <p>New agent deployed and ready</p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Weekly Revenue</p>
            <div className="flex items-baseline">
              <p className="text-2xl font-bold">${revenue}</p>
              {parseFloat(revenue) > 0 ? (
                <span className="text-xs text-emerald-600 dark:text-emerald-400 ml-1">+2.4%</span>
              ) : (
                <span className="text-xs text-slate-500 dark:text-slate-400 ml-1">starting</span>
              )}
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
          <Button variant="outline" className="w-full border-slate-200/70 dark:border-slate-700/70 hover:bg-slate-100/70 dark:hover:bg-slate-800/70">
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
