"use client";

import { FormEvent, useState } from "react";

export function PixelAdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/pixel-auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = (await response.json()) as { ok?: boolean; message?: string };

      if (!response.ok || !data.ok) {
        throw new Error(data.message ?? "Invalid password");
      }

      window.location.reload();
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : "Invalid password",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <h1 className="text-2xl font-bold text-zinc-900">TikTok Pixel Manager</h1>
      <p className="text-sm text-zinc-600">Введите пароль для входа в админку.</p>
      <input
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        placeholder="Пароль"
        className="h-12 w-full rounded-xl border border-zinc-200 px-4 text-base outline-none focus:border-zinc-400"
        autoComplete="current-password"
        required
      />
      <button
        type="submit"
        disabled={isLoading}
        className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-zinc-900 px-4 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:opacity-60"
      >
        {isLoading ? "Проверка..." : "Войти"}
      </button>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </form>
  );
}
