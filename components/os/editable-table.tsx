"use client";

export type Column<Row extends { id: string }> = {
  key: keyof Row;
  label: string;
  type?: "text" | "date" | "number" | "textarea" | "select";
  options?: string[];
};

export function EditableTable<Row extends { id: string }>({
  rows,
  columns,
  onChange,
}: {
  rows: Row[];
  columns: Column<Row>[];
  onChange: (id: string, key: keyof Row, value: string) => void;
}) {
  return (
    <div className="overflow-x-auto rounded-lg border border-[#d4dce5] bg-white">
      <table className="min-w-[1080px] w-full border-collapse text-sm">
        <thead className="bg-[#f6f8fb]">
          <tr>
            {columns.map((column) => (
              <th
                key={String(column.key)}
                className="border-b border-[#d4dce5] px-3 py-2 text-left font-semibold text-[#30445f]"
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="align-top">
              {columns.map((column) => {
                const value = String(row[column.key] ?? "");

                if (column.type === "select") {
                  return (
                    <td key={String(column.key)} className="border-t border-[#e5ebf2] p-2">
                      <select
                        value={value}
                        onChange={(event) =>
                          onChange(row.id, column.key, event.target.value)
                        }
                        className="w-full rounded-md border border-[#ccd7e3] bg-white px-2 py-2 text-sm outline-none focus:border-[#345d8a]"
                      >
                        {(column.options ?? [""]).map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </td>
                  );
                }

                if (column.type === "textarea") {
                  return (
                    <td key={String(column.key)} className="border-t border-[#e5ebf2] p-2">
                      <textarea
                        value={value}
                        onChange={(event) =>
                          onChange(row.id, column.key, event.target.value)
                        }
                        rows={3}
                        className="w-full min-w-[170px] rounded-md border border-[#ccd7e3] bg-white px-2 py-2 text-sm outline-none focus:border-[#345d8a]"
                      />
                    </td>
                  );
                }

                return (
                  <td key={String(column.key)} className="border-t border-[#e5ebf2] p-2">
                    <input
                      value={value}
                      type={column.type === "date" ? "date" : "text"}
                      onChange={(event) =>
                        onChange(row.id, column.key, event.target.value)
                      }
                      className="w-full min-w-[150px] rounded-md border border-[#ccd7e3] bg-white px-2 py-2 text-sm outline-none focus:border-[#345d8a]"
                    />
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
