"use client";

import { useFormContext } from "react-hook-form";
import { FindMyTutorForm } from "../schema";
import InputMultiLineText from "@/components/shared/input-multi-line-text";

const TutorProfile = () => {
  const { watch, setValue, trigger, formState } =
    useFormContext<FindMyTutorForm>();
  const errors = formState.errors;

  const profileQuestions = [
    {
      key: "teachingSummary",
      title: "1. Summary of Teaching Experience & Academic Achievements",
      subtitle:
        "Achievements & subjects taught, e.g., number of students, years, etc.",
      placeholder: "Academic qualifications, years, conditions, etc.",
      maxLength: 750,
    },
    {
      key: "studentResults",
      title: "2. Results of Students / Track Record",
      subtitle: "Past grade improvement records of previous students.",
      placeholder:
        "List results if you have records (exams, improvements, etc.)",
      maxLength: 750,
    },
    {
      key: "sellingPoints",
      title: "3. Other Selling Points as a Tutor",
      subtitle: "Teaching methods, commitments, what makes you stand out.",
      placeholder:
        "e.g., Motivating teaching style, strong conceptual focus, etc.",
      maxLength: 750,
    },
  ] as const;

  return (
    <div className="mx-auto max-w-7xl my-10 px-6 lg:px-8">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="border-b border-gray-200 pb-8">
          <h2 className="text-2xl font-bold text-darkpurple mb-6 flex items-center">
            <span className="bg-primary-700 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold mr-3">
              4
            </span>
            Tutor&apos;s Profile (Extremely Important!)
          </h2>

          <div className="bg-lightblue border-l-4 border-primary-700 p-4 mb-8">
            <p className="text-darkpurple font-medium">
              <strong>Important:</strong> The following section will be a key
              factor in your success rate of assignment matching.
            </p>
            <p className="text-gray-700 text-sm mt-1">
              This information may be shown to clients for quick evaluation.
            </p>
            <p className="text-gray-700 text-sm mt-1">
              Use approximately 50–200 words for each answer.{" "}
              <strong>Excellent answer required.</strong>
            </p>
          </div>

          <div className="space-y-8">
            {profileQuestions.map((q) => {
              const value = watch(q.key) || "";
              return (
                <div key={q.key}>
                  <h3 className="text-lg font-semibold text-darkpurple mb-2">
                    {q.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">{q.subtitle}</p>
                  <InputMultiLineText
                    name={q.key}
                    label={undefined}
                    placeholder={q.placeholder}
                    maxLength={q.maxLength}
                    rows={6}
                    helperText={errors[q.key]?.message as string}
                  />
                  <div className="flex justify-end mt-2">
                    <p className="text-sm text-gray-500">
                      {value.length}/{q.maxLength}
                    </p>
                  </div>
                </div>
              );
            })}

            <div className="bg-blue p-6 rounded-lg mt-8">
              <h4 className="font-semibold text-darkpurple mb-3">
                💡 Tips for a Great Profile:
              </h4>
              <ul className="text-darkpurple text-sm space-y-2">
                <li>
                  • <strong>Be specific:</strong> Include real results and
                  counts.
                </li>
                <li>
                  • <strong>Show personality:</strong> Describe your style.
                </li>
                <li>
                  • <strong>Highlight achievements:</strong> Awards/certs.
                </li>
                <li>
                  • <strong>Be honest:</strong> Authenticity builds trust.
                </li>
                <li>
                  • <strong>Use examples:</strong> Concrete generic claims.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorProfile;
