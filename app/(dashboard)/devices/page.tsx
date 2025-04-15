"use client";

import { Suspense, useEffect, useState } from "react";
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Filter, ArrowUpDown, Search, Cpu } from "lucide-react"
import { Input } from "@/components/ui/input"
import DeviceHealthPanel from "@/components/device-health-panel"
import { TransitionLink } from "@/components/ui/transition-link"
import { motion } from "framer-motion";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2 } from "lucide-react";
import { useSearchParams } from "next/navigation";

// Mock data - in a real app this would come from an API or database
const hasDevices = true

// Search component that might use useSearchParams
function DeviceSearch() {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500 dark:text-slate-400" />
        <Input type="search" placeholder="Search devices..." className="pl-9 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm" />
      </div>
      <div className="flex gap-2">
        <Button variant="outline" size="icon" className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm">
          <Filter className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm">
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

// Device list component 
function DeviceList() {
  return (
    <>
      <Tabs defaultValue="all" className="w-full mb-6">
        <TabsList className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm">
          <TabsTrigger value="all">All Devices</TabsTrigger>
          <TabsTrigger value="online">Online</TabsTrigger>
          <TabsTrigger value="offline">Offline</TabsTrigger>
          <TabsTrigger value="unassigned">Unassigned</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DeviceHealthPanel
          name="Solar Panel Array A"
          type="solar-node"
          status="online"
          uptime="99.7%"
          pool="0x7a23...45df"
          lastReward="12 hours ago"
        />
        <DeviceHealthPanel
          name="Downtown EV Station"
          type="ev-charger"
          status="online"
          uptime="98.2%"
          pool="0x8b12...f67a"
          lastReward="3 hours ago"
        />
        <DeviceHealthPanel
          name="Helium Hotspot #42"
          type="helium-miner"
          status="warning"
          uptime="78.4%"
          pool="0x3d45...921c"
          lastReward="2 days ago"
          alert="Signal strength degraded"
        />
        <DeviceHealthPanel
          name="Energy Grid Monitor"
          type="energy-monitor"
          status="online"
          uptime="100%"
          pool="0x9f34...12ab"
          lastReward="6 hours ago"
        />
        <DeviceHealthPanel
          name="Edge Compute Node"
          type="compute-node"
          status="offline"
          uptime="45.3%"
          pool="0x2c67...89de"
          lastReward="5 days ago"
          alert="Hardware failure detected"
        />
        <Card className="border-dashed border-2 flex items-center justify-center p-6 h-[230px] bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm">
          <TransitionLink href="/add-device">
            <Button variant="ghost" className="h-auto flex flex-col gap-3 py-6">
              <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-full">
                <Plus className="h-6 w-6 text-slate-600 dark:text-slate-400" />
              </div>
              <span>Add New Device</span>
            </Button>
          </TransitionLink>
        </Card>
      </div>
    </>
  );
}

export default function DevicesPage() {
  const searchParams = useSearchParams() || null;
  const [showSuccess, setShowSuccess] = useState(false);
  const [newDeviceName, setNewDeviceName] = useState("");
  
  // Immediate cleanup of ALL global window flags to prevent unwanted redirections
  useEffect(() => {
    if (typeof window !== 'undefined') {
      console.log('Devices page: Performing immediate cleanup of all global flags');
      
      // Reset all known global flags that might cause redirection issues
      window.__allowRedirectToDashboard = false;
      window.__manualDevicesButtonClicked = false;
      window.__isLocationOverridden = false;
      window.__inAgentCreationFlow = false;
      window.__usingStoredAgentData = false;
      window.__hasEventListeners = false;
      window.__skipNextNavigation = false;
      window.__hardBlockingInstalled = false;
      
      // Also force clear any lingering beforeunload or popstate handlers
      // This is a drastic approach but helps ensure clean state
      const noop = () => {};
      window.onbeforeunload = noop;
      window.onpopstate = noop;
      
      // This ensures this cleanup runs before other effects
    }
  }, []);
  
  // Add navigation protection to prevent unwanted redirects to dashboard
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Set up a temporary navigation block for a few seconds
    const blockTime = 5000; // 5 seconds
    const startTime = Date.now();
    let blockTimer: NodeJS.Timeout;
    
    // Prevent any navigation to dashboard
    const preventDashboardRedirect = (e: PopStateEvent) => {
      if (Date.now() - startTime < blockTime) {
        console.log('Intercepted potential navigation event during protection period');
        // Push current state back to prevent navigation
        window.history.pushState(null, '', window.location.pathname);
        e.preventDefault();
        e.stopPropagation();
      }
    };
    
    // Block any attempts to replace the URL
    const originalReplaceState = window.history.replaceState;
    window.history.replaceState = function(data, title, url) {
      if (url && Date.now() - startTime < blockTime) {
        const urlStr = String(url);
        if (urlStr.includes('/dashboard')) {
          console.log('Blocked replaceState to dashboard:', urlStr);
          return; // Don't execute the replace
        }
      }
      return originalReplaceState.apply(this, [data, title, url]);
    };
    
    // Add event listeners
    window.addEventListener('popstate', preventDashboardRedirect);
    
    // Execute an initial pushState to set up the history stack
    window.history.pushState(null, '', window.location.pathname);
    
    // Log that protection is active
    console.log('🔒 Navigation protection active on devices page for', blockTime, 'ms');
    
    // Set a timer to remove protection
    blockTimer = setTimeout(() => {
      console.log('🔓 Navigation protection on devices page expired');
    }, blockTime);
    
    return () => {
      window.removeEventListener('popstate', preventDashboardRedirect);
      window.history.replaceState = originalReplaceState;
      clearTimeout(blockTimer);
      console.log('Navigation protection cleanup');
    };
  }, []);
  
  // Check for silent redirects through DOM mutations
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    console.log('Setting up DOM observer to detect potential redirects');
    
    // Create a MutationObserver to detect potential redirect mechanisms
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'childList') {
          // Check for meta refresh tags that might cause redirects
          const metaTags = document.querySelectorAll('meta[http-equiv="refresh"]');
          metaTags.forEach(tag => {
            console.log('Found meta refresh tag, removing:', tag.getAttribute('content'));
            tag.remove();
          });
          
          // Check for script elements that might be redirecting
          const scripts = document.querySelectorAll('script:not([src])');
          scripts.forEach(script => {
            const content = script.textContent || '';
            if (
              content.includes('window.location') && 
              (content.includes('/dashboard') || content.includes('history.')) ||
              content.includes('navigate') || 
              content.includes('router.push')
            ) {
              console.log('Found potentially redirecting script, removing');
              script.remove();
            }
          });
          
          // Check for anchor tags with dashboard links and unwanted click handlers
          const dashboardLinks = document.querySelectorAll('a[href*="/dashboard"]');
          dashboardLinks.forEach(link => {
            // Don't block navigation menu links, but log them
            if (link.closest('nav')) {
              console.log('Found dashboard link in navigation (allowed):', link);
            } else {
              console.log('Found dashboard link outside navigation:', link);
              // Add a click interceptor to prevent accidental navigation
              link.addEventListener('click', (e) => {
                console.log('Intercepted click on dashboard link');
                e.preventDefault();
                return false;
              }, true);
            }
          });
        }
      }
    });
    
    // Start observing the document for any changes
    observer.observe(document, { 
      childList: true, 
      subtree: true,
      attributes: true,
      attributeFilter: ['href', 'src', 'content']
    });
    
    // Also monitor head specifically for meta tags
    observer.observe(document.head, {
      childList: true,
      subtree: true
    });
    
    return () => {
      observer.disconnect();
      console.log('DOM observer for redirects disconnected');
    };
  }, []);
  
  // Monitor URL changes and revert unwanted redirects
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Capture initial path when component mounts
    const initialPathname = window.location.pathname;
    console.log('Setting up URL change monitor, initial path:', initialPathname);
    
    // Record that we're on the devices page
    sessionStorage.setItem('lastValidLocation', initialPathname);
    
    // Use a more specific flag for the current valid location
    const onDevicesPage = initialPathname.includes('/devices');
    if (onDevicesPage) {
      console.log('Currently on devices page, setting protection flag');
      sessionStorage.setItem('protectDevicesPage', 'true');
    }
    
    // Set up interval to check current URL
    const intervalId = setInterval(() => {
      const currentPath = window.location.pathname;
      
      // If we detect navigation to dashboard from devices page, revert it
      if (
        sessionStorage.getItem('protectDevicesPage') === 'true' && 
        currentPath.includes('/dashboard')
      ) {
        console.log('🚨 DETECTED UNWANTED REDIRECT TO DASHBOARD, REVERTING');
        
        // Log debug info
        console.log('Current path:', currentPath);
        console.log('Initial path:', initialPathname);
        console.log('Last valid location:', sessionStorage.getItem('lastValidLocation'));
        
        // Force navigation back to devices page
        window.history.pushState(null, '', '/devices');
        
        // If pushState doesn't work, try direct location change
        if (window.location.pathname !== '/devices') {
          console.log('PushState failed, trying direct location change');
          window.location.href = '/devices';
        }
      }
    }, 100); // Check frequently
    
    return () => {
      clearInterval(intervalId);
      
      // Only clear protection if we're intentionally navigating away
      if (!window.location.pathname.includes('/devices')) {
        console.log('Navigating away from devices page, clearing protection');
        sessionStorage.removeItem('protectDevicesPage');
      }
      
      console.log('URL change monitor cleaned up');
    };
  }, []);
  
  // Check for agent creation when page loads
  useEffect(() => {
    console.log('Devices page loaded, checking for agent creation');
    console.log('Session storage flags:', {
      agentCreated: sessionStorage.getItem('agent-created'),
      agentName: sessionStorage.getItem('agent-name'),
      agentType: sessionStorage.getItem('agent-type'),
    });
    
    // This cleanup function runs on component mount to clear ANY leftover flags from the dashboard
    // that might be causing unwanted redirections
    const cleanupCompetingFlags = () => {
      // Clear old flag format
      sessionStorage.removeItem('agentCompleted');
      sessionStorage.removeItem('completionTimestamp');
      sessionStorage.removeItem('redirectedFromAgentCreation');
      sessionStorage.removeItem('agentName');
      sessionStorage.removeItem('agentType');
    };
    
    // Always run this cleanup to prevent dashboard from processing
    cleanupCompetingFlags();
    
    // Check if a new agent was just created
    const agentCreated = sessionStorage.getItem('agent-created') === 'true';
    const agentName = sessionStorage.getItem('agent-name');
    
    if (agentCreated && agentName) {
      console.log('New agent created:', agentName);
      setNewDeviceName(agentName);
      setShowSuccess(true);
      
      // Clear the session storage to prevent reuse AFTER we've handled the success state
      setTimeout(() => {
        sessionStorage.removeItem('agent-created');
        sessionStorage.removeItem('agent-name');
        sessionStorage.removeItem('agent-type');
        sessionStorage.removeItem('agent-description');
        
        // Clear any global flags
        if (typeof window !== 'undefined') {
          window.__allowRedirectToDashboard = false;
          window.__manualDevicesButtonClicked = false;
        }
      }, 500); // Small delay to ensure we've already handled the success state
      
      // Hide the success message after 5 seconds
      const timer = setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, []);
  
  return (
    <main className="container px-4 py-8 md:py-12">
      {/* Success message when an agent is created */}
      {showSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-4"
        >
          <Alert className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
            <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
            <AlertDescription className="text-green-800 dark:text-green-300">
              Agent "{newDeviceName}" has been successfully deployed! You can now manage it from this page.
            </AlertDescription>
          </Alert>
        </motion.div>
      )}
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4"
      >
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-100">Devices</h1>
          <p className="text-slate-600 dark:text-slate-300 mt-1">Manage your connected DePIN devices</p>
        </div>

        <TransitionLink href="/add-device">
          <Button className="bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600">
            <Plus className="w-4 h-4 mr-2" />
            Add New Device
          </Button>
        </TransitionLink>
      </motion.div>

      {!hasDevices ? (
        <EmptyDevicesState />
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Suspense fallback={<div>Loading search...</div>}>
            <DeviceSearch />
          </Suspense>
          
          <Suspense fallback={<div>Loading devices...</div>}>
            <DeviceList />
          </Suspense>
        </motion.div>
      )}
    </main>
  )
}

function EmptyDevicesState() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="flex flex-col items-center justify-center text-center p-8 md:p-16 mt-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm">
        <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-full mb-6">
          <Cpu className="h-12 w-12 text-slate-600 dark:text-slate-400" />
        </div>

        <h2 className="text-2xl font-bold mb-2">No Devices Connected</h2>
        <p className="text-slate-600 dark:text-slate-300 mb-8 max-w-xl">
          You haven't connected any devices yet. Add your first DePIN device to start generating revenue with autonomous
          agents.
        </p>

        <TransitionLink href="/add-device">
          <Button size="lg" className="bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600">
            Connect Your First Device
            <Plus className="ml-2 h-4 w-4" />
          </Button>
        </TransitionLink>
      </Card>
    </motion.div>
  )
} 