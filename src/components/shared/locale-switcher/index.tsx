"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { locales, type Locale } from "@/i18n/config";

const LOCALE_LABELS: Record<Locale, string> = {
  en: "English",
  si: "සිංහල",
  ta: "தமிழ்",
};

const LocaleSwitcher = () => {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname(); // raw path e.g. "/si/faq"

  const handleChange = (newLocale: Locale) => {
    const localePrefix = new RegExp(`^/(${locales.join("|")})`);
    const pathWithoutLocale = pathname.replace(localePrefix, "");
    router.replace(`/${newLocale}${pathWithoutLocale}`);
  };

  return (
    <select
      value={locale}
      onChange={(e) => handleChange(e.target.value as Locale)}
      aria-label="Select language"
      className="bg-primary-50 text-primary-700 text-sm font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-300 border border-primary-200 rounded-full px-4 py-2 hover:bg-primary-100 hover:border-primary-400 transition-colors duration-150"
    >
      {(Object.keys(LOCALE_LABELS) as Locale[]).map((loc) => (
        <option key={loc} value={loc}>
          {LOCALE_LABELS[loc]}
        </option>
      ))}
    </select>
  );
};

export default LocaleSwitcher;
