"use client";

import Link from "next/link";
import { ArrowRight, BriefcaseBusiness, ClipboardCheck, TrendingUp } from "lucide-react";
import { PageShell } from "@/components/os/page-shell";
import { copy } from "@/lib/translations";
import { useLanguage } from "@/components/os/language-context";

export function HomePage() {
  const { dual } = useLanguage();
  const heroTitle = dual(copy.homeTitle);
  const heroDescription = dual(copy.homeDescription);
  const tagline = dual(copy.appTagline);
  const about = dual(copy.aboutDescription);

  return (
    <PageShell title={copy.appName} description={copy.appTagline}>
      <section className="grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="rounded-lg border border-[#d4dce5] bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#5d6c7f]">
            Overseas Social Media OS
          </p>
          <h2 className="mt-2 text-2xl font-black text-[#14253a] sm:text-3xl">
            {heroTitle.primary}
          </h2>
          <p className="mt-1 text-sm text-[#51657f]">{heroTitle.secondary}</p>
          <p className="mt-4 text-sm leading-7 text-[#324861]">{heroDescription.primary}</p>
          <p className="mt-1 text-sm leading-7 text-[#4c6079]">{heroDescription.secondary}</p>
          <div className="mt-5 rounded-md border border-[#d9e1ea] bg-[#f8fbff] p-4">
            <p className="font-semibold text-[#1d3450]">{tagline.primary}</p>
            <p className="mt-1 text-sm text-[#45607f]">{tagline.secondary}</p>
          </div>
        </div>

        <div className="space-y-4">
          <Link
            href="/creator-crm/finder"
            className="flex items-center justify-between rounded-lg border border-[#d4dce5] bg-white p-4 hover:bg-[#f4f8fd]"
          >
            <div>
              <p className="text-sm font-black text-[#14253a]">
                {copy.homeModules.creatorCrm.zh}
              </p>
              <p className="text-sm text-[#4a5f78]">
                {copy.homeModules.creatorCrm.en}
              </p>
            </div>
            <ClipboardCheck className="h-5 w-5 text-[#2f5f90]" />
          </Link>

          <Link
            href="/content-hub"
            className="flex items-center justify-between rounded-lg border border-[#d4dce5] bg-white p-4 hover:bg-[#f4f8fd]"
          >
            <div>
              <p className="text-sm font-black text-[#14253a]">
                {copy.homeModules.contentHub.zh}
              </p>
              <p className="text-sm text-[#4a5f78]">{copy.homeModules.contentHub.en}</p>
            </div>
            <BriefcaseBusiness className="h-5 w-5 text-[#2f5f90]" />
          </Link>

          <Link
            href="/ecommerce-tracking"
            className="flex items-center justify-between rounded-lg border border-[#d4dce5] bg-white p-4 hover:bg-[#f4f8fd]"
          >
            <div>
              <p className="text-sm font-black text-[#14253a]">
                {copy.homeModules.ecommerce.zh}
              </p>
              <p className="text-sm text-[#4a5f78]">{copy.homeModules.ecommerce.en}</p>
            </div>
            <TrendingUp className="h-5 w-5 text-[#2f5f90]" />
          </Link>
        </div>
      </section>

      <section className="mt-5 rounded-lg border border-[#d4dce5] bg-white p-5">
        <h3 className="text-lg font-black text-[#14253a]">
          {copy.aboutTitle.zh} / {copy.aboutTitle.en}
        </h3>
        <p className="mt-3 text-sm leading-7 text-[#334a66]">{about.primary}</p>
        <p className="mt-1 text-sm leading-7 text-[#4a6079]">{about.secondary}</p>
      </section>

      <section className="mt-5 rounded-lg border border-[#d4dce5] bg-white p-5">
        <h3 className="text-base font-black text-[#14253a]">Quick Demo Flow / 快速演示路径</h3>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <Link
            href="/creator-crm/finder"
            className="inline-flex items-center justify-between rounded-md border border-[#d4dce5] px-3 py-2 text-sm font-semibold text-[#20344f] hover:bg-[#f4f8fd]"
          >
            Creator Finder
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/creator-crm/outreach"
            className="inline-flex items-center justify-between rounded-md border border-[#d4dce5] px-3 py-2 text-sm font-semibold text-[#20344f] hover:bg-[#f4f8fd]"
          >
            Outreach Center
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/ecommerce-tracking"
            className="inline-flex items-center justify-between rounded-md border border-[#d4dce5] px-3 py-2 text-sm font-semibold text-[#20344f] hover:bg-[#f4f8fd]"
          >
            E-commerce Tracking
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
