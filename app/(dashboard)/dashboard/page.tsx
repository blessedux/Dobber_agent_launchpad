import { Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AgentCard from "@/components/agent-card"
import EarningsWidget from "@/components/earnings-widget"
import DecisionLogViewer from "@/components/decision-log-viewer"
import DeviceHealthPanel from "@/components/device-health-panel"
import EmptyDashboard from "@/components/empty-dashboard"
import LoadingSpinner from "@/components/loading-spinner"
import { Plus, ArrowRight, BarChart2, Clock, ActivitySquare, Network } from "lucide-react"
import { TransitionLink } from "@/components/ui/transition-link"

// This is a mock to simulate a new user with no agents
const userHasAgents = true

export default function Dashboard() {
  return (
    <main className="container px-4 py-8 md:py-12">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-100">Mission Control</h1>
          <p className="text-slate-600 dark:text-slate-300 mt-1">Your autonomous agent swarm ecosystem</p>
        </div>

        <TransitionLink href="/launch-agent">
          <Button className="bg-violet-600 hover:bg-violet-700">
            <Plus className="w-4 h-4 mr-2" />
            Deploy Agent
          </Button>
        </TransitionLink>
      </div>

      {!userHasAgents ? (
        <EmptyDashboard />
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* KPIs and Resources - Left Side */}
          <div className="xl:col-span-3 space-y-6">
            <Card className="p-6 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border-slate-200/70 dark:border-slate-700/70">
              <h2 className="text-xl font-semibold mb-4">Total Earnings</h2>
              <EarningsWidget />
            </Card>
            
            <Card className="p-6 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border-slate-200/70 dark:border-slate-700/70">
              <h2 className="text-xl font-semibold mb-4">Performance Metrics</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col items-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                  <Clock className="h-6 w-6 text-emerald-500 mb-2" />
                  <span className="text-lg font-bold">98.7%</span>
                  <span className="text-xs text-slate-500">Uptime</span>
                </div>
                <div className="flex flex-col items-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                  <ActivitySquare className="h-6 w-6 text-blue-500 mb-2" />
                  <span className="text-lg font-bold">58</span>
                  <span className="text-xs text-slate-500">Actions Today</span>
                </div>
                <div className="flex flex-col items-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                  <BarChart2 className="h-6 w-6 text-violet-500 mb-2" />
                  <span className="text-lg font-bold">+12.4%</span>
                  <span className="text-xs text-slate-500">Week/Week</span>
                </div>
                <div className="flex flex-col items-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                  <Network className="h-6 w-6 text-amber-500 mb-2" />
                  <span className="text-lg font-bold">8/9</span>
                  <span className="text-xs text-slate-500">Devices Online</span>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border-slate-200/70 dark:border-slate-700/70">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Resources</h2>
                <TransitionLink href="/help">
                  <Button variant="ghost" size="sm" className="flex items-center gap-1">
                    View all
                    <ArrowRight className="w-3 h-3" />
                  </Button>
                </TransitionLink>
              </div>
              <div className="space-y-3">
                <TransitionLink href="/help/getting-started">
                  <div className="p-3 rounded-lg border border-slate-200/70 dark:border-slate-700/70 hover:bg-slate-50/70 dark:hover:bg-slate-800/70 transition-colors backdrop-blur-sm bg-white/80 dark:bg-slate-900/80">
                    <h3 className="font-medium mb-1">Agent Swarm Guide</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      Learn about decentralized autonomous businesses
                    </p>
                  </div>
                </TransitionLink>
                <TransitionLink href="/help/optimization">
                  <div className="p-3 rounded-lg border border-slate-200/70 dark:border-slate-700/70 hover:bg-slate-50/70 dark:hover:bg-slate-800/70 transition-colors backdrop-blur-sm bg-white/80 dark:bg-slate-900/80">
                    <h3 className="font-medium mb-1">Revenue Optimization</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      Maximize returns from your device fleet
                    </p>
                  </div>
                </TransitionLink>
                <TransitionLink href="/help/troubleshooting">
                  <div className="p-3 rounded-lg border border-slate-200/70 dark:border-slate-700/70 hover:bg-slate-50/70 dark:hover:bg-slate-800/70 transition-colors backdrop-blur-sm bg-white/80 dark:bg-slate-900/80">
                    <h3 className="font-medium mb-1">Troubleshooting</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      Solutions for common device and agent issues
                    </p>
                  </div>
                </TransitionLink>
              </div>
            </Card>
          </div>

          {/* Main Content - Right Side */}
          <div className="xl:col-span-9 space-y-6">
            <Tabs defaultValue="agents" className="w-full">
              <TabsList className="w-full mb-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm">
                <TabsTrigger value="agents" className="flex-1">
                  Agent Swarm
                </TabsTrigger>
                <TabsTrigger value="devices" className="flex-1">
                  Device Network
                </TabsTrigger>
                <TabsTrigger value="analytics" className="flex-1">
                  Analytics
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="agents" className="space-y-4">
                <Suspense fallback={<LoadingSpinner />}>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                    <TransitionLink href="/launch-agent">
                      <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg p-6 h-full flex flex-col items-center justify-center bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm hover:bg-white/70 dark:hover:bg-slate-800/70 transition-all">
                        <div className="bg-violet-100 dark:bg-violet-900/40 p-3 rounded-full mb-4">
                          <Plus className="h-6 w-6 text-violet-600 dark:text-violet-400" />
                        </div>
                        <h3 className="font-medium text-center">Deploy New Agent</h3>
                        <p className="text-sm text-center text-slate-500 dark:text-slate-400 mt-2">Add to your autonomous swarm</p>
                      </div>
                    </TransitionLink>
                  </div>
                </Suspense>
              </TabsContent>
              
              <TabsContent value="devices" className="space-y-4">
                <Suspense fallback={<LoadingSpinner />}>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                    <TransitionLink href="/devices/add">
                      <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg p-6 h-full flex flex-col items-center justify-center bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm hover:bg-white/70 dark:hover:bg-slate-800/70 transition-all">
                        <div className="bg-slate-100 dark:bg-slate-800/80 p-3 rounded-full mb-4">
                          <Plus className="h-6 w-6 text-slate-600 dark:text-slate-400" />
                        </div>
                        <h3 className="font-medium text-center">Connect New Device</h3>
                        <p className="text-sm text-center text-slate-500 dark:text-slate-400 mt-2">Expand your decentralized network</p>
                      </div>
                    </TransitionLink>
                  </div>
                </Suspense>
              </TabsContent>
              
              <TabsContent value="analytics" className="space-y-4">
                <Suspense fallback={<LoadingSpinner />}>
                  <div className="grid grid-cols-1 gap-4">
                    <Card className="p-6 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border-slate-200/70 dark:border-slate-700/70">
                      <h3 className="text-lg font-medium mb-4">Revenue Distribution</h3>
                      <div className="h-64 flex items-center justify-center bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                        <p className="text-slate-500 dark:text-slate-400">Analytics charts would appear here</p>
                      </div>
                    </Card>
                  </div>
                </Suspense>
              </TabsContent>
            </Tabs>

            <Card className="p-6 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border-slate-200/70 dark:border-slate-700/70">
              <h2 className="text-xl font-semibold mb-4">Agent Swarm Activity</h2>
              <DecisionLogViewer />
            </Card>
          </div>
        </div>
      )}
    </main>
  )
} 