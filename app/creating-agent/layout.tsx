"use client"

import { useEffect } from "react"

export default function CreatingAgentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Add defensive code to prevent redirects
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    console.log('Creating Agent Layout loaded, installing navigation protections');
    
    // Set a flag that we're in the creating-agent flow
    sessionStorage.setItem('inAgentCreation', 'true');
    
    // Override navigation methods to prevent unwanted redirects
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;
    const originalAssign = window.location.assign;
    const originalReplace = window.location.replace;
    
    // Block all navigation to home or dashboard unless explicitly allowed
    history.pushState = function(...args: any[]) {
      const url = args[2];
      if (typeof url === 'string' && (url === '/' || url.startsWith('/dashboard'))) {
        // Check if this is an expected redirect after agent creation
        const isAgentCompleted = sessionStorage.getItem('agentCompleted');
        if (!isAgentCompleted) {
          console.error('BLOCKED pushState to:', url);
          return null;
        }
      }
      return originalPushState.apply(history, args as any);
    };
    
    history.replaceState = function(...args: any[]) {
      const url = args[2];
      if (typeof url === 'string' && (url === '/' || url.startsWith('/dashboard'))) {
        const isAgentCompleted = sessionStorage.getItem('agentCompleted');
        if (!isAgentCompleted) {
          console.error('BLOCKED replaceState to:', url);
          return null;
        }
      }
      return originalReplaceState.apply(history, args as any);
    };
    
    window.location.assign = function(url: string) {
      if (url === '/' || url.startsWith('/dashboard')) {
        const isAgentCompleted = sessionStorage.getItem('agentCompleted');
        if (!isAgentCompleted) {
          console.error('BLOCKED location.assign to:', url);
          return;
        }
      }
      return originalAssign.call(this, url);
    };
    
    window.location.replace = function(url: string) {
      if (url === '/' || url.startsWith('/dashboard')) {
        const isAgentCompleted = sessionStorage.getItem('agentCompleted');
        if (!isAgentCompleted) {
          console.error('BLOCKED location.replace to:', url);
          return;
        }
      }
      return originalReplace.call(this, url);
    };
    
    return () => {
      // Restore original functions when component unmounts
      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;
      window.location.assign = originalAssign;
      window.location.replace = originalReplace;
      
      // Clear the flag
      sessionStorage.removeItem('inAgentCreation');
    };
  }, []);
  
  return (
    <div className="flex flex-col min-h-screen">
      {children}
    </div>
  )
} 