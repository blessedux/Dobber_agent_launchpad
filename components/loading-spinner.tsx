import { Loader2 } from "lucide-react"

export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <Loader2 className="h-8 w-8 animate-spin text-violet-600 dark:text-violet-400" />
      <p className="mt-2 text-slate-600 dark:text-slate-300">Loading...</p>
    </div>
  )
}
