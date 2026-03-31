"use client";

import { Dialog, Transition } from "@headlessui/react";
import { FC, Fragment, ReactNode } from "react";
import Icon from "../icon";

type Props = {
  isOpen: boolean;
  closeModal: () => void;
  children: ReactNode;
  title: string;
  description?: string;
  imagePath?: string;
};

const Modal: FC<Props> = ({
  isOpen,
  closeModal,
  children,
  title,
  description,
  imagePath,
}) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center relative">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-4 sm:p-6 text-left align-middle shadow-xl transition-all relative">
                {/* Decorative Background Elements */}
                <div
                  className="pointer-events-none absolute -top-20 -left-10 w-56 h-56 rounded-full bg-blue-600/5"
                  aria-hidden="true"
                />
                <div
                  className="pointer-events-none absolute -bottom-24 -right-20 w-80 h-80 rounded-full bg-blue-600/5"
                  aria-hidden="true"
                />
                <div
                  className="pointer-events-none absolute top-[25%] -right-10 w-28 h-28 rounded-full border-[6px] border-blue-600/5"
                  aria-hidden="true"
                />
                <div
                  className="pointer-events-none absolute bottom-[15%] left-2 w-10 h-10 rounded-full bg-blue-600/5"
                  aria-hidden="true"
                />

                {/* Dot Grid */}
                <svg
                  className="pointer-events-none absolute top-16 left-8 w-16 h-16 text-blue-600/5 transform -rotate-12"
                  fill="currentColor"
                  viewBox="0 0 40 40"
                >
                  <pattern
                    id="dot-pattern"
                    x="0"
                    y="0"
                    width="10"
                    height="10"
                    patternUnits="userSpaceOnUse"
                  >
                    <circle cx="2" cy="2" r="2" />
                  </pattern>
                  <rect width="40" height="40" fill="url(#dot-pattern)" />
                </svg>

                <div className="flex justify-end w-full relative z-10">
                  <button
                    onClick={closeModal}
                    className="bg-transparent text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    <Icon name="CircleX" />
                  </button>
                </div>
                <div className="pb-4 px-4 mx-auto max-w-screen-md relative z-10">
                  <div
                    className={`flex flex-shrink-0 items-center justify-center`}
                  >
                    <p className="text-xl font-semibold text-black">{title}</p>
                  </div>
                  {description && (
                    <p className="mb-4 lg:mb-8 mt-8 text-base text-center text-gray-500 dark:text-gray-400">
                      {description}
                    </p>
                  )}
                  {/* {imagePath && (
                    <div className="hidden sm:flex justify-center mb-4">
                      <img
                        src={imagePath}
                        alt="hero-image"
                        width={200}
                        height={200}
                      />
                    </div>
                  )} */}
                  {children}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default Modal;
