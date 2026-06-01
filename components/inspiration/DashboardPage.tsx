import { Brain, ImagePlus, Plus, TrendingUp } from "lucide-react";
import Link from "next/link";
import {
  getAllTags,
  getModuleImages,
  getModuleTrends,
  inspirationImages,
  modules,
  productIdeas,
  trends,
} from "@/lib/inspiration-data";
import { AppShell } from "./AppShell";
import { ImageGallery } from "./ImageGallery";
import { ModuleCard } from "./ModuleCard";
import { ProductIdeaCard } from "./ProductIdeaCard";
import { TagCloud } from "./TagCloud";

export function DashboardPage() {
  const favoriteImages = inspirationImages.filter((image) => image.isFavorite);
  const topTrends = trends.filter((trend) => trend.rank <= 3);

  return (
    <AppShell
      actions={
        <>
          <Link
            className="inline-flex items-center gap-2 rounded-md bg-[#bd3f31] px-4 py-3 text-sm font-black text-[#fff7ef] shadow-[5px_5px_0_#d9dfcf]"
            href="/images/new"
          >
            <ImagePlus className="h-4 w-4" />
            保存图片链接
          </Link>
          <Link
            className="inline-flex items-center gap-2 rounded-md border-2 border-[#d9dfcf] bg-[#f8efdc] px-4 py-3 text-sm font-black text-[#17324d] shadow-[5px_5px_0_#bd3f31]"
            href="/brainstorm"
          >
            <Brain className="h-4 w-4" />
            头脑风暴
          </Link>
        </>
      }
      description="仅本地自用的创意产品灵感工作台。第一版先支持手动输入趋势关键词、保存图片链接、管理标签与备注，并把素材喂给 AI 生成可执行产品创意。"
      eyebrow="Local-first Inspiration Studio"
      title="创意产品灵感库"
    >
      <div className="space-y-6">
        <section className="grid gap-5 xl:grid-cols-3">
          {modules.map((module) => (
            <ModuleCard
              imageCount={getModuleImages(module.slug).length}
              key={module.slug}
              module={module}
              trendCount={getModuleTrends(module.slug).length}
            />
          ))}
        </section>

        <section className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-md border-2 border-[#17324d] bg-[#d9dfcf] p-5 shadow-[7px_7px_0_#1f5b8f]">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-[#bd3f31]">
                  Today Trends
                </p>
                <h2 className="mt-1 text-2xl font-black">今日趋势速览</h2>
              </div>
              <TrendingUp className="h-6 w-6 text-[#bd3f31]" />
            </div>
            <div className="space-y-3">
              {topTrends.map((trend) => (
                <Link
                  className="block rounded-md border border-[#17324d] bg-[#eef2e6] p-4 transition hover:-translate-y-0.5 hover:bg-[#f8efdc]"
                  href={`/modules/${trend.module}`}
                  key={trend.id}
                >
                  <div className="flex items-start gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[#bd3f31] text-sm font-black text-[#fff7ef]">
                      {trend.rank}
                    </span>
                    <div>
                      <h3 className="font-black">{trend.keyword}</h3>
                      <p className="mt-1 text-sm leading-6 text-[#4b5870]">{trend.reason}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <Link
              className="mt-4 inline-flex items-center gap-2 rounded-md bg-[#17324d] px-4 py-3 text-sm font-black text-[#f8efdc]"
              href="/trends"
            >
              <Plus className="h-4 w-4" />
              管理今日 Top 10
            </Link>
          </div>

          <div className="rounded-md border-2 border-[#17324d] bg-[#eef2e6] p-5 shadow-[7px_7px_0_#bd3f31]">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[#bd3f31]">
              Popular Tags
            </p>
            <h2 className="mt-1 text-2xl font-black">热门标签</h2>
            <p className="mt-3 text-sm leading-7 text-[#4b5870]">
              标签会贯穿趋势、图片库、收藏和 AI 头脑风暴。第一版先用手动标签，后续可以从 Pinterest / Instagram / Apify / AgentReach 的结果里自动提取。
            </p>
            <div className="mt-5">
              <TagCloud tags={getAllTags().slice(0, 28)} />
            </div>
          </div>
        </section>

        <section>
          <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[#f2b0a1]">
                Inspiration Gallery
              </p>
              <h2 className="text-2xl font-black text-[#f8efdc]">灵感图片库</h2>
            </div>
            <Link className="rounded-md bg-[#d9dfcf] px-4 py-3 text-sm font-black" href="/favorites">
              查看 {favoriteImages.length} 个收藏
            </Link>
          </div>
          <ImageGallery images={inspirationImages} />
        </section>

        <section className="space-y-5">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[#f2b0a1]">
              Brainstorming Samples
            </p>
            <h2 className="text-2xl font-black text-[#f8efdc]">可执行产品创意示例</h2>
          </div>
          <div className="grid gap-5">
            {productIdeas.slice(0, 2).map((idea) => (
              <ProductIdeaCard idea={idea} key={idea.id} />
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
