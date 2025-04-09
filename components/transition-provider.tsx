"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

interface TransitionContextProps {
  isTransitioning: boolean;
}

const TransitionContext = createContext<TransitionContextProps>({
  isTransitioning: false,
});

export const useTransition = () => useContext(TransitionContext);

export const TransitionProvider = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [currentPage, setCurrentPage] = useState<string>(pathname + searchParams.toString());
  const [previousPage, setPreviousPage] = useState<string>("");

  useEffect(() => {
    const newPage = pathname + searchParams.toString();
    if (newPage !== currentPage) {
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
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: 1,
              transition: { 
                duration: 0.8, 
                ease: [0.22, 1, 0.36, 1],
                delay: 0.5, // Delay entrance to allow exit animations to complete
              }
            }}
            exit={{ 
              opacity: 0,
              transition: { 
                duration: 0.5, 
                ease: [0.22, 1, 0.36, 1],
              }
            }}
            className="page-transition-container relative z-10"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>
    </TransitionContext.Provider>
  );
}; 