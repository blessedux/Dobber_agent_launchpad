"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { PrivyProvider as BasePrivyProvider, usePrivy as useBasePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";

// Make sure we have the app ID from env
const privyAppId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;

if (!privyAppId) {
  console.error("Missing NEXT_PUBLIC_PRIVY_APP_ID environment variable");
}

// Initialize context for user data
interface PrivyContextType {
  user: any;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const PrivyContext = createContext<PrivyContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
});

export const usePrivy = () => useContext(PrivyContext);

// Provider component
export function PrivyProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  return (
    <BasePrivyProvider
      appId={privyAppId || ""}
      config={{
        loginMethods: ["wallet", "email"],
        appearance: {
          theme: "dark",
          accentColor: "#8b5cf6", // violet-500
          logo: "/virtuals_logo.svg",
          showWalletLoginFirst: false,
          walletList: ["metamask", "coinbase_wallet", "wallet_connect"]
        },
        embeddedWallets: {
          createOnLogin: "users-without-wallets"
        }
      }}
    >
      <PrivyAuthWatcher 
        setUser={setUser} 
        setIsAuthenticated={setIsAuthenticated} 
        setIsLoading={setIsLoading} 
        onSuccess={() => router.push("/dashboard")}
      />
      <PrivyContext.Provider value={{ user, isAuthenticated, isLoading }}>
        {children}
      </PrivyContext.Provider>
    </BasePrivyProvider>
  );
}

// Component to watch for auth changes
function PrivyAuthWatcher({
  setUser,
  setIsAuthenticated,
  setIsLoading,
  onSuccess,
}: {
  setUser: (user: any) => void;
  setIsAuthenticated: (value: boolean) => void;
  setIsLoading: (value: boolean) => void;
  onSuccess: () => void;
}) {
  const { ready, authenticated, user, logout } = useBasePrivy();
  const router = useRouter();

  useEffect(() => {
    if (ready) {
      setIsLoading(false);
      setIsAuthenticated(authenticated);
      setUser(user);
      
      if (authenticated && user) {
        // Redirect if user is authenticated with email or wallet
        if (user.wallet || user.email) {
          console.log("User authenticated:", user.wallet ? `Wallet: ${user.wallet.address}` : `Email: ${user.email?.address}`);
          onSuccess();
        }
      }
    }
  }, [ready, authenticated, user, setIsLoading, setIsAuthenticated, setUser, onSuccess]);

  // Set up logout handler
  useEffect(() => {
    const handleLogout = async () => {
      await logout();
      router.push("/");
    };

    // Expose logout function to window for debugging
    (window as any).logoutPrivy = handleLogout;

    return () => {
      delete (window as any).logoutPrivy;
    };
  }, [logout, router]);

  return null;
} 