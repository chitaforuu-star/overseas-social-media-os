"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, Download, Plus } from "lucide-react";
import { EditableTable, type Column } from "@/components/os/editable-table";
import { useLanguage } from "@/components/os/language-context";
import { useOS } from "@/components/os/os-context";
import { PageShell } from "@/components/os/page-shell";
import { AppBadge } from "@/components/os/ui/app-badge";
import { AppButton } from "@/components/os/ui/app-button";
import { AppCard } from "@/components/os/ui/app-card";
import { AppInput } from "@/components/os/ui/app-input";
import { AppSelect } from "@/components/os/ui/app-select";
import { SectionHeader } from "@/components/os/ui/section-header";
import {
  getCollaborationColumns,
  getContentTrackerColumns,
  getCreatorAuditColumns,
  getOutreachColumns,
  getPerformanceColumns,
  getSampleColumns,
} from "@/lib/os-ui-copy";
import { copy, stageOrder } from "@/lib/translations";
import type {
  CollaborationRecord,
  ContentRecord,
  CreatorAuditRecord,
  CreatorRecord,
  CreatorStageKey,
  CreatorStatus,
  OutreachRecord,
  PerformanceRecord,
  SampleRecord,
} from "@/lib/os-types";

const nextStage: Record<CreatorStageKey, CreatorStageKey | null> = {
  finder: "auditor",
  auditor: "outreach",
  outreach: "collaboration",
  collaboration: "sample",
  sample: "content",
  content: "performance",
  performance: null,
};

function StageNav({ current }: { current: CreatorStageKey }) {
  const { pick } = useLanguage();
  return (
    <AppCard className="p-3">
      <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-4">
        {stageOrder.map((stage) => (
          <Link
            key={stage}
            href={`/creator-crm/${stage}`}
            className={`rounded-xl border px-3 py-2 text-sm transition ${
              stage === current
                ? "border-[#F9D5E5] bg-[#FFF1F6] text-[#BE185D]"
                : "border-[#E5E7EB] bg-white text-[#374151] hover:bg-[#FAFAFA]"
            }`}
          >
            <p className="font-semibold">{pick(copy.creatorCrm.stageTitle[stage])}</p>
            <p className="os-helper-text mt-1">{pick(copy.creatorCrm.stageDescription[stage])}</p>
          </Link>
        ))}
      </div>
    </AppCard>
  );
}

function patchRow<Row extends { id: string }>(
  update: (id: string, patch: Partial<Row>) => void,
  id: string,
  key: keyof Row,
  value: string,
) {
  update(id, { [key]: value } as Partial<Row>);
}

