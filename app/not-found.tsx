"use client";

import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { TransitionLink } from "@/components/ui/transition-link";
import { motion } from "framer-motion";
import { Home } from "lucide-react";

// Separate client component for search params
function NotFoundContent() {
  return (
    <div className="flex flex-col items-center text-center">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-lg text-slate-600 dark:text-slate-300 mb-8">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <TransitionLink href="/dashboard">
        <Button className="bg-violet-600 hover:bg-violet-700">
          <Home className="w-4 h-4 mr-2" />
          Back to Home
        </Button>
      </TransitionLink>
    </div>
  );
}

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Suspense fallback={<div>Loading...</div>}>
          <NotFoundContent />
        </Suspense>
      </motion.div>
    </div>
  );
} 