"use client";

import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";
import { useOS } from "@/components/os/os-context";
import { useLanguage } from "@/components/os/language-context";
import { PageShell } from "@/components/os/page-shell";
import { Breadcrumb } from "@/components/os/ui/breadcrumb";
import { EmptyState } from "@/components/os/ui/empty-state";
import { AppButton } from "@/components/os/ui/app-button";
import { AppCard } from "@/components/os/ui/app-card";
import { SectionHeader } from "@/components/os/ui/section-header";
import { copy } from "@/lib/translations";

const modules = [
  {
    href: "/content-hub/new",
    title: "Topic Materials",
    description: "Capture trend topics and content angles.",
  },
  {
    href: "/content-hub/new",
    title: "Competitor Breakdown",
    description: "Archive hooks, CTA patterns, and messaging.",
  },
  {
    href: "/content-hub/new",
    title: "Content Calendar",
    description: "Plan publishing cadence and owners.",
  },
  {
    href: "/content-hub/new",
    title: "Script Templates",
    description: "Store reusable script structures.",
  },
] as const;

export default function ContentHubPage() {
  const { pick } = useLanguage();
  const os = useOS();

  const totalItems =
    os.state.contentMaterials.length +
    os.state.competitorContent.length +
    os.state.contentCalendar.length +
    os.state.scriptTemplates.length;

  return (
    <PageShell
      title={pick(copy.contentHub.title)}
      description={pick(copy.contentHub.description)}
      headerAction={
        <Link href="/content-hub/new">
          <AppButton variant="primary" iconLeft={<Plus className="h-4 w-4" />}>
            {pick(copy.actions.newContent)}
          </AppButton>
        </Link>
      }
    >
      <Breadcrumb
        items={[
          { label: pick(copy.nav.dashboard), href: "/" },
          { label: pick(copy.nav.contentHub) },
        ]}
      />

      <section className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <AppCard className="p-5">
          <SectionHeader title={pick(copy.contentHub.title)} description={pick(copy.contentHub.description)} />
          {totalItems === 0 ? (
            <div className="mt-4">
              <EmptyState
                title={pick(copy.contentHub.emptyTitle)}
                description={pick(copy.contentHub.emptyDescription)}
                action={
                  <Link href="/content-hub/new">
                    <AppButton variant="primary">{pick(copy.actions.newContent)}</AppButton>
                  </Link>
                }
              />
            </div>
          ) : (
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {[
                ["Topic Materials", os.state.contentMaterials.length],
                ["Competitor Content", os.state.competitorContent.length],
                ["Content Calendar", os.state.contentCalendar.length],
                ["Script Templates", os.state.scriptTemplates.length],
              ].map(([label, count]) => (
                <Link key={label} href="/content-hub/new">
                  <div className="rounded-2xl border border-[#E5E7EB] bg-[#FAFAFA] p-4 transition hover:border-[#F9D5E5] hover:bg-[#FFF9FB]">
                    <p className="os-helper-text">{label}</p>
                    <p className="mt-2 text-2xl font-semibold text-[#111827]">{count}</p>
                    <p className="mt-2 text-sm text-[#6B7280]">{pick(copy.actions.viewDetails)}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </AppCard>

        <AppCard className="p-5" tone="purple">
          <SectionHeader
            title={pick(copy.contentHub.materialBoard.title)}
            description={pick(copy.contentHub.materialBoard.description)}
          />
          <div className="mt-4 grid gap-3">
            {modules.map((module) => (
              <Link
                key={module.title}
                href={module.href}
                className="group rounded-2xl border border-[#E5E7EB] bg-white p-4 transition hover:border-[#F9D5E5] hover:bg-[#FFF9FB]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="os-card-title">{module.title}</p>
                    <p className="os-helper-text mt-1">{module.description}</p>
                  </div>
                  <ArrowRight className="mt-1 h-4 w-4 text-[#9CA3AF] transition group-hover:translate-x-0.5 group-hover:text-[#E1306C]" />
                </div>
              </Link>
            ))}
          </div>
        </AppCard>
      </section>
    </PageShell>
  );
}
