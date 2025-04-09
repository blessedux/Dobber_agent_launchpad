"use client";

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Filter, ArrowUpDown, Search, Cpu } from "lucide-react"
import { Input } from "@/components/ui/input"
import DeviceHealthPanel from "@/components/device-health-panel"
import { TransitionLink } from "@/components/ui/transition-link"
import { motion } from "framer-motion";

// Mock data - in a real app this would come from an API or database
const hasDevices = true

export default function DevicesPage() {
  return (
    <main className="container px-4 py-8 md:py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4"
      >
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-100">Devices</h1>
          <p className="text-slate-600 dark:text-slate-300 mt-1">Manage your connected DePIN devices</p>
        </div>

        <TransitionLink href="/add-device">
          <Button className="bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600">
            <Plus className="w-4 h-4 mr-2" />
            Add New Device
          </Button>
        </TransitionLink>
      </motion.div>

      {!hasDevices ? (
        <EmptyDevicesState />
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500 dark:text-slate-400" />
              <Input type="search" placeholder="Search devices..." className="pl-9 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm" />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm">
                <Filter className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm">
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Tabs defaultValue="all" className="w-full mb-6">
            <TabsList className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm">
              <TabsTrigger value="all">All Devices</TabsTrigger>
              <TabsTrigger value="online">Online</TabsTrigger>
              <TabsTrigger value="offline">Offline</TabsTrigger>
              <TabsTrigger value="unassigned">Unassigned</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <DeviceHealthPanel
              name="Solar Panel Array A"
              type="solar-node"
              status="online"
              uptime="99.7%"
              pool="0x7a23...45df"
              lastReward="12 hours ago"
            />
            <DeviceHealthPanel
              name="Downtown EV Station"
              type="ev-charger"
              status="online"
              uptime="98.2%"
              pool="0x8b12...f67a"
              lastReward="3 hours ago"
            />
            <DeviceHealthPanel
              name="Helium Hotspot #42"
              type="helium-miner"
              status="warning"
              uptime="78.4%"
              pool="0x3d45...921c"
              lastReward="2 days ago"
              alert="Signal strength degraded"
            />
            <DeviceHealthPanel
              name="Energy Grid Monitor"
              type="energy-monitor"
              status="online"
              uptime="100%"
              pool="0x9f34...12ab"
              lastReward="6 hours ago"
            />
            <DeviceHealthPanel
              name="Edge Compute Node"
              type="compute-node"
              status="offline"
              uptime="45.3%"
              pool="0x2c67...89de"
              lastReward="5 days ago"
              alert="Hardware failure detected"
            />
            <Card className="border-dashed border-2 flex items-center justify-center p-6 h-[230px] bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm">
              <TransitionLink href="/add-device">
                <Button variant="ghost" className="h-auto flex flex-col gap-3 py-6">
                  <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-full">
                    <Plus className="h-6 w-6 text-slate-600 dark:text-slate-400" />
                  </div>
                  <span>Add New Device</span>
                </Button>
              </TransitionLink>
            </Card>
          </div>
        </motion.div>
      )}
    </main>
  )
}

function EmptyDevicesState() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="flex flex-col items-center justify-center text-center p-8 md:p-16 mt-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm">
        <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-full mb-6">
          <Cpu className="h-12 w-12 text-slate-600 dark:text-slate-400" />
        </div>

        <h2 className="text-2xl font-bold mb-2">No Devices Connected</h2>
        <p className="text-slate-600 dark:text-slate-300 mb-8 max-w-xl">
          You haven't connected any devices yet. Add your first DePIN device to start generating revenue with autonomous
          agents.
        </p>

        <TransitionLink href="/add-device">
          <Button size="lg" className="bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600">
            Connect Your First Device
            <Plus className="ml-2 h-4 w-4" />
          </Button>
        </TransitionLink>
      </Card>
    </motion.div>
  )
}
