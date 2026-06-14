"use client";

import { useMemo, useState, type ReactNode } from "react";
import { Search } from "lucide-react";
import { useLanguage } from "@/components/os/language-context";
import { AppInput } from "@/components/os/ui/app-input";
import { AppSelect } from "@/components/os/ui/app-select";
import { copy } from "@/lib/translations";

export type Column<Row extends { id: string }> = {
  key: keyof Row;
  label: string;
  type?: "text" | "date" | "number" | "textarea" | "select";
  options?: string[];
  render?: (row: Row, value: string) => ReactNode;
  className?: string;
};

type EditableTableProps<Row extends { id: string }> = {
  rows: Row[];
  columns: Column<Row>[];
  onChange: (id: string, key: keyof Row, value: string) => void;
  searchPlaceholder?: string;
  primaryAction?: ReactNode;
  secondaryActions?: ReactNode;
};

export function EditableTable<Row extends { id: string }>({
  rows,
  columns,
  onChange,
  searchPlaceholder,
  primaryAction,
  secondaryActions,
}: EditableTableProps<Row>) {
  const { pick } = useLanguage();
  const [query, setQuery] = useState("");
  const [columnFilter, setColumnFilter] = useState<string>("all");

  const visibleRows = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    if (!keyword) return rows;
    return rows.filter((row) => {
      if (columnFilter === "all") {
        return columns.some((column) =>
          String(row[column.key] ?? "").toLowerCase().includes(keyword),
        );
      }
      return String(row[columnFilter as keyof Row] ?? "")
        .toLowerCase()
        .includes(keyword);
    });
  }, [rows, columns, query, columnFilter]);

  return (
    <div className="space-y-3">
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_220px_auto_auto]">
        <label className="relative block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]" />
          <AppInput
            className="pl-9"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={searchPlaceholder ?? pick(copy.common.search)}
          />
        </label>

        <AppSelect value={columnFilter} onChange={(event) => setColumnFilter(event.target.value)}>
          <option value="all">{pick(copy.common.all)}</option>
          {columns.map((column) => (
            <option key={String(column.key)} value={String(column.key)}>
              {column.label}
            </option>
          ))}
        </AppSelect>

        <div className="flex items-center justify-end gap-2">{secondaryActions}</div>
        <div className="flex items-center justify-end">{primaryAction}</div>
      </div>

      <div className="os-table-wrap">
        <table className="os-table">
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={String(column.key)} className={column.className}>
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visibleRows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="py-10 text-center text-[#6B7280]">
                  {pick(copy.common.noResult)}
                </td>
              </tr>
            ) : (
              visibleRows.map((row) => (
                <tr key={row.id}>
                  {columns.map((column) => {
                    const value = String(row[column.key] ?? "");

                    if (column.render) {
                      return <td key={String(column.key)}>{column.render(row, value)}</td>;
                    }

                    if (column.type === "select") {
                      return (
                        <td key={String(column.key)}>
                          <AppSelect
                            value={value}
                            onChange={(event) =>
                              onChange(row.id, column.key, event.target.value)
                            }
                          >
                            {(column.options ?? [""]).map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </AppSelect>
                        </td>
                      );
                    }

                    if (column.type === "textarea") {
                      return (
                        <td key={String(column.key)}>
                          <textarea
                            value={value}
                            onChange={(event) =>
                              onChange(row.id, column.key, event.target.value)
                            }
                            className="os-textarea"
                          />
                        </td>
                      );
                    }

                    return (
                      <td key={String(column.key)}>
                        <AppInput
                          value={value}
                          type={column.type === "date" ? "date" : "text"}
                          onChange={(event) =>
                            onChange(row.id, column.key, event.target.value)
                          }
                        />
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
