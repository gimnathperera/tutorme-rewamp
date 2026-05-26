"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { locales, type Locale } from "@/i18n/config";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const LOCALE_LABELS: Record<Locale, { short: string; full: string }> = {
  en: { short: "En", full: "English" },
  si: { short: "සිං", full: "Sinhala" },
  ta: { short: "தம்", full: "Tamil" },
};

const LocaleSwitcher = () => {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();

  const handleChange = (newLocale: Locale) => {
    const localePrefix = new RegExp(`^/(${locales.join("|")})`);
    const pathWithoutLocale = pathname.replace(localePrefix, "");
    router.replace(`/${newLocale}${pathWithoutLocale}`);
  };

  return (
    <Select value={locale} onValueChange={(val) => handleChange(val as Locale)}>
      <SelectTrigger
        className="h-10 w-auto gap-1 rounded-full border border-primary-200 bg-white px-4 py-2 text-sm font-medium text-primary-700 shadow-none hover:bg-primary-100 hover:border-primary-400 focus:ring-1 focus:ring-primary-300 transition-colors duration-150 [&>span]:flex [&>span]:items-center"
        aria-label="Select language"
      >
        <SelectValue>
          {LOCALE_LABELS[locale]?.short ?? locale.toUpperCase()}
        </SelectValue>
      </SelectTrigger>
      <SelectContent align="end" className="min-w-[7rem] bg-white">
        {(Object.keys(LOCALE_LABELS) as Locale[]).map((loc) => (
          <SelectItem key={loc} value={loc}>
            <span className="flex items-center gap-2">
              <span className="w-5 text-center font-medium">
                {LOCALE_LABELS[loc].short}
              </span>
              <span className="text-muted-foreground">
                {LOCALE_LABELS[loc].full}
              </span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default LocaleSwitcher;
