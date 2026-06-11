"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname } from "@/navigation";
import { useTranslations } from "next-intl";
import { ChevronDown } from "lucide-react";
import LocaleSwitcher from "../locale-switcher";

interface NavigationItem {
  name: string;
  href: string;
  dropdown?: { name: string; href: string }[];
}

interface DrawerContentProps {
  isDrawerOpen: boolean;
  onClose: () => void;
}

const DrawerContent = ({ isDrawerOpen, onClose }: DrawerContentProps) => {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [openDropdowns, setOpenDropdowns] = useState<Set<number>>(new Set());

  const navigation: NavigationItem[] = useMemo(
    () => [
      { name: t("home"), href: "/" },
      { name: t("requestForTutor"), href: "/request-for-tutors" },
      { name: t("registerAsTutor"), href: "/register-tutor" },
      { name: t("pastExamPapers"), href: "/past-exam-papers" },
      { name: t("tuitionRates"), href: "/tuition-rates" },
      { name: t("faq"), href: "/faq" },
      { name: t("blog"), href: "/blogs" },
      { name: t("contactUs"), href: "/contact-us" },
    ],
    [t],
  );

  const isActiveHref = useCallback(
    (href: string) => {
      if (href === "/") return pathname === "/";

      return pathname.startsWith(href);
    },
    [pathname],
  );

  const isActiveItem = (item: NavigationItem) => {
    if (item.dropdown) {
      return item.dropdown.some((sub) => isActiveHref(sub.href));
    }

    return isActiveHref(item.href);
  };

  useEffect(() => {
    if (!isDrawerOpen) {
      setOpenDropdowns(new Set());
      return;
    }

    const activeDropdowns = new Set<number>();

    navigation.forEach((item, index) => {
      if (item.dropdown?.some((sub) => isActiveHref(sub.href))) {
        activeDropdowns.add(index);
      }
    });

    setOpenDropdowns(activeDropdowns);
  }, [isDrawerOpen, isActiveHref, navigation]);

  const toggleDropdown = (index: number) => {
    setOpenDropdowns((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  return (
    <div className="w-full px-4 py-2" onClick={(e) => e.stopPropagation()}>
      <nav className="flex flex-col">
        {navigation.map((item, index) => {
          const isActive = isActiveItem(item);

          if (item.dropdown && item.dropdown.length > 0) {
            const isOpen = openDropdowns.has(index);
            return (
              <div
                key={index}
                className="border-b border-gray-100 last:border-none"
              >
                <button
                  onClick={() => toggleDropdown(index)}
                  className={[
                    "w-full flex items-center justify-between py-3.5 text-sm font-medium transition-colors",
                    isActive
                      ? "text-blue-600 font-semibold"
                      : "text-gray-800 hover:text-blue-600",
                  ].join(" ")}
                >
                  <span>{item.name}</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      isActive ? "text-blue-600" : "text-gray-400"
                    } ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {isOpen && (
                  <div className="pb-2 flex flex-col gap-0.5">
                    {item.dropdown.map((sub, i) => {
                      const isSubActive = isActiveHref(sub.href);

                      return (
                        <Link
                          key={i}
                          href={sub.href}
                          onClick={onClose}
                          className={[
                            "flex items-center gap-2 py-2.5 pl-4 text-sm transition-colors",
                            isSubActive
                              ? "text-blue-600 font-semibold"
                              : "text-gray-500 hover:text-blue-600",
                          ].join(" ")}
                        >
                          {isSubActive && (
                            <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                          )}
                          {sub.name}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          return (
            <div
              key={index}
              className="border-b border-gray-100 last:border-none"
            >
              <Link
                href={item.href}
                onClick={onClose}
                className={[
                  "flex items-center gap-2 py-3.5 text-sm font-medium transition-colors",
                  isActive
                    ? "text-blue-600 font-semibold"
                    : "text-gray-800 hover:text-blue-600",
                ].join(" ")}
              >
                {isActive && (
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                )}
                {item.name}
              </Link>
            </div>
          );
        })}
      </nav>
      <div className="mt-4 border-t border-gray-100 pt-4">
        <LocaleSwitcher />
      </div>
    </div>
  );
};

export default DrawerContent;
