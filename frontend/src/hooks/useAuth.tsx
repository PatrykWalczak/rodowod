"use client";

// Auth Context — provides global login state to all components.
// Usage: const { user, login, logout, isLoading } = useAuth();

import { createContext, useCallback, useContext, useEffect, useState } from "react";

import { api, tokens } from "@/lib/api";
import type { LoginRequest, RegisterRequest, TokenResponse, UserResponse } from "@/lib/types";

// ─── Types ────────────────────────────────────────────────────────────────────

interface AuthContextValue {
  user: UserResponse | null;
  isLoading: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // On mount — try to restore session from localStorage
  useEffect(() => {
    const restore = async () => {
      if (!tokens.getAccess()) {
        setIsLoading(false);
        return;
      }
      try {
        const me = await api.get<UserResponse>("/api/auth/me");
        setUser(me);
      } catch {
        // Token invalid or expired — clear storage
        tokens.clear();
      } finally {
        setIsLoading(false);
      }
    };
    restore();
  }, []);

  const login = useCallback(async (data: LoginRequest) => {
    const tokenData = await api.post<TokenResponse>("/api/auth/login", data);
    tokens.set(tokenData.access_token, tokenData.refresh_token);
    const me = await api.get<UserResponse>("/api/auth/me");
    setUser(me);
  }, []);

  const register = useCallback(async (data: RegisterRequest) => {
    const tokenData = await api.post<TokenResponse>("/api/auth/register", data);
    tokens.set(tokenData.access_token, tokenData.refresh_token);
    const me = await api.get<UserResponse>("/api/auth/me");
    setUser(me);
  }, []);

  const logout = useCallback(() => {
    tokens.clear();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
