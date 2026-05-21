import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function SettingsPage() {
  const { profile, saveProfile, isSaving } = useProfile();
  const { principal } = useAuth();
  const [name, setName] = useState("");

  useEffect(() => {
    if (profile?.name) setName(profile.name);
  }, [profile?.name]);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    saveProfile(
      { name },
      {
        onSuccess: () => toast.success("Profile saved"),
        onError: () => toast.error("Failed to save profile"),
      },
    );
  }

  return (
    <div className="p-4 max-w-xl space-y-4" data-ocid="settings.page">
      <h1 className="text-sm font-semibold text-foreground">Settings</h1>

      <div className="bg-card border border-border rounded p-4 space-y-4">
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          Profile
        </h2>
        <form onSubmit={handleSave} className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-xs">
              Display Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="h-8 text-sm"
              data-ocid="settings.name_input"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Principal ID</Label>
            <div className="font-mono text-[11px] text-muted-foreground bg-muted rounded px-2.5 py-1.5 break-all">
              {principal?.toString() ?? "—"}
            </div>
          </div>
          <Button
            type="submit"
            size="sm"
            disabled={isSaving || !name.trim()}
            data-ocid="settings.save_button"
          >
            {isSaving ? "Saving…" : "Save Profile"}
          </Button>
        </form>
      </div>
    </div>
  );
}
