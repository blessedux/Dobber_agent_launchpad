"use client"

import AgentLaunchpad from "@/components/agent-launchpad"
import { Suspense, useEffect } from "react"
import LoadingSpinner from "@/components/loading-spinner"

export default function LaunchAgentPage() {
  // Add console log for debugging in production
  useEffect(() => {
    console.log('Launch Agent Page loaded at:', window.location.pathname);
    console.log('Current URL:', window.location.href);
    
    // Detect and log any navigation attempts
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;
    
    history.pushState = function(...args: any[]) {
      console.log('history.pushState called with:', args);
      // If this is a redirect back to home, log it specially
      if (args[2] && typeof args[2] === 'string' && 
          (args[2] === '/' || args[2].startsWith('/dashboard'))) {
        console.error('DETECTED UNWANTED REDIRECT TO:', args[2]);
        // Allow the user to see what's happening by forcing a delay
        alert('Unwanted redirect detected. Check console for details.');
      }
      return originalPushState.apply(history, args as any);
    };
    
    history.replaceState = function(...args: any[]) {
      console.log('history.replaceState called with:', args);
      // If this is a redirect back to home, log it specially
      if (args[2] && typeof args[2] === 'string' && 
          (args[2] === '/' || args[2].startsWith('/dashboard'))) {
        console.error('DETECTED UNWANTED REDIRECT TO:', args[2]);
      }
      return originalReplaceState.apply(history, args as any);
    };
    
    // Also track navigation events
    const handlePopState = () => {
      console.log('popstate event fired', window.location.pathname);
    };
    
    window.addEventListener('popstate', handlePopState);
    
    // Prevent automatic redirects that might be happening
    const preventUnload = (e: BeforeUnloadEvent) => {
      console.log('beforeunload event triggered');
      e.preventDefault();
      e.returnValue = '';
      return '';
    };
    
    // Only add this in development for debugging
    if (process.env.NODE_ENV !== 'production') {
      window.addEventListener('beforeunload', preventUnload);
    }
    
    return () => {
      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;
      window.removeEventListener('popstate', handlePopState);
      if (process.env.NODE_ENV !== 'production') {
        window.removeEventListener('beforeunload', preventUnload);
      }
    };
  }, []);
  
  return (
    <main className="container px-4 py-8 md:py-12">
      {/* Add debug info */}
      <div className="absolute top-2 right-2 text-xs text-slate-400 bg-slate-800/40 p-2 rounded">
        Path: {typeof window !== 'undefined' ? window.location.pathname : 'unknown'}
      </div>
      
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-2 text-slate-800 dark:text-slate-100">
        DePIN Agent Launchpad
      </h1>
      <p className="text-center text-slate-600 dark:text-slate-300 mb-12 max-w-2xl mx-auto">
        Deploy autonomous AI agents to manage your real-world devices and create self-sustaining micro-enterprises.
      </p>

      <Suspense fallback={<LoadingSpinner />}>
        <AgentLaunchpad />
      </Suspense>
    </main>
  )
}
