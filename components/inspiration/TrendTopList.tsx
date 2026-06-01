import { Flame } from "lucide-react";
import type { TrendItem } from "@/lib/inspiration-data";
import { TagCloud } from "./TagCloud";

type TrendTopListProps = {
  trends: TrendItem[];
};

export function TrendTopList({ trends }: TrendTopListProps) {
  return (
    <div className="rounded-md border-2 border-[#17324d] bg-[#d9dfcf] p-5 shadow-[7px_7px_0_#1f5b8f]">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-xl font-black">今日趋势 Top 10</h2>
        <Flame className="h-5 w-5 text-[#bd3f31]" />
      </div>
      <div className="space-y-3">
        {trends.map((trend) => (
          <article className="rounded-md border border-[#17324d] bg-[#eef2e6] p-4" key={trend.id}>
            <div className="flex items-start gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[#bd3f31] text-sm font-black text-[#fff7ef]">
                {trend.rank}
              </span>
              <div className="min-w-0">
                <h3 className="font-black">{trend.keyword}</h3>
                <p className="mt-2 text-sm leading-6 text-[#4b5870]">{trend.reason}</p>
                <div className="mt-3">
                  <TagCloud tags={trend.tags} />
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
