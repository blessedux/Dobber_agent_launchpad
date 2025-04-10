"use client"

import { Suspense, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import LoadingSpinner from "@/components/loading-spinner"
import {
  ArrowLeft,
  Sun,
  Settings,
  Activity,
  BarChart3,
  MessagesSquare,
  Terminal,
  Sliders,
  ToggleLeft,
  PlayCircle,
  Plug,
  Radio,
  Wifi,
  Cpu,
  Zap
} from "lucide-react"

// Note: In a real app, this would fetch data for the specific agent
export default function AgentDetailPage({ params }: { params: { name: string } }) {
  // For demo purposes, hardcoding SolarOptimizer
  const agentName = params.name === "solaroptimizer" ? "SolarOptimizer" : params.name
  const deviceType = params.name === "solaroptimizer" ? "solar-node" : "device"
  
  const [agentStatus, setAgentStatus] = useState<"online" | "paused">("online")
  const [isPausing, setIsPausing] = useState(false)

  const handleTogglePause = () => {
    setIsPausing(true)
    
    // Simulate API call with a delay
    setTimeout(() => {
      setAgentStatus(agentStatus === "online" ? "paused" : "online")
      setIsPausing(false)
    }, 1000)
  }

  return (
    <main className="container px-4 py-8 md:py-12">
      <div className="mb-8">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-full ${
              agentStatus === "online" 
                ? "bg-emerald-100 dark:bg-emerald-900/40" 
                : "bg-slate-100 dark:bg-slate-800/40"
            }`}>
              {agentName === "SolarOptimizer" ? (
                <Sun className={`w-6 h-6 ${
                  agentStatus === "online" 
                    ? "text-emerald-600 dark:text-emerald-400" 
                    : "text-slate-600 dark:text-slate-400"
                }`} />
              ) : (
                <Settings className={`w-6 h-6 ${
                  agentStatus === "online" 
                    ? "text-emerald-600 dark:text-emerald-400" 
                    : "text-slate-600 dark:text-slate-400"
                }`} />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-bold">{agentName}</h1>
                <Badge
                  variant="outline"
                  className={agentStatus === "online" ? 
                    "border-emerald-200 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:border-emerald-800 dark:text-emerald-400" :
                    "border-slate-200 bg-slate-50 text-slate-700 dark:bg-slate-800/30 dark:border-slate-700 dark:text-slate-400"
                  }
                >
                  <span className="flex items-center gap-1">
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      agentStatus === "online" ? "bg-emerald-500" : "bg-slate-500"
                    }`}></span>
                    {agentStatus === "online" ? "Online" : "Paused"}
                  </span>
                </Badge>
              </div>
              <p className="text-slate-600 dark:text-slate-300">
                {agentName === "SolarOptimizer"
                  ? "Maximizing solar panel efficiency and automating energy trading"
                  : "Managing your device autonomously"}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Sliders className="w-4 h-4 mr-2" />
              Adjust Settings
            </Button>
            <Button
              variant="outline"
              className={agentStatus === "online" ? 
                "bg-red-50 hover:bg-red-100 text-red-600 border-red-200 hover:border-red-300 dark:bg-red-950/30 dark:hover:bg-red-900/50 dark:border-red-900/50 dark:hover:border-red-900 dark:text-red-400" :
                "bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border-emerald-200 hover:border-emerald-300 dark:bg-emerald-950/30 dark:hover:bg-emerald-900/50 dark:border-emerald-900/50 dark:hover:border-emerald-900 dark:text-emerald-400"
              }
              onClick={handleTogglePause}
              disabled={isPausing}
            >
              {isPausing ? (
                <LoadingSpinner className="w-4 h-4 mr-2" />
              ) : agentStatus === "online" ? (
                <ToggleLeft className="w-4 h-4 mr-2" />
              ) : (
                <PlayCircle className="w-4 h-4 mr-2" />
              )}
              {agentStatus === "online" ? "Pause Agent" : "Resume Agent"}
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="w-full mb-4 justify-start overflow-x-auto flex-nowrap">
          <TabsTrigger value="overview" className="flex items-center gap-1">
            <Activity className="w-4 h-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center gap-1">
            <BarChart3 className="w-4 h-4" />
            Performance
          </TabsTrigger>
          <TabsTrigger value="logs" className="flex items-center gap-1">
            <Terminal className="w-4 h-4" />
            Decision Logs
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-1">
            <Settings className="w-4 h-4" />
            Settings
          </TabsTrigger>
          <TabsTrigger value="chat" className="flex items-center gap-1">
            <MessagesSquare className="w-4 h-4" />
            Chat with Agent
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Suspense fallback={<LoadingSpinner />}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-6 col-span-2">
                <h2 className="text-xl font-semibold mb-4">Agent Performance</h2>
                <p className="text-slate-600 dark:text-slate-300">
                  Agent performance metrics, charts and statistics would appear here.
                </p>
              </Card>
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Actions Taken</h2>
                <p className="text-slate-600 dark:text-slate-300">Recent agent actions would appear here.</p>
              </Card>
              <Card className="p-6 col-span-3">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Device Network</h2>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-violet-600 border-violet-200 bg-violet-50 dark:bg-violet-900/20 dark:border-violet-800 dark:text-violet-400"
                    >
                      <Cpu className="w-4 h-4 mr-2" />
                      Add Device
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  {/* Managed Device 1 */}
                  <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
                    <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                      <div className="flex items-center gap-3">
                        <div className="bg-emerald-100 dark:bg-emerald-900/40 p-2 rounded-full">
                          <Sun className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div>
                          <h3 className="font-medium">Solar Panel Array A</h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400">Connected since Jan 15, 2023</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:border-emerald-800 dark:text-emerald-400">
                        Active
                      </Badge>
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-600 dark:text-slate-400">Status:</span>
                        <span className="font-medium">Operational</span>
                      </div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-600 dark:text-slate-400">Uptime:</span>
                        <span className="font-medium">99.7%</span>
                      </div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-600 dark:text-slate-400">Last reward:</span>
                        <span className="font-medium">12 hours ago</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600 dark:text-slate-400">Revenue:</span>
                        <span className="font-medium text-emerald-600 dark:text-emerald-400">$142.35 this week</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Managed Device 2 */}
                  <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
                    <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                      <div className="flex items-center gap-3">
                        <div className="bg-emerald-100 dark:bg-emerald-900/40 p-2 rounded-full">
                          <Sun className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div>
                          <h3 className="font-medium">Solar Panel Array B</h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400">Connected since Mar 22, 2023</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:border-emerald-800 dark:text-emerald-400">
                        Active
                      </Badge>
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-600 dark:text-slate-400">Status:</span>
                        <span className="font-medium">Operational</span>
                      </div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-600 dark:text-slate-400">Uptime:</span>
                        <span className="font-medium">98.9%</span>
                      </div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-600 dark:text-slate-400">Last reward:</span>
                        <span className="font-medium">1 day ago</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600 dark:text-slate-400">Revenue:</span>
                        <span className="font-medium text-emerald-600 dark:text-emerald-400">$97.52 this week</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Managed Device 3 */}
                  <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
                    <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                      <div className="flex items-center gap-3">
                        <div className="bg-amber-100 dark:bg-amber-900/40 p-2 rounded-full">
                          <Sun className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div>
                          <h3 className="font-medium">Solar Panel Array C</h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400">Connected since Apr 5, 2023</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:border-amber-800 dark:text-amber-400">
                        Maintenance
                      </Badge>
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-600 dark:text-slate-400">Status:</span>
                        <span className="font-medium text-amber-600 dark:text-amber-400">Cleaning Required</span>
                      </div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-600 dark:text-slate-400">Uptime:</span>
                        <span className="font-medium">94.2%</span>
                      </div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-600 dark:text-slate-400">Last reward:</span>
                        <span className="font-medium">2 days ago</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600 dark:text-slate-400">Revenue:</span>
                        <span className="font-medium text-amber-600 dark:text-amber-400">$52.15 this week</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Growth Options */}
                <div className="border border-violet-200 dark:border-violet-800 bg-violet-50 dark:bg-violet-900/20 rounded-lg p-4">
                  <h3 className="font-medium text-violet-800 dark:text-violet-300 mb-4">Scale Your Operation</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-lg p-4 relative overflow-hidden">
                      <div className="absolute -right-4 -top-4 bg-violet-100 dark:bg-violet-800/30 p-2 rounded-full transform rotate-12">
                        <span className="font-bold text-violet-600 dark:text-violet-400 text-xl">1</span>
                      </div>
                      <h4 className="font-medium mb-2">Starter Tier</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">Manage up to 3 devices with minimal staking</p>
                      <div className="flex justify-between mb-2 text-sm">
                        <span>Required Stake:</span>
                        <span className="font-medium">500 DOB</span>
                      </div>
                      <div className="flex justify-between mb-2 text-sm">
                        <span>Active Stage:</span>
                        <span className="font-medium text-emerald-600 dark:text-emerald-400">Current</span>
                      </div>
                    </div>
                    
                    <div className="bg-white dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-lg p-4 relative overflow-hidden">
                      <div className="absolute -right-4 -top-4 bg-violet-100 dark:bg-violet-800/30 p-2 rounded-full transform rotate-12">
                        <span className="font-bold text-violet-600 dark:text-violet-400 text-xl">2</span>
                      </div>
                      <h4 className="font-medium mb-2">Growth Tier</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">Expand to 10 devices with medium staking</p>
                      <div className="flex justify-between mb-2 text-sm">
                        <span>Required Stake:</span>
                        <span className="font-medium">1,500 DOB</span>
                      </div>
                      <Button size="sm" className="w-full">Upgrade Tier</Button>
                    </div>
                    
                    <div className="bg-white dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-lg p-4 relative overflow-hidden">
                      <div className="absolute -right-4 -top-4 bg-violet-100 dark:bg-violet-800/30 p-2 rounded-full transform rotate-12">
                        <span className="font-bold text-violet-600 dark:text-violet-400 text-xl">3</span>
                      </div>
                      <h4 className="font-medium mb-2">Enterprise Tier</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">Unlimited devices with premium features</p>
                      <div className="flex justify-between mb-2 text-sm">
                        <span>Required Stake:</span>
                        <span className="font-medium">5,000 DOB</span>
                      </div>
                      <Button size="sm" variant="outline" className="w-full">Learn More</Button>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </Suspense>
        </TabsContent>

        <TabsContent value="performance">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <Card className="p-6 md:col-span-7">
              <h2 className="text-xl font-semibold mb-6">Revenue Performance</h2>
              
              <div className="h-64 flex items-center justify-center bg-slate-50 dark:bg-slate-800/50 rounded-lg mb-4">
                <p className="text-slate-500 dark:text-slate-400">Revenue chart would appear here</p>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 rounded-lg">
                  <p className="text-sm text-slate-600 dark:text-slate-400">Today</p>
                  <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">$45.21</p>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400">+12.4%</p>
                </div>
                <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 rounded-lg">
                  <p className="text-sm text-slate-600 dark:text-slate-400">This Week</p>
                  <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">$342.87</p>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400">+8.7%</p>
                </div>
                <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 rounded-lg">
                  <p className="text-sm text-slate-600 dark:text-slate-400">This Month</p>
                  <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">$1,240.56</p>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400">+15.2%</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-6 md:col-span-5">
              <h2 className="text-xl font-semibold mb-4">Agent Metrics</h2>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Uptime</span>
                    <span className="text-sm font-medium">98.7%</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                    <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '98.7%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Device Health</span>
                    <span className="text-sm font-medium">94.2%</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                    <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '94.2%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Decision Accuracy</span>
                    <span className="text-sm font-medium">96.5%</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                    <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '96.5%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Energy Efficiency</span>
                    <span className="text-sm font-medium">89.3%</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                    <div className="bg-amber-500 h-2 rounded-full" style={{ width: '89.3%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Network Stability</span>
                    <span className="text-sm font-medium">97.8%</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                    <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '97.8%' }}></div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 border-t border-slate-200 dark:border-slate-700 pt-4">
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Agent Rank</p>
                    <p className="font-medium">Top 5%</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Agent Rating</p>
                    <p className="font-medium">★★★★★ (4.9)</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">LLM Model</p>
                    <p className="font-medium">GPT-4o</p>
                  </div>
                </div>
              </div>
            </Card>
            
            <Card className="p-6 md:col-span-12">
              <h2 className="text-xl font-semibold mb-6">Decision Optimization Impact</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                  <h3 className="font-medium mb-2">Energy Pricing Optimization</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                    Agent shifts energy sales to peak pricing periods.
                  </p>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400">Impact:</span>
                    <span className="font-medium text-emerald-600 dark:text-emerald-400">+22% Revenue</span>
                  </div>
                </div>
                
                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                  <h3 className="font-medium mb-2">Panel Angle Adjustment</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                    Automated angle adjustment based on sun position.
                  </p>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400">Impact:</span>
                    <span className="font-medium text-emerald-600 dark:text-emerald-400">+15% Output</span>
                  </div>
                </div>
                
                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                  <h3 className="font-medium mb-2">Preventative Maintenance</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                    Agent predicts cleaning needs to optimize efficiency.
                  </p>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400">Impact:</span>
                    <span className="font-medium text-emerald-600 dark:text-emerald-400">-8% Downtime</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">AI Suggestion</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Adding weather predictor module could improve forecasting and increase energy output by up to 12% during partly cloudy days.
                </p>
                <Button size="sm" variant="ghost" className="mt-2 text-violet-600 dark:text-violet-400">
                  Implement Suggestion
                </Button>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="logs">
          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Decision Logs</h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Terminal className="w-4 h-4 mr-2" />
                  Export Logs
                </Button>
              </div>
            </div>
            
            <div className="space-y-4">
              {/* Log Entry 1 */}
              <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
                <div className="flex items-center justify-between p-3 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                  <div className="flex items-center gap-3">
                    <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-300 border-none">
                      Success
                    </Badge>
                    <span className="font-medium">Energy Price Optimization</span>
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400">Today, 09:45 AM</span>
                </div>
                <div className="p-3">
                  <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">
                    Detected energy price peak at 11:00 AM. Reconfigured battery discharge schedule to maximize profit.
                  </p>
                  <div className="flex items-center gap-2 text-xs">
                    <Badge variant="outline" className="bg-slate-50 dark:bg-slate-800/50">
                      Price: $0.18/kWh
                    </Badge>
                    <Badge variant="outline" className="bg-slate-50 dark:bg-slate-800/50">
                      Expected Revenue: +$14.25
                    </Badge>
                    <Badge variant="outline" className="bg-slate-50 dark:bg-slate-800/50">
                      Device: Solar Panel Array A
                    </Badge>
                  </div>
                </div>
              </div>
              
              {/* Log Entry 2 */}
              <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
                <div className="flex items-center justify-between p-3 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                  <div className="flex items-center gap-3">
                    <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 dark:bg-amber-900/30 dark:text-amber-300 border-none">
                      Warning
                    </Badge>
                    <span className="font-medium">Maintenance Alert</span>
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400">Today, 07:12 AM</span>
                </div>
                <div className="p-3">
                  <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">
                    Detected 8% efficiency drop on Solar Panel Array C. Analysis suggests dust accumulation. Scheduled cleaning service.
                  </p>
                  <div className="flex items-center gap-2 text-xs">
                    <Badge variant="outline" className="bg-slate-50 dark:bg-slate-800/50">
                      Priority: Medium
                    </Badge>
                    <Badge variant="outline" className="bg-slate-50 dark:bg-slate-800/50">
                      Expected Recovery: 7-9%
                    </Badge>
                    <Badge variant="outline" className="bg-slate-50 dark:bg-slate-800/50">
                      Device: Solar Panel Array C
                    </Badge>
                  </div>
                </div>
              </div>
              
              {/* Log Entry 3 */}
              <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
                <div className="flex items-center justify-between p-3 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                  <div className="flex items-center gap-3">
                    <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300 border-none">
                      Info
                    </Badge>
                    <span className="font-medium">Weather Adaptation</span>
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400">Yesterday, 04:30 PM</span>
                </div>
                <div className="p-3">
                  <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">
                    Forecast shows cloudy conditions for next 48 hours. Adjusted angle of panels to optimize diffuse light collection.
                  </p>
                  <div className="flex items-center gap-2 text-xs">
                    <Badge variant="outline" className="bg-slate-50 dark:bg-slate-800/50">
                      Adjustment: +12° East
                    </Badge>
                    <Badge variant="outline" className="bg-slate-50 dark:bg-slate-800/50">
                      Expected Improvement: +4%
                    </Badge>
                    <Badge variant="outline" className="bg-slate-50 dark:bg-slate-800/50">
                      Device: All Arrays
                    </Badge>
                  </div>
                </div>
              </div>
              
              {/* Log Entry 4 */}
              <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
                <div className="flex items-center justify-between p-3 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                  <div className="flex items-center gap-3">
                    <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-300 border-none">
                      Success
                    </Badge>
                    <span className="font-medium">Grid Demand Response</span>
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400">Yesterday, 01:15 PM</span>
                </div>
                <div className="p-3">
                  <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">
                    Participated in grid demand response event. Provided 15kWh from battery storage during peak demand for premium rates.
                  </p>
                  <div className="flex items-center gap-2 text-xs">
                    <Badge variant="outline" className="bg-slate-50 dark:bg-slate-800/50">
                      Duration: 2 hours
                    </Badge>
                    <Badge variant="outline" className="bg-slate-50 dark:bg-slate-800/50">
                      Revenue: $21.45
                    </Badge>
                    <Badge variant="outline" className="bg-slate-50 dark:bg-slate-800/50">
                      Device: Storage Unit
                    </Badge>
                  </div>
                </div>
              </div>
              
              {/* Log Entry 5 */}
              <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
                <div className="flex items-center justify-between p-3 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                  <div className="flex items-center gap-3">
                    <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-300 border-none">
                      Success
                    </Badge>
                    <span className="font-medium">Contract Negotiation</span>
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400">2 days ago</span>
                </div>
                <div className="p-3">
                  <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">
                    Negotiated new power purchase agreement with local utility. Secured 5% higher rates for next 3 months.
                  </p>
                  <div className="flex items-center gap-2 text-xs">
                    <Badge variant="outline" className="bg-slate-50 dark:bg-slate-800/50">
                      Old Rate: $0.15/kWh
                    </Badge>
                    <Badge variant="outline" className="bg-slate-50 dark:bg-slate-800/50">
                      New Rate: $0.1575/kWh
                    </Badge>
                    <Badge variant="outline" className="bg-slate-50 dark:bg-slate-800/50">
                      Est. Impact: +$126/month
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center mt-6">
              <Button variant="outline" size="sm">
                Load More Logs
              </Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Agent Settings</h2>
            <p className="text-slate-600 dark:text-slate-300">Agent configuration settings would appear here.</p>
          </Card>
        </TabsContent>

        <TabsContent value="chat">
          <Card className="p-6 min-h-[600px] flex flex-col">
            <h2 className="text-xl font-semibold mb-4">Chat with Agent</h2>
            
            <div className="flex-1 overflow-y-auto space-y-4 mb-4 border border-slate-200 dark:border-slate-700 rounded-lg p-4 bg-slate-50 dark:bg-slate-800/50">
              {/* Message 1 - User */}
              <div className="flex justify-end">
                <div className="bg-violet-100 dark:bg-violet-900/40 text-slate-800 dark:text-slate-100 rounded-lg p-3 max-w-[80%]">
                  <p className="text-sm">How are the solar panels performing today?</p>
                  <span className="text-xs text-slate-500 dark:text-slate-400 block text-right mt-1">09:30 AM</span>
                </div>
              </div>
              
              {/* Message 2 - Agent */}
              <div className="flex justify-start">
                <div className="bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-lg p-3 max-w-[80%] border border-slate-200 dark:border-slate-700">
                  <p className="text-sm">
                    Good morning! All solar panels are performing well today. Current energy production is 24.5 kWh, which is 12% above average for this time of day. Weather conditions are optimal with clear skies.
                  </p>
                  <p className="text-sm mt-2">
                    Arrays A and B are at 98% efficiency. Array C is at 91% efficiency and scheduled for cleaning tomorrow to improve performance.
                  </p>
                  <span className="text-xs text-slate-500 dark:text-slate-400 block text-left mt-1">09:31 AM</span>
                </div>
              </div>
              
              {/* Message 3 - User */}
              <div className="flex justify-end">
                <div className="bg-violet-100 dark:bg-violet-900/40 text-slate-800 dark:text-slate-100 rounded-lg p-3 max-w-[80%]">
                  <p className="text-sm">What's our projected revenue for today?</p>
                  <span className="text-xs text-slate-500 dark:text-slate-400 block text-right mt-1">09:33 AM</span>
                </div>
              </div>
              
              {/* Message 4 - Agent */}
              <div className="flex justify-start">
                <div className="bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-lg p-3 max-w-[80%] border border-slate-200 dark:border-slate-700">
                  <p className="text-sm">
                    Based on current production rates and today's energy pricing, I project a total revenue of $45.21 for today.
                  </p>
                  <p className="text-sm mt-2">
                    This includes:
                    <br />- $32.75 from standard grid sales
                    <br />- $12.46 from the premium rate period (11 AM - 2 PM)
                  </p>
                  <p className="text-sm mt-2">
                    This is approximately 12.4% higher than yesterday's revenue of $40.22.
                  </p>
                  <span className="text-xs text-slate-500 dark:text-slate-400 block text-left mt-1">09:34 AM</span>
                </div>
              </div>
              
              {/* Message 5 - User */}
              <div className="flex justify-end">
                <div className="bg-violet-100 dark:bg-violet-900/40 text-slate-800 dark:text-slate-100 rounded-lg p-3 max-w-[80%]">
                  <p className="text-sm">Can we optimize Array C before the scheduled cleaning?</p>
                  <span className="text-xs text-slate-500 dark:text-slate-400 block text-right mt-1">09:36 AM</span>
                </div>
              </div>
              
              {/* Message 6 - Agent */}
              <div className="flex justify-start">
                <div className="bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-lg p-3 max-w-[80%] border border-slate-200 dark:border-slate-700">
                  <p className="text-sm">
                    I can implement some optimization measures for Array C. I recommend:
                  </p>
                  <p className="text-sm mt-2">
                    1. Adjusting the angle by +5° to better match today's sun path
                    <br />2. Reallocating power inverter capacity to prioritize Arrays A and B during peak hours
                    <br />3. Running a diagnostic test to identify if specific panels are underperforming
                  </p>
                  <p className="text-sm mt-2">
                    These measures could improve Array C's performance by 2-3% before tomorrow's cleaning. Would you like me to implement these optimizations?
                  </p>
                  <span className="text-xs text-slate-500 dark:text-slate-400 block text-left mt-1">09:37 AM</span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input 
                  type="text" 
                  placeholder="Ask your agent something..." 
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
                <Button size="sm" variant="ghost" className="absolute right-2 top-1/2 -translate-y-1/2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                    <path d="M12 8V4H8"></path>
                    <rect width="16" height="12" x="4" y="8" rx="2"></rect>
                    <path d="M2 14h2"></path>
                    <path d="M20 14h2"></path>
                    <path d="M15 13v2"></path>
                    <path d="M9 13v2"></path>
                  </svg>
                </Button>
              </div>
              <Button className="bg-violet-600 hover:bg-violet-700">
                Send
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  )
} 