function FinderBoard() {
  const { pick } = useLanguage();
  const os = useOS();

  const [query, setQuery] = useState("");
  const [platformFilter, setPlatformFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const allPlatforms = useMemo(
    () => Array.from(new Set(os.state.creators.map((item) => item.platform).filter(Boolean))),
    [os.state.creators],
  );

  const filteredRows = useMemo(() => {
    return os.state.creators.filter((row) => {
      const keyword = query.trim().toLowerCase();
      const matchKeyword =
        keyword.length === 0 ||
        [row.creatorName, row.country, row.niche, row.platform, row.keyword]
          .join(" ")
          .toLowerCase()
          .includes(keyword);
      const matchPlatform = platformFilter === "all" || row.platform === platformFilter;
      const matchStatus = statusFilter === "all" || row.status === statusFilter;
      return matchKeyword && matchPlatform && matchStatus;
    });
  }, [os.state.creators, query, platformFilter, statusFilter]);

  const columns: Column<CreatorRecord>[] = [
    {
      key: "creatorName",
      label: pick(copy.creatorCrm.table.creator),
      render: (row) => (
        <div>
          <p className="font-semibold text-[#111827]">{row.creatorName || "-"}</p>
          <p className="os-helper-text">{row.profileLink || "-"}</p>
        </div>
      ),
    },
    { key: "platform", label: pick(copy.creatorCrm.table.platform) },
    { key: "country", label: pick(copy.creatorCrm.table.country) },
    { key: "niche", label: pick(copy.creatorCrm.table.niche) },
    { key: "followers", label: pick(copy.creatorCrm.table.followers) },
    {
      key: "status",
      label: pick(copy.creatorCrm.table.status),
      render: (row) => <AppBadge status={row.status} />,
    },
    { key: "rate", label: pick(copy.creatorCrm.table.rate) },
    { key: "nextStep", label: pick(copy.creatorCrm.table.nextStep) },
  ];

  const statusOptions: CreatorStatus[] = [
    "new",
    "contacted",
    "replied",
    "sample_sent",
    "posted",
    "reviewed",
  ];

  return (
    <AppCard className="p-5">
      <SectionHeader
        title={pick(copy.creatorCrm.stageTitle.finder)}
        description={pick(copy.creatorCrm.stageDescription.finder)}
        action={
          <AppButton variant="primary" iconLeft={<Plus className="h-4 w-4" />} onClick={() => os.addCreator()}>
            {pick(copy.actions.addCreator)}
          </AppButton>
        }
      />

      <div className="mt-4 grid gap-3 lg:grid-cols-[minmax(0,1fr)_180px_200px_auto]">
        <AppInput
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={pick(copy.creatorCrm.toolbar.searchPlaceholder)}
        />
        <AppSelect
          value={platformFilter}
          onChange={(event) => setPlatformFilter(event.target.value)}
        >
          <option value="all">{pick(copy.common.all)}</option>
          {allPlatforms.map((platform) => (
            <option key={platform} value={platform}>
              {platform}
            </option>
          ))}
        </AppSelect>
        <AppSelect value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
          <option value="all">{pick(copy.common.all)}</option>
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {pick(copy.status[status])}
            </option>
          ))}
        </AppSelect>
        <AppButton variant="secondary" iconLeft={<Download className="h-4 w-4" />}>
          {pick(copy.actions.export)}
        </AppButton>
      </div>

      <div className="mt-4 os-table-wrap">
        <table className="os-table">
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={String(column.key)}>{column.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredRows.map((row) => (
              <tr key={row.id}>
                {columns.map((column) => {
                  const value = String(row[column.key] ?? "");
                  if (column.render) {
                    return <td key={String(column.key)}>{column.render(row, value)}</td>;
                  }
                  if (column.key === "status") {
                    return (
                      <td key={String(column.key)}>
                        <AppBadge status={row.status} />
                      </td>
                    );
                  }
                  return (
                    <td key={String(column.key)}>
                      <AppInput
                        value={value}
                        onChange={(event) =>
                          patchRow<CreatorRecord>(
                            os.updateCreator,
                            row.id,
                            column.key,
                            event.target.value,
                          )
                        }
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {os.state.creators.map((creator) => (
          <div key={creator.id} className="rounded-xl border border-[#E5E7EB] bg-[#FAFAFA] p-3">
            <div className="flex items-center justify-between gap-2">
              <p className="font-semibold">{creator.creatorName || "-"}</p>
              <AppBadge status={creator.status} />
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {stageOrder
                .filter((stage) => stage !== "finder")
                .map((stage) => (
                  <AppButton
                    key={stage}
                    variant="text"
                    onClick={() => os.pushCreatorToStage(creator.id, stage)}
                  >
                    {pick(copy.creatorCrm.stageTitle[stage])}
                  </AppButton>
                ))}
            </div>
          </div>
        ))}
      </div>
    </AppCard>
  );
}

export function CreatorCrmPage({ stage }: { stage: CreatorStageKey }) {
  const { locale, pick } = useLanguage();
  const os = useOS();

  return (
    <PageShell
      title={copy.creatorCrm.stageTitle[stage]}
      description={copy.creatorCrm.stageDescription[stage]}
      headerAction={
        stage === "finder" ? (
          <AppButton
            variant="primary"
            iconLeft={<Plus className="h-4 w-4" />}
            onClick={() => os.addCreator()}
          >
            {pick(copy.actions.addCreator)}
          </AppButton>
        ) : undefined
      }
    >
      <StageNav current={stage} />

      {stage === "finder" ? <FinderBoard /> : null}

      {stage === "auditor" ? (
        <AppCard className="p-5">
          <EditableTable
            rows={os.state.audits}
            columns={getCreatorAuditColumns(locale)}
            onChange={(id, key, value) =>
              patchRow<CreatorAuditRecord>(os.updateAudit, id, key, value)
            }
            searchPlaceholder={pick(copy.common.search)}
            primaryAction={
              <AppButton variant="primary" onClick={() => os.addAudit()}>
                {pick(copy.actions.addRow)}
              </AppButton>
            }
            secondaryActions={
              <AppButton variant="secondary" iconLeft={<Download className="h-4 w-4" />}>
                {pick(copy.actions.export)}
              </AppButton>
            }
          />
        </AppCard>
      ) : null}

      {stage === "outreach" ? (
        <AppCard className="p-5">
          <EditableTable
            rows={os.state.outreach}
            columns={getOutreachColumns(locale)}
            onChange={(id, key, value) =>
              patchRow<OutreachRecord>(os.updateOutreach, id, key, value)
            }
            primaryAction={
              <AppButton variant="primary" onClick={() => os.addOutreach()}>
                {pick(copy.actions.addRow)}
              </AppButton>
            }
            secondaryActions={
              <AppButton variant="secondary" iconLeft={<Download className="h-4 w-4" />}>
                {pick(copy.actions.export)}
              </AppButton>
            }
          />
        </AppCard>
      ) : null}

      {stage === "collaboration" ? (
        <AppCard className="p-5">
          <EditableTable
            rows={os.state.collaborations}
            columns={getCollaborationColumns(locale)}
            onChange={(id, key, value) =>
              patchRow<CollaborationRecord>(os.updateCollaboration, id, key, value)
            }
            primaryAction={
              <AppButton variant="primary" onClick={() => os.addCollaboration()}>
                {pick(copy.actions.create)}
              </AppButton>
            }
            secondaryActions={
              <AppButton variant="secondary" iconLeft={<Download className="h-4 w-4" />}>
                {pick(copy.actions.export)}
              </AppButton>
            }
          />
        </AppCard>
      ) : null}

      {stage === "sample" ? (
        <AppCard className="p-5">
          <EditableTable
            rows={os.state.samples}
            columns={getSampleColumns(locale)}
            onChange={(id, key, value) =>
              patchRow<SampleRecord>(os.updateSample, id, key, value)
            }
            primaryAction={
              <AppButton variant="primary" onClick={() => os.addSample()}>
                {pick(copy.actions.addRow)}
              </AppButton>
            }
            secondaryActions={
              <AppButton variant="secondary" iconLeft={<Download className="h-4 w-4" />}>
                {pick(copy.actions.export)}
              </AppButton>
            }
          />
        </AppCard>
      ) : null}

      {stage === "content" ? (
        <AppCard className="p-5">
          <EditableTable
            rows={os.state.contentTracking}
            columns={getContentTrackerColumns(locale)}
            onChange={(id, key, value) =>
              patchRow<ContentRecord>(os.updateContentTracking, id, key, value)
            }
            primaryAction={
              <AppButton variant="primary" onClick={() => os.addContentTracking()}>
                {pick(copy.actions.addRow)}
              </AppButton>
            }
            secondaryActions={
              <AppButton variant="secondary" iconLeft={<Download className="h-4 w-4" />}>
                {pick(copy.actions.export)}
              </AppButton>
            }
          />
        </AppCard>
      ) : null}

      {stage === "performance" ? (
        <AppCard className="p-5">
          <EditableTable
            rows={os.state.performance}
            columns={getPerformanceColumns(locale)}
            onChange={(id, key, value) =>
              patchRow<PerformanceRecord>(os.updatePerformance, id, key, value)
            }
            primaryAction={
              <AppButton variant="primary" onClick={() => os.addPerformance()}>
                {pick(copy.actions.addRow)}
              </AppButton>
            }
            secondaryActions={
              <AppButton variant="secondary" iconLeft={<Download className="h-4 w-4" />}>
                {pick(copy.actions.export)}
              </AppButton>
            }
          />
        </AppCard>
      ) : null}

      {nextStage[stage] ? (
        <AppCard className="p-4">
          <Link href={`/creator-crm/${nextStage[stage]}`}>
            <AppButton variant="primary" iconRight={<ArrowRight className="h-4 w-4" />}>
              {pick(copy.actions.moveNext)}
            </AppButton>
          </Link>
        </AppCard>
      ) : null}
    </PageShell>
  );
}
