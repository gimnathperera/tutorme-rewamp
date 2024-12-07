import destr from "destr";

export const prefix = "tutor-me";

export const setLocalStorageItem = <T>(
  key: LocalStorageKey,
  value: T
): void => {
  if (typeof Storage == "undefined") {
    return;
  }

  if (localStorage)
    localStorage.setItem(`${prefix}-${key}`, JSON.stringify(value));
};

export const getLocalStorageItem = <T>(key: LocalStorageKey): T | null => {
  if (typeof Storage == "undefined") {
    return null;
  }

  try {
    const stringifiedItem = localStorage.getItem(`${prefix}-${key}`);

    return destr(stringifiedItem);
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const removeLocalStorageItem = (key: LocalStorageKey): void => {
  localStorage.removeItem(`${prefix}-${key}`);
};

export const getLocalStorageKey = (key: LocalStorageKey): string => {
  return `${prefix}-${key}`;
};

export enum LocalStorageKey {
  USER_DATA = "user-data",
  TOKENS = "tokens",
}
