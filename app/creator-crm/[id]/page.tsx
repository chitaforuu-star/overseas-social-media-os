"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, MessageSquarePlus, PencilLine, WandSparkles } from "lucide-react";
import { useOS } from "@/components/os/os-context";
import { useLanguage } from "@/components/os/language-context";
import { useSupabaseAuth } from "@/components/os/supabase-auth-context";
import { useCreatorCrmSupabase } from "@/components/os/use-creator-crm-supabase";
import { PageShell } from "@/components/os/page-shell";
import { Breadcrumb } from "@/components/os/ui/breadcrumb";
import { EmptyState } from "@/components/os/ui/empty-state";
import { AppBadge } from "@/components/os/ui/app-badge";
import { AppButton } from "@/components/os/ui/app-button";
import { AppCard } from "@/components/os/ui/app-card";
import { SectionHeader } from "@/components/os/ui/section-header";
import { copy } from "@/lib/translations";

export default function CreatorCrmDetailPage() {
  const { pick } = useLanguage();
  const os = useOS();
  const auth = useSupabaseAuth();
  const crm = useCreatorCrmSupabase();
  const params = useParams<{ id: string }>();
  const creator = crm.creators.find((item) => item.id === params.id);

  const loginHref = `/auth?next=${encodeURIComponent(`/creator-crm/${params.id}`)}`;

  if (!auth.ready) {
    return (
      <PageShell
        title={pick(copy.creatorCrm.title)}
        description={pick(copy.creatorCrm.description)}
        headerAction={
          <Link href="/creator-crm">
            <AppButton variant="secondary" iconLeft={<ArrowLeft className="h-4 w-4" />}>
              {pick(copy.actions.back)}
            </AppButton>
          </Link>
        }
      >
        <Breadcrumb
          items={[
            { label: pick(copy.nav.dashboard), href: "/" },
            { label: pick(copy.nav.creatorCrm), href: "/creator-crm" },
            { label: "Creator" },
          ]}
        />
        <AppCard className="p-5">
          <EmptyState title="Loading" description="Preparing your Creator CRM session." />
        </AppCard>
      </PageShell>
    );
  }

  if (!auth.session?.user?.id) {
    return (
      <PageShell
        title={pick(copy.creatorCrm.title)}
        description={pick(copy.creatorCrm.description)}
        headerAction={
          <Link href="/creator-crm">
            <AppButton variant="secondary" iconLeft={<ArrowLeft className="h-4 w-4" />}>
              {pick(copy.actions.back)}
            </AppButton>
          </Link>
        }
      >
        <Breadcrumb
          items={[
            { label: pick(copy.nav.dashboard), href: "/" },
            { label: pick(copy.nav.creatorCrm), href: "/creator-crm" },
            { label: "Sign in" },
          ]}
        />
        <AppCard className="p-5">
          <EmptyState
            title="Sign in required"
            description="Please sign in with email and password to view creator details."
            action={
              <div className="flex flex-wrap gap-2">
                <Link href={loginHref}>
                  <AppButton variant="primary">{pick({ zh: "登录", en: "Sign in" })}</AppButton>
                </Link>
                <Link href="/auth">
                  <AppButton variant="secondary">{pick({ zh: "注册账号", en: "Create account" })}</AppButton>
                </Link>
              </div>
            }
          />
        </AppCard>
      </PageShell>
    );
  }

  if (!creator) {
    return (
      <PageShell
        title={pick(copy.creatorCrm.title)}
        description={pick(copy.creatorCrm.description)}
        headerAction={
          <Link href="/creator-crm">
            <AppButton variant="secondary" iconLeft={<ArrowLeft className="h-4 w-4" />}>
              {pick(copy.actions.back)}
            </AppButton>
          </Link>
        }
      >
        <Breadcrumb
          items={[
            { label: pick(copy.nav.dashboard), href: "/" },
            { label: pick(copy.nav.creatorCrm), href: "/creator-crm" },
            { label: "Creator" },
          ]}
        />
        <AppCard className="p-5">
          <EmptyState
            title={pick(copy.creatorCrm.emptyTitle)}
            description={pick(copy.creatorCrm.emptyDescription)}
          />
        </AppCard>
      </PageShell>
    );
  }

  const samples = os.state.samples.filter((item) => item.creatorId === creator.id);
  const contentItems = os.state.contentTracking.filter((item) => item.creatorId === creator.id);
  const performanceItems = os.state.performance.filter((item) => item.creatorId === creator.id);
  const outreachItems = os.state.outreach.filter((item) => item.creatorId === creator.id);

  return (
    <PageShell
      title={creator.creatorName || "Creator profile"}
      description={pick(copy.creatorCrm.description)}
      headerAction={
        <div className="flex flex-wrap gap-2">
          <Link href="/creator-crm">
            <AppButton variant="secondary" iconLeft={<ArrowLeft className="h-4 w-4" />}>
              {pick(copy.actions.back)}
            </AppButton>
          </Link>
          <Link href={`/creator-crm/new?id=${creator.id}`}>
            <AppButton variant="secondary" iconLeft={<PencilLine className="h-4 w-4" />}>
              {pick(copy.actions.edit)}
            </AppButton>
          </Link>
          <Link
            href={
              creator.profileLink
                ? `/creator-auditor?profile=${encodeURIComponent(creator.profileLink)}`
                : "/creator-auditor"
            }
          >
            <AppButton variant="primary" iconLeft={<WandSparkles className="h-4 w-4" />}>
              {pick(copy.creatorCrm.actions.runAudit)}
            </AppButton>
          </Link>
        </div>
      }
    >
      <Breadcrumb
        items={[
          { label: pick(copy.nav.dashboard), href: "/" },
          { label: pick(copy.nav.creatorCrm), href: "/creator-crm" },
          { label: creator.creatorName || "Creator" },
        ]}
      />

      <section className="grid gap-4 xl:grid-cols-3">
        <AppCard className="p-5 xl:col-span-2">
          <SectionHeader
            title="Creator Profile"
            description={creator.profileLink || "Profile URL pending"}
          />
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-[#E5E7EB] bg-[#FAFAFA] p-4">
              <p className="os-helper-text">Platform</p>
              <p className="mt-1 text-sm text-[#111827]">{creator.platform || "—"}</p>
            </div>
            <div className="rounded-2xl border border-[#E5E7EB] bg-[#FAFAFA] p-4">
              <p className="os-helper-text">Country / Region</p>
              <p className="mt-1 text-sm text-[#111827]">{creator.country || "—"}</p>
            </div>
            <div className="rounded-2xl border border-[#E5E7EB] bg-[#FAFAFA] p-4">
              <p className="os-helper-text">Niche</p>
              <p className="mt-1 text-sm text-[#111827]">{creator.niche || "—"}</p>
            </div>
            <div className="rounded-2xl border border-[#E5E7EB] bg-[#FAFAFA] p-4">
              <p className="os-helper-text">Language</p>
              <p className="mt-1 text-sm text-[#111827]">{creator.language || "—"}</p>
            </div>
          </div>
          <div className="mt-4 grid gap-3">
            <div className="rounded-2xl border border-[#E5E7EB] bg-white p-4">
              <p className="os-helper-text">{pick(copy.creatorCrm.table.status)}</p>
              <div className="mt-2">
                <AppBadge status={creator.status} />
              </div>
            </div>
            <div className="rounded-2xl border border-[#E5E7EB] bg-white p-4">
              <p className="os-helper-text">{pick(copy.creatorCrm.form.notes)}</p>
              <p className="mt-2 text-sm text-[#111827]">{creator.notes || "—"}</p>
            </div>
          </div>
        </AppCard>

        <AppCard className="p-5">
          <SectionHeader title="Contact Info" description="Email, WhatsApp, and social profiles." />
          <div className="mt-4 grid gap-3">
            <div className="rounded-2xl border border-[#E5E7EB] bg-[#FAFAFA] p-4">
              <p className="os-helper-text">Email</p>
              <p className="mt-1 text-sm text-[#111827]">{creator.email || "—"}</p>
            </div>
            <div className="rounded-2xl border border-[#E5E7EB] bg-[#FAFAFA] p-4">
              <p className="os-helper-text">WhatsApp / Contact</p>
              <p className="mt-1 text-sm text-[#111827]">{creator.whatsapp || "—"}</p>
            </div>
            <div className="rounded-2xl border border-[#E5E7EB] bg-[#FAFAFA] p-4">
              <p className="os-helper-text">Rate</p>
              <p className="mt-1 text-sm text-[#111827]">{creator.rate || "—"}</p>
            </div>
            <div className="rounded-2xl border border-[#E5E7EB] bg-[#FAFAFA] p-4">
              <p className="os-helper-text">Last Contact</p>
              <p className="mt-1 text-sm text-[#111827]">{creator.lastContact || "—"}</p>
            </div>
            <div className="rounded-2xl border border-[#E5E7EB] bg-[#FAFAFA] p-4">
              <p className="os-helper-text">Follow-up Date</p>
              <p className="mt-1 text-sm text-[#111827]">{creator.followUpDate || "—"}</p>
            </div>
          </div>
        </AppCard>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <AppCard className="p-5">
          <SectionHeader title="Collaboration Status" description="Target product and workflow state." />
          <div className="mt-4 grid gap-3">
            <div className="rounded-2xl border border-[#E5E7EB] bg-[#FAFAFA] p-4">
              <p className="os-helper-text">Target Product</p>
              <p className="mt-1 text-sm text-[#111827]">{creator.targetProduct || "—"}</p>
            </div>
            <div className="rounded-2xl border border-[#E5E7EB] bg-[#FAFAFA] p-4">
              <p className="os-helper-text">Collaboration Type</p>
              <p className="mt-1 text-sm text-[#111827]">{creator.collaborationType || "—"}</p>
            </div>
            <div className="rounded-2xl border border-[#E5E7EB] bg-[#FAFAFA] p-4">
              <p className="os-helper-text">Next Step</p>
              <p className="mt-1 text-sm text-[#111827]">{creator.nextStep || "—"}</p>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link href={`/outreach?creatorId=${creator.id}`}>
              <AppButton variant="primary" iconLeft={<MessageSquarePlus className="h-4 w-4" />}>
                {pick(copy.creatorCrm.actions.addOutreachNote)}
              </AppButton>
            </Link>
          </div>
        </AppCard>

        <AppCard className="p-5">
          <SectionHeader title="Sample Tracking" description="Shipping and delivery progress." />
          <div className="mt-4 space-y-3">
            {samples.length === 0 ? (
              <EmptyState title="No sample records" description="Create a sample entry when the product ships." />
            ) : (
              samples.map((sample) => (
                <div key={sample.id} className="rounded-2xl border border-[#E5E7EB] bg-[#FAFAFA] p-4">
                  <p className="os-card-title">{sample.productName || "Sample draft"}</p>
                  <p className="os-helper-text mt-1">{sample.shippingStatus || "Status pending"}</p>
                </div>
              ))
            )}
          </div>
        </AppCard>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <AppCard className="p-5">
          <SectionHeader title="Content Plan" description="Briefs, scripts, and publish links." />
          <div className="mt-4 space-y-3">
            {contentItems.length === 0 ? (
              <EmptyState title="No content plan yet" description="Add a content tracking record once the collaboration is confirmed." />
            ) : (
              contentItems.map((item) => (
                <div key={item.id} className="rounded-2xl border border-[#E5E7EB] bg-[#FAFAFA] p-4">
                  <p className="os-card-title">{item.contentBrief || "Content draft"}</p>
                  <p className="os-helper-text mt-1">{item.plannedPostDate || "Post date pending"}</p>
                </div>
              ))
            )}
          </div>
        </AppCard>

        <AppCard className="p-5">
          <SectionHeader title="Performance Review" description="Views, clicks, orders, and ROI." />
          <div className="mt-4 space-y-3">
            {performanceItems.length === 0 ? (
              <EmptyState title="No review yet" description="Log results after the post goes live." />
            ) : (
              performanceItems.map((item) => (
                <div key={item.id} className="rounded-2xl border border-[#E5E7EB] bg-[#FAFAFA] p-4">
                  <p className="os-card-title">{item.finalResult}</p>
                  <p className="os-helper-text mt-1">
                    {item.views} views · {item.orders} orders · {item.roi}
                  </p>
                </div>
              ))
            )}
          </div>
        </AppCard>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <AppCard className="p-5">
          <SectionHeader title="Outreach History" description="Emails, DMs, replies, and follow-ups." />
          <div className="mt-4 space-y-3">
            {outreachItems.length === 0 ? (
              <EmptyState title="No outreach yet" description="Use the outreach page to add the first note." />
            ) : (
              outreachItems.map((item) => (
                <div key={item.id} className="rounded-2xl border border-[#E5E7EB] bg-[#FAFAFA] p-4">
                  <p className="os-card-title">{item.contactChannel}</p>
                  <p className="os-helper-text mt-1">{item.replyStatus || "Awaiting reply"}</p>
                </div>
              ))
            )}
          </div>
        </AppCard>

        <AppCard className="p-5">
          <SectionHeader title="Quick Actions" description="Move this creator forward in the workflow." />
          <div className="mt-4 flex flex-wrap gap-2">
            <Link href={`/creator-crm/new?id=${creator.id}`}>
              <AppButton variant="secondary" iconLeft={<PencilLine className="h-4 w-4" />}>
                {pick(copy.actions.edit)}
              </AppButton>
            </Link>
            <Link
              href={
                creator.profileLink
                  ? `/creator-auditor?profile=${encodeURIComponent(creator.profileLink)}`
                  : "/creator-auditor"
              }
            >
              <AppButton variant="secondary" iconLeft={<WandSparkles className="h-4 w-4" />}>
                {pick(copy.creatorCrm.actions.runAudit)}
              </AppButton>
            </Link>
            <Link href="/outreach">
              <AppButton variant="secondary" iconLeft={<MessageSquarePlus className="h-4 w-4" />}>
                {pick(copy.creatorCrm.actions.addOutreachNote)}
              </AppButton>
            </Link>
          </div>
        </AppCard>
      </section>
    </PageShell>
  );
}
