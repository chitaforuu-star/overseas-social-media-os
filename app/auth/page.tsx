"use client";

import Link from "next/link";
import { useState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LogIn, LogOut, UserPlus } from "lucide-react";
import { useLanguage } from "@/components/os/language-context";
import { useSupabaseAuth } from "@/components/os/supabase-auth-context";
import { PageShell } from "@/components/os/page-shell";
import { AppBadge } from "@/components/os/ui/app-badge";
import { AppButton } from "@/components/os/ui/app-button";
import { AppCard } from "@/components/os/ui/app-card";
import { AppInput } from "@/components/os/ui/app-input";
import { Breadcrumb } from "@/components/os/ui/breadcrumb";
import { EmptyState } from "@/components/os/ui/empty-state";

type Mode = "login" | "signup";

export const dynamic = "force-dynamic";

export default function AuthPage() {
  const { pick } = useLanguage();
  const { configured, session, signInWithPassword, signUpWithPassword, signOut } =
    useSupabaseAuth();
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [nextPath, setNextPath] = useState("/creator-crm");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    queueMicrotask(() => {
      setNextPath(params.get("next") || "/creator-crm");
    });
  }, []);

  const submit = async () => {
    setMessage("");
    setLoading(true);
    try {
      const error =
        mode === "login"
          ? await signInWithPassword(email, password)
          : await signUpWithPassword(email, password);
      if (error) {
        setMessage(error);
        return;
      }
      if (mode === "login") {
        router.push(nextPath);
        router.refresh();
        return;
      }
      setMessage(
        "Account created. If email confirmation is enabled in Supabase, check your inbox and then sign in.",
      );
      setMode("login");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    const error = await signOut();
    setMessage(error ?? "Signed out.");
  };

  return (
    <PageShell
      title="Account Access"
      description="Email/password access for your Creator CRM cloud workspace."
      headerAction={
        <Link href="/creator-crm">
          <AppButton variant="secondary">{pick({ zh: "返回 CRM", en: "Back to CRM" })}</AppButton>
        </Link>
      }
    >
      <Breadcrumb
        items={[
          { label: pick({ zh: "首页", en: "Dashboard" }), href: "/" },
          { label: "Auth" },
        ]}
      />

      {!configured ? (
        <AppCard className="p-5">
          <EmptyState
            title="Supabase is not configured"
            description="Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your environment."
          />
        </AppCard>
      ) : null}

      {session ? (
        <AppCard className="p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="os-helper-text">Signed in as</p>
              <p className="os-card-title">{session.user.email}</p>
            </div>
            <AppBadge status="approved" />
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link href={nextPath}>
              <AppButton variant="primary" iconLeft={<LogIn className="h-4 w-4" />}>
                {pick({ zh: "继续", en: "Continue" })}
              </AppButton>
            </Link>
            <AppButton variant="secondary" iconLeft={<LogOut className="h-4 w-4" />} onClick={handleLogout}>
              {pick({ zh: "退出登录", en: "Sign out" })}
            </AppButton>
          </div>
        </AppCard>
      ) : null}

      <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <AppCard className="p-5">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setMode("login")}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                mode === "login"
                  ? "bg-[#111827] text-white"
                  : "border border-[#E5E7EB] bg-white text-[#374151]"
              }`}
            >
              {pick({ zh: "登录", en: "Sign in" })}
            </button>
            <button
              type="button"
              onClick={() => setMode("signup")}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                mode === "signup"
                  ? "bg-[#111827] text-white"
                  : "border border-[#E5E7EB] bg-white text-[#374151]"
              }`}
            >
              {pick({ zh: "注册", en: "Create account" })}
            </button>
          </div>

          <div className="mt-4 space-y-3">
            <label className="space-y-1">
              <span className="os-helper-text">Email</span>
              <AppInput
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
              />
            </label>
            <label className="space-y-1">
              <span className="os-helper-text">Password</span>
              <AppInput
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
              />
            </label>
          </div>

          {message ? (
            <p className="mt-3 rounded-2xl border border-[#E5E7EB] bg-[#FAFAFA] px-4 py-3 text-sm text-[#374151]">
              {message}
            </p>
          ) : null}

          <div className="mt-4 flex flex-wrap gap-2">
            <AppButton
              variant="primary"
              iconLeft={mode === "login" ? <LogIn className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
              onClick={submit}
              disabled={loading}
            >
              {loading ? "..." : mode === "login" ? pick({ zh: "登录", en: "Sign in" }) : pick({ zh: "注册", en: "Sign up" })}
            </AppButton>
            <Link href="/creator-crm">
              <AppButton variant="secondary">{pick({ zh: "返回 CRM", en: "Back to CRM" })}</AppButton>
            </Link>
          </div>
        </AppCard>

        <AppCard className="p-5" tone="purple">
          <EmptyState
            title="Creator CRM Cloud Sync"
            description="Your creators are bound to Supabase Auth user_id and protected by RLS. LocalStorage stays as a backup."
          />
        </AppCard>
      </section>
    </PageShell>
  );
}


