"use client";

import { Download, Plus } from "lucide-react";
import { EditableTable } from "@/components/os/editable-table";
import { useLanguage } from "@/components/os/language-context";
import { useOS } from "@/components/os/os-context";
import { PageShell } from "@/components/os/page-shell";
import { AppButton } from "@/components/os/ui/app-button";
import { AppCard } from "@/components/os/ui/app-card";
import { SectionHeader } from "@/components/os/ui/section-header";
import {
  getCalendarColumns,
  getCompetitorColumns,
  getMaterialColumns,
  getScriptColumns,
} from "@/lib/os-ui-copy";
import { copy } from "@/lib/translations";

export function ContentHubPage() {
  const os = useOS();
  const { locale, pick } = useLanguage();

  return (
    <PageShell title={copy.nav.contentHub} description={copy.pageDescription.contentHub}>
      <div className="space-y-5">
        <AppCard className="p-5">
          <SectionHeader
            title={pick(copy.contentHub.materialBoard.title)}
            description={pick(copy.contentHub.materialBoard.description)}
            action={
              <AppButton variant="primary" iconLeft={<Plus className="h-4 w-4" />} onClick={() => os.addContentMaterial()}>
                {pick(copy.actions.addRow)}
              </AppButton>
            }
          />
          <div className="mt-4">
            <EditableTable
              rows={os.state.contentMaterials}
              columns={getMaterialColumns(locale)}
              onChange={(id, key, value) =>
                os.updateContentMaterial(id, { [key]: value } as never)
              }
              secondaryActions={
                <AppButton variant="secondary" iconLeft={<Download className="h-4 w-4" />}>
                  {pick(copy.actions.export)}
                </AppButton>
              }
            />
          </div>
        </AppCard>

        <AppCard className="p-5">
          <SectionHeader
            title={pick(copy.contentHub.competitorBoard.title)}
            description={pick(copy.contentHub.competitorBoard.description)}
            action={
              <AppButton
                variant="primary"
                iconLeft={<Plus className="h-4 w-4" />}
                onClick={() => os.addCompetitorContent()}
              >
                {pick(copy.actions.addRow)}
              </AppButton>
            }
          />
          <div className="mt-4">
            <EditableTable
              rows={os.state.competitorContent}
              columns={getCompetitorColumns(locale)}
              onChange={(id, key, value) =>
                os.updateCompetitorContent(id, { [key]: value } as never)
              }
              secondaryActions={
                <AppButton variant="secondary" iconLeft={<Download className="h-4 w-4" />}>
                  {pick(copy.actions.export)}
                </AppButton>
              }
            />
          </div>
        </AppCard>

        <AppCard className="p-5" tone="purple">
          <SectionHeader
            title={pick(copy.contentHub.calendarBoard.title)}
            description={pick(copy.contentHub.calendarBoard.description)}
            action={
              <AppButton
                variant="primary"
                iconLeft={<Plus className="h-4 w-4" />}
                onClick={() => os.addContentCalendar()}
              >
                {pick(copy.actions.addRow)}
              </AppButton>
            }
          />
          <div className="mt-4">
            <EditableTable
              rows={os.state.contentCalendar}
              columns={getCalendarColumns(locale)}
              onChange={(id, key, value) =>
                os.updateContentCalendar(id, { [key]: value } as never)
              }
              secondaryActions={
                <AppButton variant="secondary" iconLeft={<Download className="h-4 w-4" />}>
                  {pick(copy.actions.export)}
                </AppButton>
              }
            />
          </div>
        </AppCard>

        <AppCard className="p-5">
          <SectionHeader
            title={pick(copy.contentHub.scriptBoard.title)}
            description={pick(copy.contentHub.scriptBoard.description)}
            action={
              <AppButton
                variant="primary"
                iconLeft={<Plus className="h-4 w-4" />}
                onClick={() => os.addScriptTemplate()}
              >
                {pick(copy.actions.addRow)}
              </AppButton>
            }
          />
          <div className="mt-4">
            <EditableTable
              rows={os.state.scriptTemplates}
              columns={getScriptColumns(locale)}
              onChange={(id, key, value) =>
                os.updateScriptTemplate(id, { [key]: value } as never)
              }
              secondaryActions={
                <AppButton variant="secondary" iconLeft={<Download className="h-4 w-4" />}>
                  {pick(copy.actions.export)}
                </AppButton>
              }
            />
          </div>
        </AppCard>
      </div>
    </PageShell>
  );
}
