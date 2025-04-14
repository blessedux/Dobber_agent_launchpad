"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { ServerCog, Cpu, Upload, Rocket, Database, CheckCircle2 } from "lucide-react"

// Add custom type definition for Window with our property
declare global {
  interface Window {
    __isLocationOverridden?: boolean;
    __usingStoredAgentData?: boolean;
  }
}

export default function CreatingAgentPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [currentStep, setCurrentStep] = useState(0)
  const [completed, setCompleted] = useState(false)
  const [isRedirecting, setIsRedirecting] = useState(false)
  const [isValidNavigation, setIsValidNavigation] = useState(false)
  
  // Define steps
  const steps = [
    { id: 0, label: "Initializing agent", icon: Cpu },
    { id: 1, label: "Setting up device connection", icon: ServerCog },
    { id: 2, label: "Configuring on-chain logic", icon: Database },
    { id: 3, label: "Uploading to DOB network", icon: Upload },
    { id: 4, label: "Launching agent", icon: Rocket },
  ]
  
  // CRITICAL: Block any unwanted redirects IMMEDIATELY when the component renders
  // This must be the first useEffect to run
  useEffect(() => {
    // Install aggressive redirect blocking as the first thing we do
    if (typeof window !== 'undefined') {
      console.log('Installing AGGRESSIVE redirect blocking');
      
      // Create a copy of the important location methods
      const originalLocation = {
        href: window.location.href,
        assign: window.location.assign,
        replace: window.location.replace,
        reload: window.location.reload,
      };
      
      // Save the current URL
      const currentUrl = window.location.href;
      const isLaunchFlow = true; // Always assume we're in the launch flow on this page
      
      // If we don't yet have the override, create it
      if (!window.__isLocationOverridden) {
        console.log('Replacing window.location object to prevent redirects');
        
        // Create a completely new location object
        const newLocation = {
          ...window.location,
          
          // Override the href setter to detect unwanted redirects
          set href(url: string) {
            console.log(`location.href setter called with: ${url}`);
            if (isLaunchFlow && (url === '/' || url.startsWith('/dashboard'))) {
              console.error(`BLOCKED navigation to: ${url}`);
              return;
            }
            originalLocation.href = url;
          },
          
          // Override methods that can cause navigation
          assign: function(url: string) {
            console.log(`location.assign called with: ${url}`);
            if (isLaunchFlow && (url === '/' || url.startsWith('/dashboard'))) {
              console.error(`BLOCKED navigation to: ${url}`);
              return;
            }
            return originalLocation.assign.call(this, url);
          },
          
          replace: function(url: string) {
            console.log(`location.replace called with: ${url}`);
            if (isLaunchFlow && (url === '/' || url.startsWith('/dashboard'))) {
              console.error(`BLOCKED navigation to: ${url}`);
              return;
            }
            return originalLocation.replace.call(this, url);
          },
          
          reload: function() {
            console.log('location.reload called');
            return originalLocation.reload.call(this);
          }
        };
        
        // Replace the entire window.location object
        try {
          // First try direct replacement (works in most browsers)
          // @ts-ignore - TypeScript doesn't like reassigning location
          window.location = newLocation;
        } catch (error) {
          console.error('Direct location replacement failed, trying Object.defineProperty');
          
          // If direct replacement fails, try with defineProperty
          try {
            Object.defineProperty(window, 'location', {
              value: newLocation,
              writable: false,
              configurable: false
            });
          } catch (innerError) {
            console.error('Failed to override window.location:', innerError);
          }
        }
        
        // Mark that we've overridden it
        window.__isLocationOverridden = true;
      }
    }
  }, []);

  // Verify that this is a valid navigation and not an unwanted redirect
  useEffect(() => {
    const isLaunchingAgent = sessionStorage.getItem('launchingAgent');
    const launchTimestamp = sessionStorage.getItem('launchTimestamp');
    const now = Date.now();
    
    // Check if we have a valid launch flag that's not too old (within 30 seconds)
    if (isLaunchingAgent && launchTimestamp && 
        now - parseInt(launchTimestamp) < 30000) {
      setIsValidNavigation(true);
      console.log('Valid agent launch navigation detected');
    } else {
      console.warn('Navigation to creating-agent page without valid launch flag');
      // We don't redirect here yet, we'll see if there are valid query params
    }
    
    // Reset the flag
    sessionStorage.removeItem('launchingAgent');
  }, []);
  
  // Add console log for debugging in production
  useEffect(() => {
    console.log('Creating Agent Page loaded');
    if (searchParams) {
      const params = Object.fromEntries([...searchParams.entries()]);
      console.log('URL Parameters:', params);
      
      // If we have valid parameters (name and type), consider this valid even without the flag
      if (params.name && params.type) {
        console.log('Valid parameters detected, allowing navigation');
        setIsValidNavigation(true);
      }
    } else {
      console.log('No URL parameters found');
      // If no valid params and no valid flag, this might be an unwanted redirect
      if (!isValidNavigation) {
        console.warn('No valid parameters or launch flag - this might be an unwanted redirect');
      }
    }
  }, [searchParams, isValidNavigation]);
  
  // Try to read agent data from sessionStorage if URL params are missing
  useEffect(() => {
    if (!isValidNavigation && typeof window !== 'undefined') {
      try {
        // Check if we have agent data in session storage
        const storedAgentData = sessionStorage.getItem('agentData');
        if (storedAgentData) {
          console.log('Found agent data in sessionStorage');
          const parsedData = JSON.parse(storedAgentData);
          
          // If we have valid data, consider this a valid navigation
          if (parsedData && parsedData.name && parsedData.type) {
            console.log('Valid agent data found in sessionStorage');
            setIsValidNavigation(true);
            
            // We don't need to update the URL - we'll just use the stored data
            // But we mark that we're using storage data
            window.__usingStoredAgentData = true;
          }
        }
      } catch (error) {
        console.error('Error parsing stored agent data:', error);
      }
    }
  }, [isValidNavigation]);
  
  // A more aggressive block for the entire page
  useEffect(() => {
    // If we somehow still get redirected and end up on the home page, go back to creating-agent
    if (typeof window !== 'undefined' && window.location.pathname === '/') {
      console.log('Detected we ended up on homepage, redirecting back');
      
      // Try to get stored agent data
      try {
        const storedAgentData = sessionStorage.getItem('agentData');
        if (storedAgentData) {
          const parsedData = JSON.parse(storedAgentData);
          if (parsedData && parsedData.name && parsedData.type) {
            const params = new URLSearchParams({
              name: parsedData.name,
              type: parsedData.type,
              desc: parsedData.desc || '',
            }).toString();
            
            // Force navigation back
            const creatingUrl = `/creating-agent?${params}`;
            window.location.href = window.location.origin + creatingUrl;
          }
        }
      } catch (error) {
        console.error('Failed to recover:', error);
      }
    }
  }, []);
  
  // Get agent data from query params
  const agentName = searchParams?.get('name') || "AgentBot"
  const deviceType = searchParams?.get('type') || "compute-node"
  const agentDescription = searchParams?.get('desc') || ""

  // Prevent unwanted redirects when we're already on this page
  useEffect(() => {
    // Check if there's a service worker that might be causing the redirect
    const checkRedirects = () => {
      // Create a MutationObserver to detect meta refreshes or JS redirects
      const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          if (mutation.type === 'childList') {
            // Check for meta refresh tags
            const metaRefreshes = document.querySelectorAll('meta[http-equiv="refresh"]');
            if (metaRefreshes.length > 0) {
              console.log('Found meta refresh tag, removing it');
              metaRefreshes.forEach(node => node.remove());
            }
          }
        }
      });
      
      // Start observing the document head for redirects
      observer.observe(document.head, { 
        childList: true,
        subtree: true 
      });
      
      // Prevent any programmatic redirects by overriding window.location methods
      const originalAssign = window.location.assign;
      const originalReplace = window.location.replace;
      const originalHref = Object.getOwnPropertyDescriptor(window.location, 'href');
      
      // Override assign
      window.location.assign = function(url: string) {
        if (url === '/' || url.startsWith('/dashboard')) {
          if (!isRedirecting) {
            console.log('Blocked unwanted location.assign redirect to:', url);
            return;
          }
        }
        return originalAssign.apply(this, [url]);
      };
      
      // Override replace
      window.location.replace = function(url: string) {
        if (url === '/' || url.startsWith('/dashboard')) {
          if (!isRedirecting) {
            console.log('Blocked unwanted location.replace redirect to:', url);
            return;
          }
        }
        return originalReplace.apply(this, [url]);
      };
      
      // Override href setter if it's configurable
      if (originalHref && originalHref.configurable) {
        Object.defineProperty(window.location, 'href', {
          get: originalHref.get,
          set: function(url) {
            if (url === '/' || url.startsWith('/dashboard')) {
              if (!isRedirecting) {
                console.log('Blocked unwanted location.href redirect to:', url);
                return;
              }
            }
            return originalHref.set?.call(this, url);
          },
          configurable: true
        });
      }
      
      return () => {
        observer.disconnect();
        window.location.assign = originalAssign;
        window.location.replace = originalReplace;
        if (originalHref && originalHref.configurable) {
          Object.defineProperty(window.location, 'href', originalHref);
        }
      };
    };
    
    const cleanup = checkRedirects();
    
    return () => {
      if (cleanup) cleanup();
    };
  }, [isRedirecting]);

  // Effect to handle the actual agent creation steps
  useEffect(() => {
    // Only start the process if this is a valid navigation
    if (!isValidNavigation) {
      console.warn('Not starting agent creation process due to invalid navigation');
      return;
    }
    
    console.log('Starting agent creation process');
    
    // Simulate the steps sequence
    const interval = setInterval(() => {
      if (currentStep < steps.length - 1) {
        setCurrentStep(prev => prev + 1)
      } else if (!completed) {
        setCompleted(true)
        clearInterval(interval)
        
        // Create agent data to pass to dashboard
        const agentParams = new URLSearchParams({
          agentCreated: 'true',
          name: agentName,
          type: deviceType,
          desc: agentDescription
        }).toString()
        
        // For production, use window.location for more reliable navigation
        const dashboardUrl = `/dashboard?${agentParams}`;
        const fullDashboardUrl = window.location.origin + dashboardUrl;
        
        console.log('Redirecting to dashboard with params:', dashboardUrl);
        setIsRedirecting(true);
        
        // Redirect to dashboard after a slight delay with the agent data
        setTimeout(() => {
          // Set a flag for the dashboard to know this is a valid redirect
          sessionStorage.setItem('agentCompleted', 'true');
          sessionStorage.setItem('completionTimestamp', Date.now().toString());
          
          // Set additional data for better reliability
          sessionStorage.setItem('redirectedFromAgentCreation', 'true');
          sessionStorage.setItem('agentName', agentName);
          sessionStorage.setItem('agentType', deviceType);
          
          console.log('Navigating to dashboard with successful agent creation');
          
          // Define a function to try multiple navigation methods
          const tryNavigation = () => {
            try {
              // First attempt: direct location change (most reliable)
              window.location.href = fullDashboardUrl;
              
              // Second attempt (fallback): use form submission
              setTimeout(() => {
                try {
                  // Create and submit a form
                  const form = document.createElement('form');
                  form.method = 'GET';
                  form.action = fullDashboardUrl;
                  form.style.display = 'none';
                  
                  // Add all parameters as hidden inputs
                  Object.entries(Object.fromEntries(new URLSearchParams(agentParams))).forEach(([key, value]) => {
                    const input = document.createElement('input');
                    input.type = 'hidden';
                    input.name = key;
                    input.value = value;
                    form.appendChild(input);
                  });
                  
                  // Append and submit
                  document.body.appendChild(form);
                  form.submit();
                } catch (innerError) {
                  console.error('Form navigation failed:', innerError);
                }
              }, 200);
              
            } catch (error) {
              console.error('Navigation to dashboard failed:', error);
              // Last resort: force reload to homepage
              window.location.href = window.location.origin + '/dashboard';
            }
          };
          
          // Execute navigation
          tryNavigation();
          
        }, 1000) // Delay after completion animation
      }
    }, 600) // Time between steps
    
    return () => clearInterval(interval)
  }, [currentStep, completed, router, agentName, deviceType, agentDescription, steps.length, isValidNavigation])

  // Add an effect to prevent unwanted redirects
  useEffect(() => {
    const preventRedirect = (e: BeforeUnloadEvent) => {
      if (!isRedirecting && currentStep < steps.length - 1) {
        console.log('Preventing navigation away from creating-agent page');
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    };
    
    window.addEventListener('beforeunload', preventRedirect);
    return () => window.removeEventListener('beforeunload', preventRedirect);
  }, [currentStep, isRedirecting, steps.length]);

  // Redirect to launch-agent if this navigation was invalid
  useEffect(() => {
    if (!isValidNavigation && searchParams && typeof window !== 'undefined') {
      // Wait a bit to make sure we've checked everything
      const timer = setTimeout(() => {
        console.warn('Invalid navigation detected, redirecting to launch-agent');
        window.location.href = '/launch-agent';
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [isValidNavigation, searchParams]);

  return (
    <main className="container flex flex-col items-center justify-center min-h-screen px-4 py-8">
      {/* Add a debug info for troubleshooting */}
      <div className="absolute top-2 right-2 text-xs text-slate-400 bg-slate-800/40 p-2 rounded">
        <div className="text-xs font-bold text-emerald-400 mb-1">⚡ REDIRECT PROTECTION ACTIVE ⚡</div>
        Path: {typeof window !== 'undefined' ? window.location.pathname : 'unknown'}<br/>
        Step: {currentStep + 1}/{steps.length}<br/>
        Completed: {completed ? 'Yes' : 'No'}<br/>
        Redirecting: {isRedirecting ? 'Yes' : 'No'}<br/>
        Valid Navigation: {isValidNavigation ? 'Yes' : 'No'}<br/>
        Override Active: {typeof window !== 'undefined' && window.__isLocationOverridden ? 'Yes' : 'No'}<br/>
        Using Stored Data: {typeof window !== 'undefined' && (window as any).__usingStoredAgentData ? 'Yes' : 'No'}
      </div>
      
      {!isValidNavigation ? (
        <Card className="w-full max-w-xl p-8 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border-slate-200/70 dark:border-slate-700/70">
          <div className="flex flex-col items-center space-y-6">
            <h1 className="text-2xl font-bold text-center text-slate-800 dark:text-slate-100">
              Invalid Navigation Detected
            </h1>
            <p className="text-center text-slate-600 dark:text-slate-300 mb-6">
              Redirecting you to the agent launchpad...
            </p>
            <div className="w-20 h-20">
              <motion.div
                className="w-full h-full rounded-full border-4 border-t-violet-600 border-r-violet-600 border-b-violet-200 border-l-violet-200 dark:border-b-violet-800 dark:border-l-violet-800"
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              />
            </div>
          </div>
        </Card>
      ) : (
        <Card className="w-full max-w-xl p-8 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border-slate-200/70 dark:border-slate-700/70">
          <div className="flex flex-col items-center space-y-6">
            <div className="w-20 h-20 mb-4">
              <motion.div
                className="w-full h-full rounded-full border-4 border-t-violet-600 border-r-violet-600 border-b-violet-200 border-l-violet-200 dark:border-b-violet-800 dark:border-l-violet-800"
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              />
            </div>
            
            <h1 className="text-2xl font-bold text-center text-slate-800 dark:text-slate-100">
              {completed ? "Agent Creation Complete!" : `Creating ${agentName}`}
            </h1>
            
            <p className="text-center text-slate-600 dark:text-slate-300 mb-6">
              {completed 
                ? `Your ${getDeviceName(deviceType)} agent is now live and ready to manage your devices.`
                : `Setting up your ${getDeviceName(deviceType)} agent on the DOB network...`}
            </p>

            <div className="w-full space-y-4">
              {steps.map((step) => (
                <div 
                  key={step.id} 
                  className="flex items-center gap-4"
                >
                  <div className={`
                    p-2 rounded-full transition-all duration-300 
                    ${currentStep >= step.id 
                      ? "bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400" 
                      : "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600"}
                  `}>
                    {currentStep > step.id ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    ) : (
                      <step.icon className="w-5 h-5" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className={`font-medium transition-colors duration-300 ${
                        currentStep >= step.id 
                          ? "text-slate-800 dark:text-slate-200" 
                          : "text-slate-400 dark:text-slate-600"
                      }`}>
                        {step.label}
                      </p>
                      {currentStep === step.id && (
                        <div className="flex space-x-1">
                          <motion.div 
                            className="w-1.5 h-1.5 rounded-full bg-violet-600 dark:bg-violet-400"
                            animate={{ opacity: [0, 1, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity, repeatType: "loop" }}
                          />
                          <motion.div 
                            className="w-1.5 h-1.5 rounded-full bg-violet-600 dark:bg-violet-400"
                            animate={{ opacity: [0, 1, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity, repeatType: "loop", delay: 0.2 }}
                          />
                          <motion.div 
                            className="w-1.5 h-1.5 rounded-full bg-violet-600 dark:bg-violet-400"
                            animate={{ opacity: [0, 1, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity, repeatType: "loop", delay: 0.4 }}
                          />
                        </div>
                      )}
                    </div>
                    {currentStep === step.id && (
                      <motion.div 
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 0.6 }}
                        className="h-1 bg-violet-500 dark:bg-violet-600 mt-2 rounded-full"
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}
    </main>
  )
}

// Helper function to get device display name
function getDeviceName(deviceType: string): string {
  switch (deviceType) {
    case "ev-charger": return "EV Charger"
    case "helium-miner": return "Helium Miner"
    case "solar-node": return "Solar Node"
    case "iot-gateway": return "IoT Gateway"
    case "compute-node": return "Compute Node"
    case "energy-monitor": return "Energy Monitor"
    default: return "Device"
  }
} 