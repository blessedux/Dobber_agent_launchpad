"use client"

import { useState } from "react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { ArrowUpRight, Wallet, Banknote } from "lucide-react"

const monthlyData = [
  { name: "Week 1", revenue: 121.52 },
  { name: "Week 2", revenue: 145.31 },
  { name: "Week 3", revenue: 118.76 },
  { name: "Week 4", revenue: 178.43 },
]

const weeklyData = [
  { name: "Mon", revenue: 24.32 },
  { name: "Tue", revenue: 21.89 },
  { name: "Wed", revenue: 25.71 },
  { name: "Thu", revenue: 32.04 },
  { name: "Fri", revenue: 28.89 },
  { name: "Sat", revenue: 21.67 },
  { name: "Sun", revenue: 23.35 },
]

export default function EarningsWidget() {
  const [timeframe, setTimeframe] = useState("weekly")
  const data = timeframe === "monthly" ? monthlyData : weeklyData

  const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0).toFixed(2)
  const previousTotal = (Number(totalRevenue) * 0.83).toFixed(2)
  const percentageIncrease = (((Number(totalRevenue) - Number(previousTotal)) / Number(previousTotal)) * 100).toFixed(1)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-2">
        <div>
          <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 mb-1">
            <Wallet className="w-4 h-4" />
            <span className="text-sm">{timeframe === "weekly" ? "This Week" : "This Month"}</span>
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-bold">${totalRevenue}</h3>
            <div className="flex items-center text-xs font-medium text-emerald-600 dark:text-emerald-400">
              <ArrowUpRight className="w-3 h-3 mr-0.5" />
              {percentageIncrease}%
            </div>
          </div>
        </div>
        <Select value={timeframe} onValueChange={setTimeframe}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Select timeframe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 15 }}>
            <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={12} tickMargin={8} stroke="#888" />
            <YAxis hide={true} domain={[0, "dataMax + 20"]} />
            <Tooltip
              cursor={{ fill: "rgba(200, 200, 200, 0.1)" }}
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                border: "1px solid #ccc",
                borderRadius: "4px",
                padding: "8px",
              }}
              formatter={(value) => [`$${value}`, "Revenue"]}
            />
            <Bar dataKey="revenue" fill="url(#colorGradient)" radius={[4, 4, 0, 0]} maxBarSize={60} />
            <defs>
              <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity={1} />
                <stop offset="100%" stopColor="#a78bfa" stopOpacity={0.8} />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <Card className="p-4 bg-slate-50 dark:bg-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/40 rounded-full">
              <Banknote className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <span className="text-sm font-medium">Latest Payout</span>
          </div>
          <div className="text-right">
            <div className="font-medium">$42.87</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">6 hours ago</div>
          </div>
        </div>
      </Card>
    </div>
  )
}
