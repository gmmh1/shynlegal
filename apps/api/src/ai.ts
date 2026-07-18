import { config } from "./config.js";
import type { AISummary, VisaType } from "./types.js";

function sanitizeSummary(input: unknown): AISummary | null {
  if (!input || typeof input !== "object") {
    return null;
  }

  const candidate = input as Record<string, unknown>;

  if (
    typeof candidate.visa_type !== "string" ||
    typeof candidate.summary !== "string" ||
    typeof candidate.risk !== "string" ||
    !Array.isArray(candidate.missing_info) ||
    typeof candidate.recommendation !== "string"
  ) {
    return null;
  }

  const risk =
    candidate.risk === "low" ||
    candidate.risk === "medium" ||
    candidate.risk === "high"
      ? candidate.risk
      : "medium";

  const recommendation =
    candidate.recommendation === "Submit enquiry"
      ? "Submit enquiry"
      : "Book consultation";

  return {
    visa_type: candidate.visa_type as VisaType,
    summary: candidate.summary,
    risk,
    missing_info: candidate.missing_info.filter(
      (v): v is string => typeof v === "string",
    ),
    recommendation,
  };
}

export async function generateOllamaSummary(input: {
  visaType: VisaType;
  details: string;
  promptOverride?: string;
}): Promise<AISummary | null> {
  const prompt = [
    input.promptOverride ||
      "You are an immigration case triage model for UK immigration support.",
    "Return JSON only with keys: visa_type, summary, risk, missing_info, recommendation.",
    "risk must be one of low|medium|high.",
    "recommendation must be one of Book consultation|Submit enquiry.",
    `visa_type: ${input.visaType}`,
    `details: ${input.details}`,
  ].join("\n");

  const response = await fetch(`${config.ollamaBaseUrl}/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: config.ollamaModel,
      prompt,
      stream: false,
      format: "json",
    }),
  });

  if (!response.ok) {
    return null;
  }

  const raw = (await response.json()) as { response?: string };
  if (!raw.response) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw.response) as unknown;
    return sanitizeSummary(parsed);
  } catch {
    return null;
  }
}

export async function generateReviewReplyDraft(input: {
  source: string;
  author?: string;
  rating: number;
  content: string;
}): Promise<string> {
  const prompt = [
    "Write a short, professional reply for a law firm responding to a public review.",
    "Keep it under 90 words.",
    "Acknowledge the feedback, avoid legal admissions, and invite offline contact where useful.",
    `source: ${input.source}`,
    `author: ${input.author ?? "Anonymous"}`,
    `rating: ${input.rating}`,
    `content: ${input.content}`,
  ].join("\n");

  try {
    const response = await fetch(`${config.ollamaBaseUrl}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: config.ollamaModel,
        prompt,
        stream: false,
      }),
    });

    if (response.ok) {
      const raw = (await response.json()) as { response?: string };
      if (raw.response?.trim()) {
        return raw.response.trim();
      }
    }
  } catch {
    // Fall back to deterministic copy below.
  }

  if (input.rating <= 3) {
    return "Thank you for your feedback. We are sorry your experience did not meet expectations. Please contact our team directly so we can review the matter carefully and respond with the appropriate support.";
  }

  return "Thank you for your kind feedback. We appreciate the opportunity to support your immigration matter and are glad the experience was helpful.";
}
