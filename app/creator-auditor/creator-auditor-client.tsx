"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Plus, ScanSearch, Save } from "lucide-react";
import { useOS } from "@/components/os/os-context";
import { useLanguage } from "@/components/os/language-context";
import { PageShell } from "@/components/os/page-shell";
import { Breadcrumb } from "@/components/os/ui/breadcrumb";
import { EmptyState } from "@/components/os/ui/empty-state";
import { AppBadge } from "@/components/os/ui/app-badge";
import { AppButton } from "@/components/os/ui/app-button";
import { AppCard } from "@/components/os/ui/app-card";
import { AppInput } from "@/components/os/ui/app-input";
import { SectionHeader } from "@/components/os/ui/section-header";
import { copy } from "@/lib/translations";
import type { CreatorRecord } from "@/lib/os-types";
import { detectSocialPlatform, extractSocialHandle } from "@/lib/social-profile";

type AuditResult = {
  platform: string;
  handle: string;
  creatorName: string;
  overallScore: number;
  matchLevel: "Strong Match" | "Maybe" | "Not Fit";
  reasonSummary: string;
  audienceFit: string;
  contentFit: string;
  brandFit: string;
  riskLevel: "Low" | "Medium" | "High";
  redFlags: string[];
  suggestedCollaborationType: "Gifted" | "Paid" | "Affiliate" | "Seeding";
  suggestedOutreachAngle: string;
  nextStep: string;
  checklist: string[];
  recommendation: "Approve" | "Maybe" | "Reject";
  dataNotice: string;
};

type Props = {
  initialProfile: string | null;
};

