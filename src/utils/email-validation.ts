const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const providerDomains: Record<string, string[]> = {
  gmail: ["gmail.com", "googlemail.com"],
  yahoo: ["yahoo.com"],
  hotmail: ["hotmail.com"],
  outlook: ["outlook.com"],
  icloud: ["icloud.com"],
};

// Generic TLDs the backend (Joi's IANA-backed `.email()`) accepts. Any
// two-letter TLD is treated as a country code. Longer TLDs must be in this
// list, so obvious fakes like ".mjk" are rejected on the client too. The
// server remains the source of truth — this just catches the common cases.
const COMMON_GENERIC_TLDS = new Set([
  "com", "org", "net", "edu", "gov", "mil", "int", "arpa", "info", "biz",
  "name", "pro", "aero", "asia", "cat", "coop", "jobs", "mobi", "museum",
  "post", "tel", "travel", "xxx", "io", "co", "ai", "app", "dev", "xyz",
  "online", "site", "tech", "store", "blog", "cloud", "email", "live", "tv",
  "cc", "ws", "fm", "me", "ly", "ngo", "ong", "one", "plus", "vip", "wiki",
  "academy", "agency", "business", "capital", "care", "careers", "center",
  "city", "club", "community", "company", "consulting", "design", "digital",
  "directory", "education", "events", "expert", "finance", "fund", "global",
  "group", "guru", "health", "help", "host", "institute", "international",
  "life", "ltd", "management", "marketing", "media", "network", "news",
  "ninja", "partners", "photography", "press", "productions", "school",
  "services", "shop", "social", "solutions", "space", "studio", "systems",
  "team", "today", "tools", "training", "ventures", "website", "work",
  "works", "world", "zone", "page", "games", "gold", "green", "money", "fit",
  "fun", "run", "sport", "studio",
]);

/**
 * Returns true when the email's TLD looks valid (a 2-letter country code or a
 * known generic TLD). Mirrors the backend's Joi `.email()` TLD validation so
 * invalid TLDs (e.g. "name@host.mjk") are flagged on the client too.
 */
export const hasValidEmailTld = (email: string) => {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return false;
  const tld = email.split(".").pop()?.toLowerCase() ?? "";
  if (/^[a-z]{2}$/.test(tld)) return true;
  return COMMON_GENERIC_TLDS.has(tld);
};

export const getEmailFormatError = (email: string) => {
  if (!emailPattern.test(email)) {
    return "Please enter a valid email address";
  }

  const domain = email.split("@")[1]?.toLowerCase();
  const domainName = domain?.split(".")[0];

  if (
    domain &&
    domainName &&
    providerDomains[domainName] &&
    !providerDomains[domainName].includes(domain)
  ) {
    return `Please enter a valid ${domainName} email address`;
  }

  return null;
};
