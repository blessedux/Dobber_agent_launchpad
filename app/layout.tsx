import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import { cn } from "@/lib/utils"
import { ThemeProvider } from "@/components/theme-provider"
import { TransitionProvider } from "@/components/transition-provider"
import { AuroraBackground } from "@/components/ui/aurora-background"
import { PrivyProvider } from "@/components/privy-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  generator: 'v0.dev'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-sans antialiased", inter.className)}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <PrivyProvider>
            <AuroraBackground fixedInViewport={true}>
              <TransitionProvider>
                {children}
              </TransitionProvider>
            </AuroraBackground>
          </PrivyProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
