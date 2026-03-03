/* eslint-disable unused-imports/no-unused-vars */

import Link from "next/link";
import { ReactNode } from "react";
import Icon from "../icon";
import { AuthUserData } from "@/types/auth-types";

interface DrawerProps {
  children: ReactNode;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  handleOnChangeSignUpModalVisibility: () => void;
  user?: AuthUserData | null;
  logout?: () => void;
}

const Drawer = ({
  children,
  isOpen,
  setIsOpen,
  handleOnChangeSignUpModalVisibility,
  user,
  logout,
}: DrawerProps) => {
  return (
    <main
      className={
        "fixed overflow-hidden z-10 bg-gray-900 bg-opacity-25 inset-0 transform ease-in-out " +
        (isOpen
          ? "transition-opacity opacity-100 duration-500 translate-x-0"
          : "transition-all delay-500 opacity-0 -translate-x-full")
      }
    >
      <section
        className={
          "w-340px max-w-lg left-0 absolute bg-white h-full shadow-xl delay-400 duration-500 ease-in-out transition-all transform " +
          (isOpen ? "translate-x-0" : "-translate-x-full")
        }
      >
        <article className="relative w-340px max-w-lg h-full flex flex-col">
          <header className="px-4 py-4 flex items-center">
            <div className="flex flex-shrink-0 items-center border-right">
              <Link href="/" className="text-2xl font-semibold text-black">
                Tuition Lanka
              </Link>
            </div>
            <button
              onClick={() => {
                setIsOpen(false);
              }}
              className="ml-auto"
            >
              <Icon name="CircleX" />
            </button>
          </header>

          <div
            className="flex-1 overflow-y-auto"
            onClick={() => {
              setIsOpen(false);
            }}
          >
            {children}
          </div>

          <footer className="p-4">
            <button
              className="w-full block bg-blue-600 text-white hover:bg-blue-700 py-2 rounded-full text-center text-base font-medium"
              onClick={() => {
                if (user?.email) {
                  logout?.();
                  setIsOpen(false);
                } else {
                  handleOnChangeSignUpModalVisibility();
                }
              }}
            >
              {user?.email ? "Logout" : "Login"}
            </button>
          </footer>
        </article>
      </section>

      {/* Backdrop */}
      <section
        className="w-screen h-full cursor-pointer"
        onClick={() => {
          setIsOpen(false);
        }}
      ></section>
    </main>
  );
};

export default Drawer;
