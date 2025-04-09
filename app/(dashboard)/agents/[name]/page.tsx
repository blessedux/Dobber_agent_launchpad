import { Suspense } from "react"
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
} from "lucide-react"

// Note: In a real app, this would fetch data for the specific agent
export default function AgentDetailPage({ params }: { params: { name: string } }) {
  // For demo purposes, hardcoding SolarOptimizer
  const agentName = params.name === "solaroptimizer" ? "SolarOptimizer" : params.name
  const deviceType = params.name === "solaroptimizer" ? "solar-node" : "device"

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
            <div className="bg-emerald-100 dark:bg-emerald-900/40 p-2.5 rounded-full">
              {agentName === "SolarOptimizer" ? (
                <Sun className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <Settings className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-bold">{agentName}</h1>
                <Badge
                  variant="outline"
                  className="border-emerald-200 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:border-emerald-800 dark:text-emerald-400"
                >
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    Online
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
              className="bg-red-50 hover:bg-red-100 text-red-600 border-red-200 hover:border-red-300 dark:bg-red-950/30 dark:hover:bg-red-900/50 dark:border-red-900/50 dark:hover:border-red-900 dark:text-red-400"
            >
              <ToggleLeft className="w-4 h-4 mr-2" />
              Pause Agent
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
                <h2 className="text-xl font-semibold mb-4">Device Network</h2>
                <p className="text-slate-600 dark:text-slate-300">
                  Connected devices and their statuses would appear here.
                </p>
              </Card>
            </div>
          </Suspense>
        </TabsContent>

        <TabsContent value="performance">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Performance Metrics</h2>
            <p className="text-slate-600 dark:text-slate-300">Detailed performance metrics would appear here.</p>
          </Card>
        </TabsContent>

        <TabsContent value="logs">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Decision Logs</h2>
            <p className="text-slate-600 dark:text-slate-300">Comprehensive agent decision logs would appear here.</p>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Agent Settings</h2>
            <p className="text-slate-600 dark:text-slate-300">Agent configuration settings would appear here.</p>
          </Card>
        </TabsContent>

        <TabsContent value="chat">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Chat with Agent</h2>
            <p className="text-slate-600 dark:text-slate-300">
              Chat interface to communicate with your agent would appear here.
            </p>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  )
} 