import AgentLaunchpad from "@/components/agent-launchpad"
import { Suspense } from "react"
import LoadingSpinner from "@/components/loading-spinner"

export default function LaunchAgentPage() {
  return (
    <main className="container px-4 py-8 md:py-12">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-2 text-slate-800 dark:text-slate-100">
        DePIN Agent Launchpad
      </h1>
      <p className="text-center text-slate-600 dark:text-slate-300 mb-12 max-w-2xl mx-auto">
        Deploy autonomous AI agents to manage your real-world devices and create self-sustaining micro-enterprises.
      </p>

      <Suspense fallback={<LoadingSpinner />}>
        <AgentLaunchpad />
      </Suspense>
    </main>
  )
}
