import Image from "next/image";
import React from "react";
import TutorImage from "../../../../../public/images/findTutor/tutor.png";
import RadioGroup from "@/components/shared/input-radio";
import InputText from "@/components/shared/input-text";
import InputSelect from "@/components/shared/input-select";
import { tutorTypesOptions } from "../../hooks/utils";
const TutorTypeComponent = () => {
  return (
    <div className="space-y-8">
      <div className="flex items-center">
        <Image
          src={TutorImage}
          alt="tutor-image"
          className="h-[100px] w-[100px] mr-5 mix"
        />
        <div>
          <h2 className="text-lg font-semibold leading-7 text-gray-900">
            Tutor Type Selection
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            We will always let you know about important changes, but you pick
            what else you want to hear about.
          </p>
        </div>
      </div>

      <RadioGroup
        label="Please select your preferred tutor type"
        name="tutorType"
        options={tutorTypesOptions}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <InputText
          label="Student's School"
          name="school"
          placeholder="Enter school name"
        />

        <InputSelect
          label="Gender Preference"
          name="genderPreference"
          options={[
            { label: "Male", value: "Male" },
            { label: "Female", value: "Female" },
            { label: "Others", value: "None" },
          ]}
        />

        <InputSelect
          label="Is Bilingual Tutor Required?"
          name="bilingualTutor"
          options={[
            { label: "Yes", value: "Yes" },
            { label: "No", value: "No" },
          ]}
        />
      </div>
    </div>
  );
};

export default TutorTypeComponent;
