import { Tokens } from "@/types/auth-types";
import {
  getLocalStorageItem,
  LocalStorageKey,
  removeLocalStorageItem,
  setLocalStorageItem,
} from "./local-storage";
import { env } from "@/configs/env";
import { Endpoints } from "@/store/api/endpoints";

export const handleForceLogout = () => {
  removeLocalStorageItem(LocalStorageKey.USER_DATA);
  removeLocalStorageItem(LocalStorageKey.TOKENS);
  localStorage.clear();
  window.location.href = "/";
};

export const getAccessToken = (): string | null => {
  const storedToken = getLocalStorageItem<Tokens>(LocalStorageKey.TOKENS);
  return storedToken?.access?.token || null;
};

export const handleRefreshTokenProcess = async (): Promise<boolean> => {
  const storedToken = getLocalStorageItem<Tokens>(LocalStorageKey.TOKENS);
  const refreshToken = storedToken?.refresh?.token;

  if (!refreshToken) {
    console.warn("No refresh token available.");
    return false;
  }

  try {
    const response = await fetch(
      `${env.urls.apiUrl}${Endpoints.RefreshToken}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      }
    );

    if (response.ok) {
      const newTokens = await response.json();
      setLocalStorageItem(LocalStorageKey.TOKENS, newTokens);
      console.log("Token refreshed successfully.");
      return true;
    } else {
      console.error("Failed to refresh token.");
      return false;
    }
  } catch (error) {
    console.error("Error while refreshing token:", error);
    return false;
  }
};
