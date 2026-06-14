"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  ClipboardList,
  Database,
  FolderKanban,
  LayoutDashboard,
  Megaphone,
  Package,
  Settings,
  SquarePen,
  Sparkles,
  Users,
  WandSparkles,
} from "lucide-react";
import { useLanguage } from "@/components/os/language-context";
import { copy } from "@/lib/translations";

const items = [
  { key: "dashboard", href: "/", icon: LayoutDashboard },
  { key: "creatorFinder", href: "/creator-finder", icon: Sparkles },
  { key: "creatorAuditor", href: "/creator-auditor", icon: WandSparkles },
  { key: "creatorCrm", href: "/creator-crm", icon: Users },
  { key: "creatorDatabase", href: "/dashboard/creators", icon: Database },
  { key: "outreach", href: "/outreach", icon: Megaphone },
  { key: "campaigns", href: "/campaigns", icon: FolderKanban },
  { key: "contentHub", href: "/content-hub", icon: SquarePen },
  { key: "samples", href: "/samples", icon: Package },
  { key: "performance", href: "/performance", icon: BarChart3 },
  { key: "sopLibrary", href: "/sop-library", icon: ClipboardList },
  { key: "settings", href: "/settings", icon: Settings },
] as const;

export function SidebarNav() {
  const pathname = usePathname();
  const { pick } = useLanguage();

  return (
    <nav className="space-y-1">
      {items.map((item) => {
        const Icon = item.icon;
        const active =
          item.href === "/"
            ? pathname === "/"
            : pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`os-sidebar-item ${active ? "os-sidebar-item-active" : ""}`}
          >
            <Icon className="h-4 w-4 shrink-0" />
            <span>{pick(copy.nav[item.key])}</span>
          </Link>
        );
      })}
    </nav>
  );
}
