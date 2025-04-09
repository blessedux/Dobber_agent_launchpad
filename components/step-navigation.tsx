"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight, Rocket } from "lucide-react"

interface StepNavigationProps {
  currentStep: number
  totalSteps: number
  nextStep: () => void
  prevStep: () => void
  isNextDisabled: boolean
}

export default function StepNavigation({
  currentStep,
  totalSteps,
  nextStep,
  prevStep,
  isNextDisabled,
}: StepNavigationProps) {
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
        <Button onClick={nextStep} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700">
          <Rocket className="w-4 h-4" />
          Launch Agent
        </Button>
      )}
    </div>
  )
}
