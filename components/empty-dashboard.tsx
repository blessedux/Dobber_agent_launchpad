import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Rocket, ArrowRight } from "lucide-react"

export default function EmptyDashboard() {
  return (
    <Card className="flex flex-col items-center justify-center text-center p-8 md:p-16 mt-4">
      <div className="bg-violet-100 dark:bg-violet-900/40 p-4 rounded-full mb-6">
        <Rocket className="h-12 w-12 text-violet-600 dark:text-violet-400" />
      </div>

      <h2 className="text-2xl font-bold mb-2">Welcome to Your Agent Launchpad</h2>
      <p className="text-slate-600 dark:text-slate-300 mb-8 max-w-xl">
        You haven't launched any agents yet. Deploy your first autonomous AI agent to manage your DePIN devices and
        start generating revenue.
      </p>

      <div className="grid gap-6 md:grid-cols-2 max-w-3xl w-full mb-8">
        <Card className="p-5 border border-slate-200 dark:border-slate-700">
          <h3 className="font-semibold mb-3">Why launch an agent?</h3>
          <ul className="space-y-2 text-left text-sm">
            <li className="flex gap-2">
              <span className="text-violet-600 dark:text-violet-400">✓</span>
              <span>Automate device management and optimization</span>
            </li>
            <li className="flex gap-2">
              <span className="text-violet-600 dark:text-violet-400">✓</span>
              <span>Maximize revenue through intelligent decisions</span>
            </li>
            <li className="flex gap-2">
              <span className="text-violet-600 dark:text-violet-400">✓</span>
              <span>Receive alerts and insights about performance</span>
            </li>
          </ul>
        </Card>

        <Card className="p-5 border border-slate-200 dark:border-slate-700">
          <h3 className="font-semibold mb-3">What you'll need</h3>
          <ul className="space-y-2 text-left text-sm">
            <li className="flex gap-2">
              <span className="text-violet-600 dark:text-violet-400">✓</span>
              <span>A compatible DePIN device</span>
            </li>
            <li className="flex gap-2">
              <span className="text-violet-600 dark:text-violet-400">✓</span>
              <span>Wallet address for receiving rewards</span>
            </li>
            <li className="flex gap-2">
              <span className="text-violet-600 dark:text-violet-400">✓</span>
              <span>5 minutes to complete the setup process</span>
            </li>
          </ul>
        </Card>
      </div>

      <Link href="/launch-agent">
        <Button size="lg" className="bg-violet-600 hover:bg-violet-700">
          Launch Your First Agent
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </Link>
    </Card>
  )
}
