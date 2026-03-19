"use client";

import { useState } from "react";

type PixelAdminManagerProps = {
  initialCode: string;
};

export function PixelAdminManager({ initialCode }: PixelAdminManagerProps) {
  const [code, setCode] = useState(initialCode);
  const [status, setStatus] = useState(initialCode ? "Pixel активен" : "Pixel не установлен");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  const handleSave = async () => {
    setError("");
    setMessage("");
    setIsSaving(true);

    try {
      const response = await fetch("/api/pixel/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "save", code }),
      });
      const data = (await response.json()) as { ok?: boolean; message?: string };
      if (!response.ok || !data.ok) {
        throw new Error(data.message ?? "Failed to save");
      }
      setStatus("Pixel активен");
      setMessage("Success");
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Failed to save");
    } finally {
      setIsSaving(false);
    }
  };

  const handleClear = async () => {
    const confirmed = window.confirm("Удалить TikTok Pixel code?");
    if (!confirmed) return;

    setError("");
    setMessage("");
    setIsClearing(true);
    try {
      const response = await fetch("/api/pixel/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "clear" }),
      });
      const data = (await response.json()) as { ok?: boolean; message?: string };
      if (!response.ok || !data.ok) {
        throw new Error(data.message ?? "Failed to clear");
      }
      setCode("");
      setStatus("Pixel не установлен");
      setMessage("Pixel removed");
    } catch (clearError) {
      setError(clearError instanceof Error ? clearError.message : "Failed to clear");
    } finally {
      setIsClearing(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/pixel-auth/logout", { method: "POST" });
    window.location.reload();
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">TikTok Pixel Manager</h1>
        <p className="mt-1 text-sm text-zinc-600">
          Вставьте TikTok Pixel code из Ads Manager и сохраните.
        </p>
      </div>

      <p className="text-sm font-medium text-zinc-700">{status}</p>

      <textarea
        value={code}
        onChange={(event) => setCode(event.target.value)}
        placeholder="Вставьте TikTok Pixel code"
        className="min-h-52 w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none focus:border-zinc-400"
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving || isClearing}
          className="h-11 rounded-xl bg-zinc-900 px-4 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:opacity-60"
        >
          {isSaving ? "Сохранение..." : "Сохранить"}
        </button>
        <button
          type="button"
          onClick={handleClear}
          disabled={isSaving || isClearing}
          className="h-11 rounded-xl border border-zinc-300 px-4 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50 disabled:opacity-60"
        >
          {isClearing ? "Очистка..." : "Очистить пиксель"}
        </button>
        <button
          type="button"
          onClick={handleLogout}
          className="h-11 rounded-xl border border-zinc-300 px-4 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50"
        >
          Выйти
        </button>
      </div>

      {message ? <p className="text-sm text-emerald-700">{message}</p> : null}
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
