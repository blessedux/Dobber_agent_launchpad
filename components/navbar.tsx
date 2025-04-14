"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { MobileMenu } from "@/components/mobile-menu"
import { Rocket, Home, ServerCog, Cpu, BarChart3, Settings, HelpCircle, LogOut, LineChart } from "lucide-react"
import { cn } from "@/lib/utils"
import { TransitionLink } from "@/components/ui/transition-link"
import { usePrivy } from "@/components/privy-provider"
import { usePrivy as useBasePrivy } from "@privy-io/react-auth"
import { LoginButton } from "@/components/login-button"

const navItems = [
  { name: "Home", href: "/dashboard", icon: <Home className="w-5 h-5" /> },
  { name: "Agents", href: "/agents", icon: <Rocket className="w-5 h-5" /> },
  { name: "Devices", href: "/devices", icon: <Cpu className="w-5 h-5" /> },
  { name: "Profit Pools", href: "/profit-pools", icon: <BarChart3 className="w-5 h-5" /> },
  { name: "Settings", href: "/settings", icon: <Settings className="w-5 h-5" /> },
]

export default function Navbar() {
  const pathname = usePathname()
  const { isAuthenticated } = usePrivy()
  const { logout, authenticated, user } = useBasePrivy()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/50 dark:border-slate-700/50 bg-transparent backdrop-blur-sm">
      <div className="container flex h-16 items-center px-4 sm:px-6">
        <div className="flex items-center gap-2 mr-6">
          <TransitionLink href="/">
            <div className="flex items-center gap-2">
              <ServerCog className="w-6 h-6 text-violet-600 dark:text-violet-400" />
              <span className="text-xl font-semibold tracking-tight hidden md:inline-block">DOBBER</span>
            </div>
          </TransitionLink>
        </div>

        <nav className="hidden md:flex items-center gap-4 flex-1">
          {navItems.map((item) => (
            <TransitionLink
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center text-sm font-medium transition-colors px-3 py-2 rounded-md",
                pathname === item.href
                  ? "text-violet-900 dark:text-violet-100 bg-violet-100 dark:bg-violet-900/40"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100",
              )}
            >
              <span className="mr-2">{item.icon}</span>
              {item.name}
            </TransitionLink>
          ))}
        </nav>

        <div className="flex items-center ml-auto gap-2">
          {authenticated ? (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="hidden sm:flex items-center gap-2"
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
              {user?.email && (
                <span className="text-sm text-slate-600 dark:text-slate-400 hidden md:block">
                  {user.email.address}
                </span>
              )}
            </div>
          ) : (
            <LoginButton 
              className="hidden sm:flex"
              variant="default"
              size="sm"
            />
          )}
          <TransitionLink href="/help">
            <Button variant="ghost" size="icon" className="hidden sm:flex">
              <HelpCircle className="h-5 w-5" />
            </Button>
          </TransitionLink>
          
          {/* Virtuals Logo */}
          <div className="flex items-center ml-4">
            <Image 
              src="/virtuals_logo.svg" 
              alt="Virtuals Logo" 
              width={120} 
              height={32} 
              className="hidden md:block" 
            />
          </div>
          
          <MobileMenu />
        </div>
      </div>
    </header>
  )
}
