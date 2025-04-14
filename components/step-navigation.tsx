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
    
    // RADICAL APPROACH: Create and open a new window, then close this one
    // This completely bypasses any redirection logic in the current window
    try {
      // Store in session storage
      sessionStorage.setItem('launchingAgent', 'true');
      sessionStorage.setItem('launchTimestamp', Date.now().toString());
      sessionStorage.setItem('noRedirect', 'true');
      sessionStorage.setItem('agentData', JSON.stringify({
        name: agentData.agentName,
        type: agentData.deviceType,
        desc: agentData.agentDescription?.substring(0, 100) || "",
      }));
      
      console.log("Using radical navigation approach");
      
      // APPROACH 1: Try iframe method
      // Create an invisible iframe that will load the target page
      const iframe = document.createElement('iframe');
      iframe.style.width = '100%';
      iframe.style.height = '100%';
      iframe.style.position = 'fixed';
      iframe.style.top = '0';
      iframe.style.left = '0';
      iframe.style.zIndex = '9999';
      iframe.style.border = 'none';
      iframe.style.backgroundColor = '#fff';
      
      // When iframe loads, make it take over the entire page
      iframe.onload = () => {
        console.log("iframe loaded successfully");
        
        // Ensure the iframe takes over the entire page
        document.body.innerHTML = '';
        document.body.style.margin = '0';
        document.body.style.padding = '0';
        document.body.style.overflow = 'hidden';
        
        // Make current page redirect to the same URL in case iframe approach fails
        setTimeout(() => {
          document.location.href = fullTargetUrl;
        }, 100);
      };
      
      // Set the iframe source and add it to the document
      iframe.src = fullTargetUrl;
      document.body.appendChild(iframe);
      
      // APPROACH 2: Fallback to form POST - works more reliably for cross-domain navigation
      setTimeout(() => {
        // Form POST method (more reliable than GET for preserving data)
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = fullTargetUrl;
        form.target = '_self';
        form.style.display = 'none';
        
        // Add parameters
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
      }, 200);
      
      // APPROACH 3: Last resort - direct location change
      setTimeout(() => {
        document.location.href = fullTargetUrl;
      }, 300);
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
