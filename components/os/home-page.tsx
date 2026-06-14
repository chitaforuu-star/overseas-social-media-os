"use client";

import Link from "next/link";
import { useMemo } from "react";
import {
  ArrowRight,
  BarChart3,
  FolderKanban,
  Megaphone,
  Package,
  Plus,
  Sparkles,
  Users,
  WandSparkles,
} from "lucide-react";
import { useLanguage } from "@/components/os/language-context";
import { useOS } from "@/components/os/os-context";
import { PageShell } from "@/components/os/page-shell";
import { AppButton } from "@/components/os/ui/app-button";
import { AppCard } from "@/components/os/ui/app-card";
import { EmptyState } from "@/components/os/ui/empty-state";
import { MetricCard } from "@/components/os/ui/metric-card";
import { SectionHeader } from "@/components/os/ui/section-header";
import { copy } from "@/lib/translations";

type FocusTask = {
  title: string;
  description: string;
  href: string;
  tone: "default" | "pink" | "purple";
};

const modules = [
  {
    href: "/creator-finder",
    title: "Creator Finder",
    description: "Search creators by market, niche, and collaboration fit.",
    icon: Sparkles,
  },
  {
    href: "/creator-auditor",
    title: "Creator Auditor",
    description: "Audit profiles before outreach or sampling.",
    icon: WandSparkles,
  },
  {
    href: "/creator-crm",
    title: "Creator CRM",
    description: "Save, segment, and manage creators in one place.",
    icon: Users,
  },
  {
    href: "/campaigns",
    title: "Campaigns",
    description: "Track campaign setup, status, and outcomes.",
    icon: FolderKanban,
  },
  {
    href: "/content-hub",
    title: "Content Hub",
    description: "Store content ideas, competitors, calendars, and scripts.",
    icon: Plus,
  },
  {
    href: "/performance",
    title: "Performance",
    description: "Review views, clicks, orders, and ROI.",
    icon: BarChart3,
  },
] as const;

const globeDots = [
  { top: "14%", left: "26%", color: "#E1306C" },
  { top: "22%", left: "66%", color: "#A855F7" },
  { top: "35%", left: "18%", color: "#C084FC" },
  { top: "46%", left: "73%", color: "#F472B6" },
  { top: "61%", left: "30%", color: "#7C3AED" },
  { top: "72%", left: "62%", color: "#D8B4FE" },
  { top: "26%", left: "45%", color: "#F9A8D4" },
  { top: "78%", left: "44%", color: "#FFFFFF" },
] as const;

