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
  const { isTransitioning } = useTransition();

  const handleClick = (e: React.MouseEvent) => {
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

// Exported component with Suspense boundary
export const TransitionLink: React.FC<TransitionLinkProps> = (props) => {
  return (
    <Suspense fallback={<span className={props.className}>{props.children}</span>}>
      <TransitionLinkInner {...props} />
    </Suspense>
  );
}; 