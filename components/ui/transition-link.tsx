"use client";

import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useTransition } from "@/components/transition-provider";

type TransitionLinkProps = {
  href: string;
  className?: string;
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
  prefetch?: boolean;
  replace?: boolean;
  scroll?: boolean;
  shallow?: boolean;
  locale?: string | false;
  isLaunchAgent?: boolean;
};

// Keep track of recent navigation attempts globally to prevent loops
const recentNavigationAttempts: Record<string, number> = {};

// Inner component that uses the hooks
function TransitionLinkInner({
  href,
  className,
  children,
  onClick,
  isLaunchAgent = false,
  ...props
}: TransitionLinkProps) {
  const [allowNavigation, setAllowNavigation] = useState(true);
  
  // Use try/catch to handle potential errors with the context
  let isTransitioning = false;
  try {
    const transitionContext = useTransition();
    isTransitioning = transitionContext?.isTransitioning || false;
    
    // Only log if this is not a menu prefetch
    if (!href.includes('/help/') && !href.endsWith('/help')) {
      console.log('TransitionLink to:', href, 'isTransitioning:', isTransitioning, 'isLaunchAgent:', isLaunchAgent);
    }
  } catch (error) {
    console.error('Error in TransitionLink context:', error);
    // If context fails, continue without transition state
  }

  // Ensure href starts with a slash for correct production routing
  const formattedHref = href.startsWith('/') ? href : `/${href}`;
  
  // Anti-loop protection
  useEffect(() => {
    // Clean up old navigation attempts (older than 10 seconds)
    const now = Date.now();
    Object.keys(recentNavigationAttempts).forEach(url => {
      if (now - recentNavigationAttempts[url] > 10000) {
        delete recentNavigationAttempts[url];
      }
    });
  }, []);

  // Handle special case for launch-agent link
  useEffect(() => {
    if (isLaunchAgent && formattedHref === '/launch-agent') {
      setAllowNavigation(true);
      console.log('Launch agent link detected, setting allowNavigation to true');
    }
  }, [isLaunchAgent, formattedHref]);

  const handleClick = (e: React.MouseEvent) => {
    // Special handling for Launch Agent button
    if (isLaunchAgent && formattedHref === '/launch-agent') {
      console.log('Launch Agent button clicked, allowing navigation');
      
      // Enhanced flags for agent launch
      if (typeof window !== 'undefined') {
        // Clear any existing protection flags that might interfere
        sessionStorage.removeItem('protectDevicesPage');
        
        // Set our launch flags
        sessionStorage.setItem('intentionalLaunchNavigation', 'true');
        sessionStorage.setItem('launchNavigationTimestamp', Date.now().toString());
        sessionStorage.setItem('noRedirect', 'true');
        
        // Reset any global flags that might interfere
        window.__allowRedirectToDashboard = false;
        window.__inAgentCreationFlow = true;
        window.__isLocationOverridden = false;
        
        // Set additional flags to help with debugging
        sessionStorage.setItem('launchClickSource', 'transitionLink');
        
        console.log('Set all navigation flags for agent launch. Proceeding with navigation.');
      }
      
      // Don't prevent default - let it navigate normally
      if (onClick) {
        onClick(e);
      }
      
      // For production, perform an immediate direct navigation as a fallback
      if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
        // Small delay to let the router start its navigation
        setTimeout(() => {
          const currentPath = window.location.pathname;
          // If we're still not on the launch-agent page after a small delay, force direct navigation
          if (!currentPath.includes('launch-agent') && !currentPath.includes('creating-agent')) {
            console.log('Navigation seems stuck, forcing direct navigation to', formattedHref);
            window.location.href = formattedHref;
          }
        }, 300);
      }
      
      return;
    }
    
    // Check if we've tried to navigate to this URL too many times recently
    const now = Date.now();
    const recentAttempts = recentNavigationAttempts[formattedHref] || 0;
    
    if (recentAttempts > 5) {
      console.warn(`Too many navigation attempts to ${formattedHref}, blocking to prevent loops`);
      e.preventDefault();
      return;
    }
    
    // Record this navigation attempt
    recentNavigationAttempts[formattedHref] = now;
    
    // For production environment, use direct location change if Next router fails
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production' && allowNavigation) {
      // If this is a launch-agent link, store a flag to prevent redirect loops
      if (formattedHref === '/launch-agent') {
        sessionStorage.setItem('redirectedToLaunchAgent', 'true');
        sessionStorage.setItem('redirectTimestamp', Date.now().toString());
      }
    }
    
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <Link
      href={formattedHref}
      className={className}
      onClick={handleClick}
      aria-disabled={isTransitioning}
      tabIndex={isTransitioning ? -1 : undefined}
      {...props}
    >
      {children}
    </Link>
  );
}

// Exported component with error boundary
export const TransitionLink: React.FC<TransitionLinkProps> = (props) => {
  // Use error boundary to prevent breaking the app if transition context fails
  try {
    return (
      <Suspense fallback={<span className={props.className}>{props.children}</span>}>
        <TransitionLinkInner {...props} />
      </Suspense>
    );
  } catch (error) {
    console.error('TransitionLink fallback due to error:', error);
    // Direct fallback to standard Link if the transition context breaks
    const href = props.href.startsWith('/') ? props.href : `/${props.href}`;
    
    // Handle special case for launch agent button
    if (props.isLaunchAgent && props.href === '/launch-agent') {
      return (
        <a 
          href={href}
          className={props.className}
          onClick={(e) => {
            if (props.onClick) props.onClick(e);
            console.log('Direct navigation to launch agent page');
          }}
        >
          {props.children}
        </a>
      );
    }
    
    // In production, add a direct link as well
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
      return (
        <a 
          href={href}
          className={props.className}
          onClick={props.onClick}
        >
          {props.children}
        </a>
      );
    }
    
    return (
      <Link 
        href={href}
        className={props.className}
        onClick={props.onClick}
        prefetch={props.prefetch}
        replace={props.replace}
        scroll={props.scroll}
      >
        {props.children}
      </Link>
    );
  }
}; 