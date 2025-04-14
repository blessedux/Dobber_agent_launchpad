"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Plus, Filter, ArrowUpDown, Search, Rocket, Brain, Database, Sparkles, Wallet, Leaf, BarChart3, Building2, PieChart, Network } from "lucide-react"
import { Input } from "@/components/ui/input"
import AgentCard from "@/components/agent-card"
import { TransitionLink } from "@/components/ui/transition-link"
import { motion } from "framer-motion";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/components/ui/use-toast";
import { Confetti } from "@/components/confetti";
import { Badge } from "@/components/ui/badge";

// Import agent types from agent-type-selection
import { agentTypes } from "@/components/steps/agent-type-selection";

// Mock data - in a real app this would come from an API or database
const hasAgents = true

export default function AgentsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [showImprovementDialog, setShowImprovementDialog] = useState(false);
  const [currentAgent, setCurrentAgent] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [improvedAgents, setImprovedAgents] = useState<string[]>([]);
  const { toast } = useToast();

  const handleImproveAgent = (agentName: string) => {
    setCurrentAgent(agentName);
    setShowImprovementDialog(true);
  };

  const handleConfirmImprovement = () => {
    if (!currentAgent) return;

    try {
      // Simulate opening a crypto wallet
      console.log("Opening wallet for carbon-neutral token transaction");
      
      // Simulate API call to improve agent
      setTimeout(() => {
        // Close dialog
        setShowImprovementDialog(false);
        
        // Show success message with confetti
        toast({
          title: "Performance Boost Unlocked!",
          description: `${currentAgent} now has enhanced compute power for better yield generation (+30%)`,
          duration: 5000,
        });
        
        // Show confetti animation
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
        
        // Mark agent as improved
        setImprovedAgents(prev => [...prev, currentAgent]);

        // Reset current agent
        setCurrentAgent(null);
      }, 1500);
    } catch (error) {
      console.error("Transaction error:", error);
      toast({
        title: "Transaction Failed",
        description: "There was an error processing your carbon-neutral token purchase. Please try again.",
        duration: 5000,
      });
    }
  };

  const isAgentImproved = (name: string) => improvedAgents.includes(name);
  
  // Get all agents without filtering by type
  const getAgents = () => {
    return [
      { 
        name: "SolarOptimizer", 
        deviceType: "solar-node", 
        status: "online" as "online" | "warning" | "offline", 
        revenue: isAgentImproved("SolarOptimizer") ? "445.73" : "342.87", 
        actions: isAgentImproved("SolarOptimizer") ? 22 : 15,
      },
      { 
        name: "ChargeMaster", 
        deviceType: "ev-charger", 
        status: "online" as "online" | "warning" | "offline", 
        revenue: isAgentImproved("ChargeMaster") ? "166.84" : "128.34", 
        actions: isAgentImproved("ChargeMaster") ? 12 : 8,
      },
      {
        name: "NetGuard",
        deviceType: "helium-miner",
        status: "warning" as "online" | "warning" | "offline",
        revenue: isAgentImproved("NetGuard") ? "93.85" : "72.19",
        actions: isAgentImproved("NetGuard") ? 7 : 4,
        alert: "Connection intermittent",
      },
      { 
        name: "GridMonitor", 
        deviceType: "energy-monitor", 
        status: "online" as "online" | "warning" | "offline", 
        revenue: isAgentImproved("GridMonitor") ? "124.31" : "95.62", 
        actions: isAgentImproved("GridMonitor") ? 16 : 11,
      },
      {
        name: "ComputeCluster",
        deviceType: "compute-node",
        status: "offline" as "online" | "warning" | "offline",
        revenue: "0.00",
        actions: 0,
        alert: "Device offline for 2 days",
      }
    ];
  };
  
  return (
    <main className="container max-w-7xl px-4 py-8 md:py-12">
      {showConfetti && <Confetti />}
      
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

        <TransitionLink href="/launch-agent" isLaunchAgent={true}>
          <Button className="bg-violet-600 hover:bg-violet-700">
            <Plus className="h-4 w-4 mr-2" />
            Deploy Agent
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

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-6">
            <TabsList className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm">
              <TabsTrigger value="all">All Agents</TabsTrigger>
              <TabsTrigger value="online">Online</TabsTrigger>
              <TabsTrigger value="offline">Offline</TabsTrigger>
              <TabsTrigger value="warning">Warnings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {getAgents().map(agent => (
                  <AgentCard 
                    key={agent.name}
                    name={agent.name}
                    deviceType={agent.deviceType} 
                    status={agent.status} 
                    revenue={agent.revenue} 
                    actions={agent.actions} 
                    alert={agent.alert}
                    onImprove={() => handleImproveAgent(agent.name)}
                    isImproved={isAgentImproved(agent.name)}
                  />
                ))}
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
            </TabsContent>
            
            <TabsContent value="online" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <AgentCard 
                  name="SolarOptimizer" 
                  deviceType="solar-node" 
                  status="online" 
                  revenue={isAgentImproved("SolarOptimizer") ? "445.73" : "342.87"} 
                  actions={isAgentImproved("SolarOptimizer") ? 22 : 15} 
                  onImprove={() => handleImproveAgent("SolarOptimizer")}
                  isImproved={isAgentImproved("SolarOptimizer")}
                />
                <AgentCard 
                  name="ChargeMaster" 
                  deviceType="ev-charger" 
                  status="online" 
                  revenue={isAgentImproved("ChargeMaster") ? "166.84" : "128.34"} 
                  actions={isAgentImproved("ChargeMaster") ? 12 : 8} 
                  onImprove={() => handleImproveAgent("ChargeMaster")}
                  isImproved={isAgentImproved("ChargeMaster")}
                />
                <AgentCard 
                  name="GridMonitor" 
                  deviceType="energy-monitor" 
                  status="online" 
                  revenue={isAgentImproved("GridMonitor") ? "124.31" : "95.62"} 
                  actions={isAgentImproved("GridMonitor") ? 16 : 11} 
                  onImprove={() => handleImproveAgent("GridMonitor")}
                  isImproved={isAgentImproved("GridMonitor")}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="offline" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <AgentCard
                  name="ComputeCluster"
                  deviceType="compute-node"
                  status="offline"
                  revenue="0.00"
                  actions={0}
                  alert="Device offline for 2 days"
                  onImprove={() => handleImproveAgent("ComputeCluster")}
                  isImproved={isAgentImproved("ComputeCluster")}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="warning" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <AgentCard
                  name="NetGuard"
                  deviceType="helium-miner"
                  status="warning"
                  revenue={isAgentImproved("NetGuard") ? "93.85" : "72.19"}
                  actions={isAgentImproved("NetGuard") ? 7 : 4}
                  alert="Connection intermittent"
                  onImprove={() => handleImproveAgent("NetGuard")}
                  isImproved={isAgentImproved("NetGuard")}
                />
              </div>
            </TabsContent>
          </Tabs>
          
          {/* Agent Improvement Dialog */}
          <Dialog open={showImprovementDialog} onOpenChange={setShowImprovementDialog}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Boost Agent Performance</DialogTitle>
                <DialogDescription>
                  Enhance your agent's performance to generate more yield from your devices.
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="flex flex-col gap-2 border rounded-lg p-4 bg-slate-50 dark:bg-slate-900">
                  <div className="text-sm text-slate-500 dark:text-slate-400">Agent</div>
                  <div className="text-xl font-bold">{currentAgent}</div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col items-center gap-2 border rounded-lg p-4 bg-slate-50 dark:bg-slate-900">
                    <Database className="h-8 w-8 text-violet-500" />
                    <div className="text-sm font-medium">More Compute Power</div>
                    <div className="text-xs text-center text-slate-500 dark:text-slate-400">
                      Process more data at faster speeds
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-center gap-2 border rounded-lg p-4 bg-slate-50 dark:bg-slate-900">
                    <Brain className="h-8 w-8 text-violet-500" />
                    <div className="text-sm font-medium">Enhanced Decision-Making</div>
                    <div className="text-xs text-center text-slate-500 dark:text-slate-400">
                      Find better optimization opportunities
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2 border rounded-lg p-4 bg-violet-50 dark:bg-violet-900/20 border-violet-200 dark:border-violet-800">
                  <div className="text-sm text-violet-600 dark:text-violet-400">Performance Benefits</div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-violet-500" />
                    <div className="text-lg font-bold text-violet-600 dark:text-violet-400">
                      +30% Yield Generation
                    </div>
                  </div>
                  <div className="text-sm text-violet-600/80 dark:text-violet-400/80">
                    Your agent will generate more revenue and work more efficiently
                  </div>
                </div>
                
                <div className="flex flex-col gap-2 p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-emerald-100 dark:bg-emerald-800/40 rounded-full">
                      <Leaf className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div className="text-sm font-medium text-emerald-800 dark:text-emerald-300">
                      Pay with Carbon-Neutral Tokens
                    </div>
                  </div>
                  <div className="text-xs text-emerald-700 dark:text-emerald-400 mt-1">
                    This performance boost is powered by eco-friendly tokens that support carbon neutrality initiatives.
                  </div>
                </div>
                
                <div className="flex items-center gap-2 p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
                  <Wallet className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                  <div className="text-xs text-slate-600 dark:text-slate-400">
                    Your wallet will open to purchase performance-boosting tokens.
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => setShowImprovementDialog(false)}
                >
                  Cancel
                </Button>
                <Button 
                  className="bg-violet-600 hover:bg-violet-700"
                  onClick={handleConfirmImprovement}
                >
                  Unlock Performance
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
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