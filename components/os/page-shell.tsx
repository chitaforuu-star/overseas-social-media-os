"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Globe2 } from "lucide-react";
import { copy } from "@/lib/translations";
import { useLanguage } from "@/components/os/language-context";

function NavItem({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const active = pathname === href || pathname.startsWith(`${href}/`);
  return (
    <Link
      href={href}
      className={`rounded-md px-3 py-2 text-sm font-semibold transition ${
        active
          ? "bg-[#14253a] text-white"
          : "bg-white text-[#203047] hover:bg-[#eef2f6]"
      }`}
    >
      {label}
    </Link>
  );
}

export function BilingualBlock({
  titleZh,
  titleEn,
  descZh,
  descEn,
}: {
  titleZh: string;
  titleEn: string;
  descZh: string;
  descEn: string;
}) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-semibold uppercase tracking-wide text-[#5d6c7f]">
        {titleZh}
      </p>
      <p className="text-base font-bold text-[#14253a]">{titleEn}</p>
      <p className="text-sm text-[#30445f]">{descZh}</p>
      <p className="text-sm text-[#4a5d76]">{descEn}</p>
    </div>
  );
}

export function PageShell({
  children,
  title,
  description,
}: {
  children: React.ReactNode;
  title: { zh: string; en: string };
  description: { zh: string; en: string };
}) {
  const { locale, setLocale, labels, dual } = useLanguage();
  const heading = dual(title);
  const subHeading = dual(description);

  return (
    <main className="min-h-screen bg-[#f2f5f8] text-[#14253a]">
      <header className="border-b border-[#d4dce5] bg-white">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#5d6c7f]">
                {copy.appName.en}
              </p>
              <h1 className="text-xl font-black sm:text-2xl">{heading.primary}</h1>
              <p className="text-sm text-[#4b5d74]">{heading.secondary}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-md border border-[#d4dce5] bg-[#f7fafc] px-3 py-2 text-sm font-semibold text-[#2f4057]">
                <Globe2 className="h-4 w-4" />
                {copy.languageLabel.zh} / {copy.languageLabel.en}
              </span>
              <button
                type="button"
                onClick={() => setLocale("zh")}
                className={`rounded-md px-3 py-2 text-sm font-semibold ${
                  locale === "zh"
                    ? "bg-[#14253a] text-white"
                    : "bg-white text-[#22344b] hover:bg-[#eef2f6]"
                }`}
              >
                {labels.zh}
              </button>
              <button
                type="button"
                onClick={() => setLocale("en")}
                className={`rounded-md px-3 py-2 text-sm font-semibold ${
                  locale === "en"
                    ? "bg-[#14253a] text-white"
                    : "bg-white text-[#22344b] hover:bg-[#eef2f6]"
                }`}
              >
                {labels.en}
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <NavItem href="/" label="Home" />
            <NavItem href="/creator-crm/finder" label="Creator CRM" />
            <NavItem href="/content-hub" label="Content Hub" />
            <NavItem href="/ecommerce-tracking" label="E-commerce Tracking" />
          </div>
        </div>
      </header>

      <section className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 rounded-lg border border-[#d4dce5] bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#5d6c7f]">
            {copy.sectionLabel.zh} / {copy.sectionLabel.en}
          </p>
          <h2 className="mt-2 text-xl font-black text-[#14253a]">
            {subHeading.primary}
          </h2>
          <p className="mt-1 text-sm text-[#4b5d74]">{subHeading.secondary}</p>
        </div>
        {children}
      </section>
    </main>
  );
}
