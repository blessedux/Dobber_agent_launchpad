"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { MobileMenu } from "@/components/mobile-menu"
import { Rocket, Home, ServerCog, Cpu, BarChart3, Settings, HelpCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { TransitionLink } from "@/components/ui/transition-link"

const navItems = [
  { name: "Home", href: "/dashboard", icon: <Home className="w-5 h-5" /> },
  { name: "Agents", href: "/agents", icon: <Rocket className="w-5 h-5" /> },
  { name: "Devices", href: "/devices", icon: <Cpu className="w-5 h-5" /> },
  { name: "Profit Pools", href: "/profit-pools", icon: <BarChart3 className="w-5 h-5" /> },
  { name: "Settings", href: "/settings", icon: <Settings className="w-5 h-5" /> },
]

export default function Navbar() {
  const pathname = usePathname()

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
          <Button className="bg-violet-600 hover:bg-violet-700 hidden sm:flex">
            Connect
          </Button>
          <TransitionLink href="/help">
            <Button variant="ghost" size="icon" className="hidden sm:flex">
              <HelpCircle className="h-5 w-5" />
            </Button>
          </TransitionLink>
          
          {/* Virtuals Logo */}
          <div className="flex items-center ml-4">
            <span className="text-md font-semibold tracking-tight hidden md:inline-block text-violet-600 dark:text-violet-400">VIRTUALS</span>
          </div>
          
          <MobileMenu />
        </div>
      </div>
    </header>
  )
}
