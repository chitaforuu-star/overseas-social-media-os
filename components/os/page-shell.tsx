"use client";

import type { ReactNode } from "react";
import { Globe2 } from "lucide-react";
import { useLanguage } from "@/components/os/language-context";
import { AppButton } from "@/components/os/ui/app-button";
import { PageHeader } from "@/components/os/ui/page-header";
import { SidebarNav } from "@/components/os/ui/sidebar-nav";
import { copy } from "@/lib/translations";
import type { BilingualText } from "@/lib/translations";

export function PageShell({
  children,
  title,
  description,
  headerAction,
}: {
  children: ReactNode;
  title: BilingualText | string;
  description: BilingualText | string;
  headerAction?: ReactNode;
}) {
  const { locale, setLocale, pick } = useLanguage();
  const pageTitle = typeof title === "string" ? title : pick(title);
  const pageDescription = typeof description === "string" ? description : pick(description);

  return (
    <main className="min-h-screen bg-[#F7F7F8] text-[#111827]">
      <header className="sticky top-0 z-20 border-b border-[#E5E7EB] bg-white/95 backdrop-blur">
        <div className="os-content-width flex items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#6B7280]">
              {pick(copy.appName)}
            </p>
            <p className="truncate text-sm text-[#6B7280]">{pick(copy.appIntro)}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden items-center gap-2 text-sm text-[#6B7280] sm:inline-flex">
              <Globe2 className="h-4 w-4" />
              {pick(copy.common.language)}
            </span>
            <AppButton
              variant={locale === "zh" ? "primary" : "secondary"}
              onClick={() => setLocale("zh")}
            >
              中文
            </AppButton>
            <AppButton
              variant={locale === "en" ? "primary" : "secondary"}
              onClick={() => setLocale("en")}
            >
              EN
            </AppButton>
          </div>
        </div>
      </header>

      <section className="os-content-width px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[248px_minmax(0,1fr)]">
          <aside className="hidden lg:block">
            <div className="os-card p-3">
              <SidebarNav />
            </div>
          </aside>

          <div className="space-y-5">
            <div className="block lg:hidden">
              <div className="os-card p-3">
                <SidebarNav />
              </div>
            </div>

            <div className="os-card p-5">
              <PageHeader
                title={pageTitle}
                description={pageDescription}
                rightSlot={headerAction}
              />
            </div>

            {children}
          </div>
        </div>
      </section>
    </main>
  );
}
