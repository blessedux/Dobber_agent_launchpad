import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Cpu, Zap, Radio, Wifi, Sun, Plug, AlertTriangle, ExternalLink } from "lucide-react"
import Link from "next/link"

interface DeviceHealthPanelProps {
  name: string
  type: string
  status: "online" | "offline" | "warning"
  uptime: string
  pool: string
  lastReward: string
  alert?: string
}

export default function DeviceHealthPanel({
  name,
  type,
  status,
  uptime,
  pool,
  lastReward,
  alert,
}: DeviceHealthPanelProps) {
  return (
    <Card className="overflow-hidden bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border-slate-200/70 dark:border-slate-700/70">
      <div className="bg-gradient-to-br from-slate-50/95 to-slate-100/95 dark:from-slate-800/95 dark:to-slate-900/95 border-b border-slate-200/80 dark:border-slate-700/80 p-4 flex items-center justify-between">
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
            {getDeviceIcon(type)}
          </div>
          <div>
            <h3 className="font-medium text-lg">{name}</h3>
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
              <span className="text-xs text-slate-500 dark:text-slate-400">{getDeviceName(type)}</span>
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

        <dl className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <dt className="text-xs text-slate-500 dark:text-slate-400">Uptime</dt>
            <dd className="font-medium">{uptime}</dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500 dark:text-slate-400">Last Reward</dt>
            <dd className="font-medium">{lastReward}</dd>
          </div>
          <div className="col-span-2">
            <dt className="text-xs text-slate-500 dark:text-slate-400">Connected Pool</dt>
            <dd className="font-mono text-sm truncate">{pool}</dd>
          </div>
        </dl>

        <Link href={`/devices/${name.toLowerCase().replace(/\s+/g, "-")}`}>
          <Button variant="outline" className="w-full border-slate-200/70 dark:border-slate-700/70 hover:bg-slate-100/70 dark:hover:bg-slate-800/70">
            <span>Device Details</span>
            <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>
    </Card>
  )
}

function getDeviceIcon(deviceType: string) {
  switch (deviceType) {
    case "ev-charger":
      return <Plug className="w-5 h-5 text-slate-600 dark:text-slate-400" />
    case "helium-miner":
      return <Radio className="w-5 h-5 text-slate-600 dark:text-slate-400" />
    case "solar-node":
      return <Sun className="w-5 h-5 text-slate-600 dark:text-slate-400" />
    case "iot-gateway":
      return <Wifi className="w-5 h-5 text-slate-600 dark:text-slate-400" />
    case "compute-node":
      return <Cpu className="w-5 h-5 text-slate-600 dark:text-slate-400" />
    case "energy-monitor":
      return <Zap className="w-5 h-5 text-slate-600 dark:text-slate-400" />
    default:
      return <Cpu className="w-5 h-5 text-slate-600 dark:text-slate-400" />
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
