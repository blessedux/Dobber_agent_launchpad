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

  const handleClick = (e: React.MouseEvent) => {
    console.log('TransitionLink clicked:', href);
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <Link
      href={href}
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
    return (
      <Link 
        href={props.href}
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