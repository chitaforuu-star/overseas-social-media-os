"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpDown, Download, Plus, Trash2, Upload } from "lucide-react";
import { useLanguage } from "@/components/os/language-context";
import { useOS } from "@/components/os/os-context";
import { PageShell } from "@/components/os/page-shell";
import { Breadcrumb } from "@/components/os/ui/breadcrumb";
import { EmptyState } from "@/components/os/ui/empty-state";
import { AppBadge } from "@/components/os/ui/app-badge";
import { AppButton } from "@/components/os/ui/app-button";
import { AppCard } from "@/components/os/ui/app-card";
import { AppInput } from "@/components/os/ui/app-input";
import { AppSelect } from "@/components/os/ui/app-select";
import { SectionHeader } from "@/components/os/ui/section-header";
import { copy } from "@/lib/translations";
import type { CreatorRecord } from "@/lib/os-types";
import { creatorDatabaseStatusOptions, marketOptions, nicheOptions, platformOptions } from "@/lib/creator-options";
import { detectSocialPlatform, extractSocialHandle } from "@/lib/social-profile";

type SortKey = "creatorName" | "platform" | "country" | "niche" | "followers" | "status" | "lastContact";

function toNumber(value?: string) {
  if (!value) return 0;
  const normalized = value.replace(/,/g, "").trim().toUpperCase();
  const match = normalized.match(/([\d.]+)\s*(K|M)?/);
  if (!match) return Number(normalized) || 0;
  const amount = Number(match[1]);
  const suffix = match[2];
  if (suffix === "M") return amount * 1_000_000;
  if (suffix === "K") return amount * 1_000;
  return amount;
}

function parseCsv(text: string) {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  if (lines.length < 2) {
    throw new Error("CSV format invalid.");
  }

  const splitRow = (row: string) => {
    const result: string[] = [];
    let current = "";
    let inQuotes = false;
    for (let index = 0; index < row.length; index += 1) {
      const char = row[index];
      const next = row[index + 1];
      if (char === '"') {
        if (inQuotes && next === '"') {
          current += '"';
          index += 1;
        } else {
          inQuotes = !inQuotes;
        }
        continue;
      }
      if (char === "," && !inQuotes) {
        result.push(current.trim());
        current = "";
        continue;
      }
      current += char;
    }
    result.push(current.trim());
    return result;
  };

  const headers = splitRow(lines[0]).map((item) => item.toLowerCase());
  return lines.slice(1).map((line) => {
    const values = splitRow(line);
    return headers.reduce<Record<string, string>>((acc, header, index) => {
      acc[header] = values[index] ?? "";
      return acc;
    }, {});
  });
}

function toCsv(rows: Record<string, string>[]) {
  if (rows.length === 0) return "";
  const headers = Object.keys(rows[0] ?? {});
  const escape = (value: string) => `"${String(value ?? "").replace(/"/g, '""')}"`;
  return [headers.join(","), ...rows.map((row) => headers.map((header) => escape(row[header] ?? "")).join(","))].join("\n");
}

function valueOrDash(value?: string) {
  return value?.trim() ? value : "—";
}

