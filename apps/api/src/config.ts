import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { z } from "zod";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const repoRootEnvPath = path.resolve(currentDir, "../../../.env");
dotenv.config({ path: repoRootEnvPath, override: false });
dotenv.config();

const envSchema = z.object({
  API_PORT: z.string().optional(),
  PORT: z.string().optional(),
  DATABASE_URL: z.string().min(1),
  OLLAMA_BASE_URL: z.string().default("http://localhost:11434"),
  OLLAMA_MODEL: z.string().default("llama3"),
  CALCOM_API_KEY: z.string().optional(),
  CALCOM_BASE_URL: z.string().default("https://api.cal.com/v2"),
  TELEGRAM_BOT_TOKEN: z.string().optional(),
  TELEGRAM_CHAT_ID: z.string().optional(),
  TELEGRAM_WEBHOOK_SECRET: z.string().optional(),
  NOTIFY_EMAIL: z.string().email().optional(),
  AI_AGENT_KEY: z.string().optional(),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  SMTP_FROM: z.string().optional(),
  N8N_WEBHOOK_BASE_URL: z.string().optional(),
  ADMIN_API_KEY: z.string().optional(),
  GOOGLE_PLACES_API_KEY: z.string().optional(),
  GOOGLE_PLACE_ID: z.string().optional(),
  FACEBOOK_PAGE_ID: z.string().optional(),
  FACEBOOK_PAGE_TOKEN: z.string().optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error(
    "Invalid environment configuration",
    parsed.error.flatten().fieldErrors,
  );
  process.exit(1);
}

const env = parsed.data;

export const config = {
  port: Number(env.API_PORT ?? env.PORT ?? 4000),
  databaseUrl: env.DATABASE_URL,
  ollamaBaseUrl: env.OLLAMA_BASE_URL,
  ollamaModel: env.OLLAMA_MODEL,
  calcomApiKey: env.CALCOM_API_KEY,
  calcomBaseUrl: env.CALCOM_BASE_URL,
  telegramBotToken: env.TELEGRAM_BOT_TOKEN,
  telegramChatId: env.TELEGRAM_CHAT_ID,
  telegramWebhookSecret: env.TELEGRAM_WEBHOOK_SECRET,
  notifyEmail: env.NOTIFY_EMAIL,
  aiAgentKey: env.AI_AGENT_KEY,
  smtpHost: env.SMTP_HOST,
  smtpPort: env.SMTP_PORT ? Number(env.SMTP_PORT) : undefined,
  smtpUser: env.SMTP_USER,
  smtpPass: env.SMTP_PASS,
  smtpFrom: env.SMTP_FROM ?? env.SMTP_USER,
  n8nWebhookBaseUrl: env.N8N_WEBHOOK_BASE_URL,
  adminApiKey: env.ADMIN_API_KEY,
  googlePlacesApiKey: env.GOOGLE_PLACES_API_KEY,
  googlePlaceId: env.GOOGLE_PLACE_ID,
  facebookPageId: env.FACEBOOK_PAGE_ID,
  facebookPageToken: env.FACEBOOK_PAGE_TOKEN,
};
