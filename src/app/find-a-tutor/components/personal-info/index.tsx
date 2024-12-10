import Image from "next/image";
import React, { FC } from "react";
import Person from "../../../../../public/images/findTutor/person.png";
import InputText from "@/components/shared/input-text";
import InputSelect from "@/components/shared/input-select";
import { Option } from "@/types/shared-types";

type Props = {
  gradesOptions: Option[];
  isGradesLoading: boolean;
};
export const PersonalInfoComponent: FC<Props> = ({
  gradesOptions,
  isGradesLoading,
}) => {
  return (
    <div className="border-gray-900/1 pb-12 space-y-8">
      <div className="flex items-center">
        <Image
          src={Person}
          alt="person-image"
          className="h-[100px] w-[100px] mr-5"
        />
        <div>
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            Personal Information
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Use a permanent address where you can receive mail.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <InputText
          label="First Name"
          placeholder="First Name"
          name="firstName"
          type="text"
        />
        <InputText
          label="Last Name"
          placeholder="Last Name"
          name="lastName"
          type="text"
        />
        <InputText label="Email" placeholder="Email" name="email" type="text" />
        <InputSelect
          label="Grade/Level"
          name="grade"
          options={gradesOptions}
          loading={isGradesLoading}
        />
        <InputText
          label="Phone Number"
          placeholder="Phone Number"
          name="phoneNumber"
          type="tel"
        />
        <InputText label="City" placeholder="Colombo" name="city" type="text" />
        <InputText
          label="State / Province"
          placeholder="State / Province"
          name="state"
          type="text"
        />
        <InputText
          label="Region"
          placeholder="Region"
          name="region"
          type="text"
        />
        <InputText
          label="ZIP / Postal code"
          placeholder="ZIP / Postal code"
          name="zip"
          type="text"
        />
      </div>
    </div>
  );
};
