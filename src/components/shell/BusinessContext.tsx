"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Business, UserRole } from "@/lib/types";
import { DEMO_BUSINESSES } from "@/lib/seed/data";
import { AuthUser, AUTH_USERS, findUserByEmail, findUserById } from "@/lib/auth/users";

interface BusinessContextType {
  activeBusiness: Business;
  setActiveBusinessId: (id: string) => void;
  allBusinesses: Business[];
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  currentUser: AuthUser;
  loginWithCredentials: (email: string, password?: string) => { success: boolean; error?: string };
  switchUser: (userId: string) => void;
  logout: () => void;
  isOwner: boolean;
  isInvestor: boolean;
  isStaff: boolean;
  isAdmin: boolean;
  dateRange: string;
  setDateRange: (range: string) => void;
  guidedDemoActive: boolean;
  setGuidedDemoActive: (active: boolean) => void;
  currentDemoStep: number;
  setCurrentDemoStep: (step: number) => void;
}

const BusinessContext = createContext<BusinessContextType | undefined>(undefined);

export function BusinessProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUserState] = useState<AuthUser>(AUTH_USERS[0]); // default: Ramesh Sharma (Vidya Stationery)
  const [activeBusinessId, setActiveBusinessIdState] = useState<string>("biz_stationery");
  const [currentRole, setCurrentRoleState] = useState<UserRole>("owner");
  const [dateRange, setDateRange] = useState<string>("Last 30 Days");
  const [guidedDemoActive, setGuidedDemoActive] = useState<boolean>(false);
  const [currentDemoStep, setCurrentDemoStep] = useState<number>(1);

  // Initialize from localStorage if present
  useEffect(() => {
    try {
      const savedUserId = localStorage.getItem("auth-user-id");
      if (savedUserId) {
        const found = findUserById(savedUserId);
        if (found) {
          setCurrentUserState(found);
          setCurrentRoleState(found.role);
          if (found.businessId) {
            setActiveBusinessIdState(found.businessId);
          }
          return;
        }
      }

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

  // Strict Tenant Isolation: Owners are permanently locked to their own business!
  const setActiveBusinessId = (id: string) => {
    if (currentUser.role === "owner" && currentUser.businessId) {
      if (id !== currentUser.businessId) {
        console.warn(`[Security Alert] Tenant breach blocked. User ${currentUser.name} is locked to ${currentUser.businessId}. Cannot switch to ${id}.`);
        return;
      }
    }
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

  const switchUser = (userId: string) => {
    const user = findUserById(userId);
    if (!user) return;
    setCurrentUserState(user);
    setCurrentRoleState(user.role);
    if (user.businessId) {
      setActiveBusinessIdState(user.businessId);
      try {
        localStorage.setItem("active-business-id", user.businessId);
      } catch {}
    }
    try {
      localStorage.setItem("auth-user-id", user.id);
      localStorage.setItem("current-user-role", user.role);
    } catch {}
  };

  const loginWithCredentials = (email: string, password?: string): { success: boolean; error?: string } => {
    const user = findUserByEmail(email);
    if (!user) {
      return { success: false, error: "No account found matching this email address." };
    }
    if (password && user.password && password !== user.password && password !== "demo") {
      return { success: false, error: "Incorrect password. (Hint: password123)" };
    }

    switchUser(user.id);
    return { success: true };
  };

  const logout = () => {
    try {
      localStorage.removeItem("auth-user-id");
      localStorage.removeItem("active-business-id");
      localStorage.removeItem("current-user-role");
    } catch {}
    // Reset to visitor/landing
    window.location.href = "/login";
  };

  const activeBusiness =
    DEMO_BUSINESSES.find((b) => b.id === activeBusinessId) || DEMO_BUSINESSES[0];

  const isOwner = currentUser.role === "owner";
  const isInvestor = currentUser.role === "funder";
  const isStaff = currentUser.role === "staff";
  const isAdmin = currentUser.role === "admin";

  return (
    <BusinessContext.Provider
      value={{
        activeBusiness,
        setActiveBusinessId,
        allBusinesses: DEMO_BUSINESSES,
        currentRole,
        setCurrentRole,
        currentUser,
        loginWithCredentials,
        switchUser,
        logout,
        isOwner,
        isInvestor,
        isStaff,
        isAdmin,
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
