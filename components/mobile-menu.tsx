"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Rocket, Home, Cpu, BarChart3, Settings, HelpCircle, LogOut, Network, LineChart, Workflow } from "lucide-react"
import { cn } from "@/lib/utils"
import { TransitionLink } from "@/components/ui/transition-link"
import { usePrivy as useBasePrivy } from "@privy-io/react-auth"

export function MobileMenu() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { login, logout, authenticated, user } = useBasePrivy()

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: <Home className="w-5 h-5" /> },
    { name: "Agents", href: "/agents", icon: <Rocket className="w-5 h-5" /> },
    { name: "Device Network", href: "/device-network", icon: <Network className="w-5 h-5" /> },
    { name: "Portfolio", href: "/portfolio", icon: <BarChart3 className="w-5 h-5" /> },
  ]
  
  const analyticsItems = [
    { name: "Performance", href: "/performance", icon: <LineChart className="w-5 h-5" /> },
    { name: "Ecosystem", href: "/ecosystem", icon: <Workflow className="w-5 h-5" /> },
  ]

  const handleLogin = () => {
    login();
    setOpen(false);
  }

  const handleLogout = () => {
    logout();
    setOpen(false);
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <div className="flex items-center gap-2 mb-8">
          <TransitionLink href="/" onClick={() => setOpen(false)}>
            <div className="flex items-center gap-2">
              <Image 
                src="/dobprotocol-logo.svg" 
                alt="DOB Protocol" 
                width={28}
                height={28}
              />
              <span className="text-xl font-semibold tracking-tight">DOBBER</span>
            </div>
          </TransitionLink>
        </div>
        <nav className="flex flex-col gap-4">
          {navItems.map((item) => (
            <TransitionLink
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
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
          
          <div className="border-t border-slate-200 dark:border-slate-700 my-2 pt-2">
            <div className="px-3 py-1 text-sm font-medium text-slate-500 dark:text-slate-400">
              Analytics
            </div>
            {analyticsItems.map((item) => (
              <TransitionLink
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
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
          </div>

          <div className="border-t border-slate-200 dark:border-slate-700 my-4 pt-4">
            {authenticated ? (
              <>
                {user?.wallet && (
                  <div className="px-3 py-2 text-sm text-slate-600 dark:text-slate-400 mb-2">
                    Connected: {user.wallet.address.slice(0, 6)}...{user.wallet.address.slice(-4)}
                  </div>
                )}
                <Button 
                  className="w-full bg-slate-200 hover:bg-slate-300 text-slate-800"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Disconnect
                </Button>
              </>
            ) : (
              <Button 
                className="w-full bg-violet-600 hover:bg-violet-700"
                onClick={handleLogin}
              >
                Connect
              </Button>
            )}
          </div>

          <TransitionLink
            href="/help"
            onClick={() => setOpen(false)}
            className="flex items-center text-sm font-medium transition-colors px-3 py-2 rounded-md text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
          >
            <HelpCircle className="w-5 h-5 mr-2" />
            Help & Support
          </TransitionLink>
        </nav>
      </SheetContent>
    </Sheet>
  )
}
