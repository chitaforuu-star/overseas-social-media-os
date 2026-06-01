import { Bookmark, ExternalLink } from "lucide-react";
import Link from "next/link";
import type { InspirationImage } from "@/lib/inspiration-data";
import { TagCloud } from "./TagCloud";

type ImageGalleryProps = {
  images: InspirationImage[];
};

export function ImageGallery({ images }: ImageGalleryProps) {
  return (
    <div className="columns-1 gap-5 md:columns-2 xl:columns-3">
      {images.map((image, index) => (
        <Link
          className="mb-5 block break-inside-avoid overflow-hidden rounded-md border-2 border-[#17324d] bg-[#eef2e6] shadow-[7px_7px_0_#bd3f31] transition hover:-translate-y-1"
          href={`/images/${image.id}`}
          key={image.id}
        >
          <div
            className="relative"
            style={{
              height: index % 2 === 0 ? 250 : 320,
              background: `linear-gradient(135deg, ${image.colors[0]}, ${image.colors[1]} 48%, ${image.colors[2]})`,
            }}
          >
            <span className="absolute left-3 top-3 rounded-md bg-[#17324d] px-3 py-1.5 text-xs font-black text-[#f8efdc]">
              图片链接占位
            </span>
            {image.isFavorite ? (
              <span className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-md bg-[#bd3f31] text-[#fff7ef]">
                <Bookmark className="h-4 w-4 fill-current" />
              </span>
            ) : null}
          </div>
          <div className="p-4">
            <div className="mb-2 flex items-center gap-2 text-xs font-bold text-[#bd3f31]">
              <ExternalLink className="h-3.5 w-3.5" />
              {image.sourceUrl}
            </div>
            <h3 className="text-lg font-black">{image.title}</h3>
            <p className="mt-2 text-sm leading-6 text-[#4b5870]">{image.notes}</p>
            <div className="mt-3">
              <TagCloud tags={image.tags} />
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
