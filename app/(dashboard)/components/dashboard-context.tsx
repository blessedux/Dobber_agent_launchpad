"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type NavigationState = {
  title: string;
  icon?: string;
};

type DashboardContextType = {
  navigation: NavigationState;
  setNavigation: (nav: NavigationState) => void;
};

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [navigation, setNavigation] = useState<NavigationState>({
    title: "Dashboard",
    icon: "Dashboard",
  });

  return (
    <DashboardContext.Provider value={{ navigation, setNavigation }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboardLayout() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error("useDashboardLayout must be used within a DashboardProvider");
  }
  return context;
} 