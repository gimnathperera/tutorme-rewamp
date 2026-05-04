export const normalizeTextSpaces = (value: unknown) =>
  typeof value === "string" ? value.trim().replace(/\s+/g, " ") : value;

export const trimText = (value: unknown) =>
  typeof value === "string" ? value.trim() : value;

export const removeWhitespace = <T>(value: T): T extends string ? string : T =>
  (typeof value === "string"
    ? value.replace(/\s+/g, "")
    : value) as T extends string ? string : T;

export const stripLeadingSpaces = (value: string) => value.replace(/^\s+/, "");

export const collapseTextSpaces = (value: string) =>
  value.replace(/^\s+/, "").replace(/\s+/g, " ").trimEnd();
