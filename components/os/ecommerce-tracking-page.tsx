"use client";

import { Download, Plus } from "lucide-react";
import { EditableTable } from "@/components/os/editable-table";
import { useLanguage } from "@/components/os/language-context";
import { useOS } from "@/components/os/os-context";
import { PageShell } from "@/components/os/page-shell";
import { AppButton } from "@/components/os/ui/app-button";
import { AppCard } from "@/components/os/ui/app-card";
import { SectionHeader } from "@/components/os/ui/section-header";
import { getEcommerceColumns } from "@/lib/os-ui-copy";
import { copy } from "@/lib/translations";

export function EcommerceTrackingPage() {
  const os = useOS();
  const { locale, pick } = useLanguage();

  return (
    <PageShell title={copy.nav.campaigns} description={copy.pageDescription.ecommerce}>
      <AppCard className="p-5" tone="pink">
        <SectionHeader
          title={pick(copy.ecommerce.boardTitle)}
          description={pick(copy.ecommerce.boardDescription)}
          action={
            <AppButton variant="primary" iconLeft={<Plus className="h-4 w-4" />} onClick={() => os.addEcommerce()}>
              {pick(copy.actions.create)}
            </AppButton>
          }
        />
        <div className="mt-4">
          <EditableTable
            rows={os.state.ecommerceTracking}
            columns={getEcommerceColumns(locale)}
            onChange={(id, key, value) => os.updateEcommerce(id, { [key]: value } as never)}
            secondaryActions={
              <AppButton variant="secondary" iconLeft={<Download className="h-4 w-4" />}>
                {pick(copy.actions.export)}
              </AppButton>
            }
          />
        </div>
      </AppCard>
    </PageShell>
  );
}
