import { Gauge, Layers, Store } from "lucide-react";
import type { ProductIdea } from "@/lib/inspiration-data";

type ProductIdeaCardProps = {
  idea: ProductIdea;
};

export function ProductIdeaCard({ idea }: ProductIdeaCardProps) {
  return (
    <article className="rounded-md border-2 border-[#17324d] bg-[#eef2e6] p-5 shadow-[7px_7px_0_#bd3f31]">
      <p className="text-xs font-black uppercase tracking-[0.16em] text-[#bd3f31]">
        {idea.inspirationSource}
      </p>
      <h2 className="mt-2 text-2xl font-black text-[#17324d]">{idea.name}</h2>
      <p className="mt-3 text-sm leading-7 text-[#4b5870]">{idea.description}</p>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        <div className="rounded-md border border-[#17324d] bg-[#f8efdc] p-3">
          <div className="mb-2 flex items-center gap-2 text-xs font-black text-[#bd3f31]">
            <Layers className="h-4 w-4" />
            材料
          </div>
          <p className="text-sm leading-6">{idea.materials}</p>
        </div>
        <div className="rounded-md border border-[#17324d] bg-[#f8efdc] p-3">
          <div className="mb-2 flex items-center gap-2 text-xs font-black text-[#bd3f31]">
            <Store className="h-4 w-4" />
            市场
          </div>
          <p className="text-sm leading-6">{idea.market}</p>
        </div>
        <div className="rounded-md border border-[#17324d] bg-[#f8efdc] p-3">
          <div className="mb-2 flex items-center gap-2 text-xs font-black text-[#bd3f31]">
            <Gauge className="h-4 w-4" />
            难度
          </div>
          <p className="text-sm leading-6">{idea.difficulty}</p>
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <InfoBlock title="制作工艺" text={idea.process} />
        <InfoBlock title="适合产品" text={idea.productFormats} />
        <InfoBlock title="可延展系列" text={idea.extensions} />
        <InfoBlock title="应用场景" text={idea.scenarios} />
      </div>
    </article>
  );
}

function InfoBlock({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-md bg-[#d9dfcf] p-3">
      <p className="text-xs font-black text-[#17324d]">{title}</p>
      <p className="mt-2 text-sm leading-6 text-[#4b5870]">{text}</p>
    </div>
  );
}
