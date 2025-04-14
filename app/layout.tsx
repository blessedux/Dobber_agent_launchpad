import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import { cn } from "@/lib/utils"
import { ThemeProvider } from "@/components/theme-provider"
import { TransitionProvider } from "@/components/transition-provider"
import { AuroraBackground } from "@/components/ui/aurora-background"
import { PrivyProvider } from "@/components/privy-provider"
import Script from "next/script"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  generator: 'v0.dev'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script 
          id="sentry-protection"
          src="/disable-external-sentry.js" 
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              // Immediate protection against invalid Sentry initialization
              (function() {
                window.__sentryInitOriginal = window.Sentry?.init;
                if (window.Sentry) {
                  window.Sentry.init = function(options) {
                    if (options && (options.dsn === 'a' || options.dsn === '')) {
                      console.warn('Blocked invalid Sentry DSN (inline script)');
                      return {};
                    }
                    if (window.__sentryInitOriginal) return window.__sentryInitOriginal(options);
                  };
                }
              })();
            `
          }}
        />
      </head>
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
