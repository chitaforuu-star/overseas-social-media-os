"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Session } from "@supabase/supabase-js";
import { getSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase/client";

type SupabaseAuthContextValue = {
  ready: boolean;
  configured: boolean;
  session: Session | null;
  userId: string | null;
  signInWithPassword: (email: string, password: string) => Promise<string | null>;
  signUpWithPassword: (email: string, password: string) => Promise<string | null>;
  signOut: () => Promise<string | null>;
  refreshSession: () => Promise<void>;
};

const SupabaseAuthContext = createContext<SupabaseAuthContextValue | null>(null);

export function SupabaseAuthProvider({ children }: { children: ReactNode }) {
  const configured = isSupabaseConfigured();
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!configured) {
      queueMicrotask(() => setReady(true));
      return;
    }

    const supabase = getSupabaseBrowserClient();
    let mounted = true;

    supabase.auth.getSession().then(({ data, error }) => {
      if (!mounted) return;
      if (!error) {
        setSession(data.session ?? null);
      }
      setReady(true);
    });

    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setReady(true);
    });

    return () => {
      mounted = false;
      data.subscription.unsubscribe();
    };
  }, [configured]);

  const value = useMemo<SupabaseAuthContextValue>(
    () => ({
      ready,
      configured,
      session,
      userId: session?.user.id ?? null,
      signInWithPassword: async (email, password) => {
        if (!configured) return "Supabase is not configured.";
        const { error } = await getSupabaseBrowserClient().auth.signInWithPassword({
          email,
          password,
        });
        return error?.message ?? null;
      },
      signUpWithPassword: async (email, password) => {
        if (!configured) return "Supabase is not configured.";
        const { error } = await getSupabaseBrowserClient().auth.signUp({
          email,
          password,
        });
        return error?.message ?? null;
      },
      signOut: async () => {
        if (!configured) return "Supabase is not configured.";
        const { error } = await getSupabaseBrowserClient().auth.signOut();
        return error?.message ?? null;
      },
      refreshSession: async () => {
        if (!configured) return;
        const { data } = await getSupabaseBrowserClient().auth.getSession();
        setSession(data.session ?? null);
      },
    }),
    [configured, ready, session],
  );

  return <SupabaseAuthContext.Provider value={value}>{children}</SupabaseAuthContext.Provider>;
}

export function useSupabaseAuth() {
  const context = useContext(SupabaseAuthContext);
  if (!context) {
    throw new Error("useSupabaseAuth must be used within SupabaseAuthProvider.");
  }
  return context;
}
