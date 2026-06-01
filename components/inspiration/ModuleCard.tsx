import { ArrowRight, Tags } from "lucide-react";
import Link from "next/link";
import type { InspirationModule } from "@/lib/inspiration-data";

type ModuleCardProps = {
  module: InspirationModule;
  imageCount: number;
  trendCount: number;
};

export function ModuleCard({ module, imageCount, trendCount }: ModuleCardProps) {
  return (
    <Link
      className="group block rounded-md border-2 border-[#17324d] bg-[#eef2e6] p-5 shadow-[7px_7px_0_#bd3f31] transition hover:-translate-y-1"
      href={`/modules/${module.slug}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <span
            className="mb-4 block h-3 w-16 rounded-full"
            style={{ backgroundColor: module.color }}
          />
          <h2 className="text-2xl font-black leading-tight text-[#17324d]">{module.name}</h2>
        </div>
        <ArrowRight className="h-6 w-6 shrink-0 text-[#bd3f31] transition-transform group-hover:translate-x-1" />
      </div>
      <p className="mt-4 text-sm leading-7 text-[#4b5870]">{module.description}</p>
      <div className="mt-5 flex flex-wrap gap-2">
        <span className="rounded-md bg-[#17324d] px-3 py-2 text-xs font-bold text-[#f8efdc]">
          Top {trendCount}
        </span>
        <span className="rounded-md bg-[#bd3f31] px-3 py-2 text-xs font-bold text-[#fff7ef]">
          {imageCount} 张示例
        </span>
        <span className="inline-flex items-center gap-1 rounded-md border border-[#17324d] bg-[#f8efdc] px-3 py-2 text-xs font-bold text-[#17324d]">
          <Tags className="h-3.5 w-3.5" />
          {module.tags.length} 个标签
        </span>
      </div>
    </Link>
  );
}
