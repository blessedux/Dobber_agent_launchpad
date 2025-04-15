"use client"

import { useEffect } from "react"

// Helper for debug logging
const logDebug = (message: string) => {
  console.log(`[${new Date().toISOString()}] Creating Agent Layout: ${message}`);
}

// Create a global flag object
declare global {
  interface Window {
    __layoutProtectionActive?: boolean;
    __skipNextNavigation?: boolean;
    __walletAuthRedirectionBlocked?: boolean;
    __allowRedirectToDashboard?: boolean;
  }
}

export default function CreatingAgentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Add defensive code to prevent redirects
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    logDebug('Creating Agent Layout loaded, installing navigation protections');
    
    // Set flag that layout protection is active
    window.__layoutProtectionActive = true;
    
    // Set a flag that we're in the creating-agent flow (keep both for compatibility)
    sessionStorage.setItem('inAgentCreation', 'true');
    sessionStorage.setItem('launchingAgent', 'true');
    sessionStorage.setItem('launchTimestamp', Date.now().toString());
    
    // Specifically check for and block wallet authentication redirects
    const blockWalletRedirects = () => {
      // Look for wallet related elements that might trigger redirects
      const walletElements = document.querySelectorAll('[class*="wallet"],[id*="wallet"],[class*="privy"],[id*="privy"]');
      
      if (walletElements.length > 0 && !window.__walletAuthRedirectionBlocked) {
        logDebug(`Found ${walletElements.length} wallet-related elements - adding protection`);
        
        // Add protection specifically for wallet auth redirects
        window.__walletAuthRedirectionBlocked = true;
        
        // Apply special patch for wallet authentication
        const patchWalletAuth = () => {
          // Override any redirects initiated by wallet authentication
          const privyModules = Object.keys(window).filter(key => 
            key.includes('privy') || key.includes('wallet') || key.includes('auth')
          );
          
          if (privyModules.length > 0) {
            logDebug(`Found ${privyModules.length} wallet/auth related modules - patching`);
            
            // Try to intercept navigate/redirect functions in these modules
            try {
              // Create a mutation observer to detect new script elements
              const observer = new MutationObserver((mutations) => {
                mutations.forEach(mutation => {
                  if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(node => {
                      if (node instanceof HTMLScriptElement) {
                        logDebug('Detected new script loading - reinforcing protection');
                        // Reinforce our protection
                        window.__skipNextNavigation = true;
                      }
                    });
                  }
                });
              });
              
              // Start observing
              observer.observe(document.head, { childList: true, subtree: true });
              
              // Cleanup function
              return () => observer.disconnect();
            } catch (err) {
              console.error('Error patching wallet auth:', err);
            }
          }
        };
        
        // Run patch immediately and return cleanup
        const cleanup = patchWalletAuth();
        return cleanup;
      }
    };
    
    // Run the wallet check function immediately
    const walletCleanup = blockWalletRedirects();
    
    // Also run it periodically
    const walletCheckInterval = setInterval(blockWalletRedirects, 500);
    
    // Override history methods safely
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;
    
    // Block all navigation to home or dashboard unless explicitly allowed
    history.pushState = function(...args: any[]) {
      const url = args[2];
      if (typeof url === 'string' && (url === '/' || url.startsWith('/dashboard'))) {
        // Skip next navigation check if set
        if (window.__skipNextNavigation) {
          window.__skipNextNavigation = false;
          logDebug('Skipping navigation block due to flag');
          return null;
        }
        
        // Check if this is an expected redirect after agent creation
        const isAgentCompleted = sessionStorage.getItem('agentCompleted');
        
        if (!isAgentCompleted && !window.__allowRedirectToDashboard) {
          logDebug('BLOCKED pushState to:' + url);
          return null;
        }
      }
      return originalPushState.apply(history, args as any);
    };
    
    history.replaceState = function(...args: any[]) {
      const url = args[2];
      if (typeof url === 'string' && (url === '/' || url.startsWith('/dashboard'))) {
        // Skip next navigation check if set
        if (window.__skipNextNavigation) {
          window.__skipNextNavigation = false;
          logDebug('Skipping navigation block due to flag');
          return null;
        }
        
        const isAgentCompleted = sessionStorage.getItem('agentCompleted');
        if (!isAgentCompleted && !window.__allowRedirectToDashboard) {
          logDebug('BLOCKED replaceState to:' + url);
          return null;
        }
      }
      return originalReplaceState.apply(history, args as any);
    };
    
    // Instead of trying to override window.location methods (which are read-only),
    // use event listeners to prevent navigation
    
    // Handle clicking on links
    const handleLinkClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      
      if (anchor) {
        const href = anchor.getAttribute('href');
        
        if (href && (href === '/' || href.startsWith('/dashboard'))) {
          // Check if this is an expected redirect after agent creation
          const isAgentCompleted = sessionStorage.getItem('agentCompleted');
          const isManualRedirect = anchor.hasAttribute('data-manual-dashboard-navigation');
          
          if (!isAgentCompleted && !isManualRedirect && !window.__allowRedirectToDashboard) {
            logDebug('BLOCKED click navigation to:' + href);
            e.preventDefault();
            return false;
          }
        }
      }
    };
    
    // Handle beforeunload
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      const isAgentCompleted = sessionStorage.getItem('agentCompleted');
      
      if (!isAgentCompleted && !window.__allowRedirectToDashboard) {
        logDebug('BLOCKED page unload');
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    };
    
    // Register event listeners
    document.addEventListener('click', handleLinkClick, true);
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    // Add a high-priority event loop to detect and block redirects
    const redirectInterval = setInterval(() => {
      if (window.location.pathname !== '/creating-agent' && !window.__allowRedirectToDashboard) {
        logDebug('DETECTED URL CHANGE - forcing back to creating-agent');
        window.history.pushState(null, '', '/creating-agent');
      }
    }, 100);
    
    return () => {
      // Only clean up if explicitly allowed
      if (window.__allowRedirectToDashboard) {
        logDebug('Cleaning up layout navigation protection - redirect allowed');
        
        // Restore original functions when component unmounts
        history.pushState = originalPushState;
        history.replaceState = originalReplaceState;
        
        // Remove event listeners
        document.removeEventListener('click', handleLinkClick, true);
        window.removeEventListener('beforeunload', handleBeforeUnload);
        
        // Clear the flags
        sessionStorage.removeItem('inAgentCreation');
        
        // Clear intervals
        clearInterval(walletCheckInterval);
        clearInterval(redirectInterval);
        
        // Clear window flags
        window.__layoutProtectionActive = false;
        window.__walletAuthRedirectionBlocked = false;
        
        // Run wallet cleanup if exists
        if (walletCleanup) walletCleanup();
      } else {
        logDebug('KEEPING layout protection active - not allowed to redirect yet');
      }
    };
  }, []);
  
  return (
    <div className="flex flex-col min-h-screen">
      {children}
    </div>
  )
} 