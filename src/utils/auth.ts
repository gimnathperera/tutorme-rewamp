import { Tokens } from "@/types/auth-types";
import { LocalStorageKey, getLocalStorageItem } from "./local-storage";

export const shouldRefreshTokenBeReFetched = (): boolean => {
  const tokens = getLocalStorageItem<Tokens>(LocalStorageKey.TOKENS);

  if (!tokens) return false;

  const tokenExpirationDate = new Date(tokens.access.expires);
  const expirationThresholdDate = new Date(Date.now());

  return tokenExpirationDate < expirationThresholdDate;
};
