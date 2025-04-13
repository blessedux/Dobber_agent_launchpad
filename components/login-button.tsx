"use client";

import { Button } from "@/components/ui/button";
import { Mail, Wallet, Bot } from "lucide-react";
import { usePrivy as useBasePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";

interface LoginButtonProps {
  className?: string;
  size?: "default" | "sm" | "lg" | "icon";
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
}

export function LoginButton({ 
  className = "", 
  size = "default",
  variant = "default"
}: LoginButtonProps) {
  const { login, authenticated } = useBasePrivy();
  const router = useRouter();

  const handleClick = () => {
    if (authenticated) {
      router.push("/dashboard");
    } else {
      login();
    }
  };

  return (
    <Button
      onClick={handleClick}
      className={`flex items-center gap-2 ${className}`}
      size={size}
      variant={variant}
    >
      {authenticated ? (
        "Go to Dashboard"
      ) : (
        <>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Bot className="h-5 w-5 animate-float" />
            </div>
            Create  
          </div>
          
          
        </>
      )}
    </Button>
  );
} 