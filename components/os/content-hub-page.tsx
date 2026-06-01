"use client";

import { EditableTable } from "@/components/os/editable-table";
import { PageShell } from "@/components/os/page-shell";
import { useOS } from "@/components/os/os-context";
import {
  calendarColumns,
  competitorColumns,
  materialColumns,
  scriptColumns,
} from "@/lib/os-ui-copy";
import { copy } from "@/lib/translations";

export function ContentHubPage() {
  const os = useOS();

  return (
    <PageShell title={copy.contentHubTitle} description={copy.contentHubDescription}>
      <div className="space-y-6">
        <section className="rounded-lg border border-[#d4dce5] bg-white p-4">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-lg font-black text-[#14253a]">
              选题素材池 / Topic Material Board
            </h3>
            <button
              type="button"
              onClick={os.addContentMaterial}
              className="rounded-md bg-[#14253a] px-3 py-2 text-sm font-semibold text-white hover:bg-[#1e3858]"
            >
              + {copy.addRowButton.zh}
            </button>
          </div>
          <EditableTable
            rows={os.state.contentMaterials}
            columns={materialColumns}
            onChange={(id, key, value) =>
              os.updateContentMaterial(id, { [key]: value } as never)
            }
          />
        </section>

        <section className="rounded-lg border border-[#d4dce5] bg-white p-4">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-lg font-black text-[#14253a]">
              竞品内容拆解 / Competitor Content Breakdown
            </h3>
            <button
              type="button"
              onClick={os.addCompetitorContent}
              className="rounded-md bg-[#14253a] px-3 py-2 text-sm font-semibold text-white hover:bg-[#1e3858]"
            >
              + {copy.addRowButton.zh}
            </button>
          </div>
          <EditableTable
            rows={os.state.competitorContent}
            columns={competitorColumns}
            onChange={(id, key, value) =>
              os.updateCompetitorContent(id, { [key]: value } as never)
            }
          />
        </section>

        <section className="rounded-lg border border-[#d4dce5] bg-white p-4">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-lg font-black text-[#14253a]">
              内容日历 / Content Calendar
            </h3>
            <button
              type="button"
              onClick={os.addContentCalendar}
              className="rounded-md bg-[#14253a] px-3 py-2 text-sm font-semibold text-white hover:bg-[#1e3858]"
            >
              + {copy.addRowButton.zh}
            </button>
          </div>
          <EditableTable
            rows={os.state.contentCalendar}
            columns={calendarColumns}
            onChange={(id, key, value) =>
              os.updateContentCalendar(id, { [key]: value } as never)
            }
          />
        </section>

        <section className="rounded-lg border border-[#d4dce5] bg-white p-4">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-lg font-black text-[#14253a]">
              脚本模板库 / Script Templates
            </h3>
            <button
              type="button"
              onClick={os.addScriptTemplate}
              className="rounded-md bg-[#14253a] px-3 py-2 text-sm font-semibold text-white hover:bg-[#1e3858]"
            >
              + {copy.addRowButton.zh}
            </button>
          </div>
          <EditableTable
            rows={os.state.scriptTemplates}
            columns={scriptColumns}
            onChange={(id, key, value) =>
              os.updateScriptTemplate(id, { [key]: value } as never)
            }
          />
        </section>
      </div>
    </PageShell>
  );
}
