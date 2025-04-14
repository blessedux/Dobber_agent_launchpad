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
    
    // Create full URL
    const targetUrl = `/creating-agent?${agentParams}`;
    const fullTargetUrl = window.location.origin + targetUrl;
    
    console.log("Redirecting to:", targetUrl);
    console.log("Production full URL:", fullTargetUrl);
    
    // Disable any auto-redirects by catching them
    try {
      // Store in session storage that we're intentionally launching an agent
      sessionStorage.setItem('launchingAgent', 'true');
      sessionStorage.setItem('launchTimestamp', Date.now().toString());
      sessionStorage.setItem('noRedirect', 'true');
      
      // Force a direct navigation with no router involved at all
      console.log("Using direct document.location navigation");
      
      // The most direct and forceful way to navigate in browsers
      // This completely bypasses Next.js router and any middleware
      document.location.href = fullTargetUrl;
      
      // If that doesn't work for some reason, try other approaches
      setTimeout(() => {
        console.log("Primary navigation approach failed, trying alternatives");
        
        // Try a basic form submission
        const form = document.createElement('form');
        form.method = 'GET';
        form.action = fullTargetUrl;
        form.target = '_self'; // Load in the same window
        
        // Add parameters
        Object.entries(Object.fromEntries(new URLSearchParams(agentParams))).forEach(([key, value]) => {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = key;
          input.value = value;
          form.appendChild(input);
        });
        
        // Add and submit
        document.body.appendChild(form);
        form.submit();
        
        // Last resort - window.location
        setTimeout(() => {
          window.location.href = fullTargetUrl;
        }, 100);
      }, 200);
    } catch (error) {
      console.error("Navigation error:", error);
      // Ultimate fallback - open in a new tab
      window.open(fullTargetUrl, '_self');
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
