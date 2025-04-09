"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Rocket, Home, ServerCog, Cpu, BarChart3, Settings, HelpCircle } from "lucide-react"
import { cn } from "@/lib/utils"

export function MobileMenu() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  const navItems = [
    { name: "Home", href: "/dashboard", icon: <Home className="w-5 h-5" /> },
    { name: "Agents", href: "/agents", icon: <Rocket className="w-5 h-5" /> },
    { name: "Devices", href: "/devices", icon: <Cpu className="w-5 h-5" /> },
    { name: "Profit Pools", href: "/profit-pools", icon: <BarChart3 className="w-5 h-5" /> },
    { name: "Settings", href: "/settings", icon: <Settings className="w-5 h-5" /> },
  ]

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
          <ServerCog className="w-6 h-6 text-violet-600 dark:text-violet-400" />
          <span className="text-xl font-semibold tracking-tight">DOBBER</span>
        </div>
        <nav className="flex flex-col gap-4">
          {navItems.map((item) => (
            <Link
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
            </Link>
          ))}

          <div className="border-t border-slate-200 dark:border-slate-700 my-4 pt-4">
            <Link href="/launch-agent" onClick={() => setOpen(false)}>
              <Button className="w-full bg-violet-600 hover:bg-violet-700">
                <Rocket className="w-4 h-4 mr-2" />
                Launch Agent
              </Button>
            </Link>
          </div>

          <Link
            href="/help"
            onClick={() => setOpen(false)}
            className="flex items-center text-sm font-medium transition-colors px-3 py-2 rounded-md text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
          >
            <HelpCircle className="w-5 h-5 mr-2" />
            Help & Support
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  )
}
