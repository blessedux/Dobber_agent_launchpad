"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import StepIndicator from "@/components/step-indicator"
import DeviceSelection from "@/components/steps/device-selection"
import AgentDescription from "@/components/steps/agent-description"
import OnChainLogic from "@/components/steps/on-chain-logic"
import TokenConfiguration from "@/components/steps/token-configuration"
import DeviceConnection from "@/components/steps/device-connection"
import LaunchAgent from "@/components/steps/launch-agent"
import StepNavigation from "@/components/step-navigation"

export type AgentData = {
  deviceType: string
  agentName: string
  agentDescription: string
  llmModel: string
  enableCollaboration: boolean
  allowSelfOptimize: boolean
  profitPoolAddress: string
  rewardDestination: string
  permissions: {
    monitor: boolean
    deposit: boolean
    manage: boolean
  }
  tokenSettings: {
    enabled: boolean
    name: string
    symbol: string
    supply: number
    initialPrice: number
    creatorRoyalty: number
    holderRewards: number
  }
  pluginInstalled: boolean
}

const initialAgentData: AgentData = {
  deviceType: "",
  agentName: "",
  agentDescription: "",
  llmModel: "gpt-4o",
  enableCollaboration: true,
  allowSelfOptimize: true,
  profitPoolAddress: "",
  rewardDestination: "",
  permissions: {
    monitor: true,
    deposit: true,
    manage: true,
  },
  tokenSettings: {
    enabled: true,
    name: "",
    symbol: "",
    supply: 10000,
    initialPrice: 0.1,
    creatorRoyalty: 10,
    holderRewards: 70
  },
  pluginInstalled: false,
}

export default function AgentLaunchpad() {
  const [currentStep, setCurrentStep] = useState(1)
  const [agentData, setAgentData] = useState<AgentData>(initialAgentData)

  const totalSteps = 6

  const updateAgentData = (data: Partial<AgentData>) => {
    setAgentData((prev) => ({ ...prev, ...data }))
  }

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <DeviceSelection agentData={agentData} updateAgentData={updateAgentData} />
      case 2:
        return <AgentDescription agentData={agentData} updateAgentData={updateAgentData} />
      case 3:
        return <OnChainLogic agentData={agentData} updateAgentData={updateAgentData} />
      case 4:
        return <TokenConfiguration agentData={agentData} updateAgentData={updateAgentData} />
      case 5:
        return <DeviceConnection agentData={agentData} updateAgentData={updateAgentData} />
      case 6:
        return <LaunchAgent agentData={agentData} />
      default:
        return null
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />

      <Card className="backdrop-blur-sm bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-lg rounded-xl p-6 mt-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="min-h-[400px]"
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>

        <StepNavigation
          currentStep={currentStep}
          totalSteps={totalSteps}
          nextStep={nextStep}
          prevStep={prevStep}
          agentData={agentData}
          isNextDisabled={
            (currentStep === 1 && !agentData.deviceType) ||
            (currentStep === 2 && (!agentData.agentName || !agentData.agentDescription)) ||
            (currentStep === 3 && (!agentData.profitPoolAddress || !agentData.rewardDestination)) ||
            (currentStep === 4 && agentData.tokenSettings.enabled && 
              (!agentData.tokenSettings.name || !agentData.tokenSettings.symbol)) ||
            (currentStep === 5 && !agentData.pluginInstalled)
          }
        />
      </Card>
    </div>
  )
}
