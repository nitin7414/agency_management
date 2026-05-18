"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/AppShell";
import { useTheme } from "@/components/ThemeProvider";
import toast from "react-hot-toast";

interface AdminProfile {
  id: string;
  name: string;
  email: string;
  logoUrl?: string;
  darkMode: boolean;
}

export default function SettingsPage() {
  const router = useRouter();
  const { darkMode, setDarkMode } = useTheme();

  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);

  // Stock fields
  const [stockFilled, setStockFilled] = useState("");
  const [stockEmpty, setStockEmpty] = useState("");
  const [stockSaving, setStockSaving] = useState(false);

  // Backup & Restore fields
  const [exporting, setExporting] = useState(false);
  const [restoring, setRestoring] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        if (data?.id) {
          setProfile(data);
          setName(data.name || "");
          setEmail(data.email || "");
        }
      });

    fetch("/api/stock")
      .then((r) => r.json())
      .then((data) => {
        if (data?.id) {
          setStockFilled(String(data.totalFilled));
          setStockEmpty(String(data.totalEmpty));
        }
      });
  }, []);

  async function handleSaveProfile() {
    if (newPassword && newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setSaving(true);
    try {
      const body: Record<string, unknown> = { name, email };
      if (newPassword) body.newPassword = newPassword;
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error();
      toast.success("Profile updated");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      toast.error("Could not update profile");
    } finally {
      setSaving(false);
    }
  }

  async function handleSaveStock() {
    setStockSaving(true);
    try {
      const res = await fetch("/api/stock", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          totalFilled: parseInt(stockFilled) || 0,
          totalEmpty: parseInt(stockEmpty) || 0,
        }),
      });
      if (!res.ok) throw new Error();
      toast.success("Stock updated");
    } catch {
      toast.error("Could not update stock");
    } finally {
      setStockSaving(false);
    }
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  async function handleExportBackup() {
    setExporting(true);
    try {
      const res = await fetch("/api/backup");
      if (!res.ok) throw new Error("Export failed");
      
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const contentDisposition = res.headers.get("content-disposition");
      let fileName = `ssga_database_backup_${new Date().toISOString().split("T")[0]}.json`;
      if (contentDisposition) {
        const matches = /filename="([^"]+)"/.exec(contentDisposition);
        if (matches && matches[1]) fileName = matches[1];
      }
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Database backup downloaded!");
    } catch (err) {
      console.error(err);
      toast.error("Could not export backup");
    } finally {
      setExporting(false);
    }
  }

  async function handleImportBackup(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const confirmRestore = window.confirm(
      "WARNING: Restoring a backup will COMPLETELY erase and replace all current customer records, transactions, empty cylinder counts, and notes. This cannot be undone!\n\nAre you absolutely sure you want to proceed?"
    );
    if (!confirmRestore) {
      e.target.value = "";
      return;
    }

    setRestoring(true);
    const loadingToast = toast.loading("Restoring backup...");
    try {
      const text = await file.text();
      const payload = JSON.parse(text);

      const res = await fetch("/api/backup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Restoration failed");

      toast.success("Database successfully restored!", { id: loadingToast });
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Could not restore backup", { id: loadingToast });
    } finally {
      setRestoring(false);
      e.target.value = "";
    }
  }

  return (
    <AppShell>
      <div className="page-title">Settings</div>

      {/* ── Profile ─────────────────────────────────────────── */}
      <div className="settings-section">
        <div className="settings-section-title">Profile</div>

        <div style={{ padding: "14px 16px" }}>
          <div className="form-group">
            <label className="form-label">Name</label>
            <input className="form-input" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="form-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div className="divider" />
          <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 10, fontWeight: 600 }}>
            CHANGE PASSWORD
          </div>
          <div className="form-group">
            <label className="form-label">New Password</label>
            <input className="form-input" type="password" placeholder="Leave blank to keep current" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Confirm New Password</label>
            <input className="form-input" type="password" placeholder="Repeat new password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
          </div>

          <button className="btn btn-primary btn-full" onClick={handleSaveProfile} disabled={saving}>
            {saving ? "Saving…" : "Save Profile"}
          </button>
        </div>
      </div>

      {/* ── Agency Stock ─────────────────────────────────────── */}
      <div className="settings-section">
        <div className="settings-section-title">Agency Cylinder Stock</div>
        <div style={{ padding: "14px 16px" }}>
          <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 12 }}>
            Set the current stock of filled and empty cylinders at the agency.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div className="form-group">
              <label className="form-label">Filled Cylinders</label>
              <input className="form-input" type="number" min="0" value={stockFilled} onChange={(e) => setStockFilled(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Empty Cylinders</label>
              <input className="form-input" type="number" min="0" value={stockEmpty} onChange={(e) => setStockEmpty(e.target.value)} />
            </div>
          </div>
          <button className="btn btn-primary btn-full" onClick={handleSaveStock} disabled={stockSaving}>
            {stockSaving ? "Saving…" : "Update Stock"}
          </button>
        </div>
      </div>

      {/* ── Appearance ───────────────────────────────────────── */}
      <div className="settings-section">
        <div className="settings-section-title">Appearance</div>
        <div className="settings-row">
          <label htmlFor="dark-toggle">Dark Mode</label>
          <label className="toggle">
            <input
              id="dark-toggle"
              type="checkbox"
              checked={darkMode}
              onChange={(e) => setDarkMode(e.target.checked)}
            />
            <span className="toggle-slider" />
          </label>
        </div>
      </div>

      {/* ── Data Safety & Backup ─────────────────────────────── */}
      <div className="settings-section">
        <div className="settings-section-title">Data Safety & Backup</div>
        <div style={{ padding: "14px 16px" }}>
          <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 12 }}>
            Protect your valuable agency records. Export a secure backup file of your entire database or restore from an existing backup file.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
            <button
              className="btn btn-primary"
              onClick={handleExportBackup}
              disabled={exporting}
              style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
            >
              📥 {exporting ? "Exporting..." : "Backup Data"}
            </button>
            <label
              className="btn btn-outline"
              style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, cursor: "pointer", margin: 0, textAlign: "center" }}
            >
              📤 {restoring ? "Restoring..." : "Restore Data"}
              <input
                type="file"
                accept=".json"
                onChange={handleImportBackup}
                disabled={restoring}
                style={{ display: "none" }}
              />
            </label>
          </div>
          <p style={{ fontSize: 11, color: "var(--danger)", margin: 0 }}>
            ⚠️ Restoring a backup will completely replace all existing records. Make sure the backup file is valid.
          </p>
        </div>
      </div>

      {/* ── Logout ───────────────────────────────────────────── */}
      <div className="settings-section">
        <div className="settings-section-title">Account</div>
        <div style={{ padding: "14px 16px" }}>
          <button
            className="btn btn-danger btn-full"
            onClick={handleLogout}
          >
            Sign Out
          </button>
        </div>
      </div>

      <div style={{ height: 16 }} />
    </AppShell>
  );
}