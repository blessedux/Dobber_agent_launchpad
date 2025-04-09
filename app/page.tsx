"use client";

import { Suspense } from "react";
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { TransitionLink } from "@/components/ui/transition-link"
import { useTransition } from "@/components/transition-provider"

// Separate client component for the landing page content that uses hooks
function LandingPageContent() {
  const { isTransitioning } = useTransition();
  
  return (
    <div className="flex items-center justify-center min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="container px-4 py-16 md:py-24 flex flex-col items-center text-center"
      >
        <motion.h1 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ 
            delay: 0.5, 
            duration: 0.8,
            exit: { duration: 0.4, delay: 0 } 
          }}
          className="text-4xl md:text-6xl font-bold tracking-tight mb-4 max-w-3xl text-slate-900 dark:text-white"
        >
          The Future of Work <br></br>Runs Itself.
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ 
            delay: 0.7, 
            duration: 0.8,
            exit: { duration: 0.4, delay: 0.1 } 
          }}
          className="text-xl text-slate-700 dark:text-slate-300 mb-12 max-w-2xl"
        >
          AI agents manage your DePIN devices like businesses — earning, scaling, and adapting autonomously.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ 
            delay: 0.9, 
            duration: 0.6,
            exit: { duration: 0.4, delay: 0.2 } 
          }}
        >
          <TransitionLink href="/dashboard">
            <Button
              variant="outline"
              className="border-violet-300 dark:border-violet-700 text-violet-600 dark:text-violet-400 hover:bg-violet-100 dark:hover:bg-violet-900/30 px-6 backdrop-blur-sm"
            >
              Get Started
            </Button>
          </TransitionLink>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="relative min-h-screen">
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
        <LandingPageContent />
      </Suspense>
    </div>
  );
}
