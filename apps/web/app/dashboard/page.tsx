import Link from "next/link";
import { fetchAdminJson } from "../lib/admin-api";
import { ReviewSyncPanel } from "./components/ReviewSyncPanel";
import { ReviewsList } from "./components/ReviewsList";

type Analytics = {
  totalLeads: number;
  bookingsToday: number;
  aiConversations: number;
  highRiskCases: number;
  conversionRate: number;
};

type LeadItem = {
  id: string;
  name?: string | null;
  email?: string | null;
  visa_type: string;
  status: string;
  score: number;
  created_at: string;
};

type ReviewItem = {
  id: string;
  source: string;
  author?: string | null;
  rating: number;
  content: string;
  ai_reply_draft?: string | null;
  approved: boolean;
  synced_at: string;
};

type ActivityItem = {
  id: string;
  event_type: string;
  status: string;
  detail?: string | null;
  created_at: string;
};

type SettingsResponse = {
  settings: Array<{ key: string; value: unknown; updated_at: string }>;
};

type PromptResponse = {
  value: string | null;
};

async function loadDashboardData() {
  const [analytics, leads, reviews, activity, settings, prompt] =
    await Promise.all([
      fetchAdminJson<Analytics>("/api/admin/analytics"),
      fetchAdminJson<{ leads: LeadItem[] }>("/api/admin/leads?limit=5"),
      fetchAdminJson<{ reviews: ReviewItem[] }>("/api/admin/reviews?limit=5"),
      fetchAdminJson<{ logs: ActivityItem[] }>(
        "/api/admin/automation-logs?limit=5",
      ),
      fetchAdminJson<SettingsResponse>("/api/admin/settings"),
      fetchAdminJson<PromptResponse>("/api/admin/ai-prompt"),
    ]);

  return {
    analytics,
    leads: leads.leads ?? [],
    reviews: reviews.reviews ?? [],
    activity: activity.logs ?? [],
    settings,
    prompt,
  };
}

function statusTone(status: string) {
  const normalized = status.toLowerCase();
  if (
    ["completed", "approved", "connected", "published", "ok"].includes(
      normalized,
    )
  ) {
    return "bg-emerald-400/15 text-emerald-200";
  }
  if (["failed", "error", "high"].includes(normalized)) {
    return "bg-red-400/15 text-red-200";
  }
  return "bg-amber-400/15 text-amber-200";
}

function formatTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export default async function DashboardPage() {
  const data = await loadDashboardData();
  const backendAddress =
    process.env.API_BASE_URL ??
    process.env.NEXT_PUBLIC_API_BASE_URL ??
    "http://localhost:4000";
  const connectionDetails = data.settings.settings.filter((item) =>
    ["api_base_url", "admin_api_key"].includes(item.key),
  ).length;
  const promptPreview = data.prompt.value?.trim()
    ? data.prompt.value.trim().slice(0, 180)
    : "No custom instructions saved yet.";

  return (
    <main className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8">
      <section className="hero-panel rounded-[2rem] px-6 py-8 sm:px-8">
        <p className="label-md text-(--secondary)">Live control center</p>
        <div className="mt-3 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="font-display text-4xl font-semibold tracking-tight text-foreground">
              Admin dashboard
            </h1>
            <p className="mt-3 max-w-2xl text-(--ink-variant)">
              A simple live view of what is coming in, what needs attention, and
              what the system handled already.
            </p>
          </div>
          <div className="surface-card px-4 py-3 text-sm text-(--ink-variant)">
            <p className="font-semibold text-foreground">Connected to</p>
            <p className="mt-1 break-all">{backendAddress}</p>
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {[
          {
            label: "People who reached out",
            value: data.analytics.totalLeads,
            note: "All enquiries captured by the backend.",
          },
          {
            label: "Bookings today",
            value: data.analytics.bookingsToday,
            note: "Appointments scheduled for today.",
          },
          {
            label: "Messages reviewed",
            value: data.analytics.aiConversations,
            note: "AI-assisted case checks stored in the system.",
          },
          {
            label: "Higher-risk cases",
            value: data.analytics.highRiskCases,
            note: "Items that need a closer look.",
          },
          {
            label: "From enquiry to booking",
            value: `${data.analytics.conversionRate}%`,
            note: "Share of leads that became bookings.",
          },
        ].map((card) => (
          <article key={card.label} className="surface-card p-5">
            <p className="text-sm font-medium text-(--ink-variant)">
              {card.label}
            </p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
              {card.value}
            </p>
            <p className="mt-2 text-sm leading-6 text-(--ink-variant)">
              {card.note}
            </p>
          </article>
        ))}
      </section>

      <section className="mt-8 grid gap-4 xl:grid-cols-2">
        <article className="surface-panel rounded-[1.75rem] p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                Latest people
              </h2>
              <p className="mt-2 text-sm leading-6 text-(--ink-variant)">
                New enquiries and their current status.
              </p>
            </div>
            <Link
              href="/dashboard"
              className="rounded-full border border-(--border-subtle) px-3 py-2 text-xs font-semibold text-foreground"
            >
              Refresh view
            </Link>
          </div>
          <div className="mt-5 grid gap-3">
            {data.leads.length > 0 ? (
              data.leads.map((lead) => (
                <div key={lead.id} className="surface-card p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-base font-semibold text-foreground">
                        {lead.name ?? "Unnamed person"}
                      </p>
                      <p className="mt-1 text-sm text-(--ink-variant)">
                        {lead.visa_type} · Score {lead.score} ·{" "}
                        {formatTime(lead.created_at)}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${statusTone(lead.status)}`}
                    >
                      {lead.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-(--ink-variant)">
                No people have come in yet.
              </p>
            )}
          </div>
        </article>

        <article className="surface-panel rounded-[1.75rem] p-6">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            Live notes
          </h2>
          <p className="mt-2 text-sm leading-6 text-(--ink-variant)">
            What the backend and WordPress settings are showing right now.
          </p>
          <div className="mt-5 grid gap-3">
            <div className="surface-card p-4">
              <p className="text-sm font-semibold text-foreground">
                Connection
              </p>
              <p className="mt-2 text-sm text-(--ink-variant)">
                Backend: {backendAddress}
              </p>
              <span className="mt-3 inline-flex rounded-full bg-emerald-500/12 px-3 py-1 text-xs font-semibold text-emerald-700">
                Connected
              </span>
            </div>
            <div className="surface-card p-4">
              <p className="text-sm font-semibold text-foreground">
                Saved settings
              </p>
              <p className="mt-2 text-sm text-(--ink-variant)">
                {connectionDetails} of 2 connection details saved.
              </p>
            </div>
            <div className="surface-card p-4">
              <p className="text-sm font-semibold text-foreground">
                AI instructions
              </p>
              <p className="mt-2 text-sm leading-6 text-(--ink-variant)">
                {promptPreview}
              </p>
            </div>
          </div>
        </article>
      </section>

      {/* Review sync panel */}
      <section className="mt-8">
        <ReviewSyncPanel />
      </section>

      <section className="mt-8 grid gap-4 xl:grid-cols-2">
        <article className="surface-panel rounded-[1.75rem] p-6">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            Recent reviews
          </h2>
          <p className="mt-2 text-sm leading-6 text-(--ink-variant)">
            Latest feedback and whether there is a reply draft ready.
          </p>
          <ReviewsList initialReviews={data.reviews} />
        </article>

        <article className="surface-panel rounded-[1.75rem] p-6">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            Recent activity
          </h2>
          <p className="mt-2 text-sm leading-6 text-(--ink-variant)">
            The latest actions the system already handled.
          </p>
          <div className="mt-5 grid gap-3">
            {data.activity.length > 0 ? (
              data.activity.map((item) => (
                <div key={item.id} className="surface-card p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-base font-semibold text-foreground">
                        {item.event_type.replaceAll("_", " ")}
                      </p>
                      <p className="mt-1 text-sm text-(--ink-variant)">
                        {formatTime(item.created_at)}
                        {item.detail ? ` · ${item.detail}` : ""}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${statusTone(item.status)}`}
                    >
                      {item.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-(--ink-variant)">
                No recent activity yet.
              </p>
            )}
          </div>
        </article>
      </section>
    </main>
  );
}
