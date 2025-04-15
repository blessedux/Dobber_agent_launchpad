"use client";

import React, { createContext, useContext, useState, useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

interface TransitionContextProps {
  isTransitioning: boolean;
}

const TransitionContext = createContext<TransitionContextProps>({
  isTransitioning: false,
});

export const useTransition = () => useContext(TransitionContext);

// Separate component to handle navigation hooks
function TransitionHandler({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [currentPage, setCurrentPage] = useState<string>("");
  const [previousPage, setPreviousPage] = useState<string>("");

  // Set initial current page on mount with null-safe check
  useEffect(() => {
    // Safe handling of initial pathname and searchParams
    const initial = pathname + (searchParams ? searchParams.toString() : "");
    setCurrentPage(initial);
  }, []);

  useEffect(() => {
    if (!pathname) return; // Safety check
    
    // Handle searchParams safely
    const paramString = searchParams ? searchParams.toString() : "";
    const newPage = pathname + paramString;
    
    if (newPage !== currentPage && currentPage !== "") {
      setPreviousPage(currentPage);
      setCurrentPage(newPage);
      
      // Start the transition
      setIsTransitioning(true);
      
      // End the transition after animation completes
      const timer = setTimeout(() => {
        setIsTransitioning(false);
      }, 1500); // Increased time to ensure exit animations complete
      
      return () => clearTimeout(timer);
    }
  }, [pathname, searchParams, currentPage]);

  return (
    <TransitionContext.Provider value={{ isTransitioning }}>
      <div className="page-wrapper relative min-h-screen">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ 
              opacity: 0,
              y: 10
            }}
            animate={{ 
              opacity: 1,
              y: 0,
              transition: { 
                duration: 0.5, 
                ease: [0.22, 1, 0.36, 1],
                delay: 0.1, // Reduced delay for faster response
              }
            }}
            exit={{ 
              opacity: 0,
              y: -10,
              transition: { 
                duration: 0.3, 
                ease: [0.22, 1, 0.36, 1],
              }
            }}
            className="page-transition-container relative z-10"
            style={{
              willChange: "transform, opacity",
              backfaceVisibility: "hidden"
            }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>
    </TransitionContext.Provider>
  );
}

export const TransitionProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <Suspense fallback={<div>Loading transitions...</div>}>
      <TransitionHandler>
        {children}
      </TransitionHandler>
    </Suspense>
  );
}; 