"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Plus, Save, Trash2 } from "lucide-react";
import { useOS } from "@/components/os/os-context";
import { useLanguage } from "@/components/os/language-context";
import { PageShell } from "@/components/os/page-shell";
import { Breadcrumb } from "@/components/os/ui/breadcrumb";
import { EmptyState } from "@/components/os/ui/empty-state";
import { AppButton } from "@/components/os/ui/app-button";
import { AppCard } from "@/components/os/ui/app-card";
import { AppInput } from "@/components/os/ui/app-input";
import { AppSelect } from "@/components/os/ui/app-select";
import { SectionHeader } from "@/components/os/ui/section-header";
import { copy } from "@/lib/translations";

const statusOptions = [
  "Draft",
  "Sent",
  "Follow-up 1",
  "Follow-up 2",
  "Replied",
  "No Response",
  "Closed",
] as const;

type Props = {
  initialCreatorId: string | null;
};

export function OutreachClient({ initialCreatorId }: Props) {
  const { pick } = useLanguage();
  const os = useOS();
  const prefillCreator = useMemo(
    () => os.state.creators.find((item) => item.id === initialCreatorId),
    [initialCreatorId, os.state.creators],
  );

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [form, setForm] = useState(() => ({
    creatorName: prefillCreator?.creatorName ?? "",
    platform: prefillCreator?.platform ?? "",
    email: prefillCreator?.email ?? "",
    dateContacted: "",
    followUpDate: "",
    templateUsed: "",
    status: "Draft" as (typeof statusOptions)[number],
    reply: "",
  }));

  const selectedRecord = useMemo(
    () => os.state.outreach.find((item) => item.id === selectedId) ?? null,
    [os.state.outreach, selectedId],
  );

  const resetForm = () => {
    setForm({
      creatorName: prefillCreator?.creatorName ?? "",
      platform: prefillCreator?.platform ?? "",
      email: prefillCreator?.email ?? "",
      dateContacted: "",
      followUpDate: "",
      templateUsed: "",
      status: "Draft",
      reply: "",
    });
    setSelectedId(null);
  };

  const saveNote = () => {
    const payload = {
      creatorId: initialCreatorId ?? "",
      creatorName: form.creatorName,
      platform: form.platform,
      email: form.email,
      dateContacted: form.dateContacted,
      followUpDate: form.followUpDate,
      templateUsed: form.templateUsed,
      status: form.status,
      reply: form.reply,
      contactChannel: "Email" as const,
      firstContactDate: form.dateContacted,
      messageTemplate: form.templateUsed,
      followUp1Date: form.followUpDate,
      followUp2Date: "",
      replyStatus: form.status,
      collaborationInterest: "",
      notes: form.reply,
    };

    if (selectedRecord) {
      os.updateOutreach(selectedRecord.id, payload);
    } else {
      os.addOutreach(payload);
    }
    resetForm();
  };

  const startEdit = (item: (typeof os.state.outreach)[number]) => {
    setSelectedId(item.id);
    setForm({
      creatorName: item.creatorName ?? "",
      platform: item.platform ?? "",
      email: item.email ?? "",
      dateContacted: item.dateContacted ?? item.firstContactDate ?? "",
      followUpDate: item.followUpDate ?? item.followUp1Date ?? "",
      templateUsed: item.templateUsed ?? item.messageTemplate ?? "",
      status: item.status ?? "Draft",
      reply: item.reply ?? item.replyStatus ?? "",
    });
  };

  const deleteRecord = (id: string) => {
    os.replaceState({
      ...os.state,
      outreach: os.state.outreach.filter((item) => item.id !== id),
    });
    if (selectedId === id) resetForm();
  };

  return (
    <PageShell
      title={pick(copy.outreach.title)}
      description={pick(copy.outreach.description)}
      headerAction={
        <Link href="/creator-crm">
          <AppButton variant="secondary">{pick(copy.nav.creatorCrm)}</AppButton>
        </Link>
      }
    >
      <Breadcrumb
        items={[
          { label: pick(copy.nav.dashboard), href: "/" },
          { label: pick(copy.nav.outreach) },
        ]}
      />

      <section className="grid gap-4 xl:grid-cols-[1fr_0.9fr]">
        <AppCard className="p-5">
          <SectionHeader
            title={pick(copy.creatorCrm.actions.addOutreachNote)}
            description={pick(copy.outreach.description)}
            action={
              <AppButton variant="primary" iconLeft={<Save className="h-4 w-4" />} onClick={saveNote}>
                {pick(copy.actions.save)}
              </AppButton>
            }
          />
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <label className="space-y-1 sm:col-span-2">
              <span className="os-helper-text">Creator Name</span>
              <AppInput
                value={form.creatorName}
                onChange={(event) => setForm((prev) => ({ ...prev, creatorName: event.target.value }))}
              />
            </label>
            <label className="space-y-1">
              <span className="os-helper-text">Platform</span>
              <AppInput
                value={form.platform}
                onChange={(event) => setForm((prev) => ({ ...prev, platform: event.target.value }))}
              />
            </label>
            <label className="space-y-1">
              <span className="os-helper-text">Email</span>
              <AppInput
                value={form.email}
                onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
              />
            </label>
            <label className="space-y-1">
              <span className="os-helper-text">Date Contacted</span>
              <AppInput
                type="date"
                value={form.dateContacted}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, dateContacted: event.target.value }))
                }
              />
            </label>
            <label className="space-y-1">
              <span className="os-helper-text">Follow-up Date</span>
              <AppInput
                type="date"
                value={form.followUpDate}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, followUpDate: event.target.value }))
                }
              />
            </label>
            <label className="space-y-1">
              <span className="os-helper-text">Status</span>
              <AppSelect
                value={form.status}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, status: event.target.value as (typeof statusOptions)[number] }))
                }
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </AppSelect>
            </label>
          </div>
          <label className="mt-3 block space-y-1">
            <span className="os-helper-text">Template Used</span>
            <textarea
              className="os-textarea"
              value={form.templateUsed}
              onChange={(event) => setForm((prev) => ({ ...prev, templateUsed: event.target.value }))}
            />
          </label>
          <label className="mt-3 block space-y-1">
            <span className="os-helper-text">Reply</span>
            <textarea
              className="os-textarea"
              value={form.reply}
              onChange={(event) => setForm((prev) => ({ ...prev, reply: event.target.value }))}
            />
          </label>
        </AppCard>

        <AppCard className="p-5" tone="purple">
          <SectionHeader
            title={pick(copy.outreach.title)}
            description={pick(copy.outreach.emptyDescription)}
            action={
              <Link href="/creator-crm">
                <AppButton variant="secondary" iconLeft={<Plus className="h-4 w-4" />}>
                  {pick(copy.nav.creatorCrm)}
                </AppButton>
              </Link>
            }
          />
          {os.state.outreach.length === 0 ? (
            <div className="mt-4">
              <EmptyState
                title={pick(copy.outreach.emptyTitle)}
                description={pick(copy.outreach.emptyDescription)}
              />
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              {os.state.outreach.map((item) => (
                <div key={item.id} className="rounded-2xl border border-[#E5E7EB] bg-white p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="os-card-title">{item.creatorName || "Creator"}</p>
                      <p className="os-helper-text mt-1">
                        {item.platform || "Platform"} · {item.status || "Draft"}
                      </p>
                      <p className="os-helper-text mt-1">{item.email || "—"}</p>
                    </div>
                    <div className="flex gap-2">
                      <AppButton variant="text" onClick={() => startEdit(item)}>
                        Edit
                      </AppButton>
                      <AppButton variant="text" iconLeft={<Trash2 className="h-4 w-4" />} onClick={() => deleteRecord(item.id)}>
                        Delete
                      </AppButton>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </AppCard>
      </section>
    </PageShell>
  );
}

