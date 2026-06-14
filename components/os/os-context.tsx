"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { createEmptyState } from "@/lib/os-demo-data";
import type {
  CampaignRecord,
  CollaborationRecord,
  ContentRecord,
  CreatorAuditRecord,
  CreatorDraftRecord,
  CreatorRecord,
  CreatorStageKey,
  CreatorStatus,
  EcommerceTrackingRecord,
  OSDataState,
  OutreachRecord,
  PerformanceRecord,
  SampleRecord,
} from "@/lib/os-types";

const STORAGE_KEY = "overseas_social_media_os_state_v2";
const LEGACY_DEMO_CREATOR_IDS = new Set(["creator-anna-west", "creator-maya-studio"]);
const LEGACY_DEMO_CREATOR_NAMES = new Set(["Anna West Living", "Maya Studio Journal"]);

const stageToStatus: Record<CreatorStageKey, CreatorStatus> = {
  finder: "new",
  auditor: "to_audit",
  outreach: "contacted",
  collaboration: "replied",
  sample: "sample_sent",
  content: "content_scheduled",
  performance: "reviewed",
};

type OSContextValue = {
  state: OSDataState;
  replaceState: (next: OSDataState) => void;
  updateCreator: (id: string, patch: Partial<CreatorRecord>) => void;
  addCreator: (patch?: Partial<CreatorRecord>) => string;
  deleteCreator: (id: string) => void;
  addCreatorDraft: (patch?: Partial<CreatorDraftRecord>) => string;
  updateCreatorDraft: (id: string, patch: Partial<CreatorDraftRecord>) => void;
  deleteCreatorDraft: (id: string) => void;
  saveCreatorDraftToCRM: (draftId: string) => string | null;
  updateAudit: (id: string, patch: Partial<CreatorAuditRecord>) => void;
  addAudit: (patch?: Partial<CreatorAuditRecord>) => string;
  updateOutreach: (id: string, patch: Partial<OutreachRecord>) => void;
  addOutreach: (patch?: Partial<OutreachRecord>) => string;
  updateCollaboration: (
    id: string,
    patch: Partial<CollaborationRecord>,
  ) => void;
  addCollaboration: (patch?: Partial<CollaborationRecord>) => string;
  updateSample: (id: string, patch: Partial<SampleRecord>) => void;
  addSample: (patch?: Partial<SampleRecord>) => string;
  updateContentTracking: (id: string, patch: Partial<ContentRecord>) => void;
  addContentTracking: (patch?: Partial<ContentRecord>) => string;
  updatePerformance: (id: string, patch: Partial<PerformanceRecord>) => void;
  addPerformance: (patch?: Partial<PerformanceRecord>) => string;
  updateEcommerce: (
    id: string,
    patch: Partial<EcommerceTrackingRecord>,
  ) => void;
  addEcommerce: (patch?: Partial<EcommerceTrackingRecord>) => string;
  addCampaign: (patch?: Partial<CampaignRecord>) => string;
  updateCampaign: (id: string, patch: Partial<CampaignRecord>) => void;
  deleteCampaign: (id: string) => void;
  addContentMaterial: (
    patch?: Partial<OSDataState["contentMaterials"][number]>,
  ) => string;
  updateContentMaterial: (
    id: string,
    patch: Partial<OSDataState["contentMaterials"][number]>,
  ) => void;
  addCompetitorContent: (
    patch?: Partial<OSDataState["competitorContent"][number]>,
  ) => string;
  updateCompetitorContent: (
    id: string,
    patch: Partial<OSDataState["competitorContent"][number]>,
  ) => void;
  addContentCalendar: (
    patch?: Partial<OSDataState["contentCalendar"][number]>,
  ) => string;
  updateContentCalendar: (
    id: string,
    patch: Partial<OSDataState["contentCalendar"][number]>,
  ) => void;
  addScriptTemplate: (
    patch?: Partial<OSDataState["scriptTemplates"][number]>,
  ) => string;
  updateScriptTemplate: (
    id: string,
    patch: Partial<OSDataState["scriptTemplates"][number]>,
  ) => void;
  pushCreatorToStage: (creatorId: string, stage: CreatorStageKey) => void;
};

