"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { ServerCog, Cpu, Upload, Rocket, Database, CheckCircle2 } from "lucide-react"

export default function CreatingAgentPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [currentStep, setCurrentStep] = useState(0)
  const [completed, setCompleted] = useState(false)
  
  // Add console log for debugging in production
  useEffect(() => {
    console.log('Creating Agent Page loaded');
    if (searchParams) {
      console.log('URL Parameters:', Object.fromEntries([...searchParams.entries()]));
    } else {
      console.log('No URL parameters found');
    }
  }, [searchParams]);
  
  // Get agent data from query params
  const agentName = searchParams?.get('name') || "AgentBot"
  const deviceType = searchParams?.get('type') || "compute-node"
  const agentDescription = searchParams?.get('desc') || ""
  
  const steps = [
    { id: 0, label: "Initializing agent", icon: Cpu },
    { id: 1, label: "Setting up device connection", icon: ServerCog },
    { id: 2, label: "Configuring on-chain logic", icon: Database },
    { id: 3, label: "Uploading to DOB network", icon: Upload },
    { id: 4, label: "Launching agent", icon: Rocket },
  ]

  useEffect(() => {
    // Simulate the steps sequence
    const interval = setInterval(() => {
      if (currentStep < steps.length - 1) {
        setCurrentStep(prev => prev + 1)
      } else if (!completed) {
        setCompleted(true)
        clearInterval(interval)
        
        // Create agent data to pass to dashboard
        const agentParams = new URLSearchParams({
          agentCreated: 'true',
          name: agentName,
          type: deviceType,
          desc: agentDescription
        }).toString()
        
        // For production, use window.location for more reliable navigation
        const dashboardUrl = `/dashboard?${agentParams}`;
        const fullDashboardUrl = window.location.origin + dashboardUrl;
        
        console.log('Redirecting to dashboard with params:', dashboardUrl);
        
        // Redirect to dashboard after a slight delay with the agent data
        setTimeout(() => {
          if (process.env.NODE_ENV === 'production') {
            window.location.href = fullDashboardUrl;
          } else {
            router.push(dashboardUrl);
            
            // Fallback direct navigation if router fails
            setTimeout(() => {
              if (window.location.pathname !== '/dashboard') {
                console.log('Router navigation failed, using direct redirect');
                window.location.href = fullDashboardUrl;
              }
            }, 300);
          }
        }, 1000) // Delay after completion animation
      }
    }, 600) // Time between steps
    
    return () => clearInterval(interval)
  }, [currentStep, completed, router, agentName, deviceType, agentDescription, steps.length])

  return (
    <main className="container flex flex-col items-center justify-center min-h-screen px-4 py-8">
      <Card className="w-full max-w-xl p-8 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border-slate-200/70 dark:border-slate-700/70">
        <div className="flex flex-col items-center space-y-6">
          <div className="w-20 h-20 mb-4">
            <motion.div
              className="w-full h-full rounded-full border-4 border-t-violet-600 border-r-violet-600 border-b-violet-200 border-l-violet-200 dark:border-b-violet-800 dark:border-l-violet-800"
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            />
          </div>
          
          <h1 className="text-2xl font-bold text-center text-slate-800 dark:text-slate-100">
            {completed ? "Agent Creation Complete!" : `Creating ${agentName}`}
          </h1>
          
          <p className="text-center text-slate-600 dark:text-slate-300 mb-6">
            {completed 
              ? `Your ${getDeviceName(deviceType)} agent is now live and ready to manage your devices.`
              : `Setting up your ${getDeviceName(deviceType)} agent on the DOB network...`}
          </p>

          <div className="w-full space-y-4">
            {steps.map((step) => (
              <div 
                key={step.id} 
                className="flex items-center gap-4"
              >
                <div className={`
                  p-2 rounded-full transition-all duration-300 
                  ${currentStep >= step.id 
                    ? "bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400" 
                    : "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600"}
                `}>
                  {currentStep > step.id ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  ) : (
                    <step.icon className="w-5 h-5" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className={`font-medium transition-colors duration-300 ${
                      currentStep >= step.id 
                        ? "text-slate-800 dark:text-slate-200" 
                        : "text-slate-400 dark:text-slate-600"
                    }`}>
                      {step.label}
                    </p>
                    {currentStep === step.id && (
                      <div className="flex space-x-1">
                        <motion.div 
                          className="w-1.5 h-1.5 rounded-full bg-violet-600 dark:bg-violet-400"
                          animate={{ opacity: [0, 1, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity, repeatType: "loop" }}
                        />
                        <motion.div 
                          className="w-1.5 h-1.5 rounded-full bg-violet-600 dark:bg-violet-400"
                          animate={{ opacity: [0, 1, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity, repeatType: "loop", delay: 0.2 }}
                        />
                        <motion.div 
                          className="w-1.5 h-1.5 rounded-full bg-violet-600 dark:bg-violet-400"
                          animate={{ opacity: [0, 1, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity, repeatType: "loop", delay: 0.4 }}
                        />
                      </div>
                    )}
                  </div>
                  {currentStep === step.id && (
                    <motion.div 
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 0.6 }}
                      className="h-1 bg-violet-500 dark:bg-violet-600 mt-2 rounded-full"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </main>
  )
}

// Helper function to get device display name
function getDeviceName(deviceType: string): string {
  switch (deviceType) {
    case "ev-charger": return "EV Charger"
    case "helium-miner": return "Helium Miner"
    case "solar-node": return "Solar Node"
    case "iot-gateway": return "IoT Gateway"
    case "compute-node": return "Compute Node"
    case "energy-monitor": return "Energy Monitor"
    default: return "Device"
  }
} 