"use client";

import { useFormContext } from "react-hook-form";
import { FindMyTutorForm } from "../schema"; // adjust path

const TermsAndSubmit = ({ onSubmit, submitting, resetForm }: { onSubmit: () => void; submitting: boolean; resetForm?: () => void }) => {
  const { watch, setValue, formState } = useFormContext<FindMyTutorForm>();
  const errors = formState.errors;

  const agreeTerms = watch("agreeTerms");
  const agreeAssignmentInfo = watch("agreeAssignmentInfo");
  const canSubmit = agreeTerms && agreeAssignmentInfo;

  return (
    <div className="mx-auto max-w-7xl my-10 px-6 lg:px-8">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div>
          <h2 className="text-2xl font-bold text-darkpurple mb-6 flex items-center">
            <span className="bg-primary-700 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold mr-3">
              5
            </span>
            Agreement & Submit
          </h2>

          <div className="space-y-6">
            {/* Agreement Checkboxes */}
            <div className="space-y-4">
              {/* Terms Agreement */}
              <div className="border border-gray-200 rounded-lg p-4">
                <label className="flex items-start cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreeTerms || false}
                    onChange={(e) => setValue("agreeTerms", e.target.checked)}
                    className="mt-1 mr-3 text-primary-700 focus:ring-primary-700 rounded"
                  />
                  <div>
                    <span className="font-medium text-darkpurple">
                      * I AGREE TO TERMS AND CONDITIONS (Required) *
                    </span>
                    <p className="text-sm text-gray-600 mt-1">
                      I agree to receiving assignment information via SMS and
                      understand that rates are subject to negotiation. I
                      understand there may be admin fees involved for successful
                      assignments.
                    </p>
                    {errors.agreeTerms && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.agreeTerms.message as string}
                      </p>
                    )}
                  </div>
                </label>
              </div>

              {/* Marketing/Assignment Info Agreement */}
              <div className="border border-gray-200 rounded-lg p-4">
                <label className="flex items-start cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreeAssignmentInfo || false}
                    onChange={(e) => setValue("agreeAssignmentInfo", e.target.checked)}
                    className="mt-1 mr-3 text-primary-700 focus:ring-primary-700 rounded"
                  />
                  <div>
                    <span className="font-medium text-darkpurple">
                      * I AGREE TO RECEIVING ASSIGNMENT INFORMATION REGARDING
                      NEW TUITION ASSIGNMENTS
                    </span>
                    <p className="text-sm text-gray-600 mt-1">
                      By checking this box, you agree to receive SMS and email
                      notifications about new tutoring assignments that match
                      your preferences.
                    </p>
                    {errors.agreeAssignmentInfo && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.agreeAssignmentInfo.message as string}
                      </p>
                    )}
                  </div>
                </label>
              </div>
            </div>

            {/* Additional Information */}
            <div className="bg-lightblue border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-darkpurple mb-2">
                📋 Important Information:
              </h4>
              <ul className="text-gray-700 text-sm space-y-1">
                <li>
                  • By accepting our Terms and Conditions, you agree to Tutor
                  Fee Commission of tutor&apos;s first lesson fee for successful
                  assignments, payable within 7 days via online banking.
                </li>
                <li>• All tutor information provided will remain confidential</li>
                <li>• You will receive assignment notifications via SMS and email</li>
                <li>• Rates are subject to negotiation between tutor and client</li>
              </ul>
            </div>

            {/* Submit & Reset Buttons */}
            <div className="flex justify-center pt-6 gap-4">
              <button
                type="button"
                onClick={onSubmit}
                disabled={submitting || !canSubmit}
                className={`text-sm md:text-xl font-semibold hover:shadow-xl py-3 px-6 md:py-5 md:px-14 rounded-full transition-all ${
                  submitting || !canSubmit
                    ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                    : "bg-primary-700 text-white hover:opacity-90 transform hover:-translate-y-1"
                }`}
              >
                {submitting ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  "SUBMIT"
                )}
              </button>
              {resetForm && (
                <button
                  type="button"
                  onClick={resetForm}
                  disabled={submitting}
                  className="text-sm md:text-xl font-semibold hover:shadow-xl py-3 px-6 md:py-5 md:px-14 rounded-full transition-all bg-gray-200 text-darkpurple hover:bg-gray-300"
                >
                  RESET
                </button>
              )}
            </div>

            {/* Footer Note */}
            <div className="text-center text-sm text-gray-500 pt-4">
              <p>Thank you for joining our tutoring community! 🎓</p>
              <p>We&apos;ll review your application and get back to you soon.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndSubmit;
