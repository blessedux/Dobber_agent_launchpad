import { Suspense } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AgentCard from "@/components/agent-card"
import EarningsWidget from "@/components/earnings-widget"
import DecisionLogViewer from "@/components/decision-log-viewer"
import DeviceHealthPanel from "@/components/device-health-panel"
import EmptyDashboard from "@/components/empty-dashboard"
import LoadingSpinner from "@/components/loading-spinner"
import { Plus, ArrowRight } from "lucide-react"

// This is a mock to simulate a new user with no agents
const userHasAgents = true

export default function Dashboard() {
  return (
    <main className="container px-4 py-8 md:py-12">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-100">Mission Control</h1>
          <p className="text-slate-600 dark:text-slate-300 mt-1">Your autonomous agent ecosystem at a glance</p>
        </div>

        <Link href="/launch-agent">
          <Button className="bg-violet-600 hover:bg-violet-700">
            <Plus className="w-4 h-4 mr-2" />
            Launch New Agent
          </Button>
        </Link>
      </div>

      {!userHasAgents ? (
        <EmptyDashboard />
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 space-y-6">
            <Tabs defaultValue="agents" className="w-full">
              <TabsList className="w-full mb-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm">
                <TabsTrigger value="agents" className="flex-1">
                  My Agents
                </TabsTrigger>
                <TabsTrigger value="devices" className="flex-1">
                  Devices
                </TabsTrigger>
              </TabsList>
              <TabsContent value="agents" className="space-y-4">
                <Suspense fallback={<LoadingSpinner />}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <AgentCard
                      name="SolarOptimizer"
                      deviceType="solar-node"
                      status="online"
                      revenue="342.87"
                      actions={15}
                    />
                    <AgentCard
                      name="ChargeMaster"
                      deviceType="ev-charger"
                      status="online"
                      revenue="128.34"
                      actions={8}
                    />
                    <AgentCard
                      name="NetGuard"
                      deviceType="helium-miner"
                      status="warning"
                      revenue="72.19"
                      actions={4}
                      alert="Connection intermittent"
                    />
                  </div>
                </Suspense>
              </TabsContent>
              <TabsContent value="devices" className="space-y-4">
                <Suspense fallback={<LoadingSpinner />}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  </div>
                </Suspense>
              </TabsContent>
            </Tabs>

            <Card className="p-6 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border-slate-200/70 dark:border-slate-700/70">
              <h2 className="text-xl font-semibold mb-4">Recent Agent Activity</h2>
              <DecisionLogViewer />
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="p-6 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border-slate-200/70 dark:border-slate-700/70">
              <h2 className="text-xl font-semibold mb-4">Total Earnings</h2>
              <EarningsWidget />
            </Card>

            <Card className="p-6 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border-slate-200/70 dark:border-slate-700/70">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Resources</h2>
                <Link href="/help">
                  <Button variant="ghost" size="sm" className="flex items-center gap-1">
                    View all
                    <ArrowRight className="w-3 h-3" />
                  </Button>
                </Link>
              </div>
              <div className="space-y-3">
                <Link href="/help/getting-started">
                  <div className="p-3 rounded-lg border border-slate-200/70 dark:border-slate-700/70 hover:bg-slate-50/70 dark:hover:bg-slate-800/70 transition-colors backdrop-blur-sm bg-white/80 dark:bg-slate-900/80">
                    <h3 className="font-medium mb-1">Getting Started Guide</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      Learn the basics of managing autonomous agents
                    </p>
                  </div>
                </Link>
                <Link href="/help/optimization">
                  <div className="p-3 rounded-lg border border-slate-200/70 dark:border-slate-700/70 hover:bg-slate-50/70 dark:hover:bg-slate-800/70 transition-colors backdrop-blur-sm bg-white/80 dark:bg-slate-900/80">
                    <h3 className="font-medium mb-1">Optimization Strategies</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      Maximize revenue from your device fleet
                    </p>
                  </div>
                </Link>
                <Link href="/help/troubleshooting">
                  <div className="p-3 rounded-lg border border-slate-200/70 dark:border-slate-700/70 hover:bg-slate-50/70 dark:hover:bg-slate-800/70 transition-colors backdrop-blur-sm bg-white/80 dark:bg-slate-900/80">
                    <h3 className="font-medium mb-1">Troubleshooting</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      Solutions for common device and agent issues
                    </p>
                  </div>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      )}
    </main>
  )
}
