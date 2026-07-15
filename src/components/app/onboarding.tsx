"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, PenLine } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAppStore, readStoredActiveProfile } from "@/lib/store";
import { LogoBadge } from "@/components/app/logo";
import { APP_NAME, APP_FULL_NAME, APP_VERSION } from "@/lib/brand";
import { useT } from "@/components/language-provider";

export function Onboarding() {
  const [penName, setPenName] = React.useState("");
  const [bio, setBio] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const { toast } = useToast();
  const setProfiles = useAppStore((s) => s.setProfiles);
  const setActiveProfileId = useAppStore((s) => s.setActiveProfileId);
  const t = useT();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const name = penName.trim();
    if (!name) {
      toast({
        title: t("onboarding.penNameRequired"),
        description: t("onboarding.penNameHint"),
        variant: "destructive",
      });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/profiles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ penName: name, bio: bio.trim() || undefined }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || t("profileForm.errorSave"));
      }
      const { profile } = await res.json();
      // refresh profile list
      const listRes = await fetch("/api/profiles", { cache: "no-store" });
      const { profiles } = await listRes.json();
      setProfiles(profiles);
      setActiveProfileId(profile.id);
      // persist active
      try {
        localStorage.setItem("ws-active-profile", profile.id);
      } catch {
        /* ignore */
      }
      void readStoredActiveProfile;
      toast({
        title: t("onboarding.welcome", { name: profile.penName }),
        description: t("onboarding.studioReady"),
      });
    } catch (err) {
      toast({
        title: t("common.error"),
        description: err instanceof Error ? err.message : t("common.tryAgain"),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app-bg min-h-screen w-full flex items-center justify-center p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-xl"
      >
        <div className="relative rounded-3xl border border-border/60 bg-card/90 glass shadow-2xl shadow-black/10 dark:shadow-black/40 overflow-hidden">
          <div className="h-1.5 w-full bg-gradient-to-r from-brand via-amber-400 to-brand" />

          <div className="p-7 sm:p-10">
            <div className="flex items-center gap-3 mb-6">
              <LogoBadge size={56} className="shrink-0" />
              <div>
                <h1 className="text-xl font-semibold tracking-tight">
                  {APP_NAME}
                </h1>
                <p className="text-xs text-muted-foreground">
                  {t("app.tagline")}
                </p>
              </div>
            </div>

            <div className="inline-flex items-center gap-1.5 rounded-full bg-brand-soft text-foreground/80 px-3 py-1 text-[11px] font-medium mb-5">
              <Sparkles className="h-3 w-3 text-brand" />
              {t("onboarding.firstRun")}
            </div>

            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight leading-tight">
              {t("onboarding.title")}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              {t("onboarding.subtitle")}
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="space-y-1.5">
                <label
                  htmlFor="penName"
                  className="text-xs font-medium text-foreground/80"
                >
                  {t("onboarding.penName")} <span className="text-brand">*</span>
                </label>
                <div className="relative">
                  <PenLine className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="penName"
                    value={penName}
                    onChange={(e) => setPenName(e.target.value)}
                    placeholder={t("profileForm.namePlaceholder")}
                    autoFocus
                    maxLength={60}
                    className="h-11 pl-9 text-base"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="bio"
                  className="text-xs font-medium text-foreground/80"
                >
                  {t("onboarding.bio")}{" "}
                  <span className="text-muted-foreground">{t("onboarding.bioOptional")}</span>
                </label>
                <Textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder={t("onboarding.bioPlaceholder")}
                  rows={3}
                  maxLength={280}
                  className="resize-none"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-11 text-sm font-medium bg-brand text-brand-foreground hover:bg-brand/90"
              >
                {loading ? t("onboarding.preparing") : t("onboarding.start")}
                {!loading && <ArrowRight className="ml-1.5 h-4 w-4" />}
              </Button>

              <p className="text-[11px] text-muted-foreground text-center pt-1">
                {t("onboarding.footer", { app: APP_FULL_NAME, version: APP_VERSION })}
              </p>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
