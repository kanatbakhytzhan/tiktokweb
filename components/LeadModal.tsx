"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { getUTMFromSearchParams, type UTMData } from "@/lib/utm";
import {
  formatKazakhstanPhone,
  isValidKazakhstanPhone,
  normalizePhone,
} from "@/lib/utils";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

type LeadModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const initialUtm: UTMData = {
  utmSource: "",
  utmMedium: "",
  utmCampaign: "",
  utmContent: "",
  utmTerm: "",
};

export function LeadModal({ isOpen, onClose }: LeadModalProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("+7");
  const [utm, setUtm] = useState<UTMData>(initialUtm);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const params = new URLSearchParams(window.location.search);
    setUtm(getUTMFromSearchParams(params));
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const body = document.body;
    const previousOverflow = body.style.overflow;
    body.style.overflow = "hidden";
    return () => {
      body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  const canSubmit = useMemo(
    () => name.trim().length > 1 && isValidKazakhstanPhone(phone) && !isLoading,
    [isLoading, name, phone],
  );

  const handlePhoneChange = (value: string) => {
    setPhone(formatKazakhstanPhone(value));
    if (error) setError("");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!name.trim()) {
      setError("Введите имя.");
      return;
    }

    if (!isValidKazakhstanPhone(phone)) {
      setError("Введите корректный номер в формате +7 (___) ___-__-__.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          phone: normalizePhone(phone).replace(/^8/, "7"),
          utm,
        }),
      });

      const data = (await response.json()) as { ok?: boolean; message?: string };

      if (!response.ok) {
        if (data?.message?.includes("GOOGLE_SCRIPT_URL")) {
          throw new Error(data.message);
        }
        throw new Error("Ошибка отправки. Попробуйте еще раз.");
      }

      if (!data?.ok) {
        throw new Error("Ошибка отправки. Попробуйте еще раз.");
      }

      setSuccess("Заявка отправлена. Переходим в WhatsApp...");
      window.location.href = buildWhatsAppUrl();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Не удалось отправить форму.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-3 backdrop-blur-[3px] sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="lead-modal-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md overflow-y-auto rounded-3xl bg-white shadow-2xl sm:max-h-[92dvh]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="px-5 pb-6 pt-5 sm:px-6 sm:pt-6">
          <div className="mb-1 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full text-2xl leading-none text-zinc-500 transition hover:bg-zinc-100"
              aria-label="Закрыть форму"
            >
              ×
            </button>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit} noValidate>
            <div className="text-center">
              <h3
                id="lead-modal-title"
                className="text-3xl font-bold leading-tight text-zinc-900 sm:text-4xl"
              >
                Оставьте контакты
              </h3>
              <p className="mt-2 text-base leading-6 text-zinc-600">
                И мы перезвоним в течение 15 минут
              </p>
            </div>

            <input
              type="tel"
              name="phone"
              value={phone}
              onChange={(event) => handlePhoneChange(event.target.value)}
              placeholder="Номер телефона"
              autoComplete="tel"
              inputMode="tel"
              className="h-12 w-full rounded-xl border border-zinc-200 bg-white px-4 text-base text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-orange-300 focus:ring-2 focus:ring-orange-200/60"
              aria-label="Номер телефона"
              required
            />

            <input
              type="text"
              name="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Имя"
              autoComplete="name"
              className="h-12 w-full rounded-xl border border-zinc-200 bg-white px-4 text-base text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-orange-300 focus:ring-2 focus:ring-orange-200/60"
              aria-label="Имя"
              required
            />

            <button
              type="submit"
              disabled={!canSubmit}
              style={{ WebkitTapHighlightColor: "transparent" }}
              className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-gradient-to-r from-[#FFC824] to-[#FF7A00] px-6 text-base font-semibold text-white outline-none transition hover:brightness-105 focus:outline-none focus-visible:outline-none active:translate-y-[1px] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? "Отправка..." : "Бесплатная консультация"}
            </button>

            {error ? (
              <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </p>
            ) : null}
            {success ? (
              <p className="rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                {success}
              </p>
            ) : null}

            <p className="pb-1 text-center text-xs leading-5 text-zinc-500">
              Нажимая на кнопку, вы соглашаетесь с политикой конфиденциальности
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
