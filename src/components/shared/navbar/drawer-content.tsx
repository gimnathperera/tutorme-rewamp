"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface NavigationItem {
  name: string;
  href: string;
  current: boolean;
  dropdown?: { name: string; href: string }[];
}

const navigation: NavigationItem[] = [
  { name: "Request a Tutor", href: "/request-for-tutors", current: false },
  { name: "Register a Tutor", href: "/register-tutor", current: false },
  {
    name: "Academics",
    href: "/",
    current: false,
    dropdown: [
      { name: "Grades", href: "/grades" },
      { name: "Subjects", href: "/subjects" },
      { name: "Test Papers", href: "/test-papers" },
    ],
  },
  {
    name: "Tuition Rates",
    href: "/tuition-rates",
    current: false,
  },
  { name: "FAQ", href: "/#faq-section", current: false },
  { name: "Blog", href: "/blogs", current: false },
  { name: "Contact Us", href: "/#keep-in-touch-section", current: false },
];

interface DrawerContentProps {
  onClose: () => void;
}

const DrawerContent = ({ onClose }: DrawerContentProps) => {
  const [openDropdowns, setOpenDropdowns] = useState<Set<number>>(new Set());

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
          if (item.dropdown && item.dropdown.length > 0) {
            const isOpen = openDropdowns.has(index);
            return (
              <div
                key={index}
                className="border-b border-gray-100 last:border-none"
              >
                <button
                  onClick={() => toggleDropdown(index)}
                  className="w-full flex items-center justify-between py-3.5 text-sm font-medium text-gray-800 hover:text-blue-600 transition-colors"
                >
                  <span>{item.name}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="pb-2 flex flex-col gap-0.5">
                    {item.dropdown.map((sub, i) => (
                      <Link
                        key={i}
                        href={sub.href}
                        onClick={onClose}
                        className="py-2.5 pl-4 text-sm text-gray-500 hover:text-blue-600 transition-colors"
                      >
                        {sub.name}
                      </Link>
                    ))}
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
                className="block py-3.5 text-sm font-medium text-gray-800 hover:text-blue-600 transition-colors"
              >
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
