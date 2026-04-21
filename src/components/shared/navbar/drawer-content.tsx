"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";

interface NavigationItem {
  name: string;
  href: string;
  dropdown?: { name: string; href: string }[];
}

const navigation: NavigationItem[] = [
  { name: "Request for Tutor", href: "/request-for-tutors" },
  { name: "Register as a Tutor", href: "/register-tutor" },
  {
    name: "Academics",
    href: "/",
    dropdown: [
      { name: "Grades & Subjects", href: "/grades-and-subjects" },
      { name: "Test Papers", href: "/test-papers" },
    ],
  },
  {
    name: "Tuition Rates",
    href: "/tuition-rates",
  },
  { name: "FAQ", href: "/faq" },
  { name: "Blog", href: "/blogs" },
  { name: "Contact Us", href: "/contact-us" },
];

interface DrawerContentProps {
  onClose: () => void;
}

const DrawerContent = ({ onClose }: DrawerContentProps) => {
  const pathname = usePathname();
  const [openDropdowns, setOpenDropdowns] = useState<Set<number>>(new Set());

  const isActiveHref = useCallback((href: string) => {
    if (href === "/") return pathname === "/";

    return pathname.startsWith(href);
  }, [pathname]);

  const isActiveItem = (item: NavigationItem) => {
    if (item.dropdown) {
      return item.dropdown.some((sub) => isActiveHref(sub.href));
    }

    return isActiveHref(item.href);
  };

  useEffect(() => {
    setOpenDropdowns((prev) => {
      const next = new Set(prev);

      navigation.forEach((item, index) => {
        if (item.dropdown?.some((sub) => isActiveHref(sub.href))) {
          next.add(index);
        }
      });

      return next;
    });
  }, [isActiveHref]);

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
                    } ${
                      isOpen ? "rotate-180" : ""
                    }`}
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
    </div>
  );
};

export default DrawerContent;
