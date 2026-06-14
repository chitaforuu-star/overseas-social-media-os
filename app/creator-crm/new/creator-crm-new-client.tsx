"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { useLanguage } from "@/components/os/language-context";
import { useSupabaseAuth } from "@/components/os/supabase-auth-context";
import { useCreatorCrmSupabase } from "@/components/os/use-creator-crm-supabase";
import { PageShell } from "@/components/os/page-shell";
import { Breadcrumb } from "@/components/os/ui/breadcrumb";
import { EmptyState } from "@/components/os/ui/empty-state";
import { AppButton } from "@/components/os/ui/app-button";
import { AppCard } from "@/components/os/ui/app-card";
import { AppInput } from "@/components/os/ui/app-input";
import { AppSelect } from "@/components/os/ui/app-select";
import { SectionHeader } from "@/components/os/ui/section-header";
import { copy } from "@/lib/translations";
import type { CreatorRecord, CreatorStatus, CollaborationType } from "@/lib/os-types";

const statusOptions: CreatorStatus[] = [
  "new",
  "to_audit",
  "approved",
  "contacted",
  "replied",
  "sample_sent",
  "content_scheduled",
  "posted",
  "reviewed",
];

const collaborationOptions: CollaborationType[] = ["Gifted", "Paid", "Affiliate", "Seeding"];

function emptyCreator(): CreatorRecord {
  return {
    id: "",
    creatorName: "",
    platform: "",
    profileLink: "",
    country: "",
    language: "",
    niche: "",
    keyword: "",
    followers: "",
    averageViews: "",
    email: "",
    whatsapp: "",
    instagram: "",
    tiktok: "",
    youtube: "",
    facebook: "",
    status: "new",
    rate: "",
    targetProduct: "",
    collaborationType: "",
    nextStep: "",
    lastContact: "",
    followUpDate: "",
    notes: "",
    source: "manual",
  };
}

type Props = {
  initialCreatorId: string | null;
};

