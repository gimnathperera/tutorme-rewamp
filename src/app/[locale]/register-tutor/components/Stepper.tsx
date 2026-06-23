"use client";

import { FC } from "react";
import Icon from "@/components/shared/icon";

export type StepperStep = {
  key: string;
  label: string;
};

type StepperProps = {
  steps: StepperStep[];
  currentIndex: number;
  /** Called when a previously-completed step is clicked. Omit to disable navigation. */
  onStepSelect?: (_index: number) => void;
};

const circleBase =
  "relative z-10 flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-full text-sm sm:text-base font-semibold transition-colors duration-300";

const Stepper: FC<StepperProps> = ({ steps, currentIndex, onStepSelect }) => (
  <nav
    aria-label="Progress"
    className="mx-auto mb-10 max-w-2xl px-2 sm:mb-12"
  >
    <ol className="flex items-center">
      {steps.map((step, index) => {
        const isCompleted = index < currentIndex;
        const isCurrent = index === currentIndex;
        const isLast = index === steps.length - 1;
        const isClickable = isCompleted && Boolean(onStepSelect);

        const circleColor = isCompleted
          ? "bg-green-500 text-white"
          : isCurrent
            ? "bg-blue-600 text-white shadow-md ring-4 ring-blue-100"
            : "bg-gray-200 text-gray-500";

        const labelColor = isCompleted
          ? "text-green-600"
          : isCurrent
            ? "text-blue-600 font-semibold"
            : "text-gray-400";

        return (
          <li
            key={step.key}
            className={`relative flex items-center ${isLast ? "flex-none" : "flex-1"}`}
          >
            {/* Circle + label */}
            <div className="relative flex flex-col items-center">
              <button
                type="button"
                onClick={isClickable ? () => onStepSelect?.(index) : undefined}
                disabled={!isClickable}
                aria-current={isCurrent ? "step" : undefined}
                className={`${circleBase} ${circleColor} ${
                  isClickable ? "cursor-pointer" : "cursor-default"
                }`}
              >
                {isCompleted ? (
                  <Icon name="Check" size={20} />
                ) : (
                  index + 1
                )}
              </button>
              <span
                className={`absolute top-full mt-2 w-24 whitespace-normal sm:w-max sm:whitespace-nowrap -translate-x-1/2 left-1/2 text-center text-[11px] leading-tight sm:text-sm ${labelColor}`}
              >
                {step.label}
              </span>
            </div>

            {/* Connector to next step */}
            {!isLast && (
              <div
                aria-hidden="true"
                className={`mx-1 sm:mx-2 h-0.5 sm:h-1 flex-1 rounded-full transition-colors duration-300 ${
                  isCompleted ? "bg-green-500" : "bg-gray-200"
                }`}
              />
            )}
          </li>
        );
      })}
    </ol>
  </nav>
);

export default Stepper;
