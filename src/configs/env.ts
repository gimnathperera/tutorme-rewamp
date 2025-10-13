import z from "zod";

const ENV_VARIABLES = {
  NEXT_PUBLIC_API_URL:
    process.env.NEXT_PUBLIC_API_URL || "https://api.placeholder.com",
  NODE_ENV: process.env.NODE_ENV,
  NEXT_PUBLIC_WHATSAPP_NUMBER:
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "1234567890",
};

const envSchema = z
  .object({
    NEXT_PUBLIC_API_URL: z.string().url(),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    NEXT_PUBLIC_WHATSAPP_NUMBER: z.string().min(10).max(15),
  })
  .strict();

const result = envSchema.safeParse(ENV_VARIABLES);

if (!result.success) {
  console.log(result.error.issues);
  // Only exit in production, allow build to continue otherwise
  if (process.env.NODE_ENV === "production" && typeof window !== "undefined") {
    process.exit(-1);
  }
}

const parsedEnv = result.data;

export const env = {
  app: {
    nodeEnv: parsedEnv.NODE_ENV,
    whatsAppNumber: parsedEnv.NEXT_PUBLIC_WHATSAPP_NUMBER,
  },
  urls: {
    apiUrl: parsedEnv.NEXT_PUBLIC_API_URL,
  },
};
