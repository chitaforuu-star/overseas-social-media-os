"use client";

import { EditableTable } from "@/components/os/editable-table";
import { PageShell } from "@/components/os/page-shell";
import { useOS } from "@/components/os/os-context";
import { ecommerceColumns } from "@/lib/os-ui-copy";
import { copy } from "@/lib/translations";

export function EcommerceTrackingPage() {
  const os = useOS();

  return (
    <PageShell title={copy.ecommerceTitle} description={copy.ecommerceDescription}>
      <section className="rounded-lg border border-[#d4dce5] bg-white p-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-lg font-black text-[#14253a]">
            转化追踪台 / Conversion Tracking Board
          </h3>
          <button
            type="button"
            onClick={os.addEcommerce}
            className="rounded-md bg-[#14253a] px-3 py-2 text-sm font-semibold text-white hover:bg-[#1e3858]"
          >
            + {copy.addRowButton.zh}
          </button>
        </div>
        <EditableTable
          rows={os.state.ecommerceTracking}
          columns={ecommerceColumns}
          onChange={(id, key, value) =>
            os.updateEcommerce(id, { [key]: value } as never)
          }
        />
      </section>
    </PageShell>
  );
}
