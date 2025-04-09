import { ServerCog } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function LandingPage() {
  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Transparent navbar */}
      <header className="absolute top-0 left-0 right-0 z-10">
        <div className="container flex h-16 items-center px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <ServerCog className="w-6 h-6 text-violet-600 dark:text-violet-400" />
            <span className="text-xl font-semibold tracking-tight">DOBBER</span>
          </div>
        </div>
      </header>

      {/* Hero section */}
      <main className="flex-1 flex items-center justify-center">
        <div className="container px-4 py-16 md:py-24 flex flex-col items-center text-center">
          <div className="bg-violet-100 dark:bg-violet-900/40 p-4 rounded-full mb-8">
            <ServerCog className="h-12 w-12 text-violet-600 dark:text-violet-400" />
          </div>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 max-w-3xl">
            Autonomous Agents for Your DePIN Devices
          </h1>

          <p className="text-xl text-slate-600 dark:text-slate-300 mb-12 max-w-2xl">
            Deploy AI agents that autonomously manage your real-world devices and generate revenue without your
            intervention.
          </p>

          <Button
            variant="outline"
            className="border-violet-300 dark:border-violet-700 text-violet-600 dark:text-violet-400 hover:bg-violet-100 dark:hover:bg-violet-900/30 px-6"
          >
            Create
          </Button>
        </div>
      </main>
    </div>
  )
}
