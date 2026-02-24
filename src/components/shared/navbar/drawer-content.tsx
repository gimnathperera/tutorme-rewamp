"use client";

import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
    name: "Tuition",
    href: "/",
    current: false,
    dropdown: [
      { name: "Tuition Rates", href: "/tuition-rates" },
    ],
  },
  {
    name: "FAQ",
    href: "/#faq-section",
    current: false,
  },
  { name: "Blog", href: "/blogs", current: false },
  { name: "Contact Us", href: "/#keep-in-touch-section", current: false },
];

interface DrawerContentProps {
  onClose: () => void;
}

const DrawerContent = ({ onClose }: DrawerContentProps) => {
  return (
    <div
      className="rounded-md max-w-sm w-full mx-auto px-4"
      onClick={(e) => e.stopPropagation()} // 👈 Prevent drawer close
    >
      <Accordion type="multiple" className="w-full">
        {navigation.map((item, index) => {
          if (item.dropdown && item.dropdown.length > 0) {
            return (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-base text-black hover:text-purple-600">
                  {item.name}
                </AccordionTrigger>
                <AccordionContent className="flex flex-col gap-1 pl-4">
                  {item.dropdown.map((sub, i) => (
                    <Link
                      key={i}
                      href={sub.href}
                      className="text-sm text-muted-foreground hover:text-purple-600 transition-colors"
                      onClick={onClose}
                    >
                      {sub.name}
                    </Link>
                  ))}
                </AccordionContent>
              </AccordionItem>
            );
          }

          return (
            <div key={index} className="py-1">
              <Link
                href={item.href}
                className="block text-base text-black hover:text-purple-600 transition-colors"
                onClick={onClose}
              >
                {item.name}
              </Link>
            </div>
          );
        })}
      </Accordion>
    </div>
  );
};

export default DrawerContent;