export function HomePage() {
  const { pick } = useLanguage();
  const os = useOS();
  const countryDistribution = useMemo(() => {
    const counts = new Map<string, number>();
    os.state.creators.forEach((creator) => {
      const key = creator.country?.trim() || "Unknown";
      counts.set(key, (counts.get(key) ?? 0) + 1);
    });
    return [...counts.entries()]
      .map(([country, count]) => ({ country, count }))
      .sort((a, b) => b.count - a.count);
  }, [os.state.creators]);

  const totalCreators = os.state.creators.length;
  const samplesSentCount = os.state.creators.filter((creator) => creator.status === "sample_sent").length;
  const globalReach = countryDistribution.length;
  const maxCountryCount = Math.max(1, ...countryDistribution.map((item) => item.count));

  const creatorsInPipeline = os.state.creators.filter(
    (creator) => creator.status !== "reviewed",
  ).length;
  const awaitingReply = os.state.outreach.filter(
    (item) => !item.replyStatus.toLowerCase().includes("replied"),
  ).length;
  const postsLive = os.state.creators.filter((creator) => creator.status === "posted").length;

  const tasks: FocusTask[] = [
    {
      title: pick(copy.dashboard.tasks.audit),
      description: "Open the auditor and review the next creator link.",
      href: "/creator-auditor",
      tone: "pink",
    },
    {
      title: pick(copy.dashboard.tasks.followUp),
      description: "Check the latest outreach replies and follow-up dates.",
      href: "/outreach",
      tone: "default",
    },
    {
      title: pick(copy.dashboard.tasks.sample),
      description: "Check sample shipping and update delivery status.",
      href: "/samples",
      tone: "purple",
    },
    {
      title: pick(copy.dashboard.tasks.publish),
      description: "Review the next scheduled post and content QA.",
      href: "/content-hub",
      tone: "default",
    },
    {
      title: pick(copy.dashboard.tasks.report),
      description: "Open the performance page and log the latest results.",
      href: "/performance",
      tone: "pink",
    },
  ];

  return (
    <PageShell
      title={pick(copy.appName)}
      description={pick(copy.pageDescription.dashboard)}
      headerAction={
        <div className="flex flex-wrap gap-2">
          <Link href="/creator-crm/new">
            <AppButton variant="primary" iconLeft={<Plus className="h-4 w-4" />}>
              {pick(copy.actions.addCreator)}
            </AppButton>
          </Link>
          <Link href="/campaigns/new">
            <AppButton variant="secondary" iconLeft={<FolderKanban className="h-4 w-4" />}>
              {pick(copy.actions.newCampaign)}
            </AppButton>
          </Link>
        </div>
      }
    >
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label={pick(copy.dashboard.metrics.creators)}
          value={creatorsInPipeline}
          hint={pick(copy.nav.creatorCrm)}
          tag={pick(copy.nav.creatorFinder)}
          icon={<Users className="h-4 w-4 text-[#6B7280]" />}
          tone="pink"
        />
        <MetricCard
          label={pick(copy.dashboard.metrics.awaitingReply)}
          value={awaitingReply}
          hint={pick(copy.nav.outreach)}
          tag={pick(copy.nav.outreach)}
          icon={<Megaphone className="h-4 w-4 text-[#6B7280]" />}
        />
        <MetricCard
          label={pick(copy.dashboard.metrics.sampleSent)}
          value={samplesSentCount}
          hint={pick(copy.nav.samples)}
          tag={pick(copy.nav.samples)}
          icon={<Package className="h-4 w-4 text-[#6B7280]" />}
          tone="purple"
        />
        <MetricCard
          label={pick(copy.dashboard.metrics.postsLive)}
          value={postsLive}
          hint={pick(copy.nav.performance)}
          tag={pick(copy.nav.performance)}
          icon={<BarChart3 className="h-4 w-4 text-[#6B7280]" />}
        />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <AppCard className="p-5" tone="pink">
          <SectionHeader
            title={pick(copy.dashboard.sections.todayFocus)}
            description={pick(copy.appIntro)}
            action={
              <Link href="/creator-crm/new">
                <AppButton variant="primary" iconLeft={<Plus className="h-4 w-4" />}>
                  {pick(copy.actions.addTask)}
                </AppButton>
              </Link>
            }
          />
          <div className="mt-4 space-y-2">
            {tasks.map((task) => (
              <Link
                key={task.title}
                href={task.href}
                className="flex items-start justify-between gap-3 rounded-2xl border border-[#E5E7EB] bg-white px-4 py-3 transition hover:-translate-y-0.5 hover:border-[#F9D5E5]"
              >
                <div className="min-w-0 space-y-1">
                  <p className="os-card-title">{task.title}</p>
                  <p className="os-helper-text">{task.description}</p>
                </div>
                <span className="mt-0.5 rounded-full border border-[#E5E7EB] bg-[#FAFAFA] px-3 py-1 text-xs font-medium text-[#4B5563]">
                  {pick(copy.actions.viewDetails)}
                </span>
              </Link>
            ))}
          </div>
        </AppCard>

        <AppCard className="p-5">
          <SectionHeader
            title={pick(copy.dashboard.sections.workModules)}
            description={pick(copy.pageDescription.dashboard)}
          />
          <div className="mt-4 grid gap-3">
            {modules.map((module) => {
              const Icon = module.icon;
              return (
                <Link
                  key={module.href}
                  href={module.href}
                  className="group rounded-2xl border border-[#E5E7EB] bg-white p-4 transition hover:border-[#F9D5E5] hover:bg-[#FFF9FB]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF1F6] text-[#BE185D]">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="os-card-title">{module.title}</p>
                        <p className="os-helper-text mt-1">{module.description}</p>
                      </div>
                    </div>
                    <ArrowRight className="mt-1 h-4 w-4 text-[#9CA3AF] transition group-hover:translate-x-0.5 group-hover:text-[#E1306C]" />
                  </div>
                </Link>
              );
            })}
          </div>
        </AppCard>
      </section>

      <AppCard className="p-5">
        <SectionHeader
          title={pick(copy.aboutTitle)}
          description={pick(copy.appIntro)}
        />
        <p className="os-body-text mt-3 max-w-4xl text-[#374151]">
          This prototype is built for overseas social media, influencer marketing, and creator
          operations teams. It focuses on a practical workflow: discover creators, audit fit,
          save to CRM, manage outreach, track content, and review performance.
        </p>
      </AppCard>

      {os.state.creators.length === 0 &&
      os.state.creatorDrafts.length === 0 &&
      os.state.campaigns.length === 0 ? (
        <AppCard className="p-5">
          <EmptyState
            title={pick(copy.common.noDataTitle)}
            description={pick(copy.common.noDataDescription)}
            action={
              <div className="flex flex-wrap gap-2">
                <Link href="/creator-crm/new">
                  <AppButton variant="primary">{pick(copy.actions.addCreatorManually)}</AppButton>
                </Link>
                <Link href="/creator-finder">
                  <AppButton variant="secondary">{pick(copy.actions.searchCreators)}</AppButton>
                </Link>
              </div>
            }
          />
        </AppCard>
      ) : null}

      <section className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Creator CRM", value: os.state.creators.length, href: "/creator-crm" },
          { label: "Campaigns", value: os.state.campaigns.length, href: "/campaigns" },
          { label: "Content Hub", value: os.state.contentMaterials.length, href: "/content-hub" },
        ].map((item) => (
          <Link key={item.label} href={item.href}>
            <AppCard className="p-4 transition hover:border-[#F9D5E5] hover:bg-[#FFF9FB]">
              <p className="os-helper-text">{item.label}</p>
              <p className="mt-2 text-3xl font-semibold text-[#111827]">{item.value}</p>
              <p className="mt-2 text-sm text-[#6B7280]">{pick(copy.actions.viewDetails)}</p>
            </AppCard>
          </Link>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <AppCard className="p-5" tone="purple">
          <SectionHeader
            title={pick({
              zh: "创作者国家分布",
              en: "Creator Country Distribution",
            })}
            description={pick({
              zh: "查看创作者来自哪些市场，以及每个市场的覆盖情况。",
              en: "See where your creators are based and how coverage is distributed by market.",
            })}
          />
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-[24px] border border-[#E5E7EB] bg-white p-4">
              <p className="os-helper-text">{pick({ zh: "达人总数", en: "Creators Total" })}</p>
              <p className="mt-2 text-[30px] font-semibold leading-none text-[#111827]">{totalCreators}</p>
            </div>
            <div className="rounded-[24px] border border-[#E5E7EB] bg-white p-4">
              <p className="os-helper-text">{pick({ zh: "已寄样", en: "Samples Sent" })}</p>
              <p className="mt-2 text-[30px] font-semibold leading-none text-[#111827]">{samplesSentCount}</p>
            </div>
            <div className="rounded-[24px] border border-[#E5E7EB] bg-white p-4">
              <p className="os-helper-text">{pick({ zh: "全球覆盖", en: "Global Reach" })}</p>
              <p className="mt-2 text-[30px] font-semibold leading-none text-[#111827]">{globalReach}</p>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {countryDistribution.length === 0 ? (
              <div className="rounded-[24px] border border-dashed border-[#D8C8F0] bg-white/70 p-4 text-sm text-[#6B7280]">
                {pick({ zh: "还没有达人国家数据。", en: "No creator country data yet." })}
              </div>
            ) : (
              countryDistribution.slice(0, 5).map((item) => {
                const width = `${Math.max(10, Math.round((item.count / maxCountryCount) * 100))}%`;
                return (
                  <div key={item.country} className="space-y-2 rounded-[24px] border border-white/70 bg-white p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="os-card-title">{item.country}</p>
                      <p className="text-sm font-medium text-[#6B7280]">{item.count}</p>
                    </div>
                    <div className="h-2 rounded-full bg-[#F3E8FF]">
                      <div className="h-2 rounded-full bg-[#A855F7]" style={{ width }} />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </AppCard>

        <AppCard className="overflow-hidden p-0">
          <div className="relative overflow-hidden rounded-[28px] border border-[#2E2148] bg-[#140F24] p-5 text-white shadow-[0_30px_80px_rgba(95,57,170,0.22)] sm:p-6">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(225,48,108,0.16),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.18),transparent_30%),radial-gradient(circle_at_center,rgba(255,255,255,0.05),transparent_56%)]" />
            <div className="relative flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/55">
                  {pick({ zh: "全球创作者网络", en: "Global Creator Network" })}
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-white">
                  {pick({
                    zh: "Creator Country Distribution / Samples Sent / Global Reach",
                    en: "Creator Country Distribution / Samples Sent / Global Reach",
                  })}
                </h2>
              </div>
              <span className="rounded-full border border-white/10 bg-white/[0.08] px-3 py-1 text-xs font-medium text-white/70 backdrop-blur-md">
                {pick({ zh: "Local data", en: "Local data" })}
              </span>
            </div>

            <div className="relative mt-6 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="relative flex min-h-[360px] items-center justify-center overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.04] p-6">
                <div className="absolute inset-6 rounded-full border border-white/10" />
                <div className="absolute inset-12 rounded-full border border-white/8" />
                <div className="absolute inset-[22%] rounded-full bg-[radial-gradient(circle_at_35%_30%,rgba(255,255,255,0.9),rgba(196,181,253,0.7)_18%,rgba(168,85,247,0.36)_38%,rgba(20,15,36,0.02)_72%)] shadow-[0_0_90px_rgba(192,132,252,0.22)]" />
                <div className="absolute inset-[18%] rounded-full bg-[radial-gradient(circle_at_65%_65%,rgba(225,48,108,0.16),transparent_45%)]" />
                <div className="absolute inset-[16%] rounded-full border border-white/5 opacity-70" />
                {globeDots.map((dot) => (
                  <span
                    key={`${dot.top}-${dot.left}`}
                    className="absolute h-3 w-3 rounded-full ring-4 ring-white/10"
                    style={{
                      top: dot.top,
                      left: dot.left,
                      backgroundColor: dot.color,
                      boxShadow: `0 0 0 6px rgba(255,255,255,0.04), 0 0 24px ${dot.color}55`,
                    }}
                  />
                ))}
                <div className="absolute left-6 top-6 rounded-full border border-white/10 bg-black/35 px-3 py-2 text-xs font-medium text-white/70 backdrop-blur-md">
                  {pick({ zh: "Creator Country Distribution", en: "Creator Country Distribution" })}
                </div>
                <div className="absolute bottom-6 right-6 rounded-full border border-white/10 bg-black/35 px-3 py-2 text-xs font-medium text-white/70 backdrop-blur-md">
                  {pick({ zh: "Global Reach", en: "Global Reach" })}
                </div>
              </div>

              <div className="space-y-3">
                <div className="rounded-[28px] border border-white/10 bg-white/[0.05] p-4 backdrop-blur-md">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/50">
                    {pick({ zh: "Summary", en: "Summary" })}
                  </p>
                  <div className="mt-4 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                    {[
                      { label: pick({ zh: "达人总数", en: "Creators Total" }), value: totalCreators },
                      { label: pick({ zh: "已寄样", en: "Samples Sent" }), value: samplesSentCount },
                      { label: pick({ zh: "覆盖市场", en: "Markets Covered" }), value: globalReach },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="rounded-[22px] border border-white/10 bg-[#1B1431] px-4 py-3"
                      >
                        <p className="text-xs font-medium text-white/50">{item.label}</p>
                        <p className="mt-2 text-3xl font-semibold leading-none text-white">
                          {item.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-[28px] border border-white/10 bg-white/[0.05] p-4 backdrop-blur-md">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/50">
                    {pick({ zh: "Network Notes", en: "Network Notes" })}
                  </p>
                  <div className="mt-4 space-y-3 text-sm text-white/[0.72]">
                    <p>
                      {pick({
                        zh: "柔和紫色、发光圆点和深色浮层，用来表达全球 Creator Network 的连接感。",
                        en: "Soft purple, glowing points, and dark floating labels create a global creator network feel.",
                      })}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {[
                        pick({ zh: "国家分布", en: "Country Distribution" }),
                        pick({ zh: "已寄样", en: "Samples Sent" }),
                        pick({ zh: "全球覆盖", en: "Global Reach" }),
                      ].map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-white/10 bg-white/[0.08] px-3 py-1 text-xs font-medium text-white/75"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </AppCard>
      </section>
    </PageShell>
  );
}
