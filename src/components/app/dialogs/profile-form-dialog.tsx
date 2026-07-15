"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PenLine } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useT } from "@/components/language-provider";

export function ProfileFormDialog({
  open,
  onOpenChange,
  mode,
  profileId,
  initial,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  mode: "create" | "edit";
  profileId?: string;
  initial?: { penName?: string; bio?: string };
  onSaved?: () => void;
}) {
  const [penName, setPenName] = React.useState(initial?.penName ?? "");
  const [bio, setBio] = React.useState(initial?.bio ?? "");
  const [loading, setLoading] = React.useState(false);
  const { toast } = useToast();
  const t = useT();

  React.useEffect(() => {
    if (open) {
      setPenName(initial?.penName ?? "");
      setBio(initial?.bio ?? "");
    }
  }, [open]); // reset on open

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const name = penName.trim();
    if (!name) {
      toast({
        title: t("profileForm.nameRequired"),
        variant: "destructive",
      });
      return;
    }
    setLoading(true);
    try {
      const url = mode === "create" ? "/api/profiles" : `/api/profiles/${profileId}`;
      const method = mode === "create" ? "POST" : "PATCH";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ penName: name, bio: bio.trim() || undefined }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d?.error || t("profileForm.errorSave"));
      }
      toast({
        title: mode === "create" ? t("profileForm.created") : t("profileForm.updated"),
      });
      onSaved?.();
      onOpenChange(false);
    } catch (err) {
      toast({
        title: t("common.error"),
        description: err instanceof Error ? err.message : "",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[440px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? t("profileForm.createTitle") : t("profileForm.editTitle")}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? t("profileForm.createDesc")
              : t("profileForm.editDesc")}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="pf-name">{t("profileForm.nameLabel")}</Label>
            <div className="relative">
              <PenLine className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="pf-name"
                value={penName}
                onChange={(e) => setPenName(e.target.value)}
                placeholder={t("profileForm.namePlaceholder")}
                autoFocus
                maxLength={60}
                className="pl-9"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="pf-bio">{t("profileForm.bioLabel")}</Label>
            <Textarea
              id="pf-bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              maxLength={280}
              className="resize-none"
              placeholder={t("profileForm.bioPlaceholder")}
            />
          </div>
          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              {t("common.cancel")}
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-brand text-brand-foreground hover:bg-brand/90"
            >
              {loading ? t("common.saving") : mode === "create" ? t("profileForm.createBtn") : t("common.save")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
