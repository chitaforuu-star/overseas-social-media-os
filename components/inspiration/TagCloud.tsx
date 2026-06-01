type TagCloudProps = {
  tags: string[];
  tone?: "light" | "dark";
};

export function TagCloud({ tags, tone = "light" }: TagCloudProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <span
          className={
            tone === "dark"
              ? "rounded-md border border-[#d9dfcf] bg-[#17324d] px-3 py-1.5 text-xs font-bold text-[#f8efdc]"
              : "rounded-md border border-[#17324d] bg-[#f8efdc] px-3 py-1.5 text-xs font-bold text-[#17324d]"
          }
          key={tag}
        >
          #{tag}
        </span>
      ))}
    </div>
  );
}
