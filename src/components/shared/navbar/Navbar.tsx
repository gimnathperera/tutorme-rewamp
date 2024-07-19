"use client";
import { Disclosure } from "@headlessui/react";
import { Bars3Icon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useState } from "react";
import FormLogin from "../../auth/form-login";
import Modal from "../modal";
import Drawer from "./Drawer";
import Drawerdata from "./Drawerdata";
import FormSignUp from "../../auth/form-sign-up";

interface NavigationItem {
  name: string;
  href: string;
  current: boolean;
}

enum FormType {
  Login = "Login",
  SignUp = "SignUp",
}

const navigation: NavigationItem[] = [
  { name: "Find a Tutor", href: "#aboutus-section", current: false },
  { name: "Tuition Rates", href: "#services-section", current: false },
  { name: "Subjects", href: "#faq-section", current: false },
  { name: "Test Papers", href: "#faq-section", current: false },
  { name: "FAQ", href: "#faq-section", current: false },
  { name: "Blog", href: "/blogs", current: false },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const [currentForm, setCurrentForm] = useState<FormType>(FormType.Login);

  const handleOnChangeSignUpModalVisibility = () => {
    setIsSignUpModalOpen((show) => !show);
  };

  const handleOnChangeForm = () => {
    if (currentForm === FormType.Login) {
      setCurrentForm(FormType.SignUp);
    } else {
      setCurrentForm(FormType.Login);
    }
  };

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
                onClick={() => setIsOpen(true)}
              />
            </div>

            <Drawer isOpen={isOpen} setIsOpen={setIsOpen}>
              <Drawerdata />
            </Drawer>
          </div>
        </div>
      </>

      <Modal
        isOpen={isSignUpModalOpen}
        title={currentForm === FormType.Login ? "Login" : "Sign Up"}
        closeModal={handleOnChangeSignUpModalVisibility}
        description={
          currentForm === FormType.Login
            ? "Login to access to your account"
            : "Sign up to create an account"
        }
      >
        {currentForm === FormType.Login ? (
          <FormLogin onRegisterClick={handleOnChangeForm} />
        ) : (
          <FormSignUp onLoginClick={handleOnChangeForm} />
        )}
      </Modal>
    </Disclosure>
  );
};

export default Navbar;
