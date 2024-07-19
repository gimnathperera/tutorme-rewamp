"use client";
import { Dialog, Transition } from "@headlessui/react";
import Link from "next/link";
import { FC, Fragment, ReactNode } from "react";

type Props = {
  isOpen: boolean;
  closeModal: () => void;
  children: ReactNode;
  title: string;
  description?: string;
};
const Modal: FC<Props> = ({
  isOpen,
  closeModal,
  children,
  title,
  description,
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
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="py-8 lg:py-8 px-4 mx-auto max-w-screen-md">
                  <div className="flex flex-shrink-0 items-center justify-center">
                    <Link
                      href="/"
                      className="text-2xl sm:text-4xl font-semibold text-black"
                    >
                      {title}
                    </Link>
                  </div>
                  {description && (
                    <p className="mb-8 lg:mb-16 mt-8 font-light text-center text-gray-500 dark:text-gray-400 sm:text-xl">
                      Contact us now? Want to send us a feedback?
                    </p>
                  )}

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
