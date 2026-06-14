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
    left: "25%",
    accent: "#FB7185",
  },
  {
    code: "UK",
    label: "UK",
    aliases: ["uk", "united kingdom", "great britain", "britain", "england"],
    href: "/creator-crm?country=UK",
    top: "28%",
    left: "43%",
    accent: "#8B5CF6",
  },
  {
    code: "Germany",
    label: "DE",
    aliases: ["germany", "de", "deutschland"],
    href: "/creator-crm?country=Germany",
    top: "32%",
    left: "47%",
    accent: "#22C55E",
  },
  {
    code: "Korea",
    label: "KR",
    aliases: ["korea", "south korea", "republic of korea", "kr"],
    href: "/creator-crm?country=Korea",
    top: "39%",
    left: "72%",
    accent: "#F59E0B",
  },
  {
    code: "Singapore",
    label: "SG",
    aliases: ["singapore", "sg"],
    href: "/creator-crm?country=Singapore",
    top: "61%",
    left: "69%",
    accent: "#06B6D4",
  },
  {
    code: "Malaysia",
    label: "MY",
    aliases: ["malaysia", "my"],
    href: "/creator-crm?country=Malaysia",
    top: "65%",
    left: "66%",
    accent: "#A855F7",
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
      <section className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <AppCard className="overflow-hidden border-[#D7E7F7] bg-[#F8FBFF] p-0 shadow-[0_28px_70px_rgba(15,23,42,0.06)]">
          <div className="grid gap-0 xl:grid-cols-[1.1fr_0.9fr]">
            <div className="relative min-h-[520px] overflow-hidden bg-[linear-gradient(180deg,#F6FBFF_0%,#EEF7FD_100%)] p-5 sm:p-6">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_12%,rgba(125,211,252,0.55),transparent_22%),radial-gradient(circle_at_82%_16%,rgba(167,243,208,0.34),transparent_18%),radial-gradient(circle_at_42%_86%,rgba(255,255,255,0.92),transparent_28%)]" />
              <div className="relative flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#6B7280]">
                    {pick({ zh: "全球创作者网络", en: "Global Creator Network" })}
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-[#111827] sm:text-[2rem]">
                    {pick({
                      zh: "明亮的半球地球，显示国家分布与寄样覆盖",
                      en: "A bright hemisphere map showing creator distribution and sample coverage",
                    })}
                  </h2>
                </div>
                <span className="rounded-full border border-[#D7E7F7] bg-white px-3 py-1 text-xs font-medium text-[#4B5563] shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
                  {pick({ zh: "本地数据", en: "Local data" })}
                </span>
              </div>

              <div className="relative mt-5 min-h-[420px] overflow-hidden rounded-[36px] border border-[#D8E7F4] bg-[linear-gradient(180deg,#EAF6FF_0%,#DFF1FF_46%,#CFE8FF_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
                <svg
                  viewBox="0 0 1200 760"
                  className="absolute inset-0 h-full w-full"
                  aria-hidden="true"
                >
                  <defs>
                    <radialGradient id="creator-map-atmosphere" cx="48%" cy="38%" r="66%">
                      <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
                      <stop offset="42%" stopColor="#DDF2FF" stopOpacity="0.56" />
                      <stop offset="100%" stopColor="#C8E8FF" stopOpacity="0.12" />
                    </radialGradient>
                    <radialGradient id="creator-map-ocean" cx="46%" cy="38%" r="66%">
                      <stop offset="0%" stopColor="#79D4FF" />
                      <stop offset="55%" stopColor="#4FB7F2" />
                      <stop offset="100%" stopColor="#2A8FD6" />
                    </radialGradient>
                    <radialGradient id="creator-map-land" cx="46%" cy="38%" r="70%">
                      <stop offset="0%" stopColor="#D9F7BE" />
                      <stop offset="55%" stopColor="#B9E78E" />
                      <stop offset="100%" stopColor="#7CCB66" />
                    </radialGradient>
                    <linearGradient id="creator-map-sand" x1="0%" x2="100%" y1="0%" y2="100%">
                      <stop offset="0%" stopColor="#FFF4C2" />
                      <stop offset="100%" stopColor="#F2D88D" />
                    </linearGradient>
                    <filter id="creator-map-shadow" x="-30%" y="-30%" width="160%" height="160%">
                      <feDropShadow dx="0" dy="26" stdDeviation="26" floodColor="#0F172A" floodOpacity="0.14" />
                    </filter>
                    <clipPath id="creator-earth-clip">
                      <circle cx="470" cy="365" r="268" />
                    </clipPath>
                  </defs>
                  <rect width="1200" height="760" fill="#EAF6FF" />
                  <circle cx="470" cy="365" r="312" fill="url(#creator-map-atmosphere)" />
                  <g filter="url(#creator-map-shadow)">
                    <circle cx="470" cy="365" r="268" fill="url(#creator-map-ocean)" />
                  </g>
                  <g clipPath="url(#creator-earth-clip)">
                    <path d="M164 249L214 220L281 231L330 266L322 311L279 339L229 331L182 292L164 249Z" fill="url(#creator-map-land)" />
                    <path d="M231 356L276 373L299 413L292 477L266 532L228 508L217 456L221 401L231 356Z" fill="url(#creator-map-land)" />
                    <path d="M420 203L492 187L566 205L612 244L606 288L565 310L515 300L472 271L420 203Z" fill="url(#creator-map-land)" />
                    <path d="M476 286L541 294L585 333L592 388L561 445L509 452L470 418L456 357L476 286Z" fill="url(#creator-map-sand)" fillOpacity="0.95" />
                    <path d="M598 204L681 191L747 214L785 257L782 301L744 326L697 322L653 299L598 204Z" fill="url(#creator-map-land)" />
                    <path d="M676 309L722 314L758 341L762 381L735 398L698 391L668 360L676 309Z" fill="url(#creator-map-sand)" />
                    <path d="M738 423L794 431L832 457L825 493L788 504L747 482L733 448L738 423Z" fill="url(#creator-map-land)" />
                    <path d="M331 162L385 150L438 160" stroke="rgba(255,255,255,0.35)" strokeLinecap="round" strokeWidth="4" />
                    <path d="M265 214C340 190 425 178 520 180" stroke="rgba(255,255,255,0.28)" strokeLinecap="round" strokeWidth="2" fill="none" />
                    <path d="M228 320C349 291 515 286 692 306" stroke="rgba(255,255,255,0.28)" strokeLinecap="round" strokeWidth="2" fill="none" />
                    <path d="M246 408C367 383 525 383 711 411" stroke="rgba(255,255,255,0.24)" strokeLinecap="round" strokeWidth="2" fill="none" />
                    <path d="M293 494C395 472 542 470 719 492" stroke="rgba(255,255,255,0.24)" strokeLinecap="round" strokeWidth="2" fill="none" />
                  </g>
                  <circle cx="470" cy="365" r="268" fill="none" stroke="rgba(255,255,255,0.72)" strokeWidth="2" />
                  <circle cx="470" cy="365" r="268" fill="none" stroke="rgba(20,98,165,0.16)" strokeWidth="6" />
                  <g opacity="0.42" fill="none" stroke="rgba(255,255,255,0.55)">
                    <ellipse cx="470" cy="365" rx="256" ry="80" />
                    <ellipse cx="470" cy="365" rx="256" ry="138" />
                    <ellipse cx="470" cy="365" rx="256" ry="198" />
                    <path d="M214 365H726" />
                    <path d="M238 300H706" />
                    <path d="M238 430H706" />
                    <path d="M314 205C354 282 354 448 314 525" />
                    <path d="M628 205C588 282 588 448 628 525" />
                  </g>
                </svg>

                <div className="absolute left-5 top-5 rounded-full border border-white/65 bg-white/80 px-3 py-2 text-xs font-medium text-[#334155] shadow-[0_14px_30px_rgba(15,23,42,0.08)] backdrop-blur-md">
                  {pick({ zh: "Creator World Map", en: "Creator World Map" })}
                </div>
                <div className="absolute bottom-5 left-5 rounded-full border border-white/65 bg-white/80 px-3 py-2 text-xs font-medium text-[#334155] shadow-[0_14px_30px_rgba(15,23,42,0.08)] backdrop-blur-md">
                  {pick({ zh: "点击圆点查看对应国家达人库", en: "Click a node to open the country creator list" })}
                </div>

                {worldRegionStats.map((region) => {
                  const active = region.count > 0;
                  const size = active ? 44 + Math.round((region.count / maxRegionCount) * 12) : 38;

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
                          "flex items-center justify-center rounded-full border text-sm font-semibold transition duration-200",
                          active
                            ? "border-white/80 text-white shadow-[0_0_0_10px_rgba(255,255,255,0.24),0_0_26px_rgba(59,130,246,0.2)] group-hover:-translate-y-1"
                            : "border-white/80 bg-white/65 text-[#64748B] group-hover:-translate-y-1",
                        ].join(" ")}
                        style={{
                          width: `${size}px`,
                          height: `${size}px`,
                          background: active ? region.accent : "rgba(255,255,255,0.72)",
                          boxShadow: active
                            ? `0 0 0 10px rgba(255,255,255,0.24), 0 0 24px ${region.accent}55`
                            : "0 0 0 10px rgba(255,255,255,0.18)",
                        }}
                      >
                        {region.count}
                      </span>
                      <span className="pointer-events-none absolute left-1/2 top-full z-20 mt-2 -translate-x-1/2 whitespace-nowrap rounded-full border border-[#D7E7F7] bg-[#0F172A] px-3 py-2 text-xs font-medium text-white opacity-0 shadow-[0_16px_40px_rgba(15,23,42,0.28)] transition group-hover:opacity-100">
                        <span className="block text-[10px] uppercase tracking-[0.18em] text-white/45">{region.code}</span>
                        <span className="block">{region.label}</span>
                        <span className="block text-white/70">{region.count} creators</span>
                      </span>
                    </Link>
                  );
                })}
              </div>

              <div className="space-y-3 p-5 sm:p-6">
                <div className="rounded-[28px] border border-[#D7E7F7] bg-white p-4 shadow-[0_16px_36px_rgba(15,23,42,0.05)]">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6B7280]">
                    {pick({ zh: "Summary", en: "Summary" })}
                  </p>
                  <div className="mt-4 grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
                    {[
                      { label: pick({ zh: "达人总数", en: "Creators Total" }), value: totalCreators },
                      { label: pick({ zh: "已寄样", en: "Samples Sent" }), value: samplesSentCount },
                      { label: pick({ zh: "覆盖市场", en: "Markets Covered" }), value: globalReach },
                    ].map((item) => (
                      <div key={item.label} className="rounded-[22px] border border-[#E5E7EB] bg-[#F8FBFF] px-4 py-3">
                        <p className="text-xs font-medium text-[#6B7280]">{item.label}</p>
                        <p className="mt-2 text-3xl font-semibold leading-none text-[#111827]">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-[28px] border border-[#D7E7F7] bg-white p-4 shadow-[0_16px_36px_rgba(15,23,42,0.05)]">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6B7280]">
                    {pick({ zh: "Network Notes", en: "Network Notes" })}
                  </p>
                  <div className="mt-4 space-y-3 text-sm text-[#475569]">
                    <p>
                      {pick({
                        zh: "明亮的半球地图、彩色节点和悬浮标签，让全球创作者分布一眼可见。",
                        en: "A bright hemisphere map with colorful nodes and floating labels makes global creator coverage instantly readable.",
                      })}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {[
                        pick({ zh: "国家分布", en: "Country Distribution" }),
                        pick({ zh: "已寄样", en: "Samples Sent" }),
                        pick({ zh: "全球覆盖", en: "Global Reach" }),
                      ].map((tag) => (
                        <span key={tag} className="rounded-full border border-[#D7E7F7] bg-[#F8FBFF] px-3 py-1 text-xs font-medium text-[#475569]">
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

    </PageShell>
  );
}
