"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/components/os/language-context";
import { PageShell } from "@/components/os/page-shell";
import { Breadcrumb } from "@/components/os/ui/breadcrumb";
import { AppCard } from "@/components/os/ui/app-card";
import { SectionHeader } from "@/components/os/ui/section-header";
import { copy } from "@/lib/translations";

const cards = [
  { key: "finder", href: "/creator-finder" },
  { key: "auditor", href: "/creator-auditor" },
  { key: "outreach", href: "/outreach" },
  { key: "content", href: "/content-hub" },
  { key: "review", href: "/performance" },
] as const;

export default function SopLibraryPage() {
  const { pick } = useLanguage();

  return (
    <PageShell
      title={pick(copy.sopLibrary.title)}
      description={pick(copy.sopLibrary.description)}
    >
      <Breadcrumb
        items={[
          { label: pick(copy.nav.dashboard), href: "/" },
          { label: pick(copy.nav.sopLibrary) },
        ]}
      />

      <AppCard className="p-5">
        <SectionHeader
          title={pick(copy.sopLibrary.title)}
          description={pick(copy.sopLibrary.description)}
        />
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {cards.map((card) => (
            <Link
              key={card.key}
              href={card.href}
              className="rounded-2xl border border-[#E5E7EB] bg-white p-4 transition hover:border-[#F9D5E5] hover:bg-[#FFF9FB]"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="os-card-title">
                    {pick(copy.sopLibrary.cards[card.key].title)}
                  </p>
                  <p className="os-helper-text mt-1">
                    {pick(copy.sopLibrary.cards[card.key].description)}
                  </p>
                </div>
                <ArrowRight className="mt-1 h-4 w-4 text-[#9CA3AF]" />
              </div>
            </Link>
          ))}
        </div>
      </AppCard>
    </PageShell>
  );
}
