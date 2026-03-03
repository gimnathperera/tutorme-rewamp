"use client";

import { useState, useRef, useEffect } from "react";
import { useAuthContext } from "@/contexts";
import { Disclosure } from "@headlessui/react";
import { Bars3Icon, ChevronDownIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Modal from "../modal";
import Drawer from "./drawer-component";
import DrawerContent from "./drawer-content";
import { useAuthModalState } from "./hooks";
import ProfileDropdown from "./profile-section";

interface NavigationItem {
  name: string;
  href: string;
  dropdown?: { name: string; href: string }[];
}

const navigation: NavigationItem[] = [
  { name: "Request a Tutor", href: "/request-for-tutors" },
  { name: "Register a Tutor", href: "/register-tutor" },
  {
    name: "Academics",
    href: "/",
    dropdown: [
      { name: "Grades", href: "/grades" },
      { name: "Subjects", href: "/subjects" },
      { name: "Test Papers", href: "/test-papers" },
    ],
  },
  { name: "Tuition Rates", href: "/tuition-rates" },
  { name: "FAQ", href: "/#faq-section" },
  { name: "Blog", href: "/blogs" },
  { name: "Contact Us", href: "/#keep-in-touch-section" },
];

const Navbar = () => {
  const pathname = usePathname();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  /** The id of the anchor section currently in view on the home page, e.g. "faq-section" */
  const [activeSection, setActiveSection] = useState<string | null>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close dropdown on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenDropdown(null);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  /**
   * IntersectionObserver: watch anchor sections on the home page.
   * Fires only when pathname === "/" so we don't attach it on other pages.
   */
  useEffect(() => {
    if (pathname !== "/") {
      setActiveSection(null);
      return;
    }

    const sectionIds = ["faq-section", "keep-in-touch-section"];
    const observers: IntersectionObserver[] = [];

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(id);
          } else {
            // Clear only if this section was the active one
            setActiveSection((prev) => (prev === id ? null : prev));
          }
        },
        { threshold: 0.3 }, // section must be ≥ 30% visible
      );

      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((obs) => obs.disconnect());
  }, [pathname]);

  const toggleDropdown = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  const {
    isOpen,
    isSignUpModalOpen,
    formTitle,
    fromDescription,
    formImage,
    AuthForm,
    handleOnChangeSignUpModalVisibility,
    handleOnChangeDrawerVisibility,
  } = useAuthModalState();

  const { user, isUserLoaded, logout } = useAuthContext();

  /** True when the given nav item should be considered "active" */
  const isActive = (item: NavigationItem): boolean => {
    if (item.dropdown) {
      return item.dropdown.some((sub) => pathname.startsWith(sub.href));
    }
    if (item.href === "/") return pathname === "/";
    // Anchor links: active only when the corresponding section is in the viewport
    if (item.href.startsWith("/#")) {
      if (pathname !== "/") return false;
      const sectionId = item.href.slice(2); // "/#faq-section" → "faq-section"
      return activeSection === sectionId;
    }
    return pathname.startsWith(item.href);
  };

  return (
    <Disclosure as="nav" className="navbar">
      <div className="mx-auto max-w-7xl p-3 md:p-4">
        <div className="relative flex h-12 sm:h-20 items-center">
          <div className="flex flex-1 items-center sm:justify-between">
            {/* ── Logo ── */}
            <div className="flex flex-shrink-0 items-start">
              <Link href="/" className="text-xl sm:text-4xl flex font-semibold">
                <div className="text-black font-bold">Tuition</div>
                <div className="text-blue-600 font-bold"> Lanka</div>
              </Link>
            </div>

            {/* ── Desktop nav links ── */}
            <div className="hidden lg:flex items-center">
              <div
                ref={dropdownRef}
                className="flex justify-end space-x-1 relative"
              >
                {navigation.map((item) => {
                  const active = isActive(item);

                  return item.dropdown ? (
                    <div key={item.name} className="relative">
                      <button
                        onClick={() => toggleDropdown(item.name)}
                        aria-expanded={openDropdown === item.name}
                        aria-haspopup="true"
                        className={[
                          "group px-3 py-2 rounded-md text-base font-medium flex items-center gap-1 transition-colors duration-150",
                          active
                            ? "text-blue-600 font-semibold"
                            : "navlinks hover:text-blue-600",
                        ].join(" ")}
                      >
                        {item.name}
                        <ChevronDownIcon
                          className={[
                            "w-4 h-4 transition-transform duration-200",
                            openDropdown === item.name ? "rotate-180" : "",
                          ].join(" ")}
                        />
                        {/* active underline indicator */}
                        {active && (
                          <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-blue-600 rounded-full" />
                        )}
                      </button>

                      {/* ── Dropdown panel ── */}
                      <div
                        className={[
                          "absolute top-full left-0 mt-2 w-52 origin-top-left rounded-xl bg-white shadow-xl ring-1 ring-black/5 z-50",
                          "transition-all duration-200 ease-out",
                          openDropdown === item.name
                            ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
                            : "opacity-0 scale-95 -translate-y-1 pointer-events-none",
                        ].join(" ")}
                      >
                        <div className="py-1">
                          {item.dropdown.map((subItem, idx) => {
                            const subActive = pathname.startsWith(subItem.href);
                            return (
                              <Link
                                key={subItem.name}
                                href={subItem.href}
                                onClick={() => setOpenDropdown(null)}
                                className={[
                                  "flex items-center gap-2 px-4 py-2.5 text-sm transition-colors duration-100",
                                  idx !== 0 ? "border-t border-gray-50" : "",
                                  subActive
                                    ? "text-blue-600 font-semibold bg-blue-50"
                                    : "text-gray-700 hover:bg-gray-50 hover:text-blue-600",
                                ].join(" ")}
                              >
                                {subActive && (
                                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 flex-shrink-0" />
                                )}
                                {subItem.name}
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={[
                        "relative px-3 py-2 rounded-md text-base font-medium transition-colors duration-150",
                        active
                          ? "text-blue-600 font-semibold"
                          : "navlinks hover:text-blue-600",
                      ].join(" ")}
                    >
                      {item.name}
                      {/* animated underline for active link */}
                      <span
                        className={[
                          "absolute bottom-0 left-3 right-3 h-[2px] rounded-full bg-blue-600 transition-transform duration-200 origin-left",
                          active ? "scale-x-100" : "scale-x-0",
                        ].join(" ")}
                      />
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* ── Login / Profile ── */}
            <div className="inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:pr-0">
              <div className="hidden lg:block">
                {user?.email ? (
                  <ProfileDropdown isLoading={!isUserLoaded} user={user} />
                ) : !isUserLoaded ? (
                  <ProfileDropdown isLoading={!isUserLoaded} user={user!} />
                ) : (
                  <button
                    type="button"
                    className="justify-end text-xl font-semibold bg-transparent py-4 px-6 lg:px-12 navbutton rounded-full hover:bg-blue-600 hover:text-white transition-colors duration-200"
                    onClick={handleOnChangeSignUpModalVisibility}
                  >
                    Login
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* ── Mobile hamburger ── */}
          <div className="flex items-center gap-3 lg:hidden">
            {user?.email ? (
              <ProfileDropdown isLoading={!isUserLoaded} user={user} />
            ) : null}
            <Bars3Icon
              className="block h-6 w-6"
              aria-hidden="true"
              onClick={handleOnChangeDrawerVisibility}
            />
          </div>

          <Drawer
            isOpen={isOpen}
            setIsOpen={handleOnChangeDrawerVisibility}
            handleOnChangeSignUpModalVisibility={
              handleOnChangeSignUpModalVisibility
            }
            user={user}
            logout={logout}
          >
            <DrawerContent onClose={() => handleOnChangeDrawerVisibility()} />
          </Drawer>
        </div>
      </div>

      <Modal
        isOpen={isSignUpModalOpen}
        title={formTitle}
        closeModal={handleOnChangeSignUpModalVisibility}
        description={fromDescription}
        imagePath={formImage}
      >
        <AuthForm />
      </Modal>
    </Disclosure>
  );
};

export default Navbar;
