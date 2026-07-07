"use client";

import { useLocale } from "next-intl";
import { usePathname } from "next/navigation";
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

interface LocaleSwitcherProps {
  onDark?: boolean;
}

const LocaleSwitcher = ({ onDark = false }: LocaleSwitcherProps) => {
  const locale = useLocale() as Locale;
  const pathname = usePathname();

  const handleChange = (newLocale: Locale) => {
    const localePrefix = new RegExp(`^/(${locales.join("|")})`);
    const pathWithoutLocale = pathname.replace(localePrefix, "");
    // Hard reload so all translated content (backend data, cached state) refreshes
    window.location.href = `/${newLocale}${pathWithoutLocale}`;
  };

  // Single compact design shared across desktop and mobile so the switcher looks
  // identical everywhere; `onDark` adapts it to a transparent hero background.
  const triggerClass = onDark
    ? "h-8 w-auto gap-0.5 rounded-full border border-white/40 bg-white/10 px-3 py-1 text-sm font-medium text-white shadow-none hover:bg-white/20 focus:ring-0 [&>span]:flex [&>span]:items-center [&>svg]:h-3.5 [&>svg]:w-3.5 [&>svg]:text-white"
    : "h-8 w-auto gap-0.5 rounded-full border border-gray-200 bg-white px-3 py-1 text-sm font-medium text-gray-700 shadow-none hover:bg-gray-50 focus:ring-0 [&>span]:flex [&>span]:items-center [&>svg]:h-3.5 [&>svg]:w-3.5";

  return (
    <Select value={locale} onValueChange={(val) => handleChange(val as Locale)}>
      <SelectTrigger className={triggerClass} aria-label="Select language">
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
