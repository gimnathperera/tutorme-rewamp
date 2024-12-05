import { AuthUserData } from "@/types/auth-types";
import { JWTPayload, createRemoteJWKSet, jwtVerify } from "jose";
import { z } from "zod";
import { LocalStorageKey, getLocalStorageItem } from "./local-storage";

export const getVerifiedJWT = async (
  token: string,
  jwks: ReturnType<typeof createRemoteJWKSet>
): Promise<JWTPayload> => {
  const { payload } = await jwtVerify(token, jwks, {});

  return payload;
};

export const getValidatedJWTPayload = (
  token: JWTPayload
): z.SafeParseSuccess<JWTValidatedPayload>["data"] => {
  const result = jwtSchema.safeParse(token);
  if (!result.success) throw new Error(result.error.message);

  return result.data;
};

export const shouldRefreshTokenBeReFetched = (): boolean => {
  const userData = getLocalStorageItem<AuthUserData>(LocalStorageKey.USER_DATA);
  if (!userData) return false;

  const threshold = 60 * 60 * 1000; // 1 hour
  const tokenExpirationDate = new Date(userData.exp * 1000);
  const expirationThresholdDate = new Date(Date.now() + threshold);

  return tokenExpirationDate < expirationThresholdDate;
};

const jwtSchema = z.object({
  sub: z.string(),
  userId: z.number(),
  userRole: z.string(),
  name: z.string(),
  preferred_username: z.string(),
  email: z.string().email(),
  iat: z.number(),
  exp: z.number(),
  mfaVerified: z.boolean(),
  customerName: z.string().nullable(),
  customerId: z.number().nullable(),
});

export type JWTValidatedPayload = z.infer<typeof jwtSchema>;