const OSContext = createContext<OSContextValue | null>(null);

function uniqueId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function cloneEmptyState(): OSDataState {
  return createEmptyState();
}

function normalizeCreator(
  creator: Partial<CreatorRecord> & { id?: string } = {},
): CreatorRecord {
  return {
    id: creator.id ?? uniqueId("creator"),
    creatorName: creator.creatorName ?? "",
    handle: creator.handle ?? "",
    platform: creator.platform ?? "",
    profileLink: creator.profileLink ?? "",
    country: creator.country ?? "",
    language: creator.language ?? "",
    niche: creator.niche ?? "",
    keyword: creator.keyword ?? "",
    followers: creator.followers ?? "",
    averageViews: creator.averageViews ?? "",
    email: creator.email ?? "",
    whatsapp: creator.whatsapp ?? "",
    instagram: creator.instagram ?? "",
    tiktok: creator.tiktok ?? "",
    youtube: creator.youtube ?? "",
    facebook: creator.facebook ?? "",
    status: creator.status ?? "new",
    rate: creator.rate ?? "",
    targetProduct: creator.targetProduct ?? "",
    collaborationType: creator.collaborationType ?? "",
    nextStep: creator.nextStep ?? "",
    lastContact: creator.lastContact ?? "",
    followUpDate: creator.followUpDate ?? "",
    notes: creator.notes ?? "",
    source: creator.source ?? "manual",
  };
}

function normalizeDraft(
  draft: Partial<CreatorDraftRecord> & { id?: string } = {},
): CreatorDraftRecord {
  return {
    ...normalizeCreator(draft),
    id: draft.id ?? uniqueId("draft"),
    source: draft.source ?? "manual",
    fitScore: draft.fitScore ?? "",
    audienceMatch: draft.audienceMatch ?? "",
    contentStyleMatch: draft.contentStyleMatch ?? "",
    engagementQuality: draft.engagementQuality ?? "",
    brandSafety: draft.brandSafety ?? "",
    collaborationPotential: draft.collaborationPotential ?? "",
    redFlags: draft.redFlags ?? "",
    recommendation: draft.recommendation ?? "Maybe",
    auditNotes: draft.auditNotes ?? "",
  };
}

function normalizeState(input: Partial<OSDataState> | null | undefined): OSDataState {
  const base = cloneEmptyState();
  const creators = (input?.creators ?? []).map((creator) => normalizeCreator(creator));
  const creatorDrafts = (input?.creatorDrafts ?? []).map((draft) => normalizeDraft(draft));

  const filteredCreators = creators.filter(
    (creator) =>
      !LEGACY_DEMO_CREATOR_IDS.has(creator.id) &&
      !LEGACY_DEMO_CREATOR_NAMES.has(creator.creatorName) &&
      !LEGACY_DEMO_CREATOR_NAMES.has(creator.profileLink),
  );

  const filteredDrafts = creatorDrafts.filter(
    (draft) =>
      !LEGACY_DEMO_CREATOR_IDS.has(draft.id) &&
      !LEGACY_DEMO_CREATOR_NAMES.has(draft.creatorName),
  );

  const filterByCreator = <T extends { creatorId: string; creatorName: string }>(
    rows: T[],
  ) =>
    rows.filter(
      (row) =>
        !LEGACY_DEMO_CREATOR_IDS.has(row.creatorId) &&
        !LEGACY_DEMO_CREATOR_NAMES.has(row.creatorName),
    );

  return {
    ...base,
    creators: filteredCreators,
    creatorDrafts: filteredDrafts,
    audits: filterByCreator(input?.audits ?? []),
    outreach: filterByCreator(input?.outreach ?? []),
    collaborations: filterByCreator(input?.collaborations ?? []),
    campaigns: (input?.campaigns ?? []).map((item) => ({
      id: item.id ?? uniqueId("campaign"),
      campaignName: item.campaignName ?? "",
      objective: item.objective ?? "",
      targetMarket: item.targetMarket ?? "",
      creatorName: item.creatorName ?? "",
      platform: item.platform ?? "",
      status: item.status ?? "Planned",
      startDate: item.startDate ?? "",
      endDate: item.endDate ?? "",
      budget: item.budget ?? "",
      trackingLink: item.trackingLink ?? "",
      discountCode: item.discountCode ?? "",
      notes: item.notes ?? "",
    })),
    samples: filterByCreator(input?.samples ?? []),
    contentTracking: filterByCreator(input?.contentTracking ?? []),
    performance: filterByCreator(input?.performance ?? []),
    contentMaterials: input?.contentMaterials ?? [],
    competitorContent: input?.competitorContent ?? [],
    contentCalendar: input?.contentCalendar ?? [],
    scriptTemplates: input?.scriptTemplates ?? [],
    ecommerceTracking: input?.ecommerceTracking ?? [],
  };
}

