"use client";

import type { CreatorRecord, CreatorStatus, OSDataState } from "@/lib/os-types";
import { createEmptyState } from "@/lib/os-demo-data";
import { getSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase/client";

const TABLE_NAME = "creator_crm_creators";
const OS_STORAGE_KEY = "overseas_social_media_os_state_v2";

type CreatorRow = {
  id: string;
  user_id: string;
  name: string;
  platform: string;
  country: string | null;
  niche: string | null;
  followers: number | null;
  status: CreatorStatus;
  email: string | null;
  note: string | null;
  profile_url: string | null;
  handle: string | null;
  language: string | null;
  last_contacted_at: string | null;
  next_step: string | null;
  created_at?: string;
  updated_at?: string;
};

type CreatorInput = Partial<CreatorRecord> & { id?: string };

function generateId(prefix: string) {
  const random = globalThis.crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2, 10);
  return `${prefix}-${random}`;
}

function normalizeText(value: string | undefined | null) {
  return value?.trim() ?? "";
}

function normalizeFollowers(value: string | number | undefined | null) {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : 0;
  }
  const parsed = Number(String(value ?? "").replace(/[^\d.]/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
}

function creatorRowToRecord(row: CreatorRow): CreatorRecord {
  return {
    id: row.id,
    creatorName: row.name ?? "",
    handle: row.handle ?? "",
    platform: row.platform ?? "",
    profileLink: row.profile_url ?? "",
    country: row.country ?? "",
    language: row.language ?? "",
    niche: row.niche ?? "",
    keyword: "",
    followers: row.followers ? String(row.followers) : "",
    averageViews: "",
    email: row.email ?? "",
    whatsapp: "",
    instagram: "",
    tiktok: "",
    youtube: "",
    facebook: "",
    status: row.status ?? "new",
    rate: "",
    targetProduct: "",
    collaborationType: "",
    nextStep: row.next_step ?? "",
    lastContact: row.last_contacted_at ?? "",
    followUpDate: "",
    notes: row.note ?? "",
    source: "manual",
  };
}

function recordToCreatorRow(userId: string, creator: CreatorInput): CreatorRow {
  return {
    id: creator.id?.trim() || generateId("creator"),
    user_id: userId,
    name: normalizeText(creator.creatorName),
    platform: normalizeText(creator.platform),
    country: normalizeText(creator.country) || null,
    niche: normalizeText(creator.niche) || null,
    followers: normalizeFollowers(creator.followers),
    status: creator.status ?? "new",
    email: normalizeText(creator.email) || null,
    note: normalizeText(creator.notes) || null,
    profile_url: normalizeText(creator.profileLink) || null,
    handle: normalizeText(creator.handle) || null,
    language: normalizeText(creator.language) || null,
    last_contacted_at: normalizeText(creator.lastContact) || null,
    next_step: normalizeText(creator.nextStep) || null,
  };
}

function readLocalBackupState(): OSDataState {
  if (typeof window === "undefined") {
    return createEmptyState();
  }

  const cached = window.localStorage.getItem(OS_STORAGE_KEY);
  if (!cached) {
    return createEmptyState();
  }

  try {
    const parsed = JSON.parse(cached) as Partial<OSDataState>;
    return { ...createEmptyState(), ...parsed };
  } catch {
    return createEmptyState();
  }
}

function writeLocalBackupCreators(creators: CreatorRecord[]) {
  if (typeof window === "undefined") {
    return;
  }

  const state = readLocalBackupState();
  window.localStorage.setItem(
    OS_STORAGE_KEY,
    JSON.stringify({
      ...state,
      creators,
    }),
  );
}

function readLocalBackupCreators() {
  return readLocalBackupState().creators;
}

export function isSupabaseReady() {
  return isSupabaseConfigured();
}

export async function loadCreatorCrmForUser(userId: string) {
  if (!isSupabaseConfigured()) {
    return {
      creators: [] as CreatorRecord[],
      message: "Supabase is not configured.",
    };
  }

  const supabase = getSupabaseBrowserClient();
  const { data: existingRows, error: readError } = await supabase
    .from(TABLE_NAME)
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (readError) {
    return {
      creators: [] as CreatorRecord[],
      message: readError.message,
    };
  }

  if ((existingRows?.length ?? 0) === 0) {
    const localCreators = readLocalBackupCreators();
    if (localCreators.length > 0) {
      const payload = localCreators.map((creator) => recordToCreatorRow(userId, creator));
      const { error: insertError } = await supabase.from(TABLE_NAME).upsert(payload, {
        onConflict: "id",
      });
      if (insertError) {
        return {
          creators: [],
          message: insertError.message,
        };
      }
      const { data: importedRows, error: importedError } = await supabase
        .from(TABLE_NAME)
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
      if (importedError) {
        return {
          creators: [],
          message: importedError.message,
        };
      }
      return {
        creators: (importedRows ?? []).map(creatorRowToRecord),
        message: "Imported local backup to Supabase.",
      };
    }
  }

  return {
    creators: (existingRows ?? []).map(creatorRowToRecord),
    message: null as string | null,
  };
}

export async function saveCreatorCrmRecord(userId: string, creator: CreatorInput) {
  const supabase = getSupabaseBrowserClient();
  const payload = recordToCreatorRow(userId, creator);

  const { data, error } = await supabase
    .from(TABLE_NAME)
    .upsert(payload, { onConflict: "id" })
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  const saved = creatorRowToRecord(data as CreatorRow);
  const backup = readLocalBackupState();
  const nextCreators = [...backup.creators.filter((item) => item.id !== saved.id), saved];
  writeLocalBackupCreators(nextCreators);
  return saved;
}

export async function deleteCreatorCrmRecord(userId: string, creatorId: string) {
  const supabase = getSupabaseBrowserClient();
  const { error } = await supabase.from(TABLE_NAME).delete().eq("user_id", userId).eq("id", creatorId);
  if (error) {
    throw new Error(error.message);
  }

  const backup = readLocalBackupState();
  writeLocalBackupCreators(backup.creators.filter((item) => item.id !== creatorId));
}

export async function getCreatorCrmRecord(userId: string, creatorId: string) {
  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select("*")
    .eq("user_id", userId)
    .eq("id", creatorId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data ? creatorRowToRecord(data as CreatorRow) : null;
}