export default function CreatorDatabasePage() {
  const { pick } = useLanguage();
  const os = useOS();
  const importRef = useRef<HTMLInputElement | null>(null);

  const [search, setSearch] = useState("");
  const [platformFilter, setPlatformFilter] = useState("");
  const [marketFilter, setMarketFilter] = useState("");
  const [nicheFilter, setNicheFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("creatorName");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [toast, setToast] = useState("");
  const [error, setError] = useState("");

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2400);
  };

  const filteredCreators = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    const rows = os.state.creators.filter((creator) => {
      const handle =
        creator.handle ?? extractSocialHandle(creator.profileLink, detectSocialPlatform(creator.profileLink));
      const values = [
        creator.creatorName,
        handle,
        creator.platform,
        creator.country,
        creator.language,
        creator.niche,
        creator.email,
        creator.notes,
        creator.profileLink,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return (
        (!keyword || values.includes(keyword)) &&
        (!platformFilter || creator.platform === platformFilter) &&
        (!marketFilter || creator.country === marketFilter) &&
        (!nicheFilter || creator.niche === nicheFilter) &&
        (!statusFilter || creator.status === statusFilter)
      );
    });

    return [...rows].sort((a, b) => {
      const direction = sortDirection === "asc" ? 1 : -1;
      if (sortKey === "creatorName") return a.creatorName.localeCompare(b.creatorName) * direction;
      if (sortKey === "platform") return a.platform.localeCompare(b.platform) * direction;
      if (sortKey === "country") return a.country.localeCompare(b.country) * direction;
      if (sortKey === "niche") return a.niche.localeCompare(b.niche) * direction;
      if (sortKey === "followers") return (toNumber(a.followers) - toNumber(b.followers)) * direction;
      if (sortKey === "status") return a.status.localeCompare(b.status) * direction;
      return (a.lastContact ?? "").localeCompare(b.lastContact ?? "") * direction;
    });
  }, [marketFilter, nicheFilter, os.state.creators, platformFilter, search, sortDirection, sortKey, statusFilter]);

  const selectedCount = selectedIds.length;

  const toggleSelected = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const toggleSelectAll = () => {
    if (selectedCount === filteredCreators.length) {
      setSelectedIds([]);
      return;
    }
    setSelectedIds(filteredCreators.map((item) => item.id));
  };

  const exportCreators = (rows = filteredCreators) => {
    if (rows.length === 0) return;
    const csv = toCsv(
      rows.map((creator) => ({
        creatorName: creator.creatorName,
        platform: creator.platform,
        handle: creator.handle ?? "",
        profileUrl: creator.profileLink,
        country: creator.country,
        language: creator.language ?? "",
        niche: creator.niche,
        followers: creator.followers,
        avgViews: creator.averageViews,
        engagementRate: (creator as { engagementRate?: string }).engagementRate ?? "",
        email: creator.email,
        status: creator.status,
        source: creator.source ?? "",
        lastContacted: creator.lastContact ?? "",
        notes: creator.notes,
      })),
    );
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `creator-database-${Date.now()}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
    showToast("CSV exported.");
  };

  const handleDeleteSelected = () => {
    selectedIds.forEach((id) => os.deleteCreator(id));
    setSelectedIds([]);
    showToast("Selected creators deleted.");
  };

  const handleImportCsv = async (file: File) => {
    try {
      const text = await file.text();
      const rows = parseCsv(text);
      if (rows.length === 0) {
        throw new Error("CSV format invalid.");
      }

      rows.forEach((row) => {
        const platform = row.platform || detectSocialPlatform(row["profile url"] || row.profileurl || "");
        const profileUrl = row["profile url"] || row.profileurl || row.url || "";
        const handle = row.handle || extractSocialHandle(profileUrl, platform as ReturnType<typeof detectSocialPlatform>);
        const existing = os.state.creators.find(
          (creator) =>
            creator.profileLink.trim().toLowerCase() === profileUrl.trim().toLowerCase() ||
            (handle && (creator.handle ?? "").trim().toLowerCase() === handle.trim().toLowerCase()),
        );
        const payload: Partial<CreatorRecord> = {
          creatorName: row["creator name"] || row.creatorname || row.name || "Imported creator",
          handle: handle || row.handle || "",
          platform,
          profileLink: profileUrl,
          country: row.country || row.market || row["country / market"] || "",
          language: row.language || "",
          niche: row.category || row.niche || "",
          keyword: row.keyword || "",
          followers: row.followers || "",
          averageViews: row["avg views"] || row["avg views "] || row.avgviews || "",
          email: row.email || "",
          whatsapp: "",
          instagram: platform === "Instagram" ? profileUrl : "",
          tiktok: platform === "TikTok" ? profileUrl : "",
          youtube: platform === "YouTube" ? profileUrl : "",
          facebook: platform === "Facebook" ? profileUrl : "",
          status: "to_audit" as const,
          rate: "",
          targetProduct: "",
          collaborationType: "",
          nextStep: "Review imported CSV creator",
          lastContact: "",
          followUpDate: "",
          notes: row.bio || row.notes || "Imported from CSV",
          source: "importedCsv" as const,
        };
        if (existing) {
          os.updateCreator(existing.id, payload);
        } else {
          os.addCreator(payload);
        }
      });

      showToast(`Imported ${rows.length} creators.`);
    } catch (importError) {
      setError(importError instanceof Error ? importError.message : "CSV format invalid.");
    }
  };

  const emptyActions = (
    <div className="flex flex-wrap gap-2">
      <Link href="/creator-crm/new">
        <AppButton variant="primary" iconLeft={<Plus className="h-4 w-4" />}>
          {pick(copy.actions.addCreatorManually)}
        </AppButton>
      </Link>
      <AppButton
        variant="secondary"
        iconLeft={<Upload className="h-4 w-4" />}
        onClick={() => importRef.current?.click()}
      >
        {pick(copy.actions.importCsv)}
      </AppButton>
    </div>
  );

  return (
    <PageShell
      title={pick(copy.nav.creatorDatabase)}
      description={pick(copy.creatorCrm.description)}
      headerAction={
        <div className="flex flex-wrap gap-2">
          <Link href="/creator-crm/new">
            <AppButton variant="primary" iconLeft={<Plus className="h-4 w-4" />}>
              {pick(copy.actions.addCreatorManually)}
            </AppButton>
          </Link>
          <AppButton
            variant="secondary"
            iconLeft={<Upload className="h-4 w-4" />}
            onClick={() => importRef.current?.click()}
          >
            {pick(copy.actions.importCsv)}
          </AppButton>
          <AppButton
            variant="secondary"
            iconLeft={<Download className="h-4 w-4" />}
            onClick={() => exportCreators()}
          >
            {pick(copy.actions.exportCsv)}
          </AppButton>
        </div>
      }
    >
      <Breadcrumb
        items={[
          { label: pick(copy.nav.dashboard), href: "/" },
          { label: pick(copy.nav.creatorDatabase) },
        ]}
      />

      <input
        ref={importRef}
        type="file"
        accept=".csv,text/csv"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (!file) return;
          void handleImportCsv(file);
          event.target.value = "";
        }}
      />

      {toast ? (
        <div className="fixed bottom-4 right-4 z-50 rounded-2xl border border-[#E5E7EB] bg-white px-4 py-3 text-sm text-[#111827] shadow-lg">
          {toast}
        </div>
      ) : null}

      <AppCard className="p-5">
        <SectionHeader
          title={pick(copy.nav.creatorDatabase)}
          description={pick(copy.creatorCrm.description)}
          action={
            selectedCount > 0 ? (
              <div className="flex flex-wrap gap-2">
                <AppButton
                  variant="secondary"
                  iconLeft={<Download className="h-4 w-4" />}
                  onClick={() => exportCreators(filteredCreators.filter((item) => selectedIds.includes(item.id)))}
                >
                  {pick(copy.actions.exportCsv)}
                </AppButton>
                <AppButton
                  variant="secondary"
                  iconLeft={<Trash2 className="h-4 w-4" />}
                  onClick={handleDeleteSelected}
                >
                  {pick(copy.actions.deleteSelected)}
                </AppButton>
              </div>
            ) : null
          }
        />

        <div className="mt-4 flex flex-wrap gap-2">
          <label className="min-w-[240px] flex-1">
            <span className="sr-only">{pick(copy.common.search)}</span>
            <AppInput
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search creator, handle, country, niche, email, notes"
            />
          </label>

          <AppSelect value={platformFilter} onChange={(event) => setPlatformFilter(event.target.value)}>
            <option value="">{pick(copy.common.all)}</option>
            {platformOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {pick(option.label)}
              </option>
            ))}
          </AppSelect>

          <AppSelect value={marketFilter} onChange={(event) => setMarketFilter(event.target.value)}>
            <option value="">{pick(copy.common.all)}</option>
            {marketOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {pick(option.label)}
              </option>
            ))}
          </AppSelect>

          <AppSelect value={nicheFilter} onChange={(event) => setNicheFilter(event.target.value)}>
            <option value="">{pick(copy.common.all)}</option>
            {nicheOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {pick(option.label)}
              </option>
            ))}
          </AppSelect>

          <AppSelect value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
            <option value="">{pick(copy.common.all)}</option>
            {creatorDatabaseStatusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {pick(option.label)}
              </option>
            ))}
          </AppSelect>

          <AppSelect value={sortKey} onChange={(event) => setSortKey(event.target.value as SortKey)}>
            <option value="creatorName">Sort: Creator</option>
            <option value="platform">Sort: Platform</option>
            <option value="country">Sort: Country</option>
            <option value="niche">Sort: Niche</option>
            <option value="followers">Sort: Followers</option>
            <option value="status">Sort: Status</option>
            <option value="lastContact">Sort: Last Contact</option>
          </AppSelect>

          <AppButton
            variant="secondary"
            iconLeft={<ArrowUpDown className="h-4 w-4" />}
            onClick={() => setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"))}
          >
            {sortDirection.toUpperCase()}
          </AppButton>
        </div>

        {error ? (
          <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="os-mini-tag">{filteredCreators.length} creators</span>
          <span className="os-helper-text">
            {selectedCount > 0 ? `${selectedCount} selected` : "No selection"}
          </span>
        </div>

        {filteredCreators.length === 0 ? (
          <div className="mt-4">
            <EmptyState
              title={pick(copy.creatorCrm.emptyTitle)}
              description={pick(copy.creatorCrm.emptyDescription)}
              action={emptyActions}
            />
          </div>
        ) : (
          <div className="mt-4 overflow-x-auto rounded-2xl border border-[#E5E7EB] bg-white">
            <table className="os-table min-w-[1600px]">
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      checked={selectedCount > 0 && selectedCount === filteredCreators.length}
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th>Creator Name</th>
                  <th>Platform</th>
                  <th>Handle</th>
                  <th>Profile URL</th>
                  <th>Country / Market</th>
                  <th>Language</th>
                  <th>Niche</th>
                  <th>Followers</th>
                  <th>Avg Views</th>
                  <th>Engagement Rate</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Source</th>
                  <th>Last Contacted</th>
                  <th>Notes</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredCreators.map((creator) => (
                  <tr key={creator.id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(creator.id)}
                        onChange={() => toggleSelected(creator.id)}
                      />
                    </td>
                    <td>
                      <div>
                        <p className="font-semibold text-[#111827]">{valueOrDash(creator.creatorName)}</p>
                        <p className="os-helper-text">{valueOrDash(creator.profileLink)}</p>
                      </div>
                    </td>
                    <td>{valueOrDash(creator.platform)}</td>
                    <td>{valueOrDash(creator.handle)}</td>
                    <td>{valueOrDash(creator.profileLink)}</td>
                    <td>{valueOrDash(creator.country)}</td>
                    <td>{valueOrDash(creator.language)}</td>
                    <td>{valueOrDash(creator.niche)}</td>
                    <td>{valueOrDash(creator.followers)}</td>
                    <td>{valueOrDash(creator.averageViews)}</td>
                    <td>{valueOrDash((creator as { engagementRate?: string }).engagementRate)}</td>
                    <td>{valueOrDash(creator.email)}</td>
                    <td>
                      <AppBadge status={creator.status} />
                    </td>
                    <td>{valueOrDash(creator.source)}</td>
                    <td>{valueOrDash(creator.lastContact)}</td>
                    <td className="max-w-[240px]">{valueOrDash(creator.notes)}</td>
                    <td>
                      <div className="flex flex-wrap gap-2">
                        <Link href={`/creator-crm/${creator.id}`}>
                          <AppButton variant="text">{pick(copy.actions.view)}</AppButton>
                        </Link>
                        <Link href={`/creator-crm/new?id=${creator.id}`}>
                          <AppButton variant="text">{pick(copy.actions.edit)}</AppButton>
                        </Link>
                        <Link
                          href={
                            creator.profileLink
                              ? `/creator-auditor?profile=${encodeURIComponent(creator.profileLink)}`
                              : "/creator-auditor"
                          }
                        >
                          <AppButton variant="text">{pick(copy.actions.runAuditor)}</AppButton>
                        </Link>
                        <AppButton
                          variant="text"
                          iconLeft={<Trash2 className="h-4 w-4" />}
                          onClick={() => {
                            os.deleteCreator(creator.id);
                            setSelectedIds((prev) => prev.filter((item) => item !== creator.id));
                            showToast("Creator deleted.");
                          }}
                        >
                          {pick(copy.actions.delete)}
                        </AppButton>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </AppCard>
    </PageShell>
  );
}
