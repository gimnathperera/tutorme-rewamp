/* eslint-disable unused-imports/no-unused-vars */

import Link from "next/link";
import { ReactNode, useEffect } from "react";
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
  useEffect(() => {
    if (!isOpen) return;

    const scrollY = window.scrollY;
    const { body, documentElement } = document;
    const previousBodyStyles = {
      overflow: body.style.overflow,
      position: body.style.position,
      top: body.style.top,
      width: body.style.width,
    };
    const previousHtmlOverflow = documentElement.style.overflow;

    documentElement.style.overflow = "hidden";
    body.style.overflow = "hidden";
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.width = "100%";

    return () => {
      documentElement.style.overflow = previousHtmlOverflow;
      body.style.overflow = previousBodyStyles.overflow;
      body.style.position = previousBodyStyles.position;
      body.style.top = previousBodyStyles.top;
      body.style.width = previousBodyStyles.width;
      window.scrollTo(0, scrollY);
    };
  }, [isOpen]);

  return (
    <main
      className={
        "fixed overflow-hidden z-[100] inset-0 transition-opacity duration-200 ease-in-out [-webkit-tap-highlight-color:transparent] " +
        (isOpen
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none")
      }
    >
      <section
        className={
          "drawer-panel z-10 w-340px max-w-lg left-0 absolute bg-white h-full shadow-xl duration-300 ease-in-out transition-transform transform " +
          (isOpen ? "translate-x-0" : "-translate-x-full")
        }
      >
        <article className="relative w-340px max-w-lg h-full flex flex-col">
          <header className="px-4 py-4 flex items-center">
            <div className="flex flex-shrink-0 items-center border-right">
              <Link href="/" className="text-2xl font-bold text-black">
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
            className="flex-1 overflow-y-auto overscroll-contain"
            onClick={() => {
              setIsOpen(false);
            }}
          >
            {children}
          </div>

          <footer className="p-4">
            <button
              className="w-full block bg-blue-600 text-white hover:bg-blue-700 py-2 rounded-full text-center text-base font-semibold"
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
        className="absolute inset-0 bg-gray-900/25 cursor-pointer [-webkit-tap-highlight-color:transparent]"
        onClick={() => {
          setIsOpen(false);
        }}
      ></section>
    </main>
  );
};

export default Drawer;
