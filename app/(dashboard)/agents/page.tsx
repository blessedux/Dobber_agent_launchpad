"use client";

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Filter, ArrowUpDown, Search, Rocket } from "lucide-react"
import { Input } from "@/components/ui/input"
import AgentCard from "@/components/agent-card"
import { TransitionLink } from "@/components/ui/transition-link"
import { motion } from "framer-motion";

// Mock data - in a real app this would come from an API or database
const hasAgents = true

export default function AgentsPage() {
  return (
    <main className="container px-4 py-8 md:py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4"
      >
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-100">Agents</h1>
          <p className="text-slate-600 dark:text-slate-300 mt-1">Manage your autonomous AI agents</p>
        </div>

        <TransitionLink href="/launch-agent">
          <Button className="bg-violet-600 hover:bg-violet-700">
            <Plus className="w-4 h-4 mr-2" />
            Launch New Agent
          </Button>
        </TransitionLink>
      </motion.div>

      {!hasAgents ? (
        <EmptyAgentsState />
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500 dark:text-slate-400" />
              <Input type="search" placeholder="Search agents..." className="pl-9 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm" />
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
              <TabsTrigger value="all">All Agents</TabsTrigger>
              <TabsTrigger value="online">Online</TabsTrigger>
              <TabsTrigger value="offline">Offline</TabsTrigger>
              <TabsTrigger value="warning">Warnings</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AgentCard name="SolarOptimizer" deviceType="solar-node" status="online" revenue="342.87" actions={15} />
            <AgentCard name="ChargeMaster" deviceType="ev-charger" status="online" revenue="128.34" actions={8} />
            <AgentCard
              name="NetGuard"
              deviceType="helium-miner"
              status="warning"
              revenue="72.19"
              actions={4}
              alert="Connection intermittent"
            />
            <AgentCard name="GridMonitor" deviceType="energy-monitor" status="online" revenue="95.62" actions={11} />
            <AgentCard
              name="ComputeCluster"
              deviceType="compute-node"
              status="offline"
              revenue="0.00"
              actions={0}
              alert="Device offline for 2 days"
            />
            <Card className="border-dashed border-2 flex items-center justify-center p-6 h-[230px] bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm">
              <TransitionLink href="/launch-agent">
                <Button variant="ghost" className="h-auto flex flex-col gap-3 py-6">
                  <div className="bg-violet-100 dark:bg-violet-900/40 p-3 rounded-full">
                    <Plus className="h-6 w-6 text-violet-600 dark:text-violet-400" />
                  </div>
                  <span>Launch New Agent</span>
                </Button>
              </TransitionLink>
            </Card>
          </div>
        </motion.div>
      )}
    </main>
  )
}

function EmptyAgentsState() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="flex flex-col items-center justify-center text-center p-8 md:p-16 mt-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm">
        <div className="bg-violet-100 dark:bg-violet-900/40 p-4 rounded-full mb-6">
          <Rocket className="h-12 w-12 text-violet-600 dark:text-violet-400" />
        </div>

        <h2 className="text-2xl font-bold mb-2">No Agents Yet</h2>
        <p className="text-slate-600 dark:text-slate-300 mb-8 max-w-xl">
          You haven't launched any agents yet. Create your first autonomous AI agent to start managing your devices.
        </p>

        <TransitionLink href="/launch-agent">
          <Button size="lg" className="bg-violet-600 hover:bg-violet-700">
            Launch Your First Agent
            <Plus className="ml-2 h-4 w-4" />
          </Button>
        </TransitionLink>
      </Card>
    </motion.div>
  )
} 