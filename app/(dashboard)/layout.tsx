"use client"

import type React from "react"
import Navbar from "@/components/navbar"
import ProtectedRoute from "@/components/protected-route"
import { AuroraBackground } from "@/components/ui/aurora-background"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1">{children}</main>
      </div>
    </ProtectedRoute>
  )
} 