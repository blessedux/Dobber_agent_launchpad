"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { ServerCog, Cpu, Upload, Rocket, Database, CheckCircle2 } from "lucide-react"
import { Zap, Check, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

// Add custom type definition for Window with our property
declare global {
  interface Window {
    __isLocationOverridden?: boolean;
    __usingStoredAgentData?: boolean;
    __inAgentCreationFlow?: boolean;
    __allowRedirectToDashboard?: boolean;
    __hasEventListeners?: boolean;
    __skipNextNavigation?: boolean;
    __manualDevicesButtonClicked?: boolean;
    __hardBlockingInstalled?: boolean;
  }
}

// Define the steps for agent creation
const steps = [
  { id: 0, label: "Initializing agent", icon: Cpu, description: "Setting up agent configuration and requirements" },
  { id: 1, label: "Setting up device connection", icon: ServerCog, description: "Establishing secure connection with device network" },
  { id: 2, label: "Configuring on-chain logic", icon: Database, description: "Setting up profit pools and permissions" },
  { id: 3, label: "Uploading to DOB network", icon: Upload, description: "Deploying agent code to the decentralized network" },
  { id: 4, label: "Launching agent", icon: Rocket, description: "Activating agent and verifying online status" },
]

export default function CreatingAgentPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Get the agent name from the search params
  const agentName = searchParams?.get('name') || 'New Agent'
  const deviceType = searchParams?.get('type') || 'AI'
  const agentDescription = searchParams?.get('description') || ''
  
  const [currentStep, setCurrentStep] = useState(0)
  const [completed, setCompleted] = useState(false)
  const [path, setPath] = useState('')
  const [isRedirecting, setIsRedirecting] = useState(false)
  const [isValidNavigation, setIsValidNavigation] = useState(false)
  const [confirmationDisplayed, setConfirmationDisplayed] = useState(false)
  const [stepTimePassed, setStepTimePassed] = useState(0)
  const [forceLock, setForceLock] = useState(true) // Force lock redirect until ready
  const [animationsComplete, setAnimationsComplete] = useState(false)
  const [manualNavigationAllowed, setManualNavigationAllowed] = useState(false)
  
  // Add a log function that adds timestamp
  const logDebug = (message: string) => {
    console.log(`[CreatingAgent] ${message}`);
  }
  
  // EXTRA CRITICAL: Mount a one-time useEffect that blocks the route change
  // This runs once with highest priority to prevent any route changes during initial loading
  useEffect(() => {
    // Prevent any navigation attempts for at least 5 seconds
    const blockTime = 5000;
    const startTime = Date.now();
    
    // Block navigation attempts using history API
    const blockAllNavigation = (e: BeforeUnloadEvent) => {
      // If we're within the block time, prevent ALL navigation
      if (Date.now() - startTime < blockTime) {
        logDebug(`HARD BLOCKED navigation attempt during initialization phase`);
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    };
    
    // Set up a one-time lock
    logDebug('Installing CRITICAL navigation protection');
    
    // Lock navigation for a period of time
    const unlockTimer = setTimeout(() => {
      logDebug('Critical time-based navigation lock expired');
      setForceLock(false);
    }, blockTime);
    
    // Also block any navigation attempts using the beforeunload event
    window.addEventListener('beforeunload', blockAllNavigation);
    
    // Capture the current URL to detect any changes
    const initialUrl = window.location.href;
    
    // Create an interval to check if URL has changed (as a fallback detection)
    const intervalCheck = setInterval(() => {
      if (window.location.href !== initialUrl && forceLock) {
        logDebug('DETECTED URL CHANGE during lock period - attempting recovery');
        // Try to go back to our route
        window.history.pushState(null, '', initialUrl);
      }
    }, 100);
    
    return () => {
      window.removeEventListener('beforeunload', blockAllNavigation);
      clearTimeout(unlockTimer);
      clearInterval(intervalCheck);
      logDebug('CRITICAL navigation protection cleanup (should only happen once)');
    };
  }, []);

  // CRITICAL: Block any unwanted redirects IMMEDIATELY when the component renders
  // This must be the first useEffect to run after the critical protection
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // This effect only needs to run when the component mounts
    // Simple protection against back navigation
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      // Only prevent unload if we're not manually navigating away
      if (!window.__manualDevicesButtonClicked) {
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    };

    // Prevent back button
    const handlePopState = (e: PopStateEvent) => {
      // Only prevent pop state if we're not manually navigating away
      if (!window.__manualDevicesButtonClicked) {
        window.history.pushState(null, '', window.location.pathname);
        e.preventDefault();
      }
    };

    // Push state to prevent back button
    window.history.pushState(null, '', window.location.pathname);
    
    // Add event listeners
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);

    // Initialize debugging global
    window.__manualDevicesButtonClicked = false;
    window.__allowRedirectToDashboard = false;

    // Log that protection is active
    console.log('👮‍♀️ Navigation protection active');

    // Cleanup function
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
      
      // Clean up globals
      window.__manualDevicesButtonClicked = false;
      window.__allowRedirectToDashboard = false;
      
      console.log('🧹 Navigation protection cleaned up');
    };
  }, []);

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
      
      // Use only event listeners for navigation protection
      if (typeof window !== 'undefined' && !window.__hasEventListeners) {
        console.log('Installing navigation event listeners');
        
        // Use beforeunload event to intercept all navigation attempts
        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
          // Only prevent navigation if we're not done yet
          if (!isRedirecting && !window.__allowRedirectToDashboard) {
            console.log('Blocked unload via beforeunload event');
            event.preventDefault();
            event.returnValue = '';
            return '';
          }
        };
        
        // Listen for click events on all anchor tags
        const handleLinkClick = (event: MouseEvent) => {
          const target = event.target as HTMLElement;
          const anchor = target.closest('a');
          
          if (anchor) {
            const href = anchor.getAttribute('href');
            
            // If this is a link to home or dashboard and we're not explicitly redirecting
            if (href && !isRedirecting && 
                (href === '/' || href.startsWith('/dashboard'))) {
              
              // Only allow if this is our explicit "go to dashboard" button
              const isManualDashboardButton = anchor.hasAttribute('data-manual-dashboard-navigation');
              
              if (!isManualDashboardButton && !window.__allowRedirectToDashboard) {
                console.log('Blocked unwanted link navigation to:', href);
                event.preventDefault();
                return false;
              }
            }
          }
        };
        
        // Add our event listeners
        window.addEventListener('beforeunload', handleBeforeUnload);
        document.addEventListener('click', handleLinkClick, true);
        
        // Mark that we've set up our event listeners
        window.__hasEventListeners = true;
        
        return () => {
          // Clean up all event listeners
          window.removeEventListener('beforeunload', handleBeforeUnload);
          document.removeEventListener('click', handleLinkClick, true);
          observer.disconnect();
          
          window.__hasEventListeners = false;
        };
      }
      
      return () => {
        observer.disconnect();
      };
    };
    
    const cleanup = checkRedirects();
    
    return () => {
      if (cleanup) cleanup();
    };
  }, [isRedirecting]);

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
            
            // Force navigation back using router instead of direct location manipulation
            const creatingUrl = `/creating-agent?${params}`;
            // Mark this as an allowed redirect
            window.__allowRedirectToDashboard = true;
            // Use Next.js router to navigate safely
            router.push(creatingUrl);
          }
        }
      } catch (error) {
        console.error('Failed to recover:', error);
      }
    }
  }, [router]);
  
  // Safe initialization of client-side values
  useEffect(() => {
    // Set the path from window.location
    setPath(window.location.pathname)
    
    // When this component mounts, mark that we're launching an agent
    // This prevents unwanted navigation away from the flow
    sessionStorage.setItem('launchingAgent', 'true')
    sessionStorage.setItem('launchTimestamp', Date.now().toString())
    
    // Add this log to track when the effect runs
    console.log('Agent creation flow initialization effect running, step:', currentStep)
    
    // Add a smaller initial delay before starting the process
    if (currentStep === 0 && stepTimePassed === 0) {
      logDebug('Adding initial delay before starting agent creation process');
        setTimeout(() => {
        // Start the process after a small delay
        setStepTimePassed(1);
      }, 300); // 300ms initial delay
    }
    
    return () => {
      console.log('Cleanup of initialization effect, step:', currentStep)
    }
  }, [currentStep, stepTimePassed])
  
  // Separate effect for step progression - slowed down for better visibility
  useEffect(() => {
    let stepTimer: NodeJS.Timeout
    
    // Only progress if not completed
    if (currentStep < steps.length && !completed && !confirmationDisplayed) {
      // Log the current step for debugging
      logDebug(`Processing step ${currentStep + 1}/${steps.length}: ${steps[currentStep].label}`)
      
      if (stepTimePassed < 100) {
        // Increment the progress within a step (0-100%)
        stepTimer = setTimeout(() => {
          setStepTimePassed(prev => {
            // Speed up progress to complete each step faster
            if (prev > 90) return prev + 5;
            if (prev > 75) return prev + 8;
            return prev + 10;
          })
        }, 100) // Much faster progress (100ms intervals)
      } else {
        // Move to next step when progress reaches 100%
        logDebug(`Completing step ${currentStep + 1}/${steps.length}`)
        
        // Shorter delay before moving to the next step
        stepTimer = setTimeout(() => {
          setStepTimePassed(0) // Reset step progress
          setCurrentStep(prev => prev + 1)
        }, 300) // 300ms delay between steps
      }
    }
    
    return () => clearTimeout(stepTimer)
  }, [currentStep, completed, confirmationDisplayed, stepTimePassed]);
  
  // After the last step completes, wait for animations to complete before showing confirmation
  useEffect(() => {
    const allStepsCompleted = currentStep >= steps.length;
    
    if (allStepsCompleted && !animationsComplete && !completed) {
      logDebug('All steps reached, showing confirmation immediately');
      // Much shorter delay before showing completion
      const animationDelay = setTimeout(() => {
        logDebug('Animation delay complete, showing confirmation screen');
        setAnimationsComplete(true);
        setCompleted(true);
        setConfirmationDisplayed(true);
        
        // Enable navigation button immediately
        logDebug('Setting manual navigation allowed immediately');
        setManualNavigationAllowed(true);
      }, 500); // 500ms delay to ensure screen is visible
      
      return () => clearTimeout(animationDelay);
    }
  }, [currentStep, steps.length, animationsComplete, completed]);

  // Store agent data as soon as completion is shown
  useEffect(() => {
    if (completed && confirmationDisplayed) {
      // Store agent info in session storage for the destination page to use
      if (typeof window !== 'undefined') {
        logDebug('Storing agent data in session storage for redirection');
        
        // Using a consistent set of flags across the app
        sessionStorage.setItem('lastCreatedAgent', agentName);
        sessionStorage.setItem('agentCompleted', 'true');
        sessionStorage.setItem('completionTimestamp', Date.now().toString());
        sessionStorage.setItem('redirectedFromAgentCreation', 'true');
        sessionStorage.setItem('agentName', agentName);
        sessionStorage.setItem('agentType', deviceType);
        sessionStorage.setItem('agentDescription', agentDescription || '');
        
        // This is a key flag for layout protection to eventually allow redirection
        sessionStorage.setItem('intentionalCompletion', 'true');
      }
    }
  }, [completed, confirmationDisplayed, agentName, deviceType, agentDescription]);

  return (
    <main className="container flex flex-col items-center justify-center min-h-screen px-4 py-8">
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
            {!completed ? (
              // Creation in progress UI
              <>
          <div className="w-20 h-20 mb-4">
            <motion.div
              className="w-full h-full rounded-full border-4 border-t-violet-600 border-r-violet-600 border-b-violet-200 border-l-violet-200 dark:border-b-violet-800 dark:border-l-violet-800"
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            />
          </div>
          
          <h1 className="text-2xl font-bold text-center text-slate-800 dark:text-slate-100">
                  Creating {agentName}
          </h1>
          
          <p className="text-center text-slate-600 dark:text-slate-300 mb-6">
                  Setting up your {getDeviceName(deviceType)} agent on the DOB network...
                </p>
              </>
            ) : (
              // Completion UI with enhanced success animation
              <>
                <motion.div 
                  className="w-24 h-24 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ 
                    scale: 1, 
                    boxShadow: ["0px 0px 0px rgba(16, 185, 129, 0)", "0px 0px 50px rgba(16, 185, 129, 0.6)", "0px 0px 0px rgba(16, 185, 129, 0)"] 
                  }}
                  transition={{ 
                    scale: { type: "spring", damping: 8, stiffness: 100, duration: 1 },
                    boxShadow: { 
                      repeat: Infinity, 
                      duration: 3, 
                      repeatType: "loop" 
                    }
                  }}
                >
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                  >
                    <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                  </motion.div>
                </motion.div>
                
                <motion.h1 
                  className="text-2xl font-bold text-center text-slate-800 dark:text-slate-100"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                >
                  Agent Creation Complete!
                </motion.h1>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2, duration: 0.5 }}
                >
                  <p className="text-center text-slate-600 dark:text-slate-300">
                    Your {getDeviceName(deviceType)} agent is now live and ready to manage your devices.
                  </p>
                </motion.div>
                
                <motion.div 
                  className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-lg border border-emerald-200 dark:border-emerald-800 w-full"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <h3 className="font-medium text-emerald-800 dark:text-emerald-300 mb-2">Agent Details:</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Name:</span>
                      <span className="font-medium text-slate-800 dark:text-slate-200">{agentName}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Type:</span>
                      <span className="font-medium text-slate-800 dark:text-slate-200">{getDeviceName(deviceType)}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Status:</span>
                      <span className="font-medium text-emerald-600 dark:text-emerald-400">
                        <span className="inline-flex items-center">
                          <span className="relative flex h-2 w-2 mr-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                          </span>
                          Online
                        </span>
                      </span>
                    </li>
                    {agentDescription && (
                      <li className="pt-2 border-t border-emerald-200 dark:border-emerald-800 mt-2">
                        <span className="text-slate-600 dark:text-slate-400 block mb-1">Description:</span>
                        <span className="font-medium text-slate-800 dark:text-slate-200">{agentDescription}</span>
                      </li>
                    )}
                  </ul>
                </motion.div>
                
                <motion.div 
                  className="w-full bg-violet-50 dark:bg-violet-900/20 p-5 rounded-lg border-2 border-violet-300 dark:border-violet-700 mt-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                >
                  <div className="text-center mb-4">
                    <h3 className="text-lg font-semibold text-violet-800 dark:text-violet-300">Agent Deployment Successful!</h3>
                    <p className="text-sm text-violet-600 dark:text-violet-400">
                      Your agent is now live and ready to manage devices.
                    </p>
                  </div>
                  
                  <div className="flex justify-center mb-4">
                    <button
                      id="manual-device-navigation-button"
                      data-manual-device-navigation="true"
                      className="px-6 py-3 rounded-md font-medium mt-8 bg-violet-600 hover:bg-violet-700 text-white"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        
                        // Mark that we clicked the button to disable protection
                        if (typeof window !== 'undefined') {
                          logDebug('Manual navigation button clicked');
                          window.__manualDevicesButtonClicked = true;
                          window.__allowRedirectToDashboard = true;
                          
                          // Store session data for the devices page
                          sessionStorage.setItem('agent-created', 'true');
                          sessionStorage.setItem('agent-name', agentName);
                          sessionStorage.setItem('agent-type', deviceType);
                          sessionStorage.setItem('agent-description', agentDescription || '');
                          
                          // Create direct navigation
                          const a = document.createElement('a');
                          a.href = '/devices';
                          a.id = 'manual-navigation-link';
                          document.body.appendChild(a);
                          
                          try {
                            logDebug('Attempting direct navigation click');
                            a.click();
                            
                            // Fallback with timeout
                            setTimeout(() => {
                              logDebug('Fallback - checking if navigation happened');
                              if (window.location.pathname !== '/devices') {
                                logDebug('Direct navigation failed, trying window.location');
                                window.location.href = '/devices';
                              }
                            }, 500);
                          } catch (err) {
                            logDebug(`Navigation error: ${err}`);
                            window.location.href = '/devices';
                          }
                        }
                      }}
                    >
                      Next
                    </button>
                  </div>
                </motion.div>
              </>
            )}

          <div className="w-full space-y-4">
            {steps.map((step) => (
              <div 
                key={step.id} 
                className="flex items-center gap-4"
              >
                <div className={`
                  p-2 rounded-full transition-all duration-300 
                    ${currentStep > step.id 
                    ? "bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400" 
                      : currentStep === step.id
                        ? "bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400 animate-pulse"
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
                      {currentStep === step.id && !completed && (
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
                      
                      {currentStep === step.id + 1 && stepTimePassed === 0 && (
                        <div className="flex items-center">
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: [0, 1.2, 1] }}
                            transition={{ duration: 0.5 }}
                            className="text-emerald-500 flex items-center"
                          >
                            <Check className="w-5 h-5 mr-1" />
                            <span className="text-xs">Complete</span>
                          </motion.div>
                      </div>
                    )}
                  </div>
                    
                    {/* Add step description */}
                    {currentStep === step.id && !completed && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        {step.description}
                      </p>
                    )}
                    
                    {currentStep === step.id && !completed && (
                    <motion.div 
                      initial={{ width: "0%" }}
                        animate={{ width: `${stepTimePassed}%` }}
                        transition={{ duration: 0.2 }}
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