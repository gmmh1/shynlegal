import { AISummary, RiskLevel, VisaType } from "./types.js";

const visaRiskMap: Record<VisaType, RiskLevel> = {
  "Spouse Visa": "medium",
  "Student Visa": "low",
  "Skilled Worker Visa": "medium",
  "Visit Visa": "medium",
  Citizenship: "low",
  Other: "high",
};

const missingByVisa: Record<VisaType, string[]> = {
  "Spouse Visa": ["income requirement", "proof of relationship"],
  "Student Visa": ["CAS letter", "funds evidence"],
  "Skilled Worker Visa": ["certificate of sponsorship", "salary threshold"],
  "Visit Visa": ["travel purpose", "financial support evidence"],
  Citizenship: ["residency timeline", "life in the UK test"],
  Other: ["route eligibility", "supporting evidence"],
};

export const services = [
  "Family Visas",
  "Student Visa",
  "Visit Visa",
  "Skilled Worker Visa",
  "Naturalisation & Citizenship",
  "EU Settlement Scheme",
  "Ancestry Visa",
  "E-Visa Transition",
  "Other Immigration Routes",
];

export const reviews = [
  {
    source: "Google",
    rating: 5,
    author: "S. Karim",
    content:
      "Clear guidance and fast response. The team handled my spouse visa case professionally.",
  },
  {
    source: "Facebook",
    rating: 5,
    author: "A. Singh",
    content:
      "The consultation was detailed and practical. I felt prepared before submitting my application.",
  },
  {
    source: "Google",
    rating: 4,
    author: "L. Morris",
    content:
      "Helpful process and excellent document checklist support from start to finish.",
  },
];

export function buildSummary(visaType: VisaType, details: string): AISummary {
  const detail = details.trim();
  const shortSummary =
    detail.length > 160 ? `${detail.slice(0, 157)}...` : detail;

  return {
    visa_type: visaType,
    summary: shortSummary || "Applicant shared initial immigration details.",
    risk: visaRiskMap[visaType],
    missing_info: missingByVisa[visaType],
    recommendation:
      visaType === "Other" ? "Submit enquiry" : "Book consultation",
  };
}
