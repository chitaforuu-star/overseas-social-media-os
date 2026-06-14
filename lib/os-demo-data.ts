import type { OSDataState } from "@/lib/os-types";

export function createEmptyState(): OSDataState {
  return {
    creators: [],
    creatorDrafts: [],
    audits: [],
    outreach: [],
    collaborations: [],
    campaigns: [],
    samples: [],
    contentTracking: [],
    performance: [],
    contentMaterials: [],
    competitorContent: [],
    contentCalendar: [],
    scriptTemplates: [],
    ecommerceTracking: [],
  };
}
