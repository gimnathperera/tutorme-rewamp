import z from "zod";

/**
 * Schema validation
 */
const envSchema = z
  .object({
    NEXT_PUBLIC_API_URL: z.string().url(),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    NEXT_PUBLIC_WHATSAPP_NUMBER: z.string().min(10).max(15),
  })
  .strict();

/**
 * IMPORTANT:
 * Next.js requires STATIC env access.
 * NEVER use process.env[key]
 */
const ENV_VARIABLES = {
  NEXT_PUBLIC_API_URL:
    process.env.NEXT_PUBLIC_API_URL ||
    "https://api.placeholder.com",

  NODE_ENV:
    (process.env.NODE_ENV as
      | "development"
      | "test"
      | "production"
      | undefined) || "development",

  NEXT_PUBLIC_WHATSAPP_NUMBER:
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "1234567890",
};

/**
 * Validate once
 */
const result = envSchema.safeParse(ENV_VARIABLES);

if (!result.success) {
  console.warn("Invalid environment variables:", result.error.issues);
}

const ENV = result.success ? result.data : ENV_VARIABLES;

/**
 * Exported env object
 */
export const env = {
  app: {
    nodeEnv: ENV.NODE_ENV,
    whatsAppNumber: ENV.NEXT_PUBLIC_WHATSAPP_NUMBER,
  },

  urls: {
    apiUrl: ENV.NEXT_PUBLIC_API_URL,
  },
};