export function CreatorCrmNewClient({ initialCreatorId }: Props) {
  const { pick } = useLanguage();
  const auth = useSupabaseAuth();
  const crm = useCreatorCrmSupabase();
  const router = useRouter();

  const existingCreator = useMemo(
    () => crm.creators.find((item) => item.id === initialCreatorId) ?? null,
    [initialCreatorId, crm.creators],
  );

  const [form, setForm] = useState<CreatorRecord>(emptyCreator);

  const isEditing = Boolean(existingCreator);

  useEffect(() => {
    if (existingCreator) {
      queueMicrotask(() => {
        setForm({ ...emptyCreator(), ...existingCreator });
      });
      return;
    }
    if (!initialCreatorId) {
      queueMicrotask(() => {
        setForm(emptyCreator());
      });
    }
  }, [existingCreator, initialCreatorId]);

  const handleSave = async () => {
    if (!auth.session?.user?.id) {
      return;
    }

    const saved = await crm.saveCreator({
      ...form,
      id: existingCreator?.id ?? initialCreatorId ?? form.id ?? "",
      source: "manual",
    });
    router.push(`/creator-crm/${saved.id}`);
  };

  const loginHref = `/auth?next=${encodeURIComponent(
    `/creator-crm/new${initialCreatorId ? `?id=${encodeURIComponent(initialCreatorId)}` : ""}`,
  )}`;

  const setField = <K extends keyof CreatorRecord>(key: K, value: CreatorRecord[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <PageShell
      title={isEditing ? `${pick(copy.creatorCrm.actions.editCreator)}` : pick(copy.actions.addCreator)}
      description={pick(copy.creatorCrm.description)}
      headerAction={
        <div className="flex flex-wrap gap-2">
          <Link href="/creator-crm">
            <AppButton variant="secondary" iconLeft={<ArrowLeft className="h-4 w-4" />}>
              {pick(copy.actions.back)}
            </AppButton>
          </Link>
          {auth.session?.user?.id ? (
            <AppButton
              variant="secondary"
              onClick={async () => {
                await auth.signOut();
              }}
            >
              {pick({ zh: "退出登录", en: "Sign out" })}
            </AppButton>
          ) : (
            <Link href={loginHref}>
              <AppButton variant="primary">{pick({ zh: "登录", en: "Sign in" })}</AppButton>
            </Link>
          )}
        </div>
      }
    >
      <Breadcrumb
        items={[
          { label: pick(copy.nav.dashboard), href: "/" },
          { label: pick(copy.nav.creatorCrm), href: "/creator-crm" },
          { label: isEditing ? pick(copy.creatorCrm.actions.editCreator) : pick(copy.actions.addCreator) },
        ]}
      />

      {!auth.ready ? (
        <AppCard className="p-5">
          <EmptyState title="Loading" description="Preparing your Creator CRM session." />
        </AppCard>
      ) : !auth.session?.user?.id ? (
        <AppCard className="p-5">
          <EmptyState
            title="Sign in required"
            description="Please sign in with email and password to create or edit creators."
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
      ) : (
        <>
      <section className="grid gap-4 xl:grid-cols-2">
        <AppCard className="p-5">
          <SectionHeader
            title={pick(copy.creatorCrm.form.basicInfo)}
            description={pick(copy.creatorCrm.form.creatorName)}
          />
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <label className="space-y-1 sm:col-span-2">
              <span className="os-helper-text">{pick(copy.creatorCrm.form.creatorName)}</span>
              <AppInput
                value={form.creatorName}
                onChange={(event) => setField("creatorName", event.target.value)}
                placeholder="Creator name"
              />
            </label>
            <label className="space-y-1">
              <span className="os-helper-text">{pick(copy.creatorCrm.form.platform)}</span>
              <AppInput
                value={form.platform}
                onChange={(event) => setField("platform", event.target.value)}
                placeholder="TikTok / Instagram / YouTube / Facebook"
              />
            </label>
            <label className="space-y-1">
              <span className="os-helper-text">{pick(copy.creatorCrm.form.profileUrl)}</span>
              <AppInput
                value={form.profileLink}
                onChange={(event) => setField("profileLink", event.target.value)}
                placeholder="https://..."
              />
            </label>
            <label className="space-y-1">
              <span className="os-helper-text">{pick(copy.creatorCrm.form.country)}</span>
              <AppInput
                value={form.country}
                onChange={(event) => setField("country", event.target.value)}
                placeholder="US / UAE / UK"
              />
            </label>
            <label className="space-y-1">
              <span className="os-helper-text">{pick(copy.creatorCrm.form.language)}</span>
              <AppInput
                value={form.language ?? ""}
                onChange={(event) => setField("language", event.target.value)}
                placeholder="English / Arabic"
              />
            </label>
            <label className="space-y-1">
              <span className="os-helper-text">{pick(copy.creatorCrm.form.niche)}</span>
              <AppInput
                value={form.niche}
                onChange={(event) => setField("niche", event.target.value)}
                placeholder="Home decor / Beauty / Tech"
              />
            </label>
            <label className="space-y-1">
              <span className="os-helper-text">{pick(copy.creatorCrm.form.followers)}</span>
              <AppInput
                value={form.followers}
                onChange={(event) => setField("followers", event.target.value)}
                placeholder="12.4K"
              />
            </label>
            <label className="space-y-1">
              <span className="os-helper-text">{pick(copy.creatorCrm.form.averageViews)}</span>
              <AppInput
                value={form.averageViews}
                onChange={(event) => setField("averageViews", event.target.value)}
                placeholder="3.2K"
              />
            </label>
            <label className="space-y-1">
              <span className="os-helper-text">{pick(copy.creatorCrm.form.email)}</span>
              <AppInput
                value={form.email}
                onChange={(event) => setField("email", event.target.value)}
                placeholder="creator@email.com"
              />
            </label>
            <label className="space-y-1">
              <span className="os-helper-text">{pick(copy.creatorCrm.form.whatsapp)}</span>
              <AppInput
                value={form.whatsapp ?? ""}
                onChange={(event) => setField("whatsapp", event.target.value)}
                placeholder="+1 555 000 0000"
              />
            </label>
            <label className="space-y-1">
              <span className="os-helper-text">{pick(copy.creatorCrm.form.rate)}</span>
              <AppInput
                value={form.rate}
                onChange={(event) => setField("rate", event.target.value)}
                placeholder="Affiliate 15% / Paid $200"
              />
            </label>
            <label className="space-y-1 sm:col-span-2">
              <span className="os-helper-text">{pick(copy.creatorCrm.form.notes)}</span>
              <textarea
                value={form.notes}
                onChange={(event) => setField("notes", event.target.value)}
                className="os-textarea"
                placeholder="Notes on fit, audience, and content style"
              />
            </label>
          </div>
        </AppCard>

        <AppCard className="p-5" tone="purple">
          <SectionHeader
            title={pick(copy.creatorCrm.form.collaborationInfo)}
            description={pick(copy.creatorCrm.form.targetProduct)}
          />
          <div className="mt-4 grid gap-3">
            <label className="space-y-1">
              <span className="os-helper-text">{pick(copy.creatorCrm.form.targetProduct)}</span>
              <AppInput
                value={form.targetProduct ?? ""}
                onChange={(event) => setField("targetProduct", event.target.value)}
                placeholder="Mirror / Wall Art / Home Decor"
              />
            </label>
            <label className="space-y-1">
              <span className="os-helper-text">{pick(copy.creatorCrm.form.collaborationType)}</span>
              <AppSelect
                value={form.collaborationType ?? ""}
                onChange={(event) =>
                  setField("collaborationType", event.target.value as CollaborationType)
                }
              >
                <option value="">{pick(copy.common.all)}</option>
                {collaborationOptions.map((option) => (
                  <option key={option} value={option}>
                    {pick(copy.collaborationType[option])}
                  </option>
                ))}
              </AppSelect>
            </label>
            <label className="space-y-1">
              <span className="os-helper-text">{pick(copy.creatorCrm.form.currentStatus)}</span>
              <AppSelect
                value={form.status}
                onChange={(event) => setField("status", event.target.value as CreatorStatus)}
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {pick(copy.status[status])}
                  </option>
                ))}
              </AppSelect>
            </label>
            <label className="space-y-1">
              <span className="os-helper-text">{pick(copy.creatorCrm.form.nextStep)}</span>
              <AppInput
                value={form.nextStep}
                onChange={(event) => setField("nextStep", event.target.value)}
                placeholder="Run audit / outreach / sample"
              />
            </label>
            <label className="space-y-1">
              <span className="os-helper-text">{pick(copy.creatorCrm.form.followUpDate)}</span>
              <AppInput
                type="date"
                value={form.followUpDate ?? ""}
                onChange={(event) => setField("followUpDate", event.target.value)}
              />
            </label>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            <AppButton variant="primary" iconLeft={<Save className="h-4 w-4" />} onClick={handleSave}>
              {isEditing ? pick(copy.actions.save) : pick(copy.creatorCrm.actions.saveCreator)}
            </AppButton>
            <Link href="/creator-crm">
              <AppButton variant="secondary">{pick(copy.actions.back)}</AppButton>
            </Link>
          </div>
        </AppCard>
      </section>
        </>
      )}
    </PageShell>
  );
}
