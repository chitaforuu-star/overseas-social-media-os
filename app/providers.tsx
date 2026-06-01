"use client";

import type { ReactNode } from "react";
import { LanguageProvider } from "@/components/os/language-context";
import { OSProvider } from "@/components/os/os-context";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <LanguageProvider>
      <OSProvider>{children}</OSProvider>
    </LanguageProvider>
  );
}
