"use client";

import { FC } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import Icon from "../icon";
import SubmitButton from "../submit-button";

type ConfirmationAlertProps = {
  isOpen: boolean;
  closeModal: () => void;
  onConfirm: () => void;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  icon?: React.ReactNode;
  confirmButtonStyle?: string;
  cancelButtonStyle?: string;
  loading?: boolean;
};

const ConfirmationAlert: FC<ConfirmationAlertProps> = ({
  isOpen,
  closeModal,
  onConfirm,
  title,
  description,
  confirmText = "Yes, I'm sure",
  cancelText = "No, cancel",
  icon,
  confirmButtonStyle = "text-white bg-red-600 hover:bg-red-700 focus:ring-red-300",
  cancelButtonStyle = "text-gray-500 bg-white hover:bg-gray-100 focus:ring-primary-300",
  loading = false,
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
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="relative bg-white rounded-3xl shadow-lg max-w-md w-full p-6">
                <div className="text-center">
                  {icon && <div className="mb-4">{icon}</div>}
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium text-gray-900"
                  >
                    {title}
                  </Dialog.Title>
                  {description && (
                    <p className="mt-2 text-sm text-gray-500">{description}</p>
                  )}
                </div>
                <div className="mt-6 flex justify-center gap-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className={`py-2 px-4 rounded-lg font-medium ${cancelButtonStyle}`}
                  >
                    {cancelText}
                  </button>
                  <SubmitButton
                    type="button"
                    onClick={onConfirm}
                    className={`py-2 px-4 rounded-lg font-medium ${confirmButtonStyle}`}
                    loading={loading}
                    title={confirmText}
                  />
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ConfirmationAlert;
