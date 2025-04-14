"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight, Rocket } from "lucide-react"
import { useRouter } from "next/navigation"

interface StepNavigationProps {
  currentStep: number
  totalSteps: number
  nextStep: () => void
  prevStep: () => void
  isNextDisabled: boolean
  agentData?: any // Add agentData prop to pass to the dashboard
}

export default function StepNavigation({
  currentStep,
  totalSteps,
  nextStep,
  prevStep,
  isNextDisabled,
  agentData,
}: StepNavigationProps) {
  const router = useRouter()

  // Function to handle the final launch action
  const handleLaunchAgent = () => {
    // Here you would typically send the agent data to a backend
    console.log("Starting agent creation:", agentData)
    
    // Create a serialized version of the essential agent data
    const agentParams = new URLSearchParams({
      name: agentData.agentName,
      type: agentData.deviceType,
      desc: agentData.agentDescription?.substring(0, 100) || "",
    }).toString()
    
    // Ensure paths start with a slash and create the full URL for production
    const targetUrl = `/creating-agent?${agentParams}`;
    const fullTargetUrl = window.location.origin + targetUrl;
    
    console.log("Redirecting to:", targetUrl);
    console.log("Production full URL:", fullTargetUrl);
    
    try {
      // Prevent any redirection middleware from interfering
      // by storing a flag in session storage
      sessionStorage.setItem('launchingAgent', 'true');
      sessionStorage.setItem('launchTimestamp', Date.now().toString());
      
      // For production, use a direct location change which is more reliable
      if (process.env.NODE_ENV === 'production') {
        console.log("Using direct location navigation in production");
        
        // Create a hidden form and submit it (avoids some redirection issues)
        const form = document.createElement('form');
        form.method = 'GET';
        form.action = targetUrl;
        form.style.display = 'none';
        
        // Add the parameters as hidden inputs
        Object.entries(Object.fromEntries(new URLSearchParams(agentParams))).forEach(([key, value]) => {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = key;
          input.value = value;
          form.appendChild(input);
        });
        
        // Add the form to the document and submit it
        document.body.appendChild(form);
        form.submit();
        
        // Alternative direct navigation as fallback
        setTimeout(() => {
          window.location.href = fullTargetUrl;
        }, 100);
        
        return;
      }
      
      // In development, try router.push first
      router.push(targetUrl);
      
      // As a backup, also set a timeout to do a window.location redirect if router.push doesn't work
      setTimeout(() => {
        // Check if we're still on the current page
        if (window.location.pathname !== '/creating-agent') {
          console.log("Router navigation appears to have failed, using direct location redirect");
          window.location.href = fullTargetUrl;
        }
      }, 300);
    } catch (error) {
      console.error("Navigation error:", error);
      // Fallback to direct location change
      window.location.href = fullTargetUrl;
    }
  }

  return (
    <div className="flex justify-between mt-8">
      {currentStep > 1 ? (
        <Button variant="outline" onClick={prevStep} className="flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
      ) : (
        <div></div>
      )}

      {currentStep < totalSteps ? (
        <Button
          onClick={nextStep}
          disabled={isNextDisabled}
          className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700"
        >
          Continue
          <ArrowRight className="w-4 h-4" />
        </Button>
      ) : (
        <Button 
          onClick={handleLaunchAgent} 
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700"
        >
          <Rocket className="w-4 h-4" />
          Launch Agent
        </Button>
      )}
    </div>
  )
}
