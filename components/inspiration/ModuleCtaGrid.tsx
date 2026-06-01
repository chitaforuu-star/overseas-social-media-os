import {
  Bookmark,
  Brain,
  FileText,
  Images,
  Tags,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import {
  getModuleImages,
  getModuleTrends,
  moduleSections,
  productIdeas,
  type InspirationModule,
} from "@/lib/inspiration-data";

const sectionIcons: Record<string, LucideIcon> = {
  trends: TrendingUp,
  tags: Tags,
  gallery: Images,
  favorites: Bookmark,
  "sources-notes": FileText,
  brainstorm: Brain,
};

type ModuleCtaGridProps = {
  module: InspirationModule;
};

export function ModuleCtaGrid({ module }: ModuleCtaGridProps) {
  const images = getModuleImages(module.slug);
  const trends = getModuleTrends(module.slug);
  const favoriteCount = images.filter((image) => image.isFavorite).length;
  const ideaCount = productIdeas.filter((idea) => idea.module === module.slug).length;

  const stats: Record<string, string> = {
    trends: `${trends.length} 条`,
    tags: `${module.tags.length} 个`,
    gallery: `${images.length} 张`,
    favorites: `${favoriteCount} 个`,
    "sources-notes": `${images.length} 条`,
    brainstorm: `${ideaCount || "待"} 个`,
  };

  return (
    <section className="rounded-md border-2 border-[#17324d] bg-[#d9dfcf] p-5 shadow-[7px_7px_0_#1f5b8f]">
      <div className="mb-4 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#bd3f31]">
            Next Pages CTA
          </p>
          <h2 className="text-2xl font-black">二级页面入口</h2>
        </div>
        <span className="w-fit rounded-md bg-[#17324d] px-3 py-2 text-xs font-black text-[#f8efdc]">
          {module.shortName}
        </span>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {moduleSections.map((section) => {
          const Icon = sectionIcons[section.slug];

          return (
            <Link
              className="group rounded-md border-2 border-[#17324d] bg-[#eef2e6] p-4 transition hover:-translate-y-1 hover:bg-[#f8efdc]"
              href={`/modules/${module.slug}/${section.slug}`}
              key={section.slug}
            >
              <div className="flex items-start justify-between gap-4">
                <span
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-[#fff7ef]"
                  style={{ backgroundColor: module.color }}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <span className="rounded-md bg-[#17324d] px-2.5 py-1 text-xs font-black text-[#f8efdc]">
                  {stats[section.slug]}
                </span>
              </div>
              <h3 className="mt-4 text-lg font-black">{section.title}</h3>
              <p className="mt-2 text-sm leading-6 text-[#4b5870]">{section.description}</p>
              <p className="mt-4 text-sm font-black text-[#bd3f31] transition group-hover:translate-x-1">
                {section.ctaLabel} →
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
