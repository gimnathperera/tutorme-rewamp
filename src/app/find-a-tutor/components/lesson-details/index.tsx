import InputMultiSelect from "@/components/shared/input-multi-select";
import InputSelect from "@/components/shared/input-select";
import Image from "next/image";
import { FC, useEffect } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import lesson from "../../../../../public/images/findTutor/lesson.png";
import { Option } from "@/types/shared-types";

const durationOptions = [
  { value: "30_min", label: "30 minutes" },
  { value: "1_hour", label: "1 hour" },
  { value: "2_hour", label: "2 hours" },
];

const frequencyOptions = [
  { value: "1_week", label: "Once a week" },
  { value: "2_week", label: "Twice a week" },
  { value: "daily", label: "Daily" },
];

const tutorCountOptions = [
  { label: "1", value: 1 },
  { label: "2", value: 2 },
  { label: "3", value: 3 },
  { label: "4", value: 4 },
];

type Props = {
  subjectsOptions: Option[];
  isSubjectsLoading: boolean;
};
const LessonDetails: FC<Props> = ({ subjectsOptions, isSubjectsLoading }) => {
  const { watch, control } = useFormContext();
  const tutorCount = watch("tutorCount");

  const { fields, append, remove } = useFieldArray({
    control,
    name: "tutors",
  });

  useEffect(() => {
    const count = parseInt(tutorCount || 0);
    const currentLength = fields.length;

    if (count > currentLength) {
      for (let i = currentLength; i < count; i++) {
        append({ subjects: [], duration: "", frequency: "" });
      }
    } else if (count < currentLength) {
      for (let i = currentLength; i > count; i--) {
        remove(i - 1);
      }
    }
  }, [tutorCount, fields.length, append, remove]);

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
          name="tutorCount"
          options={tutorCountOptions}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {fields.map((field, index) => (
            <div key={field.id} className="flex flex-col gap-3">
              <p className="font-bold">Tutor {index + 1}</p>

              <InputMultiSelect
                label="Subjects"
                name={`tutors.${index}.subjects`}
                options={subjectsOptions}
                isLoading={isSubjectsLoading}
              />

              <InputSelect
                label="Duration"
                name={`tutors.${index}.duration`}
                options={durationOptions}
              />

              <InputSelect
                label="Frequency"
                name={`tutors.${index}.frequency`}
                options={frequencyOptions}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LessonDetails;
