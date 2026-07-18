"use client";

import { useState } from "react";

type SyncResult = {
  provider: string;
  fetched: number;
  synced: number;
  error?: string;
};

type ProviderOption = "google" | "facebook" | "all";

const providers: { key: ProviderOption; label: string; logo: string; color: string }[] = [
  { key: "google",   label: "Google",   logo: "G", color: "bg-blue-500/10 border-blue-500/25 text-blue-300" },
  { key: "facebook", label: "Facebook", logo: "f", color: "bg-indigo-500/10 border-indigo-500/25 text-indigo-300" },
  { key: "all",      label: "Sync All", logo: "↻", color: "bg-[rgba(201,168,76,0.1)] border-[rgba(201,168,76,0.25)] text-[#C9A84C]" },
];

export function ReviewSyncPanel() {
  const [loading, setLoading] = useState<ProviderOption | null>(null);
  const [results, setResults] = useState<SyncResult[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function triggerSync(provider: ProviderOption) {
    setLoading(provider);
    setResults(null);
    setError(null);

    try {
      const res = await fetch("/api/admin/reviews/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider }),
      });

      const data = (await res.json()) as { ok?: boolean; results?: SyncResult[]; error?: string };

      if (!res.ok || !data.ok) {
        setError(data.error ?? `Request failed (${res.status})`);
        return;
      }

      setResults(data.results ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="surface-panel rounded-[1.75rem] p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="label-md text-[#C9A84C]">Review sync</p>
          <h2 className="mt-1 text-xl font-semibold text-foreground">
            Pull reviews from Google &amp; Facebook
          </h2>
          <p className="mt-1.5 text-sm text-(--ink-variant)">
            Fetches live reviews from your connected accounts and saves them to the database.
          </p>
        </div>
      </div>

      {/* Sync buttons */}
      <div className="mt-5 flex flex-wrap gap-3">
        {providers.map((p) => (
          <button
            key={p.key}
            type="button"
            disabled={loading !== null}
            onClick={() => triggerSync(p.key)}
            className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed ${p.color} hover:brightness-110`}
          >
            {loading === p.key ? (
              <span className="inline-block h-3.5 w-3.5 rounded-full border-2 border-current border-t-transparent animate-spin" />
            ) : (
              <span className="font-bold text-base leading-none">{p.logo}</span>
            )}
            {loading === p.key ? "Syncing…" : `Sync ${p.label}`}
          </button>
        ))}
      </div>

      {/* Results */}
      {results && (
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {results.map((r) => (
            <div
              key={r.provider}
              className={`rounded-xl border p-4 text-sm ${
                r.error
                  ? "bg-red-500/8 border-red-500/20"
                  : "bg-emerald-500/8 border-emerald-500/20"
              }`}
            >
              <p className="font-semibold text-foreground capitalize">{r.provider}</p>
              {r.error ? (
                <p className="mt-1 text-red-300 text-xs leading-5">{r.error}</p>
              ) : (
                <div className="mt-2 flex gap-4 text-xs text-(--ink-variant)">
                  <span>
                    <strong className="text-foreground">{r.fetched}</strong> fetched
                  </span>
                  <span>
                    <strong className="text-emerald-300">{r.synced}</strong> new
                  </span>
                  <span>
                    <strong className="text-foreground">{r.fetched - r.synced}</strong> already saved
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/8 px-4 py-3 text-sm text-red-300">
          ✕ {error}
        </div>
      )}

      {/* Credential notice */}
      <div className="mt-5 rounded-xl border border-[rgba(201,168,76,0.15)] bg-[rgba(201,168,76,0.05)] px-4 py-3 text-xs text-(--ink-variant) leading-5">
        <strong className="text-[#C9A84C]">Credentials required:</strong>{" "}
        Set <code className="text-[#C9A84C]">GOOGLE_PLACES_API_KEY</code>,{" "}
        <code className="text-[#C9A84C]">GOOGLE_PLACE_ID</code>,{" "}
        <code className="text-[#C9A84C]">FACEBOOK_PAGE_ID</code>, and{" "}
        <code className="text-[#C9A84C]">FACEBOOK_PAGE_TOKEN</code> in your root <code className="text-[#C9A84C]">.env</code> file.
      </div>
    </div>
  );
}
