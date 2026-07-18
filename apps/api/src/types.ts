export type VisaType =
  | "Spouse Visa"
  | "Student Visa"
  | "Skilled Worker Visa"
  | "Visit Visa"
  | "Citizenship"
  | "Other";

export type RiskLevel = "low" | "medium" | "high";

export interface AIConversationInput {
  name?: string;
  email?: string;
  visaType: VisaType;
  details: string;
}

export interface AISummary {
  visa_type: VisaType;
  summary: string;
  risk: RiskLevel;
  missing_info: string[];
  recommendation: "Book consultation" | "Submit enquiry";
}
