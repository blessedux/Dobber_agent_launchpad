"use client";

import React, { Suspense } from "react";
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
};

// Inner component that uses the hooks
function TransitionLinkInner({
  href,
  className,
  children,
  onClick,
  ...props
}: TransitionLinkProps) {
  // Use try/catch to handle potential errors with the context
  let isTransitioning = false;
  try {
    const transitionContext = useTransition();
    isTransitioning = transitionContext?.isTransitioning || false;
    console.log('TransitionLink to:', href, 'isTransitioning:', isTransitioning);
  } catch (error) {
    console.error('Error in TransitionLink context:', error);
    // If context fails, continue without transition state
  }

  // Ensure href starts with a slash for correct production routing
  const formattedHref = href.startsWith('/') ? href : `/${href}`;

  const handleClick = (e: React.MouseEvent) => {
    console.log('TransitionLink clicked:', formattedHref);
    
    // For production environment, use direct location change if Next router fails
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
      // Allow the default Link behavior to try first
      setTimeout(() => {
        // If we're still on the same page after a short delay, force navigation
        if (window.location.pathname !== formattedHref.split('?')[0]) {
          console.log('Navigation appears to have failed, redirecting manually');
          window.location.href = formattedHref;
        }
      }, 100);
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