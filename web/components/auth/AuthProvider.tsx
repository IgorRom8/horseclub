"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import {
  loginLocalUser,
  logoutLocalUser,
  readLocalSession,
  registerLocalUser,
  type LocalSession,
} from "@/lib/localAuth";

type AuthContextValue = {
  user: LocalSession | null;
  ready: boolean;
  login: (username: string, password: string) => { ok: true } | { ok: false; error: string };
  register: (username: string, password: string) => { ok: true } | { ok: false; error: string };
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<LocalSession | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setUser(readLocalSession());
    setReady(true);
  }, []);

  const login = useCallback((username: string, password: string) => {
    const r = loginLocalUser(username, password);
    if (r.ok) setUser(readLocalSession());
    return r;
  }, []);

  const register = useCallback((username: string, password: string) => {
    const r = registerLocalUser(username, password);
    if (r.ok) setUser(readLocalSession());
    return r;
  }, []);

  const logout = useCallback(() => {
    logoutLocalUser();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, ready, login, register, logout }),
    [user, ready, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
