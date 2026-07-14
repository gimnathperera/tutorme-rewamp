export const GOOGLE_PREFILL_STORAGE_KEY = "tutor-me-google-prefill";

export type GooglePrefillData = {
  name: string;
  email: string;
  picture?: string;
  idToken: string;
};

export const writeGooglePrefill = (data: GooglePrefillData): void => {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(GOOGLE_PREFILL_STORAGE_KEY, JSON.stringify(data));
};

export const readAndClearGooglePrefill = (): GooglePrefillData | null => {
  if (typeof window === "undefined") return null;

  const raw = sessionStorage.getItem(GOOGLE_PREFILL_STORAGE_KEY);
  sessionStorage.removeItem(GOOGLE_PREFILL_STORAGE_KEY);

  if (!raw) return null;

  try {
    return JSON.parse(raw) as GooglePrefillData;
  } catch {
    return null;
  }
};
