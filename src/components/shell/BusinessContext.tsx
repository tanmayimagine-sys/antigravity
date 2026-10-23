"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Business, UserRole } from "@/lib/types";
import { DEMO_BUSINESSES } from "@/lib/seed/data";

interface BusinessContextType {
  activeBusiness: Business;
  setActiveBusinessId: (id: string) => void;
  allBusinesses: Business[];
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  dateRange: string;
  setDateRange: (range: string) => void;
  guidedDemoActive: boolean;
  setGuidedDemoActive: (active: boolean) => void;
  currentDemoStep: number;
  setCurrentDemoStep: (step: number) => void;
}

const BusinessContext = createContext<BusinessContextType | undefined>(undefined);

export function BusinessProvider({ children }: { children: React.ReactNode }) {
  const [activeBusinessId, setActiveBusinessIdState] = useState<string>("biz_stationery");
  const [currentRole, setCurrentRoleState] = useState<UserRole>("owner");
  const [dateRange, setDateRange] = useState<string>("Last 30 Days");
  const [guidedDemoActive, setGuidedDemoActive] = useState<boolean>(false);
  const [currentDemoStep, setCurrentDemoStep] = useState<number>(1);

  // Initialize from localStorage if present
  useEffect(() => {
    try {
      const savedBiz = localStorage.getItem("active-business-id");
      if (savedBiz && DEMO_BUSINESSES.some((b) => b.id === savedBiz)) {
        setActiveBusinessIdState(savedBiz);
      }
      const savedRole = localStorage.getItem("current-user-role") as UserRole | null;
      if (savedRole) {
        setCurrentRoleState(savedRole);
      }
    } catch {}
  }, []);

  const setActiveBusinessId = (id: string) => {
    setActiveBusinessIdState(id);
    try {
      localStorage.setItem("active-business-id", id);
    } catch {}
  };

  const setCurrentRole = (role: UserRole) => {
    setCurrentRoleState(role);
    try {
      localStorage.setItem("current-user-role", role);
    } catch {}
  };

  const activeBusiness =
    DEMO_BUSINESSES.find((b) => b.id === activeBusinessId) || DEMO_BUSINESSES[0];

  return (
    <BusinessContext.Provider
      value={{
        activeBusiness,
        setActiveBusinessId,
        allBusinesses: DEMO_BUSINESSES,
        currentRole,
        setCurrentRole,
        dateRange,
        setDateRange,
        guidedDemoActive,
        setGuidedDemoActive,
        currentDemoStep,
        setCurrentDemoStep,
      }}
    >
      {children}
    </BusinessContext.Provider>
  );
}

export function useBusiness() {
  const ctx = useContext(BusinessContext);
  if (!ctx) throw new Error("useBusiness must be used within a BusinessProvider");
  return ctx;
}
