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
      }, 1200); // Slightly longer than our animation to ensure it completes
      
      return () => clearTimeout(timer);
    }
  }, [pathname, searchParams, currentPage]);

  return (
    <TransitionContext.Provider value={{ isTransitioning }}>
      <div className="page-wrapper">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, filter: "blur(20px)" }}
            animate={{ 
              opacity: 1, 
              filter: "blur(0px)",
              transition: { 
                duration: 1, 
                ease: [0.22, 1, 0.36, 1],
              }
            }}
            exit={{ 
              opacity: 0, 
              filter: "blur(20px)",
              transition: { 
                duration: 1, 
                ease: [0.22, 1, 0.36, 1],
              }
            }}
            className="page-transition-container"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>
    </TransitionContext.Provider>
  );
}; 