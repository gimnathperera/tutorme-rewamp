"use client";
import { useState } from "react";
import { useAuthContext } from "@/contexts";
import { Disclosure } from "@headlessui/react";
import { Bars3Icon } from "@heroicons/react/24/outline";
import Link from "next/link";
import Modal from "../modal";
import Drawer from "./drawer-component";
import DrawerContent from "./drawer-content";
import { useAuthModalState } from "./hooks";
import ProfileDropdown from "./profile-section";

interface NavigationItem {
  name: string;
  href: string;
  current: boolean;
  dropdown?: { name: string; href: string }[];
}

const navigation: NavigationItem[] = [
  { name: "Find a Tutor", href: "/find-a-tutor", current: false },
  { name: "Grades", href: "/grades", current: false },
  { name: "Test Papers", href: "/test-papers", current: false },
  { name: "Tuition Rates", href: "/tuition-rates", current: false },
  { name: "FAQ", href: "/#faq-section", current: false },
  { name: "Blog", href: "/blogs", current: false },
  { name: "Contact Us", href: "/#keep-in-touch-section", current: false },
  {
    name: "Levels and Exams",
    href: "/",
    current: false,
    dropdown: [
      { name: "Primary Level", href: "/level-and-exams/1" },
      { name: "Grade 6 to 9 Level", href: "/level-and-exams/2" },
      { name: "GCE Ordinary Level", href: "/level-and-exams/3" },
      { name: "GCE Advanced Level", href: "/level-and-exams/4" },
    ],
  },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const Navbar = () => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

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

  const { user, isUserLoaded } = useAuthContext();

  return (
    <Disclosure as="nav" className="navbar">
      <div className="mx-auto max-w-7xl p-3 md:p-4 lg:px-8">
        <div className="relative flex h-12 sm:h-20 items-center">
          <div className="flex flex-1 items-center sm:justify-between">
            <div className="flex flex-shrink-0 items-center">
              <Link
                href="/"
                className="text-2xl sm:text-4xl font-semibold text-black"
              >
                Tutor Me
              </Link>
            </div>

            <div className="hidden lg:flex items-center">
              <div className="flex justify-end space-x-4 relative">
                {navigation.map((item) =>
                  item.dropdown ? (
                    <div key={item.name} className="relative">
                      <button
                        onClick={() => toggleDropdown(item.name)}
                        className={classNames(
                          item.current
                            ? "bg-gray-900"
                            : "navlinks hover:text-black",
                          "px-3 py-4 rounded-md text-lg font-normal flex items-center gap-1"
                        )}
                      >
                        {item.name}
                        <svg
                          className="w-4 h-4 ml-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>
                      {openDropdown === item.name && (
                        <div className="absolute mt-2 w-48 bg-white rounded-md shadow-lg z-50">
                          {item.dropdown.map((subItem) => (
                            <Link
                              key={subItem.name}
                              href={subItem.href}
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              onClick={() => setOpenDropdown(null)}
                            >
                              {subItem.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={classNames(
                        item.current
                          ? "bg-gray-900"
                          : "navlinks hover:text-black",
                        "px-3 py-4 rounded-md text-lg font-normal"
                      )}
                    >
                      {item.name}
                    </Link>
                  )
                )}
              </div>
            </div>

            <div className=" inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto md:ml-6 sm:pr-0">
              <div className="hidden lg:block">
                {user?.email ? (
                  <ProfileDropdown isLoading={!isUserLoaded} user={user} />
                ) : !isUserLoaded ? (
                  <ProfileDropdown isLoading={!isUserLoaded} user={user!} />
                ) : (
                  <button
                    type="button"
                    className="justify-end text-xl font-semibold bg-transparent py-4 px-6 lg:px-12 navbutton rounded-full hover:bg-navyblue hover:text-white"
                    onClick={handleOnChangeSignUpModalVisibility}
                  >
                    Login
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="block lg:hidden">
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
          >
            <DrawerContent />
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
