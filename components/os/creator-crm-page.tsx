"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { EditableTable } from "@/components/os/editable-table";
import { useLanguage } from "@/components/os/language-context";
import { useOS } from "@/components/os/os-context";
import { PageShell } from "@/components/os/page-shell";
import {
  collaborationColumns,
  contentTrackerColumns,
  creatorAuditColumns,
  creatorFinderColumns,
  outreachColumns,
  performanceColumns,
  sampleColumns,
} from "@/lib/os-ui-copy";
import { copy, stageOrder } from "@/lib/translations";
import type {
  CollaborationRecord,
  ContentRecord,
  CreatorAuditRecord,
  CreatorRecord,
  CreatorStageKey,
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
  return (
    <div className="mb-4 flex flex-wrap gap-2">
      {stageOrder.map((stage) => (
        <Link
          key={stage}
          href={`/creator-crm/${stage}`}
          className={`rounded-md px-3 py-2 text-sm font-semibold ${
            stage === current
              ? "bg-[#14253a] text-white"
              : "bg-white text-[#2f4057] hover:bg-[#edf2f7]"
          }`}
        >
          {copy.stageTitles[stage].zh} / {copy.stageTitles[stage].en}
        </Link>
      ))}
    </div>
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

export function CreatorCrmPage({ stage }: { stage: CreatorStageKey }) {
  const { dual } = useLanguage();
  const os = useOS();
  const stageTitle = dual(copy.stageTitles[stage]);
  const stageDescription = dual(copy.stageDescriptions[stage]);

  return (
    <PageShell title={copy.creatorCrmTitle} description={copy.creatorCrmDescription}>
      <StageNav current={stage} />
      <div className="mb-4 rounded-lg border border-[#d4dce5] bg-white p-4">
        <h3 className="text-lg font-black text-[#14253a]">{stageTitle.primary}</h3>
        <p className="text-sm text-[#4b5d74]">{stageTitle.secondary}</p>
        <p className="mt-2 text-sm text-[#334a66]">{stageDescription.primary}</p>
        <p className="text-sm text-[#4b5d74]">{stageDescription.secondary}</p>
      </div>

      {stage === "finder" ? (
        <section className="space-y-4">
          <div className="rounded-lg border border-[#d4dce5] bg-white p-4">
            <p className="text-sm font-semibold text-[#30445f]">
              {copy.addRowButton.zh} / {copy.addRowButton.en}
            </p>
            <button
              type="button"
              onClick={os.addCreator}
              className="mt-2 rounded-md bg-[#14253a] px-3 py-2 text-sm font-semibold text-white hover:bg-[#1e3858]"
            >
              + {copy.addRowButton.zh}
            </button>
          </div>

          <EditableTable
            rows={os.state.creators}
            columns={creatorFinderColumns}
            onChange={(id, key, value) =>
              patchRow<CreatorRecord>(os.updateCreator, id, key, value)
            }
          />

          <div className="rounded-lg border border-[#d4dce5] bg-white p-4">
            <h4 className="text-sm font-black text-[#203047]">
              Creator Flow Actions / 达人流转动作
            </h4>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {os.state.creators.map((creator) => (
                <div
                  key={creator.id}
                  className="rounded-md border border-[#dde5ee] bg-[#f9fbfd] p-3"
                >
                  <p className="text-sm font-semibold text-[#22344b]">
                    {creator.creatorName || "Unnamed Creator"}
                  </p>
                  <p className="text-xs text-[#607188]">
                    {creator.platform} · {creator.country} · {creator.niche}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {stageOrder
                      .filter((item) => item !== "finder")
                      .map((target) => (
                        <button
                          key={target}
                          type="button"
                          onClick={() => os.pushCreatorToStage(creator.id, target)}
                          className="rounded-md border border-[#ccd7e3] bg-white px-2 py-1 text-xs font-semibold text-[#2b405b] hover:bg-[#eef2f6]"
                        >
                          {copy.stageTitles[target].en}
                        </button>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {stage === "auditor" ? (
        <section className="space-y-4">
          <button
            type="button"
            onClick={os.addAudit}
            className="rounded-md bg-[#14253a] px-3 py-2 text-sm font-semibold text-white hover:bg-[#1e3858]"
          >
            + {copy.addRowButton.zh}
          </button>
          <EditableTable
            rows={os.state.audits}
            columns={creatorAuditColumns}
            onChange={(id, key, value) =>
              patchRow<CreatorAuditRecord>(os.updateAudit, id, key, value)
            }
          />
        </section>
      ) : null}

      {stage === "outreach" ? (
        <section className="space-y-4">
          <button
            type="button"
            onClick={os.addOutreach}
            className="rounded-md bg-[#14253a] px-3 py-2 text-sm font-semibold text-white hover:bg-[#1e3858]"
          >
            + {copy.addRowButton.zh}
          </button>
          <EditableTable
            rows={os.state.outreach}
            columns={outreachColumns}
            onChange={(id, key, value) =>
              patchRow<OutreachRecord>(os.updateOutreach, id, key, value)
            }
          />
        </section>
      ) : null}

      {stage === "collaboration" ? (
        <section className="space-y-4">
          <button
            type="button"
            onClick={os.addCollaboration}
            className="rounded-md bg-[#14253a] px-3 py-2 text-sm font-semibold text-white hover:bg-[#1e3858]"
          >
            + {copy.addRowButton.zh}
          </button>
          <EditableTable
            rows={os.state.collaborations}
            columns={collaborationColumns}
            onChange={(id, key, value) =>
              patchRow<CollaborationRecord>(
                os.updateCollaboration,
                id,
                key,
                value,
              )
            }
          />
        </section>
      ) : null}

      {stage === "sample" ? (
        <section className="space-y-4">
          <button
            type="button"
            onClick={os.addSample}
            className="rounded-md bg-[#14253a] px-3 py-2 text-sm font-semibold text-white hover:bg-[#1e3858]"
          >
            + {copy.addRowButton.zh}
          </button>
          <EditableTable
            rows={os.state.samples}
            columns={sampleColumns}
            onChange={(id, key, value) =>
              patchRow<SampleRecord>(os.updateSample, id, key, value)
            }
          />
        </section>
      ) : null}

      {stage === "content" ? (
        <section className="space-y-4">
          <button
            type="button"
            onClick={os.addContentTracking}
            className="rounded-md bg-[#14253a] px-3 py-2 text-sm font-semibold text-white hover:bg-[#1e3858]"
          >
            + {copy.addRowButton.zh}
          </button>
          <EditableTable
            rows={os.state.contentTracking}
            columns={contentTrackerColumns}
            onChange={(id, key, value) =>
              patchRow<ContentRecord>(os.updateContentTracking, id, key, value)
            }
          />
        </section>
      ) : null}

      {stage === "performance" ? (
        <section className="space-y-4">
          <button
            type="button"
            onClick={os.addPerformance}
            className="rounded-md bg-[#14253a] px-3 py-2 text-sm font-semibold text-white hover:bg-[#1e3858]"
          >
            + {copy.addRowButton.zh}
          </button>
          <EditableTable
            rows={os.state.performance}
            columns={performanceColumns}
            onChange={(id, key, value) =>
              patchRow<PerformanceRecord>(os.updatePerformance, id, key, value)
            }
          />
        </section>
      ) : null}

      {nextStage[stage] ? (
        <div className="mt-4 rounded-lg border border-[#d4dce5] bg-white p-4">
          <Link
            href={`/creator-crm/${nextStage[stage]}`}
            className="inline-flex items-center gap-2 rounded-md bg-[#14253a] px-3 py-2 text-sm font-semibold text-white hover:bg-[#1e3858]"
          >
            {copy.flowButton.zh}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : null}
    </PageShell>
  );
}
