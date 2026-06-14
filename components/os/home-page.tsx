"use client";

import Link from "next/link";
import { useMemo } from "react";
import {
  ArrowRight,
  BarChart3,
  FolderKanban,
  Globe2,
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

type WorldRegion = {
  code: "US" | "UK" | "Korea" | "Singapore" | "Malaysia" | "Germany";
  label: string;
  aliases: string[];
  href: string;
  top: string;
  left: string;
  accent: string;
};

const worldRegions: WorldRegion[] = [
  {
    code: "US",
    label: "US",
    aliases: ["us", "usa", "united states", "united states of america"],
    href: "/creator-crm?country=US",
    top: "44%",
    left: "18%",
    accent: "#E1306C",
  },
  {
    code: "UK",
    label: "UK",
    aliases: ["uk", "united kingdom", "great britain", "britain", "england"],
    href: "/creator-crm?country=UK",
    top: "29%",
    left: "49%",
    accent: "#8B5CF6",
  },
  {
    code: "Germany",
    label: "DE",
    aliases: ["germany", "de", "deutschland"],
    href: "/creator-crm?country=Germany",
    top: "33%",
    left: "53%",
    accent: "#C084FC",
  },
  {
    code: "Korea",
    label: "KR",
    aliases: ["korea", "south korea", "republic of korea", "kr"],
    href: "/creator-crm?country=Korea",
    top: "36%",
    left: "77%",
    accent: "#F472B6",
  },
  {
    code: "Singapore",
    label: "SG",
    aliases: ["singapore", "sg"],
    href: "/creator-crm?country=Singapore",
    top: "60%",
    left: "72%",
    accent: "#A855F7",
  },
  {
    code: "Malaysia",
    label: "MY",
    aliases: ["malaysia", "my"],
    href: "/creator-crm?country=Malaysia",
    top: "63%",
    left: "69%",
    accent: "#D8B4FE",
  },
];

function normalizeCountry(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function countryMatches(country: string, aliases: string[]) {
  const value = normalizeCountry(country);
  return aliases.some((alias) => {
    const normalizedAlias = normalizeCountry(alias);
    return (
      value === normalizedAlias ||
      value.includes(normalizedAlias) ||
      normalizedAlias.includes(value)
    );
  });
}

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

  const creatorsInPipeline = os.state.creators.filter(
    (creator) => creator.status !== "reviewed",
  ).length;
  const awaitingReply = os.state.outreach.filter(
    (item) => !item.replyStatus.toLowerCase().includes("replied"),
  ).length;
  const postsLive = os.state.creators.filter((creator) => creator.status === "posted").length;
  const worldRegionStats = useMemo(
    () =>
      worldRegions.map((region) => {
        const count = os.state.creators.filter((creator) =>
          countryMatches(creator.country ?? "", region.aliases),
        ).length;

        return {
          ...region,
          count,
        };
      }),
    [os.state.creators],
  );
  const maxRegionCount = Math.max(1, ...worldRegionStats.map((region) => region.count));

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

      <section className="grid gap-4 xl:grid-cols-2">
        <AppCard className="overflow-hidden p-0">
          <div className="relative overflow-hidden rounded-[28px] border border-[#2E2148] bg-[#0F1020] p-5 text-white shadow-[0_30px_80px_rgba(95,57,170,0.22)] sm:p-6">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_18%,rgba(225,48,108,0.18),transparent_24%),radial-gradient(circle_at_78%_26%,rgba(168,85,247,0.16),transparent_24%),radial-gradient(circle_at_center,rgba(255,255,255,0.06),transparent_58%)]" />
            <div className="relative flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06]">
                  <Globe2 className="h-4 w-4 text-white/80" />
                </div>
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
              </div>
              <span className="rounded-full border border-white/10 bg-white/[0.08] px-3 py-1 text-xs font-medium text-white/70 backdrop-blur-md">
                {pick({ zh: "本地数据", en: "Local data" })}
              </span>
            </div>

            <div className="relative mt-6 grid gap-4 lg:grid-cols-[1.08fr_0.92fr]">
              <div className="relative min-h-[400px] overflow-hidden rounded-[34px] border border-white/10 bg-[#11162B] p-4">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(255,255,255,0.08),transparent_35%),radial-gradient(circle_at_50%_58%,rgba(225,48,108,0.12),transparent_32%),linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0))]" />
                <svg
                  viewBox="0 0 1000 680"
                  className="absolute inset-0 h-full w-full"
                  aria-hidden="true"
                >
                  <defs>
                    <radialGradient id="globeOcean" cx="50%" cy="40%" r="70%">
                      <stop offset="0%" stopColor="#2E2457" />
                      <stop offset="55%" stopColor="#181A34" />
                      <stop offset="100%" stopColor="#0D1022" />
                    </radialGradient>
                    <radialGradient id="globeGlow" cx="50%" cy="45%" r="60%">
                      <stop offset="0%" stopColor="#D8B4FE" stopOpacity="0.55" />
                      <stop offset="100%" stopColor="#D8B4FE" stopOpacity="0" />
                    </radialGradient>
                    <clipPath id="globeClip">
                      <circle cx="430" cy="350" r="235" />
                    </clipPath>
                  </defs>
                  <rect width="1000" height="680" fill="#0F1020" />
                  <circle cx="430" cy="350" r="272" fill="url(#globeGlow)" opacity="0.55" />
                  <circle cx="430" cy="350" r="238" fill="url(#globeOcean)" />
                  <g opacity="0.18" stroke="#E9D5FF" strokeWidth="1.2" fill="none">
                    <ellipse cx="430" cy="350" rx="228" ry="76" />
                    <ellipse cx="430" cy="350" rx="228" ry="132" />
                    <ellipse cx="430" cy="350" rx="228" ry="188" />
                    <path d="M202 350H658" />
                    <path d="M228 282H632" />
                    <path d="M228 418H632" />
                    <path d="M278 214C323 285 323 415 278 486" />
                    <path d="M582 214C537 285 537 415 582 486" />
                  </g>
                  <g clipPath="url(#globeClip)" opacity="0.85">
                    <path d="M214 247L256 216L316 227L358 266L346 313L305 337L259 326L221 287L214 247Z" fill="#EDE9FE" fillOpacity="0.22" />
                    <path d="M288 370L321 396L338 448L327 506L295 548L268 510L263 458L275 408L288 370Z" fill="#EDE9FE" fillOpacity="0.18" />
                    <path d="M429 226L478 214L535 229L574 268L570 321L530 345L483 334L447 306L429 226Z" fill="#EDE9FE" fillOpacity="0.2" />
                    <path d="M503 314L553 310L599 333L618 378L603 431L563 457L521 436L501 391L503 314Z" fill="#EDE9FE" fillOpacity="0.18" />
                    <path d="M593 230L653 216L714 236L744 275L731 313L690 332L648 321L610 289L593 230Z" fill="#EDE9FE" fillOpacity="0.2" />
                    <path d="M689 463L724 457L756 474L768 506L748 530L715 521L694 500L689 463Z" fill="#EDE9FE" fillOpacity="0.18" />
                    <circle cx="430" cy="350" r="238" fill="none" stroke="rgba(255,255,255,0.08)" />
                  </g>
                </svg>

                <div className="absolute left-4 top-4 rounded-full border border-white/10 bg-black/35 px-3 py-2 text-xs font-medium text-white/70 backdrop-blur-md">
                  {pick({ zh: "Creator World Map", en: "Creator World Map" })}
                </div>
                <div className="absolute bottom-4 left-4 rounded-full border border-white/10 bg-black/35 px-3 py-2 text-xs font-medium text-white/70 backdrop-blur-md">
                  {pick({ zh: "点击国家节点进入达人库", en: "Click a node to open CRM" })}
                </div>

                {worldRegionStats.map((region) => {
                  const active = region.count > 0;
                  const size = active ? 42 + Math.round((region.count / maxRegionCount) * 10) : 34;

                  return (
                    <Link
                      key={region.code}
                      href={region.href}
                      title={`${region.code} · ${region.count} creators`}
                      className="group absolute z-10 -translate-x-1/2 -translate-y-1/2"
                      style={{ top: region.top, left: region.left }}
                    >
                      <span
                        className={[
                          "flex items-center justify-center rounded-full border text-xs font-semibold transition duration-200",
                          active
                            ? "border-white/20 bg-white text-[#111827] shadow-[0_0_0_8px_rgba(255,255,255,0.06),0_0_28px_rgba(225,48,108,0.18)] group-hover:-translate-y-0.5"
                            : "border-white/15 bg-white/12 text-white/70 group-hover:border-white/30 group-hover:bg-white/18",
                        ].join(" ")}
                        style={{
                          width: `${size}px`,
                          height: `${size}px`,
                          boxShadow: active
                            ? `0 0 0 8px rgba(255,255,255,0.06), 0 0 24px ${region.accent}55`
                            : "0 0 0 8px rgba(255,255,255,0.04)",
                        }}
                      >
                        {region.count}
                      </span>
                      <span className="pointer-events-none absolute left-1/2 top-full z-20 mt-2 -translate-x-1/2 whitespace-nowrap rounded-full border border-white/10 bg-[#0B0D1A] px-3 py-2 text-xs font-medium text-white/80 opacity-0 shadow-[0_16px_40px_rgba(0,0,0,0.35)] transition group-hover:opacity-100">
                        <span className="block text-[10px] uppercase tracking-[0.18em] text-white/40">{region.code}</span>
                        <span className="block">{region.label}</span>
                        <span className="block text-white/55">{region.count} creators</span>
                      </span>
                    </Link>
                  );
                })}
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
                      <div key={item.label} className="rounded-[22px] border border-white/10 bg-[#1B1431] px-4 py-3">
                        <p className="text-xs font-medium text-white/50">{item.label}</p>
                        <p className="mt-2 text-3xl font-semibold leading-none text-white">{item.value}</p>
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
                        zh: "半球地图、彩色节点和深色悬浮标签，让你一眼看见全球创作者分布。",
                        en: "A hemisphere-style map with colorful nodes and dark floating labels gives the dashboard a global creator network feel.",
                      })}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {[
                        pick({ zh: "国家分布", en: "Country Distribution" }),
                        pick({ zh: "已寄样", en: "Samples Sent" }),
                        pick({ zh: "全球覆盖", en: "Global Reach" }),
                      ].map((tag) => (
                        <span key={tag} className="rounded-full border border-white/10 bg-white/[0.08] px-3 py-1 text-xs font-medium text-white/75">
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
