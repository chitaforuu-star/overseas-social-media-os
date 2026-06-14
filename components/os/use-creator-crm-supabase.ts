"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { CreatorRecord } from "@/lib/os-types";
import {
  deleteCreatorCrmRecord,
  isSupabaseReady,
  loadCreatorCrmForUser,
  saveCreatorCrmRecord,
} from "@/lib/creator-crm-supabase";
import { useSupabaseAuth } from "@/components/os/supabase-auth-context";

export function useCreatorCrmSupabase() {
  const auth = useSupabaseAuth();
  const userId = auth.session?.user?.id ?? null;
  const [creators, setCreators] = useState<CreatorRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const reload = useCallback(async () => {
    if (!userId) {
      queueMicrotask(() => {
        setCreators([]);
        setLoading(false);
      });
      return;
    }

    setLoading(true);
    setError("");
    try {
      const result = await loadCreatorCrmForUser(userId);
      setCreators(result.creators);
      if (result.message) {
        setNotice(result.message);
      }
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Failed to load Creator CRM.");
      setCreators([]);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (!auth.ready) {
      return;
    }
    if (!userId) {
      queueMicrotask(() => {
        setCreators([]);
        setLoading(false);
      });
      return;
    }
    queueMicrotask(() => {
      void reload();
    });
  }, [auth.ready, reload, userId]);

  const saveCreator = useCallback(
    async (creator: Partial<CreatorRecord> & { id?: string }) => {
      if (!userId) {
        throw new Error("Please sign in first.");
      }
      const saved = await saveCreatorCrmRecord(userId, creator);
      setCreators((prev) => {
        const next = prev.filter((item) => item.id !== saved.id);
        next.unshift(saved);
        return next;
      });
      return saved;
    },
    [userId],
  );

  const deleteCreator = useCallback(
    async (id: string) => {
      if (!userId) {
        throw new Error("Please sign in first.");
      }
      await deleteCreatorCrmRecord(userId, id);
      setCreators((prev) => prev.filter((item) => item.id !== id));
    },
    [userId],
  );

  return useMemo(
    () => ({
      ...auth,
      creators,
      loading: auth.ready ? loading : true,
      error,
      notice,
      reload,
      saveCreator,
      deleteCreator,
      configured: isSupabaseReady(),
    }),
    [auth, creators, deleteCreator, error, loading, notice, reload, saveCreator],
  );
}
