"use client";
import { Disclosure } from "@headlessui/react";
import { Bars3Icon } from "@heroicons/react/24/outline";
import Link from "next/link";
import Modal from "../modal";
import Drawer from "./drawer-component";
import DrawerContent from "./drawer-content";
import { useAuthModalState } from "./hooks";

interface NavigationItem {
  name: string;
  href: string;
  current: boolean;
}

const navigation: NavigationItem[] = [
  { name: "Find a Tutor", href: "/find-a-tutor", current: false },
  { name: "Grades", href: "/grades", current: false },
  { name: "Test Papers", href: "/test-papers", current: false },
  { name: "FAQ", href: "/#faq-section", current: false },
  { name: "Blog", href: "/blogs", current: false },
  { name: "Contact Us", href: "/#keep-in-touch-section", current: false },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const Navbar = () => {
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

  return (
    <Disclosure as="nav" className="navbar">
      <>
        <div className="mx-auto max-w-7xl p-3 md:p-4 lg:px-8">
          <div className="relative flex h-12 sm:h-20 items-center">
            <div className="flex flex-1 items-center sm:justify-between">
              <div className="flex flex-shrink-0 items-center border-right">
                <Link
                  href="/"
                  className="text-2xl sm:text-4xl font-semibold text-black"
                >
                  Tutor Me
                </Link>
              </div>

              <div className="hidden lg:flex items-center border-right ">
                <div className="flex justify-end space-x-4">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={classNames(
                        item.current
                          ? "bg-gray-900"
                          : "navlinks hover:text-black",
                        "px-3 py-4 rounded-md text-lg font-normal"
                      )}
                      aria-current={item.href ? "page" : undefined}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
              <div className=" inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto md:ml-6 sm:pr-0">
                <div className="hidden lg:block">
                  <button
                    type="button"
                    className="justify-end text-xl font-semibold bg-transparent py-4 px-6 lg:px-12 navbutton rounded-full hover:bg-navyblue hover:text-white"
                    onClick={handleOnChangeSignUpModalVisibility}
                  >
                    Login
                  </button>
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
      </>

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
