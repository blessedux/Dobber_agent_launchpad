"use client"

import type React from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import ProtectedRoute from "@/components/protected-route"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { 
  Rocket, 
  Home, 
  Network, 
  BarChart3, 
  LineChart, 
  Workflow,
  LogOut,
  HelpCircle
} from "lucide-react"
import { MobileMenu } from '@/components/mobile-menu'
import { usePrivy as useBasePrivy } from "@privy-io/react-auth"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

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
  const { logout, authenticated, user } = useBasePrivy()
  
  return (
    <ProtectedRoute>
      <div className="flex flex-col min-h-screen">
        <header className="border-b border-border py-2 px-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-2 mr-6">
              <Link href="/dashboard" className="flex items-center gap-2">
                <Image 
                  src="/dobprotocol-logo.svg" 
                  alt="DOB Protocol" 
                  width={28}
                  height={28}
                  className="text-violet-600 dark:text-violet-400"
                />
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
            
            <div className="flex items-center gap-3">
              {authenticated && (
                <div className="flex items-center gap-3">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link href="/help">
                          <Button variant="ghost" size="icon" className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100">
                            <HelpCircle className="h-5 w-5" />
                          </Button>
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs" side="bottom">
                        <div className="space-y-2 p-1">
                          <p className="font-semibold">Your Data is Secure</p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            DOB Protocol takes your privacy seriously. Your wallet address and personal data 
                            are stored securely and never shared with third parties. All agent operations 
                            run in an encrypted environment with zero-knowledge verification.
                          </p>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    className="hidden sm:flex items-center gap-1"
                    onClick={logout}
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Disconnect</span>
                  </Button>

                  {user?.wallet && (
                    <span className="text-sm text-slate-600 dark:text-slate-400 hidden md:block">
                      {user.wallet.address.slice(0, 6)}...{user.wallet.address.slice(-4)}
                    </span>
                  )}
                  
                  <div className="ml-4 hidden md:block">
                    <Image 
                      src="/virtuals_logo.svg" 
                      alt="Virtuals Protocol" 
                      width={120} 
                      height={32}
                    />
                  </div>
                </div>
              )}
              <MobileMenu />
            </div>
          </div>
        </header>
        
        <main className="flex-1 p-6">{children}</main>
      </div>
    </ProtectedRoute>
  )
} 