export function CreatorAuditorClient({ initialProfile }: Props) {
  const { pick } = useLanguage();
  const os = useOS();

  const [form, setForm] = useState(() => ({
    profileUrl: initialProfile ?? "",
    targetProduct: "",
    targetMarket: "",
    brandStyle: "",
    redFlags: "",
  }));
  const [result, setResult] = useState<AuditResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");

  const parsed = useMemo(
    () => ({
      platform: detectSocialPlatform(form.profileUrl),
      handle: extractSocialHandle(form.profileUrl, detectSocialPlatform(form.profileUrl)),
    }),
    [form.profileUrl],
  );

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2400);
  };

  const runAudit = async () => {
    if (!form.profileUrl.trim()) {
      setError("Profile URL is required.");
      setResult(null);
      return;
    }

    setError("");
    setLoading(true);
    try {
      const matchedCreator = os.state.creators.find((creator) => {
        const profile = creator.profileLink.trim().toLowerCase();
        const handle = creator.handle?.trim().toLowerCase() ?? "";
        const input = form.profileUrl.trim().toLowerCase();
        return (
          profile === input ||
          input.includes(profile) ||
          (handle && input.includes(handle.replace(/^@/, ""))) ||
          (handle && input.includes(handle))
        );
      });

      const response = await fetch("/api/creators/audit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          profileUrl: form.profileUrl,
          targetProduct: form.targetProduct,
          targetMarket: form.targetMarket,
          brandStyle: form.brandStyle,
          creatorRecord: matchedCreator ?? undefined,
        }),
      });

      const payload = (await response.json()) as Partial<AuditResult> & { message?: string };
      if (!response.ok) {
        setError(payload.message || "Audit failed.");
        setResult(null);
        return;
      }

      setResult({
        platform: payload.platform ?? parsed.platform ?? "Unknown",
        handle: payload.handle ?? parsed.handle ?? "—",
        creatorName: payload.creatorName ?? "—",
        overallScore: payload.overallScore ?? 0,
        matchLevel: payload.matchLevel ?? "Maybe",
        reasonSummary: payload.reasonSummary ?? "",
        audienceFit: payload.audienceFit ?? "",
        contentFit: payload.contentFit ?? "",
        brandFit: payload.brandFit ?? "",
        riskLevel: payload.riskLevel ?? "Medium",
        redFlags: payload.redFlags ?? [],
        suggestedCollaborationType: payload.suggestedCollaborationType ?? "Gifted",
        suggestedOutreachAngle: payload.suggestedOutreachAngle ?? "",
        nextStep: payload.nextStep ?? "",
        checklist: payload.checklist ?? [],
        recommendation: payload.recommendation ?? "Maybe",
        dataNotice:
          payload.dataNotice ??
          "Missing follower, engagement, or content data. Running a basic audit.",
      });
    } catch (auditError) {
      setError(
        auditError instanceof Error ? auditError.message : "Audit failed. Please try again.",
      );
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const saveToCrm = () => {
    if (!result) return;

    const existing = os.state.creators.find((creator) => {
      const profile = creator.profileLink.trim().toLowerCase();
      const handle = creator.handle?.trim().toLowerCase() ?? "";
      const input = form.profileUrl.trim().toLowerCase();
      return (
        profile === input ||
        input.includes(profile) ||
        (handle && input.includes(handle.replace(/^@/, ""))) ||
        (handle && input.includes(handle))
      );
    });

    const notes = [
      `Audit score: ${result.overallScore}`,
      `Match level: ${result.matchLevel}`,
      `Risk: ${result.riskLevel}`,
      result.reasonSummary,
      `Recommended type: ${result.suggestedCollaborationType}`,
      result.suggestedOutreachAngle,
    ]
      .filter(Boolean)
      .join(" | ");

    const payload: Partial<CreatorRecord> = {
      creatorName: result.creatorName === "—" ? "" : result.creatorName,
      handle: result.handle === "—" ? "" : result.handle,
      platform: result.platform === "—" ? "" : result.platform,
      profileLink: form.profileUrl,
      country: form.targetMarket,
      language: "",
      niche: "",
      keyword: "",
      followers: "",
      averageViews: "",
      email: "",
      whatsapp: "",
      instagram: result.platform === "Instagram" ? form.profileUrl : "",
      tiktok: result.platform === "TikTok" ? form.profileUrl : "",
      youtube: result.platform === "YouTube" ? form.profileUrl : "",
      facebook: result.platform === "Facebook" ? form.profileUrl : "",
      status: result.matchLevel === "Strong Match" ? "approved" : "to_audit",
      rate: "",
      targetProduct: form.targetProduct,
      collaborationType: result.suggestedCollaborationType,
      nextStep: result.nextStep,
      lastContact: "",
      followUpDate: "",
      notes,
      source: "auditor",
    };

    if (existing) {
      os.updateCreator(existing.id, payload);
    } else {
      os.addCreator(payload);
    }
    showToast("Saved to Creator Database.");
  };

  return (
    <PageShell
      title={pick(copy.creatorAuditor.title)}
      description={pick(copy.creatorAuditor.description)}
      headerAction={
        <Link href="/creator-crm/new">
          <AppButton variant="primary" iconLeft={<Plus className="h-4 w-4" />}>
            {pick(copy.actions.addCreatorManually)}
          </AppButton>
        </Link>
      }
    >
      <Breadcrumb
        items={[
          { label: pick(copy.nav.dashboard), href: "/" },
          { label: pick(copy.nav.creatorAuditor) },
        ]}
      />

      {toast ? (
        <div className="fixed bottom-4 right-4 z-50 rounded-2xl border border-[#E5E7EB] bg-white px-4 py-3 text-sm text-[#111827] shadow-lg">
          {toast}
        </div>
      ) : null}

      <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <AppCard className="p-5">
          <SectionHeader
            title={pick(copy.creatorAuditor.inputTitle)}
            description={pick(copy.creatorAuditor.description)}
            action={
              <AppButton
                variant="primary"
                iconLeft={<ScanSearch className="h-4 w-4" />}
                onClick={runAudit}
                disabled={loading}
              >
                {loading ? "Running audit..." : pick(copy.actions.runAuditor)}
              </AppButton>
            }
          />

          <div className="mt-4 grid gap-3">
            <label className="space-y-1">
              <span className="os-helper-text">{pick(copy.creatorAuditor.fields.profileUrl)}</span>
              <AppInput
                value={form.profileUrl}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, profileUrl: event.target.value }))
                }
                placeholder="https://www.instagram.com/creator/"
              />
            </label>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="space-y-1">
                <span className="os-helper-text">
                  {pick(copy.creatorAuditor.fields.targetProduct)}
                </span>
                <AppInput
                  value={form.targetProduct}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, targetProduct: event.target.value }))
                  }
                  placeholder="Mirror / Wall Art / Home Decor"
                />
              </label>

              <label className="space-y-1">
                <span className="os-helper-text">
                  {pick(copy.creatorAuditor.fields.targetMarket)}
                </span>
                <AppInput
                  value={form.targetMarket}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, targetMarket: event.target.value }))
                  }
                  placeholder="US / UAE / UK"
                />
              </label>
            </div>

            <label className="space-y-1">
              <span className="os-helper-text">{pick(copy.creatorAuditor.fields.brandStyle)}</span>
              <textarea
                value={form.brandStyle}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, brandStyle: event.target.value }))
                }
                className="os-textarea"
                placeholder="Minimal, premium, calm, lifestyle-oriented"
              />
            </label>

            <label className="space-y-1">
              <span className="os-helper-text">{pick(copy.creatorAuditor.fields.redFlags)}</span>
              <textarea
                value={form.redFlags}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, redFlags: event.target.value }))
                }
                className="os-textarea"
                placeholder="Brand safety concerns, mismatched audience, spam comments..."
              />
            </label>
          </div>
        </AppCard>

        <AppCard className="p-5" tone="purple">
          <SectionHeader
            title={pick(copy.creatorAuditor.outputTitle)}
            description={pick(copy.creatorAuditor.emptyDescription)}
          />

          {error ? (
            <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          {result ? (
            <div className="mt-4 space-y-4">
              <div className="rounded-2xl border border-[#E5E7EB] bg-white p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="os-card-title">{result.creatorName || "Profile Draft"}</span>
                  <AppBadge status="to_audit" />
                </div>
                <p className="os-helper-text mt-1">
                  {result.platform}
                  {result.handle && result.handle !== "—" ? ` | ${result.handle}` : " | Handle pending"}
                </p>
                <p className="mt-2 text-sm text-[#374151]">{result.dataNotice}</p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-[#E5E7EB] bg-white p-4">
                  <p className="os-helper-text">{pick(copy.creatorAuditor.fields.fitScore)}</p>
                  <p className="mt-2 text-2xl font-semibold text-[#111827]">
                    {result.overallScore}/100
                  </p>
                </div>
                <div className="rounded-2xl border border-[#E5E7EB] bg-white p-4">
                  <p className="os-helper-text">{pick(copy.creatorAuditor.fields.recommendation)}</p>
                  <p className="mt-2 text-2xl font-semibold text-[#111827]">
                    {result.matchLevel}
                  </p>
                </div>
              </div>

              <div className="grid gap-3">
                {[
                  [pick(copy.creatorAuditor.fields.audienceMatch), result.audienceFit],
                  [pick(copy.creatorAuditor.fields.contentStyleMatch), result.contentFit],
                  [pick(copy.creatorAuditor.fields.brandSafety), result.brandFit],
                  ["Risk Level", result.riskLevel],
                  ["Reason Summary", result.reasonSummary],
                  ["Suggested Outreach Angle", result.suggestedOutreachAngle],
                  ["Suggested Collaboration Type", result.suggestedCollaborationType],
                  ["Next Step", result.nextStep],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-2xl border border-[#E5E7EB] bg-white p-4">
                    <p className="os-helper-text">{label}</p>
                    <p className="mt-1 text-sm text-[#111827]">{String(value)}</p>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl border border-[#E5E7EB] bg-white p-4">
                <p className="os-helper-text">Red Flags</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {result.redFlags.length > 0 ? (
                    result.redFlags.map((flag) => (
                      <span key={flag} className="os-mini-tag">
                        {flag}
                      </span>
                    ))
                  ) : (
                    <span className="os-helper-text">—</span>
                  )}
                </div>
              </div>

              <div className="rounded-2xl border border-[#E5E7EB] bg-white p-4">
                <p className="os-helper-text">Checklist</p>
                <div className="mt-2 space-y-2">
                  {result.checklist.map((item) => (
                    <div key={item} className="flex items-center gap-2 text-sm text-[#111827]">
                      <CheckMark />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <AppButton variant="primary" iconLeft={<Save className="h-4 w-4" />} onClick={saveToCrm}>
                  {pick(copy.actions.saveToCrm)}
                </AppButton>
                <Link href="/dashboard/creators">
                  <AppButton variant="secondary">{pick(copy.actions.viewDetails)}</AppButton>
                </Link>
              </div>
            </div>
          ) : (
            <div className="mt-4">
              <EmptyState
                title={pick(copy.creatorAuditor.emptyTitle)}
                description={pick(copy.creatorAuditor.emptyDescription)}
              />
            </div>
          )}
        </AppCard>
      </section>
    </PageShell>
  );
}

function CheckMark() {
  return (
    <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#E1306C]/10 text-[10px] font-semibold text-[#E1306C]">
      ✓
    </span>
  );
}
