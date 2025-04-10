"use client";

import { Suspense, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { TransitionLink } from "@/components/ui/transition-link"
import { useTransition } from "@/components/transition-provider"
import { ChevronDown, Rocket, Server, Cpu, BarChart3 } from "lucide-react"
import { usePrivy } from "@/components/privy-provider"
import { usePrivy as useBasePrivy } from "@privy-io/react-auth"
import { useRouter } from "next/navigation";

// Separate client component for the landing page content that uses hooks
function LandingPageContent() {
  const { isTransitioning } = useTransition();
  const aboutRef = useRef<HTMLDivElement>(null);
  const { authenticated, user, login } = useBasePrivy();
  const router = useRouter();
  
  // Effect to redirect to dashboard when authenticated
  useEffect(() => {
    if (authenticated && user) {
      router.push("/dashboard");
    }
  }, [authenticated, user, router]);
  
  const scrollToAbout = () => {
    aboutRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleCreateClick = () => {
    if (authenticated) {
      router.push("/dashboard");
    } else {
      login();
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
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
            className="flex flex-col gap-4 w-full max-w-xs"
          >
            <Button 
              onClick={handleCreateClick}
              className="w-full bg-violet-600 hover:bg-violet-700 text-white px-6 py-6 text-lg"
            >
              Create
            </Button>
            
            <Button
              variant="outline"
              onClick={scrollToAbout}
              className="w-full border-violet-300 dark:border-violet-700 text-violet-600 dark:text-violet-400 hover:bg-violet-100 dark:hover:bg-violet-900/30 px-6 py-6 text-lg backdrop-blur-sm"
            >
              Dobber
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        </motion.div>
      </div>
      
      {/* About Dobber Section */}
      <div 
        ref={aboutRef} 
        className="min-h-screen flex items-center justify-center py-20"
      >
        <div className="container px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-slate-900 dark:text-white">What is Dobber?</h2>
            <p className="text-xl text-slate-700 dark:text-slate-300 max-w-3xl mx-auto">
              Dobber is an AI-powered platform that transforms your DePIN devices into autonomous business units.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white/10 dark:bg-slate-800/50 backdrop-blur-sm p-8 rounded-xl border border-slate-200/20 dark:border-slate-700/20">
              <div className="bg-violet-100 dark:bg-violet-900/40 p-3 rounded-full w-fit mb-4">
                <Rocket className="h-7 w-7 text-violet-600 dark:text-violet-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Autonomous Agents</h3>
              <p className="text-slate-600 dark:text-slate-400">
                AI agents that run your devices without human intervention, maximizing profits 24/7.
              </p>
            </div>
            
            <div className="bg-white/10 dark:bg-slate-800/50 backdrop-blur-sm p-8 rounded-xl border border-slate-200/20 dark:border-slate-700/20">
              <div className="bg-violet-100 dark:bg-violet-900/40 p-3 rounded-full w-fit mb-4">
                <Cpu className="h-7 w-7 text-violet-600 dark:text-violet-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Device Management</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Effortlessly connect and manage all your DePIN devices from a single dashboard.
              </p>
            </div>
            
            <div className="bg-white/10 dark:bg-slate-800/50 backdrop-blur-sm p-8 rounded-xl border border-slate-200/20 dark:border-slate-700/20">
              <div className="bg-violet-100 dark:bg-violet-900/40 p-3 rounded-full w-fit mb-4">
                <BarChart3 className="h-7 w-7 text-violet-600 dark:text-violet-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Revenue Optimization</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Smart algorithms that automatically adapt to market conditions to maximize your earnings.
              </p>
            </div>
            
            <div className="bg-white/10 dark:bg-slate-800/50 backdrop-blur-sm p-8 rounded-xl border border-slate-200/20 dark:border-slate-700/20">
              <div className="bg-violet-100 dark:bg-violet-900/40 p-3 rounded-full w-fit mb-4">
                <Server className="h-7 w-7 text-violet-600 dark:text-violet-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Decentralized Infrastructure</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Built on blockchain technology for maximum security, transparency, and ownership.
              </p>
            </div>
          </div>
          
          <div className="mt-16 text-center">
            <Button 
              onClick={handleCreateClick}
              className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-6 text-lg"
            >
              Create
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="relative">
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
        <LandingPageContent />
      </Suspense>
    </div>
  );
}
