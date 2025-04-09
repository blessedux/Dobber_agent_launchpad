import { CheckCircle2 } from "lucide-react"

interface StepIndicatorProps {
  currentStep: number
  totalSteps: number
}

export default function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  const steps = [
    "Select Your Device",
    "Describe Your Agent",
    "Set Up On-Chain Logic",
    "Connect to Device",
    "Launch Agent",
  ]

  return (
    <div className="hidden md:flex justify-between items-center w-full mb-8">
      {steps.map((step, index) => {
        const stepNumber = index + 1
        const isActive = stepNumber === currentStep
        const isCompleted = stepNumber < currentStep

        return (
          <div key={stepNumber} className="flex flex-col items-center w-1/5">
            <div className="relative flex items-center justify-center">
              {isCompleted ? (
                <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
              ) : (
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isActive
                      ? "bg-violet-100 dark:bg-violet-900 text-violet-600 dark:text-violet-400 border-2 border-violet-500"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                  }`}
                >
                  {stepNumber}
                </div>
              )}

              {stepNumber < totalSteps && (
                <div
                  className={`absolute w-full h-[2px] top-1/2 left-full -translate-y-1/2 ${
                    isCompleted ? "bg-emerald-500" : "bg-slate-200 dark:bg-slate-700"
                  }`}
                  style={{ width: "calc(100% - 2.5rem)" }}
                />
              )}
            </div>

            <span
              className={`mt-2 text-xs font-medium ${
                isActive
                  ? "text-violet-600 dark:text-violet-400"
                  : isCompleted
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-slate-500 dark:text-slate-400"
              }`}
            >
              {step}
            </span>
          </div>
        )
      })}
    </div>
  )
}
