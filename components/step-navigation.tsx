"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight, Rocket } from "lucide-react"
import { useRouter } from "next/navigation"

interface StepNavigationProps {
  currentStep: number
  totalSteps: number
  nextStep: () => void
  prevStep: () => void
  isNextDisabled: boolean
  agentData?: any // Add agentData prop to pass to the dashboard
}

export default function StepNavigation({
  currentStep,
  totalSteps,
  nextStep,
  prevStep,
  isNextDisabled,
  agentData,
}: StepNavigationProps) {
  const router = useRouter()

  // Function to handle the final launch action
  const handleLaunchAgent = () => {
    // Here you would typically send the agent data to a backend
    console.log("Starting agent creation:", agentData)
    
    // Create a serialized version of the essential agent data
    const agentParams = new URLSearchParams({
      name: agentData.agentName,
      type: agentData.deviceType,
      desc: agentData.agentDescription?.substring(0, 100) || "",
    }).toString()
    
    // Redirect to the agent creation loading screen with agent data
    router.push(`/creating-agent?${agentParams}`)
  }

  return (
    <div className="flex justify-between mt-8">
      {currentStep > 1 ? (
        <Button variant="outline" onClick={prevStep} className="flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
      ) : (
        <div></div>
      )}

      {currentStep < totalSteps ? (
        <Button
          onClick={nextStep}
          disabled={isNextDisabled}
          className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700"
        >
          Continue
          <ArrowRight className="w-4 h-4" />
        </Button>
      ) : (
        <Button 
          onClick={handleLaunchAgent} 
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700"
        >
          <Rocket className="w-4 h-4" />
          Launch Agent
        </Button>
      )}
    </div>
  )
}