function persistState(next: OSDataState) {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

function updateArrayById<T extends { id: string }>(
  rows: T[],
  id: string,
  patch: Partial<T>,
): T[] {
  return rows.map((row) => (row.id === id ? { ...row, ...patch } : row));
}

function removeCreatorLinkedRecords(state: OSDataState, creatorId: string) {
  const creator = state.creators.find((item) => item.id === creatorId);
  return {
    ...state,
    creators: state.creators.filter((item) => item.id !== creatorId),
    creatorDrafts: state.creatorDrafts.filter((item) => item.id !== creatorId),
    audits: state.audits.filter((item) => item.creatorId !== creatorId),
    outreach: state.outreach.filter((item) => item.creatorId !== creatorId),
    collaborations: state.collaborations.filter((item) => item.creatorId !== creatorId),
    samples: state.samples.filter((item) => item.creatorId !== creatorId),
    contentTracking: state.contentTracking.filter((item) => item.creatorId !== creatorId),
    performance: state.performance.filter((item) => item.creatorId !== creatorId),
    campaigns: state.campaigns.filter((item) => item.creatorName !== creator?.creatorName),
    ecommerceTracking: state.ecommerceTracking.filter(
      (item) => item.creatorName !== creator?.creatorName,
    ),
  };
}

export function OSProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<OSDataState>(() => {
    if (typeof window === "undefined") {
      return cloneEmptyState();
    }
    const cached = window.localStorage.getItem(STORAGE_KEY);
    if (!cached) {
      return cloneEmptyState();
    }
    try {
      return normalizeState(JSON.parse(cached) as Partial<OSDataState>);
    } catch {
      return cloneEmptyState();
    }
  });

  const replaceState = (next: OSDataState) => {
    setState(next);
    persistState(next);
  };

  const updateState = (updater: (prev: OSDataState) => OSDataState) => {
    setState((prev) => {
      const next = updater(prev);
      persistState(next);
      return next;
    });
  };

  const value = useMemo<OSContextValue>(() => {
    const addCreator = (patch: Partial<CreatorRecord> = {}) => {
      const nextCreator = normalizeCreator({ ...patch, source: patch.source ?? "manual" });
      updateState((prev) => ({
        ...prev,
        creators: [...prev.creators, nextCreator],
      }));
      return nextCreator.id;
    };

    const addCreatorDraft = (patch: Partial<CreatorDraftRecord> = {}) => {
      const nextDraft = normalizeDraft({ ...patch, source: patch.source ?? "manual" });
      updateState((prev) => ({
        ...prev,
        creatorDrafts: [...prev.creatorDrafts, nextDraft],
      }));
      return nextDraft.id;
    };

    const saveCreatorDraftToCRM = (draftId: string) => {
      let savedId: string | null = null;
      updateState((prev) => {
        const draft = prev.creatorDrafts.find((item) => item.id === draftId);
        if (!draft) return prev;
        const savedCreator = normalizeCreator({
          ...draft,
          id: uniqueId("creator"),
          source: draft.source,
          status: draft.status === "to_audit" ? "to_audit" : draft.status,
        });
        savedId = savedCreator.id;
        return {
          ...prev,
          creators: [...prev.creators, savedCreator],
          creatorDrafts: prev.creatorDrafts.filter((item) => item.id !== draftId),
        };
      });
      return savedId;
    };

    const addAudit = (patch: Partial<CreatorAuditRecord> = {}) => {
      const next = {
        id: uniqueId("audit"),
        creatorId: patch.creatorId ?? "",
        creatorName: patch.creatorName ?? "",
        contentMatchScore: patch.contentMatchScore ?? "",
        engagementScore: patch.engagementScore ?? "",
        audienceMatch: patch.audienceMatch ?? "",
        commentQuality: patch.commentQuality ?? "",
        brandSafety: patch.brandSafety ?? "",
        pastSponsoredContent: patch.pastSponsoredContent ?? "",
        finalGrade: patch.finalGrade ?? "B",
        decision: patch.decision ?? "Test",
      };
      updateState((prev) => ({ ...prev, audits: [...prev.audits, next] }));
      return next.id;
    };

    const addOutreach = (patch: Partial<OutreachRecord> = {}) => {
      const next = {
        id: uniqueId("outreach"),
        creatorId: patch.creatorId ?? "",
        creatorName: patch.creatorName ?? "",
        contactChannel: patch.contactChannel ?? "Email",
        firstContactDate: patch.firstContactDate ?? "",
        messageTemplate: patch.messageTemplate ?? "",
        followUp1Date: patch.followUp1Date ?? "",
        followUp2Date: patch.followUp2Date ?? "",
        replyStatus: patch.replyStatus ?? "",
        collaborationInterest: patch.collaborationInterest ?? "",
        notes: patch.notes ?? "",
      };
      updateState((prev) => ({ ...prev, outreach: [...prev.outreach, next] }));
      return next.id;
    };

    const addCollaboration = (patch: Partial<CollaborationRecord> = {}) => {
      const next = {
        id: uniqueId("collab"),
        creatorId: patch.creatorId ?? "",
        creatorName: patch.creatorName ?? "",
        collaborationType: patch.collaborationType ?? "Free Product",
        fee: patch.fee ?? "",
        commissionRate: patch.commissionRate ?? "",
        deliverables: patch.deliverables ?? "",
        platform: patch.platform ?? "",
        deadline: patch.deadline ?? "",
        agreementStatus: patch.agreementStatus ?? "",
      };
      updateState((prev) => ({ ...prev, collaborations: [...prev.collaborations, next] }));
      return next.id;
    };

    const addSample = (patch: Partial<SampleRecord> = {}) => {
      const next = {
        id: uniqueId("sample"),
        creatorId: patch.creatorId ?? "",
        creatorName: patch.creatorName ?? "",
        productName: patch.productName ?? "",
        sku: patch.sku ?? "",
        color: patch.color ?? "",
        shippingAddress: patch.shippingAddress ?? "",
        phone: patch.phone ?? "",
        country: patch.country ?? "",
        logisticsProvider: patch.logisticsProvider ?? "",
        trackingNumber: patch.trackingNumber ?? "",
        shippingStatus: patch.shippingStatus ?? "",
        deliveredDate: patch.deliveredDate ?? "",
      };
      updateState((prev) => ({ ...prev, samples: [...prev.samples, next] }));
      return next.id;
    };

    const addContentTracking = (patch: Partial<ContentRecord> = {}) => {
      const next = {
        id: uniqueId("content"),
        creatorId: patch.creatorId ?? "",
        creatorName: patch.creatorName ?? "",
        contentBrief: patch.contentBrief ?? "",
        scriptDirection: patch.scriptDirection ?? "",
        keySellingPoints: patch.keySellingPoints ?? "",
        discountCode: patch.discountCode ?? "",
        trackingLink: patch.trackingLink ?? "",
        plannedPostDate: patch.plannedPostDate ?? "",
        actualPostDate: patch.actualPostDate ?? "",
        postLink: patch.postLink ?? "",
        tagChecked: patch.tagChecked ?? "",
        linkChecked: patch.linkChecked ?? "",
      };
      updateState((prev) => ({ ...prev, contentTracking: [...prev.contentTracking, next] }));
      return next.id;
    };

    const addPerformance = (patch: Partial<PerformanceRecord> = {}) => {
      const next = {
        id: uniqueId("perf"),
        creatorId: patch.creatorId ?? "",
        creatorName: patch.creatorName ?? "",
        views: patch.views ?? "",
        likes: patch.likes ?? "",
        comments: patch.comments ?? "",
        clicks: patch.clicks ?? "",
        orders: patch.orders ?? "",
        revenue: patch.revenue ?? "",
        conversionRate: patch.conversionRate ?? "",
        roi: patch.roi ?? "",
        finalResult: patch.finalResult ?? "Observe",
      };
      updateState((prev) => ({ ...prev, performance: [...prev.performance, next] }));
      return next.id;
    };

    const addEcommerce = (patch: Partial<EcommerceTrackingRecord> = {}) => {
      const next = {
        id: uniqueId("ecommerce"),
        productName: patch.productName ?? "",
        productPageUrl: patch.productPageUrl ?? "",
        creatorName: patch.creatorName ?? "",
        trackingLink: patch.trackingLink ?? "",
        discountCode: patch.discountCode ?? "",
        utmSource: patch.utmSource ?? "",
        clicks: patch.clicks ?? "",
        orders: patch.orders ?? "",
        revenue: patch.revenue ?? "",
        conversionRate: patch.conversionRate ?? "",
      };
      updateState((prev) => ({
        ...prev,
        ecommerceTracking: [...prev.ecommerceTracking, next],
      }));
      return next.id;
    };

    const addCampaign = (patch: Partial<CampaignRecord> = {}) => {
      const next: CampaignRecord = {
        id: uniqueId("campaign"),
        campaignName: patch.campaignName ?? "",
        objective: patch.objective ?? "",
        targetMarket: patch.targetMarket ?? "",
        creatorName: patch.creatorName ?? "",
        platform: patch.platform ?? "",
        status: patch.status ?? "Planned",
        startDate: patch.startDate ?? "",
        endDate: patch.endDate ?? "",
        budget: patch.budget ?? "",
        trackingLink: patch.trackingLink ?? "",
        discountCode: patch.discountCode ?? "",
        notes: patch.notes ?? "",
      };
      updateState((prev) => ({
        ...prev,
        campaigns: [...prev.campaigns, next],
      }));
      return next.id;
    };

    return {
      state,
      replaceState,
      updateCreator: (id, patch) => {
        updateState((prev) => ({
          ...prev,
          creators: updateArrayById(prev.creators, id, patch),
        }));
      },
      addCreator,
      deleteCreator: (id) => {
        updateState((prev) => removeCreatorLinkedRecords(prev, id));
      },
      addCreatorDraft,
      updateCreatorDraft: (id, patch) => {
        updateState((prev) => ({
          ...prev,
          creatorDrafts: updateArrayById(prev.creatorDrafts, id, patch),
        }));
      },
      deleteCreatorDraft: (id) => {
        updateState((prev) => ({
          ...prev,
          creatorDrafts: prev.creatorDrafts.filter((item) => item.id !== id),
        }));
      },
      saveCreatorDraftToCRM,
      updateAudit: (id, patch) => {
        updateState((prev) => ({
          ...prev,
          audits: updateArrayById(prev.audits, id, patch),
        }));
      },
      addAudit,
      updateOutreach: (id, patch) => {
        updateState((prev) => ({
          ...prev,
          outreach: updateArrayById(prev.outreach, id, patch),
        }));
      },
      addOutreach,
      updateCollaboration: (id, patch) => {
        updateState((prev) => ({
          ...prev,
          collaborations: updateArrayById(prev.collaborations, id, patch),
        }));
      },
      addCollaboration,
      updateSample: (id, patch) => {
        updateState((prev) => ({
          ...prev,
          samples: updateArrayById(prev.samples, id, patch),
        }));
      },
      addSample,
      updateContentTracking: (id, patch) => {
        updateState((prev) => ({
          ...prev,
          contentTracking: updateArrayById(prev.contentTracking, id, patch),
        }));
      },
      addContentTracking,
      updatePerformance: (id, patch) => {
        updateState((prev) => ({
          ...prev,
          performance: updateArrayById(prev.performance, id, patch),
        }));
      },
      addPerformance,
      updateEcommerce: (id, patch) => {
        updateState((prev) => ({
          ...prev,
          ecommerceTracking: updateArrayById(prev.ecommerceTracking, id, patch),
        }));
      },
      addEcommerce,
      addCampaign,
      updateCampaign: (id, patch) => {
        updateState((prev) => ({
          ...prev,
          campaigns: updateArrayById(prev.campaigns, id, patch),
        }));
      },
      deleteCampaign: (id) => {
        updateState((prev) => ({
          ...prev,
          campaigns: prev.campaigns.filter((item) => item.id !== id),
        }));
      },
      addContentMaterial: (patch = {}) => {
        const next = {
          id: uniqueId("material"),
          platform: patch.platform ?? "",
          topic: patch.topic ?? "",
          format: patch.format ?? "",
          insight: patch.insight ?? "",
          status: patch.status ?? "",
        };
        updateState((prev) => ({
          ...prev,
          contentMaterials: [...prev.contentMaterials, next],
        }));
        return next.id;
      },
      updateContentMaterial: (id, patch) => {
        updateState((prev) => ({
          ...prev,
          contentMaterials: prev.contentMaterials.map((row) =>
            row.id === id ? { ...row, ...patch } : row,
          ),
        }));
      },
      addCompetitorContent: (patch = {}) => {
        const next = {
          id: uniqueId("competitor"),
          brand: patch.brand ?? "",
          platform: patch.platform ?? "",
          contentType: patch.contentType ?? "",
          hook: patch.hook ?? "",
          cta: patch.cta ?? "",
          notes: patch.notes ?? "",
        };
        updateState((prev) => ({
          ...prev,
          competitorContent: [...prev.competitorContent, next],
        }));
        return next.id;
      },
      updateCompetitorContent: (id, patch) => {
        updateState((prev) => ({
          ...prev,
          competitorContent: prev.competitorContent.map((row) =>
            row.id === id ? { ...row, ...patch } : row,
          ),
        }));
      },
      addContentCalendar: (patch = {}) => {
        const next = {
          id: uniqueId("calendar"),
          date: patch.date ?? "",
          platform: patch.platform ?? "",
          campaign: patch.campaign ?? "",
          scriptTemplate: patch.scriptTemplate ?? "",
          owner: patch.owner ?? "",
          status: patch.status ?? "",
        };
        updateState((prev) => ({
          ...prev,
          contentCalendar: [...prev.contentCalendar, next],
        }));
        return next.id;
      },
      updateContentCalendar: (id, patch) => {
        updateState((prev) => ({
          ...prev,
          contentCalendar: prev.contentCalendar.map((row) =>
            row.id === id ? { ...row, ...patch } : row,
          ),
        }));
      },
      addScriptTemplate: (patch = {}) => {
        const next = {
          id: uniqueId("template"),
          templateName: patch.templateName ?? "",
          scenario: patch.scenario ?? "",
          structure: patch.structure ?? "",
          keyPrompt: patch.keyPrompt ?? "",
          notes: patch.notes ?? "",
        };
        updateState((prev) => ({
          ...prev,
          scriptTemplates: [...prev.scriptTemplates, next],
        }));
        return next.id;
      },
      updateScriptTemplate: (id, patch) => {
        updateState((prev) => ({
          ...prev,
          scriptTemplates: prev.scriptTemplates.map((row) =>
            row.id === id ? { ...row, ...patch } : row,
          ),
        }));
      },
      pushCreatorToStage: (creatorId, stage) => {
        updateState((prev) => {
          const creator = prev.creators.find((item) => item.id === creatorId);
          if (!creator) return prev;

          if (stage === "finder") {
            return {
              ...prev,
              creators: prev.creators.map((item) =>
                item.id === creatorId ? { ...item, status: "new" } : item,
              ),
            };
          }

          const nextStatus = stageToStatus[stage];
          const nextCreators = prev.creators.map((item) =>
            item.id === creatorId ? { ...item, status: nextStatus } : item,
          );

          if (stage === "auditor") {
            const exists = prev.audits.some((row) => row.creatorId === creatorId);
            return {
              ...prev,
              creators: nextCreators,
              audits: exists
                ? prev.audits
                : [
                    ...prev.audits,
                    {
                      id: uniqueId("audit"),
                      creatorId: creator.id,
                      creatorName: creator.creatorName,
                      contentMatchScore: "",
                      engagementScore: "",
                      audienceMatch: "",
                      commentQuality: "",
                      brandSafety: "",
                      pastSponsoredContent: "",
                      finalGrade: "B",
                      decision: "Test",
                    },
                  ],
            };
          }

          if (stage === "outreach") {
            const exists = prev.outreach.some((row) => row.creatorId === creatorId);
            return {
              ...prev,
              creators: nextCreators,
              outreach: exists
                ? prev.outreach
                : [
                    ...prev.outreach,
                    {
                      id: uniqueId("outreach"),
                      creatorId: creator.id,
                      creatorName: creator.creatorName,
                      contactChannel: "Email",
                      firstContactDate: "",
                      messageTemplate: "",
                      followUp1Date: "",
                      followUp2Date: "",
                      replyStatus: "",
                      collaborationInterest: "",
                      notes: "",
                    },
                  ],
            };
          }

          if (stage === "collaboration") {
            const exists = prev.collaborations.some((row) => row.creatorId === creatorId);
            return {
              ...prev,
              creators: nextCreators,
              collaborations: exists
                ? prev.collaborations
                : [
                    ...prev.collaborations,
                    {
                      id: uniqueId("collab"),
                      creatorId: creator.id,
                      creatorName: creator.creatorName,
                      collaborationType: "Free Product",
                      fee: "",
                      commissionRate: "",
                      deliverables: "",
                      platform: creator.platform,
                      deadline: "",
                      agreementStatus: "",
                    },
                  ],
            };
          }

          if (stage === "sample") {
            const exists = prev.samples.some((row) => row.creatorId === creatorId);
            return {
              ...prev,
              creators: nextCreators,
              samples: exists
                ? prev.samples
                : [
                    ...prev.samples,
                    {
                      id: uniqueId("sample"),
                      creatorId: creator.id,
                      creatorName: creator.creatorName,
                      productName: "",
                      sku: "",
                      color: "",
                      shippingAddress: "",
                      phone: "",
                      country: creator.country,
                      logisticsProvider: "",
                      trackingNumber: "",
                      shippingStatus: "",
                      deliveredDate: "",
                    },
                  ],
            };
          }

          if (stage === "content") {
            const exists = prev.contentTracking.some((row) => row.creatorId === creatorId);
            return {
              ...prev,
              creators: nextCreators,
              contentTracking: exists
                ? prev.contentTracking
                : [
                    ...prev.contentTracking,
                    {
                      id: uniqueId("content"),
                      creatorId: creator.id,
                      creatorName: creator.creatorName,
                      contentBrief: "",
                      scriptDirection: "",
                      keySellingPoints: "",
                      discountCode: "",
                      trackingLink: "",
                      plannedPostDate: "",
                      actualPostDate: "",
                      postLink: "",
                      tagChecked: "",
                      linkChecked: "",
                    },
                  ],
            };
          }

          const exists = prev.performance.some((row) => row.creatorId === creatorId);
          return {
            ...prev,
            creators: nextCreators,
            performance: exists
              ? prev.performance
              : [
                  ...prev.performance,
                  {
                    id: uniqueId("performance"),
                    creatorId: creator.id,
                    creatorName: creator.creatorName,
                    views: "",
                    likes: "",
                    comments: "",
                    clicks: "",
                    orders: "",
                    revenue: "",
                    conversionRate: "",
                    roi: "",
                    finalResult: "Observe",
                  },
                ],
          };
        });
      },
    };
  }, [state]);

  return <OSContext.Provider value={value}>{children}</OSContext.Provider>;
}

export function useOS() {
  const context = useContext(OSContext);
  if (!context) {
    throw new Error("useOS must be used inside OSProvider");
  }
  return context;
}
