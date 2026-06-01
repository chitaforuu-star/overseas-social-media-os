"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { createDemoState } from "@/lib/os-demo-data";
import type {
  CollaborationRecord,
  ContentRecord,
  CreatorAuditRecord,
  CreatorRecord,
  CreatorStageKey,
  EcommerceTrackingRecord,
  OSDataState,
  OutreachRecord,
  PerformanceRecord,
  SampleRecord,
} from "@/lib/os-types";

const STORAGE_KEY = "overseas_social_media_os_state_v1";

type OSContextValue = {
  state: OSDataState;
  replaceState: (next: OSDataState) => void;
  updateCreator: (id: string, patch: Partial<CreatorRecord>) => void;
  addCreator: () => void;
  updateAudit: (id: string, patch: Partial<CreatorAuditRecord>) => void;
  addAudit: () => void;
  updateOutreach: (id: string, patch: Partial<OutreachRecord>) => void;
  addOutreach: () => void;
  updateCollaboration: (
    id: string,
    patch: Partial<CollaborationRecord>,
  ) => void;
  addCollaboration: () => void;
  updateSample: (id: string, patch: Partial<SampleRecord>) => void;
  addSample: () => void;
  updateContentTracking: (id: string, patch: Partial<ContentRecord>) => void;
  addContentTracking: () => void;
  updatePerformance: (id: string, patch: Partial<PerformanceRecord>) => void;
  addPerformance: () => void;
  updateEcommerce: (
    id: string,
    patch: Partial<EcommerceTrackingRecord>,
  ) => void;
  addEcommerce: () => void;
  addContentMaterial: () => void;
  updateContentMaterial: (
    id: string,
    patch: Partial<OSDataState["contentMaterials"][number]>,
  ) => void;
  addCompetitorContent: () => void;
  updateCompetitorContent: (
    id: string,
    patch: Partial<OSDataState["competitorContent"][number]>,
  ) => void;
  addContentCalendar: () => void;
  updateContentCalendar: (
    id: string,
    patch: Partial<OSDataState["contentCalendar"][number]>,
  ) => void;
  addScriptTemplate: () => void;
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

function withCreatorDefaults(creator: CreatorRecord) {
  return {
    creatorId: creator.id,
    creatorName: creator.creatorName,
  };
}

export function OSProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<OSDataState>(() => {
    if (typeof window === "undefined") {
      return createDemoState();
    }
    const cached = window.localStorage.getItem(STORAGE_KEY);
    if (!cached) {
      return createDemoState();
    }
    try {
      return JSON.parse(cached) as OSDataState;
    } catch {
      return createDemoState();
    }
  });

  const replaceState = (next: OSDataState) => {
    setState(next);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const updateState = (updater: (prev: OSDataState) => OSDataState) => {
    setState((prev) => {
      const next = updater(prev);
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const value = useMemo<OSContextValue>(() => {
    return {
      state,
      replaceState,
      updateCreator: (id, patch) => {
        updateState((prev) => ({
          ...prev,
          creators: prev.creators.map((row) =>
            row.id === id ? { ...row, ...patch } : row,
          ),
        }));
      },
      addCreator: () => {
        updateState((prev) => ({
          ...prev,
          creators: [
            ...prev.creators,
            {
              id: uniqueId("creator"),
              platform: "",
              country: "",
              niche: "",
              keyword: "",
              creatorName: "",
              profileLink: "",
              followers: "",
              averageViews: "",
              email: "",
              instagram: "",
              tiktok: "",
              youtube: "",
              facebook: "",
              notes: "",
            },
          ],
        }));
      },
      updateAudit: (id, patch) => {
        updateState((prev) => ({
          ...prev,
          audits: prev.audits.map((row) =>
            row.id === id ? { ...row, ...patch } : row,
          ),
        }));
      },
      addAudit: () => {
        updateState((prev) => ({
          ...prev,
          audits: [
            ...prev.audits,
            {
              id: uniqueId("audit"),
              creatorId: "",
              creatorName: "",
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
        }));
      },
      updateOutreach: (id, patch) => {
        updateState((prev) => ({
          ...prev,
          outreach: prev.outreach.map((row) =>
            row.id === id ? { ...row, ...patch } : row,
          ),
        }));
      },
      addOutreach: () => {
        updateState((prev) => ({
          ...prev,
          outreach: [
            ...prev.outreach,
            {
              id: uniqueId("outreach"),
              creatorId: "",
              creatorName: "",
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
        }));
      },
      updateCollaboration: (id, patch) => {
        updateState((prev) => ({
          ...prev,
          collaborations: prev.collaborations.map((row) =>
            row.id === id ? { ...row, ...patch } : row,
          ),
        }));
      },
      addCollaboration: () => {
        updateState((prev) => ({
          ...prev,
          collaborations: [
            ...prev.collaborations,
            {
              id: uniqueId("collab"),
              creatorId: "",
              creatorName: "",
              collaborationType: "Free Product",
              fee: "",
              commissionRate: "",
              deliverables: "",
              platform: "",
              deadline: "",
              agreementStatus: "",
            },
          ],
        }));
      },
      updateSample: (id, patch) => {
        updateState((prev) => ({
          ...prev,
          samples: prev.samples.map((row) =>
            row.id === id ? { ...row, ...patch } : row,
          ),
        }));
      },
      addSample: () => {
        updateState((prev) => ({
          ...prev,
          samples: [
            ...prev.samples,
            {
              id: uniqueId("sample"),
              creatorId: "",
              creatorName: "",
              productName: "",
              sku: "",
              color: "",
              shippingAddress: "",
              phone: "",
              country: "",
              logisticsProvider: "",
              trackingNumber: "",
              shippingStatus: "",
              deliveredDate: "",
            },
          ],
        }));
      },
      updateContentTracking: (id, patch) => {
        updateState((prev) => ({
          ...prev,
          contentTracking: prev.contentTracking.map((row) =>
            row.id === id ? { ...row, ...patch } : row,
          ),
        }));
      },
      addContentTracking: () => {
        updateState((prev) => ({
          ...prev,
          contentTracking: [
            ...prev.contentTracking,
            {
              id: uniqueId("content"),
              creatorId: "",
              creatorName: "",
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
        }));
      },
      updatePerformance: (id, patch) => {
        updateState((prev) => ({
          ...prev,
          performance: prev.performance.map((row) =>
            row.id === id ? { ...row, ...patch } : row,
          ),
        }));
      },
      addPerformance: () => {
        updateState((prev) => ({
          ...prev,
          performance: [
            ...prev.performance,
            {
              id: uniqueId("perf"),
              creatorId: "",
              creatorName: "",
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
        }));
      },
      updateEcommerce: (id, patch) => {
        updateState((prev) => ({
          ...prev,
          ecommerceTracking: prev.ecommerceTracking.map((row) =>
            row.id === id ? { ...row, ...patch } : row,
          ),
        }));
      },
      addEcommerce: () => {
        updateState((prev) => ({
          ...prev,
          ecommerceTracking: [
            ...prev.ecommerceTracking,
            {
              id: uniqueId("ecommerce"),
              productName: "",
              productPageUrl: "",
              creatorName: "",
              trackingLink: "",
              discountCode: "",
              utmSource: "",
              clicks: "",
              orders: "",
              revenue: "",
              conversionRate: "",
            },
          ],
        }));
      },
      addContentMaterial: () => {
        updateState((prev) => ({
          ...prev,
          contentMaterials: [
            ...prev.contentMaterials,
            {
              id: uniqueId("material"),
              platform: "",
              topic: "",
              format: "",
              insight: "",
              status: "",
            },
          ],
        }));
      },
      updateContentMaterial: (id, patch) => {
        updateState((prev) => ({
          ...prev,
          contentMaterials: prev.contentMaterials.map((row) =>
            row.id === id ? { ...row, ...patch } : row,
          ),
        }));
      },
      addCompetitorContent: () => {
        updateState((prev) => ({
          ...prev,
          competitorContent: [
            ...prev.competitorContent,
            {
              id: uniqueId("competitor"),
              brand: "",
              platform: "",
              contentType: "",
              hook: "",
              cta: "",
              notes: "",
            },
          ],
        }));
      },
      updateCompetitorContent: (id, patch) => {
        updateState((prev) => ({
          ...prev,
          competitorContent: prev.competitorContent.map((row) =>
            row.id === id ? { ...row, ...patch } : row,
          ),
        }));
      },
      addContentCalendar: () => {
        updateState((prev) => ({
          ...prev,
          contentCalendar: [
            ...prev.contentCalendar,
            {
              id: uniqueId("calendar"),
              date: "",
              platform: "",
              campaign: "",
              scriptTemplate: "",
              owner: "",
              status: "",
            },
          ],
        }));
      },
      updateContentCalendar: (id, patch) => {
        updateState((prev) => ({
          ...prev,
          contentCalendar: prev.contentCalendar.map((row) =>
            row.id === id ? { ...row, ...patch } : row,
          ),
        }));
      },
      addScriptTemplate: () => {
        updateState((prev) => ({
          ...prev,
          scriptTemplates: [
            ...prev.scriptTemplates,
            {
              id: uniqueId("template"),
              templateName: "",
              scenario: "",
              structure: "",
              keyPrompt: "",
              notes: "",
            },
          ],
        }));
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
          if (stage === "finder") return prev;

          if (stage === "auditor") {
            const exists = prev.audits.some((row) => row.creatorId === creatorId);
            if (exists) return prev;
            return {
              ...prev,
              audits: [
                ...prev.audits,
                {
                  id: uniqueId("audit"),
                  ...withCreatorDefaults(creator),
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
            if (exists) return prev;
            return {
              ...prev,
              outreach: [
                ...prev.outreach,
                {
                  id: uniqueId("outreach"),
                  ...withCreatorDefaults(creator),
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
            const exists = prev.collaborations.some(
              (row) => row.creatorId === creatorId,
            );
            if (exists) return prev;
            return {
              ...prev,
              collaborations: [
                ...prev.collaborations,
                {
                  id: uniqueId("collab"),
                  ...withCreatorDefaults(creator),
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
            if (exists) return prev;
            return {
              ...prev,
              samples: [
                ...prev.samples,
                {
                  id: uniqueId("sample"),
                  ...withCreatorDefaults(creator),
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
            const exists = prev.contentTracking.some(
              (row) => row.creatorId === creatorId,
            );
            if (exists) return prev;
            return {
              ...prev,
              contentTracking: [
                ...prev.contentTracking,
                {
                  id: uniqueId("content"),
                  ...withCreatorDefaults(creator),
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
          if (exists) return prev;
          return {
            ...prev,
            performance: [
              ...prev.performance,
              {
                id: uniqueId("performance"),
                ...withCreatorDefaults(creator),
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
