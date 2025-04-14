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
    
    try {
      // Set flags in sessionStorage to indicate this is a valid navigation
      sessionStorage.setItem('launchingAgent', 'true');
      sessionStorage.setItem('launchTimestamp', Date.now().toString());
      sessionStorage.setItem('agentData', JSON.stringify({
        name: agentData.agentName,
        type: agentData.deviceType,
        desc: agentData.agentDescription?.substring(0, 100) || "",
      }));
      
      console.log("Navigating to creating-agent page");
      
      // Use a reliable method for navigation
      // First, create the form for a solid fallback
      const form = document.createElement('form');
      form.method = 'GET';
      form.action = fullTargetUrl;
      form.style.display = 'none';
      
      // Add all parameters as hidden inputs
      Object.entries(Object.fromEntries(new URLSearchParams(agentParams))).forEach(([key, value]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = value;
        form.appendChild(input);
      });
      
      // Add the form to the document
      document.body.appendChild(form);
      
      // Use direct location change first (most reliable for single page apps)
      setTimeout(() => {
        try {
          window.location.href = fullTargetUrl;
        } catch (e) {
          console.error("Direct navigation failed, using form submit", e);
          // If that fails, submit the form
          form.submit();
        }
      }, 100);
      
      // Set a backup timeout for form submission
      setTimeout(() => {
        form.submit();
      }, 300);
    } catch (error) {
      console.error("Navigation error:", error);
      // Ultimate fallback - try direct navigation again
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
