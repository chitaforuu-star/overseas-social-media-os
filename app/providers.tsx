"use client";

import type { ReactNode } from "react";
import { LanguageProvider } from "@/components/os/language-context";
import { OSProvider } from "@/components/os/os-context";
import { SupabaseAuthProvider } from "@/components/os/supabase-auth-context";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <LanguageProvider>
      <SupabaseAuthProvider>
        <OSProvider>{children}</OSProvider>
      </SupabaseAuthProvider>
    </LanguageProvider>
  );
}
