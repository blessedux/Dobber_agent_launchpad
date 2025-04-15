"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePrivy } from "@/components/privy-provider";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = usePrivy();
  const router = useRouter();

  useEffect(() => {
    // Check for the noRedirect flag - this is used to temporarily disable redirects
    // when deliberately navigating to the agent creation flow
    const noRedirect = typeof window !== 'undefined' && (
      sessionStorage.getItem('noRedirect') || 
      sessionStorage.getItem('agent-created') === 'true' ||
      sessionStorage.getItem('protectDevicesPage') === 'true'
    );
    
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
    
    // Only redirect to home if:
    // 1. Authentication check is done (not loading)
    // 2. User is not authenticated
    // 3. There's no explicit noRedirect flag
    // 4. We're not in a special flow that should bypass auth (like creating-agent or devices from agent creation)
    if (!isLoading && !isAuthenticated && !noRedirect && 
        !currentPath.includes('creating-agent') && 
        !(currentPath.includes('/devices') && 
          (sessionStorage.getItem('agent-created') === 'true' || 
           sessionStorage.getItem('protectDevicesPage') === 'true'))
    ) {
      console.log('Not authenticated, redirecting to home');
      router.push("/");
    }
    
    // Clear the noRedirect flag after using it (so it doesn't persist)
    if (typeof window !== 'undefined' && sessionStorage.getItem('noRedirect')) {
      console.log('Clearing noRedirect flag');
      sessionStorage.removeItem('noRedirect');
    }
  }, [isAuthenticated, isLoading, router]);

  // For the creating-agent page or devices page with protection flag, bypass the auth check completely
  if (typeof window !== 'undefined' && (
    window.location.pathname.includes('creating-agent') || 
    (window.location.pathname.includes('/devices') && 
     (sessionStorage.getItem('agent-created') === 'true' || 
      sessionStorage.getItem('protectDevicesPage') === 'true'))
  )) {
    return <>{children}</>;
  }

  // Show loading state or nothing while checking authentication
  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-violet-600 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
} 