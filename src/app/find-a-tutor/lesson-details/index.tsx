import InputMultiSelect from "@/components/shared/input-multi-select";
import InputSelect from "@/components/shared/input-select";
import React from "react";

import Image from "next/image";

import lesson from "../../../../public/images/findTutor/lesson.png";

const subjectsOptions = [
  { value: "Math", label: "Math" },
  { value: "Science", label: "Science" },
  { value: "English", label: "English" },
  { value: "History", label: "History" },
];

const durationOptions = [
  { value: "30 minutes", label: "30 minutes" },
  { value: "1 hour", label: "1 hour" },
  { value: "2 hours", label: "2 hours" },
];

const frequencyOptions = [
  { value: "Once a week", label: "Once a week" },
  { value: "Twice a week", label: "Twice a week" },
  { value: "Daily", label: "Daily" },
];

const LessonDetails: React.FC = () => {
  return (
    <div className="pb-12 space-y-8">
      <div className="flex items-center">
        <Image
          src={lesson}
          alt="lesson-image"
          className="h-[100px] w-[100px] mr-5"
        />
        <div>
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            Lesson Details
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            This information will be displayed publicly so be careful what you
            share.
          </p>
        </div>
      </div>

      <div className="space-y-8">
        <InputSelect
          className="sm:w-1/3"
          label="How many tutors do you need?"
          name="numTutors"
          options={[
            { label: "1", value: "1" },
            { label: "2", value: "2" },
            { label: "3", value: "3" },
            { label: "4", value: "4" },
          ]}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="flex flex-col gap-3">
            <p className="font-bold">Tutor {1 + 1}</p>

            <InputMultiSelect
              label="Subjects"
              name="subjects"
              options={subjectsOptions}
            />

            <InputSelect
              label="Duration"
              name="subjects"
              options={durationOptions}
            />

            <InputSelect
              label="Frequency"
              name="frequency"
              options={frequencyOptions}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonDetails;
