"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { useOS } from "@/components/os/os-context";
import { useLanguage } from "@/components/os/language-context";
import { PageShell } from "@/components/os/page-shell";
import { Breadcrumb } from "@/components/os/ui/breadcrumb";
import { AppButton } from "@/components/os/ui/app-button";
import { AppCard } from "@/components/os/ui/app-card";
import { AppInput } from "@/components/os/ui/app-input";
import { AppSelect } from "@/components/os/ui/app-select";
import { SectionHeader } from "@/components/os/ui/section-header";
import { copy } from "@/lib/translations";

type ContentMaterial = {
  id: string;
  platform: string;
  topic: string;
  format: string;
  insight: string;
  status: string;
};

function emptyContent(): ContentMaterial {
  return { id: "", platform: "", topic: "", format: "", insight: "", status: "" };
}

type Props = {
  initialItemId: string | null;
};

export function ContentHubNewClient({ initialItemId }: Props) {
  const { pick } = useLanguage();
  const os = useOS();
  const router = useRouter();

  const existing = useMemo(
    () => os.state.contentMaterials.find((item) => item.id === initialItemId),
    [initialItemId, os.state.contentMaterials],
  );
  const [form, setForm] = useState<ContentMaterial>(() =>
    existing ? { ...emptyContent(), ...existing } : emptyContent(),
  );

  const handleSave = () => {
    if (existing) {
      os.updateContentMaterial(existing.id, { ...form, id: existing.id });
      router.push(`/content-hub/${existing.id}`);
      return;
    }
    const id = os.addContentMaterial(form);
    router.push(`/content-hub/${id}`);
  };

  const setField = <K extends keyof ContentMaterial>(key: K, value: ContentMaterial[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <PageShell
      title={pick(copy.actions.newContent)}
      description={pick(copy.contentHub.description)}
      headerAction={
        <Link href="/content-hub">
          <AppButton variant="secondary" iconLeft={<ArrowLeft className="h-4 w-4" />}>
            {pick(copy.actions.back)}
          </AppButton>
        </Link>
      }
    >
      <Breadcrumb
        items={[
          { label: pick(copy.nav.dashboard), href: "/" },
          { label: pick(copy.nav.contentHub), href: "/content-hub" },
          { label: pick(copy.actions.newContent) },
        ]}
      />

      <AppCard className="p-5">
        <SectionHeader title={pick(copy.actions.newContent)} description={pick(copy.contentHub.description)} />
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="space-y-1">
            <span className="os-helper-text">Platform</span>
            <AppInput value={form.platform} onChange={(e) => setField("platform", e.target.value)} />
          </label>
          <label className="space-y-1">
            <span className="os-helper-text">Topic</span>
            <AppInput value={form.topic} onChange={(e) => setField("topic", e.target.value)} />
          </label>
          <label className="space-y-1">
            <span className="os-helper-text">Format</span>
            <AppInput value={form.format} onChange={(e) => setField("format", e.target.value)} />
          </label>
          <label className="space-y-1">
            <span className="os-helper-text">Status</span>
            <AppSelect value={form.status} onChange={(e) => setField("status", e.target.value)}>
              <option value="">Pending</option>
              <option value="Ready">Ready</option>
              <option value="In Progress">In Progress</option>
              <option value="Draft">Draft</option>
            </AppSelect>
          </label>
          <label className="space-y-1 sm:col-span-2">
            <span className="os-helper-text">Insight</span>
            <textarea
              className="os-textarea"
              value={form.insight}
              onChange={(e) => setField("insight", e.target.value)}
            />
          </label>
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          <AppButton variant="primary" iconLeft={<Save className="h-4 w-4" />} onClick={handleSave}>
            {pick(copy.actions.save)}
          </AppButton>
          <Link href="/content-hub">
            <AppButton variant="secondary">{pick(copy.actions.back)}</AppButton>
          </Link>
        </div>
      </AppCard>
    </PageShell>
  );
}
