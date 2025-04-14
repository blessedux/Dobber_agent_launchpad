"use client"

import type React from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import Navbar from "@/components/navbar"
import ProtectedRoute from "@/components/protected-route"
import { AuroraBackground } from "@/components/ui/aurora-background"
import NavigationMenu from '@/components/ui/navigation-menu'
import UserNav from '@/components/ui/user-nav'
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Rocket, Home, ServerCog, Cpu, BarChart3, Settings, Network, LineChart, Workflow } from "lucide-react"
import { MobileMenu } from '@/components/mobile-menu'

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Agents", href: "/agents", icon: Rocket },
  { name: "Device Network", href: "/device-network", icon: Network },
  { name: "Portfolio", href: "/portfolio", icon: BarChart3 },
]

const analyticsItems = [
  { name: "Performance", href: "/performance", icon: LineChart },
  { name: "Ecosystem", href: "/ecosystem", icon: Workflow },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  
  return (
    <ProtectedRoute>
      <div className="flex flex-col min-h-screen">
        <header className="border-b border-border py-2 px-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-2 mr-6">
              <Link href="/dashboard" className="flex items-center gap-2">
                <ServerCog className="w-6 h-6 text-violet-600 dark:text-violet-400" />
                <span className="text-xl font-semibold tracking-tight hidden md:inline-block">DOBBER</span>
              </Link>
            </div>
            
            <nav className="hidden md:flex items-center gap-1 flex-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center text-sm font-medium transition-colors px-3 py-2 rounded-md",
                    pathname === item.href
                      ? "text-violet-900 dark:text-violet-100 bg-violet-100 dark:bg-violet-900/40"
                      : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100",
                  )}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.name}
                </Link>
              ))}
              
              <div className="h-6 mx-2 border-l border-slate-200 dark:border-slate-700" />
              
              {analyticsItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center text-sm font-medium transition-colors px-3 py-2 rounded-md",
                    pathname === item.href
                      ? "text-violet-900 dark:text-violet-100 bg-violet-100 dark:bg-violet-900/40"
                      : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100",
                  )}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.name}
                </Link>
              ))}
            </nav>
            
            <div className="flex items-center gap-4">
              <UserNav />
              <MobileMenu />
            </div>
          </div>
        </header>
        
        <main className="flex-1 p-6">{children}</main>
      </div>
    </ProtectedRoute>
  )
} 