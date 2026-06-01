import {
  Archive,
  Bookmark,
  Brain,
  Home,
  ImagePlus,
  LayoutDashboard,
  Settings,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { modules } from "@/lib/inspiration-data";

const navItems = [
  { href: "/", label: "灵感首页", icon: Home },
  { href: "/trends", label: "今日趋势", icon: LayoutDashboard },
  { href: "/images/new", label: "添加图片链接", icon: ImagePlus },
  { href: "/favorites", label: "我的收藏", icon: Bookmark },
  { href: "/brainstorm", label: "AI 头脑风暴", icon: Brain },
  { href: "/settings", label: "数据接口预留", icon: Settings },
];

type AppShellProps = {
  children: ReactNode;
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
};

export function AppShell({ children, eyebrow, title, description, actions }: AppShellProps) {
  return (
    <main className="min-h-screen bg-[#586f4f] text-[#17324d]">
      <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-5 lg:grid-cols-[280px_1fr] lg:px-8">
        <aside className="rounded-md border-2 border-[#17324d] bg-[#d9dfcf] p-4 shadow-[7px_7px_0_#bd3f31] lg:sticky lg:top-5 lg:h-[calc(100vh-40px)]">
          <Link className="block rounded-md bg-[#17324d] p-4 text-[#f8efdc]" href="/">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-md bg-[#bd3f31]">
                <Sparkles className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-black">本地灵感库</p>
                <p className="mt-1 text-xs text-[#dfe7d8]">Manual + AI MVP</p>
              </div>
            </div>
          </Link>

          <nav className="mt-5 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  className="flex items-center gap-3 rounded-md border border-[#17324d]/20 bg-[#eef2e6] px-3 py-3 text-sm font-bold transition hover:-translate-y-0.5 hover:border-[#17324d] hover:bg-[#f8efdc]"
                  href={item.href}
                  key={item.href}
                >
                  <Icon className="h-4 w-4 text-[#bd3f31]" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-6 border-t-2 border-[#17324d] pt-5">
            <div className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-[#56635b]">
              <Archive className="h-4 w-4" />
              三个模块
            </div>
            <div className="space-y-2">
              {modules.map((module) => (
                <Link
                  className="block rounded-md border border-[#17324d]/20 bg-[#eef2e6] px-3 py-3 transition hover:-translate-y-0.5 hover:border-[#17324d] hover:bg-[#f8efdc]"
                  href={`/modules/${module.slug}`}
                  key={module.slug}
                >
                  <p className="text-sm font-black">{module.shortName}</p>
                  <p className="mt-1 line-clamp-2 text-xs leading-5 text-[#4b5870]">
                    {module.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </aside>

        <section className="min-w-0">
          <header className="mb-6 rounded-md border-2 border-[#d9dfcf] bg-[#17324d] p-5 text-[#f8efdc] shadow-[7px_7px_0_#bd3f31]">
            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
              <div>
                {eyebrow ? (
                  <p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-[#f2b0a1]">
                    {eyebrow}
                  </p>
                ) : null}
                <h1 className="text-3xl font-black leading-tight sm:text-5xl">{title}</h1>
                {description ? (
                  <p className="mt-4 max-w-3xl text-sm leading-7 text-[#dfe7d8]">{description}</p>
                ) : null}
              </div>
              {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
            </div>
          </header>
          {children}
        </section>
      </div>
    </main>
  );
}
