"use client";

import { useFormContext } from "react-hook-form";
import { FindMyTutorForm } from "../schema";
import InputText from "@/components/shared/input-text";
import RadioGroup from "@/components/shared/input-radio";
import { useEffect } from "react";

const PersonalInfo = () => {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<FindMyTutorForm>();

  const data = watch();
  useEffect(() => {
    if (!data.dateOfBirth) return;

    const birthDate = new Date(data.dateOfBirth);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();

    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age--;
    }

    if (!isNaN(age) && age > 0 && age < 100) {
      setValue("age", age);
    }
  }, [data.dateOfBirth, setValue]);

  return (
    <div className="mx-auto max-w-7xl my-10 px-6 lg:px-8">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="border-b border-gray-200 pb-8">
          <h2 className="text-2xl font-bold text-darkpurple mb-6 flex items-center">
            <span className="bg-primary-700 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold mr-3">
              1
            </span>
            Personal Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div className="md:col-span-2">
              <InputText
                label="Full Name (As Per NRIC) *"
                name="fullName"
                placeholder="Enter your full name"
                helperText={errors.fullName?.message as string}
              />
            </div>

            {/* Contact Number */}
            <div>
              <InputText
                label="Contact Number *"
                name="contactNumber"
                type="tel"
                placeholder="91234567"
                helperText={errors.contactNumber?.message as string}
              />
            </div>

            <div>
              <InputText
                label="Email *"
                name="email"
                type="email"
                placeholder="your.email@example.com"
                helperText={errors.email?.message as string}
              />
            </div>

            {/* Date of Birth */}
            <div className="md:col-span-2">
              <InputText
                label="Date of Birth *"
                name="dateOfBirth"
                type="date"
                helperText={errors.dateOfBirth?.message as string}
              />
            </div>

            {/* Gender */}
            <div>
              <RadioGroup
                label="Gender *"
                name="gender"
                options={[
                  { label: "Male", value: "Male" },
                  { label: "Female", value: "Female" },
                ]}
                helperText={errors.gender?.message as string}
                className="flex gap-6 mt-2"
              />
            </div>

            {/* Age */}
            <div>
              <label className="block text-sm font-medium text-darkpurple mb-2">
                Age *
              </label>
              <input
                type="number"
                {...register("age", {
                  valueAsNumber: true,
                  setValueAs: (v) => (v === "" ? undefined : Number(v)),
                })}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-700 focus:border-primary-700 transition-colors ${
                  errors.age ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="25"
                min={18}
                max={80}
              />
              {errors.age && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.age.message}
                </p>
              )}
            </div>

            {/* Nationality */}
            <div>
              <RadioGroup
                label="Nationality *"
                name="nationality"
                options={[
                  { label: "Sri Lankan", value: "Sri Lankan" },

                  { label: "Others", value: "Others" },
                ]}
                helperText={errors.nationality?.message as string}
                className="flex flex-wrap gap-4 mt-2"
              />
            </div>

            {/* Race */}
            <div>
              <RadioGroup
                label="Race *"
                name="race"
                options={[
                  { label: "Sinhalese", value: "Sinhalese" },
                  { label: "Tamil", value: "Tamil" },
                  { label: "Muslim", value: "Muslim" },
                  { label: "Burgher", value: "Burgher" },

                  { label: "Others", value: "Others" },
                ]}
                helperText={errors.race?.message as string}
                className="flex flex-wrap gap-4 mt-2"
              />
            </div>

            {/* Last 4 Digits of NRIC */}
            <div>
              <InputText
                label="Last 4 Digits of NRIC *"
                name="last4NRIC"
                type="text"
                placeholder="1234"
                maxLength={4}
                inputMode="numeric"
                helperText={errors.last4NRIC?.message as string}
              />
              <p className="text-xs text-gray-500 mt-1">
                Your identity is protected! This information is securely stored
                and not displayed on clients. *For Tax / Admin purpose only 🔒🔒
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfo;
