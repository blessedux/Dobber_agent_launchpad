"use client"

import type React from "react"
import Navbar from "@/components/navbar"
import { AuroraBackground } from "@/components/ui/aurora-background"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <AuroraBackground>
        {children}
      </AuroraBackground>
    </div>
  )
} 