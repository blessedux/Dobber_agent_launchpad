"use client"

import AgentLaunchpad from "@/components/agent-launchpad"
import { Suspense, useEffect } from "react"
import LoadingSpinner from "@/components/loading-spinner"

export default function LaunchAgentPage() {
  // Add console log for debugging in production
  useEffect(() => {
    console.log('Launch Agent Page loaded at:', window.location.pathname);
    console.log('Current URL:', window.location.href);
    
    // Check if this is an intentional navigation to the page
    const intentionalNavigation = sessionStorage.getItem('intentionalLaunchNavigation');
    const navigationTimestamp = sessionStorage.getItem('launchNavigationTimestamp');
    const isIntentional = intentionalNavigation && navigationTimestamp && 
        (Date.now() - parseInt(navigationTimestamp) < 10000);
    
    console.log('Navigation intent check:', { isIntentional });
    
    // Clear the navigation flags
    sessionStorage.removeItem('intentionalLaunchNavigation');
    sessionStorage.removeItem('launchNavigationTimestamp');
    
    // Only apply blocking logic if this wasn't an intentional navigation
    if (!isIntentional) {
      // Detect and PREVENT unwanted navigation attempts
      const originalPushState = history.pushState;
      const originalReplaceState = history.replaceState;
      
      history.pushState = function(...args: any[]) {
        console.log('history.pushState called with:', args);
        // If this is a redirect back to home or dashboard, BLOCK it unless explicitly triggered
        if (args[2] && typeof args[2] === 'string' && 
            (args[2] === '/' || args[2].startsWith('/dashboard'))) {
          console.error('BLOCKING UNWANTED REDIRECT TO:', args[2]);
          // Only block if not coming from legitimate agent creation
          const isValidRedirect = sessionStorage.getItem('agentCompleted');
          if (!isValidRedirect) {
            console.log('Navigation prevented - not from agent creation flow');
            return null; // Block the navigation
          }
        }
        return originalPushState.apply(history, args as any);
      };
      
      history.replaceState = function(...args: any[]) {
        console.log('history.replaceState called with:', args);
        // If this is a redirect back to home or dashboard, BLOCK it unless explicitly triggered
        if (args[2] && typeof args[2] === 'string' && 
            (args[2] === '/' || args[2].startsWith('/dashboard'))) {
          console.error('BLOCKING UNWANTED REDIRECT TO:', args[2]);
          // Only block if not coming from legitimate agent creation
          const isValidRedirect = sessionStorage.getItem('agentCompleted');
          if (!isValidRedirect) {
            console.log('Navigation prevented - not from agent creation flow');
            return null; // Block the navigation
          }
        }
        return originalReplaceState.apply(history, args as any);
      };
      
      // Block direct navigation away
      const handleBeforeUnload = (event: BeforeUnloadEvent) => {
        // Only allow navigation if we're going to creating-agent or if it's a legitimate dashboard redirect
        const isLaunchingAgent = sessionStorage.getItem('launchingAgent');
        const isAgentCompleted = sessionStorage.getItem('agentCompleted');
        
        if (!isLaunchingAgent && !isAgentCompleted) {
          console.log('Blocking navigation away from launch-agent page');
          event.preventDefault();
          event.returnValue = '';
          return '';
        }
      };
      
      // Track all navigation events
      const handlePopState = () => {
        console.log('popstate event fired', window.location.pathname);
      };
      
      window.addEventListener('popstate', handlePopState);
      window.addEventListener('beforeunload', handleBeforeUnload);
      
      return () => {
        history.pushState = originalPushState;
        history.replaceState = originalReplaceState;
        window.removeEventListener('popstate', handlePopState);
        window.removeEventListener('beforeunload', handleBeforeUnload);
      };
    }
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
