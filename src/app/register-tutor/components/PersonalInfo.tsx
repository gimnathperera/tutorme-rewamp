"use client";

import { useFormContext } from "react-hook-form";
import { FindMyTutorForm } from "../schema";

const PersonalInfo = () => {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<FindMyTutorForm>();

  const data = watch(); // for conditional validation / dependent re-validation

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
              <label className="block text-sm font-medium text-darkpurple mb-2">
                Full Name (As Per NRIC) *
              </label>
              <input
                type="text"
                {...register("fullName")}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-700 focus:border-primary-700 transition-colors ${
                  errors.fullName ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter your full name"
              />
              {errors.fullName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.fullName.message}
                </p>
              )}
            </div>

            {/* Contact Number */}
            <div>
              <label className="block text-sm font-medium text-darkpurple mb-2">
                Contact Number *
              </label>
              <input
                type="tel"
                {...register("contactNumber")}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-700 focus:border-primary-700 transition-colors ${
                  errors.contactNumber ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="91234567"
              />
              {errors.contactNumber && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.contactNumber.message}
                </p>
              )}
            </div>

            {/* Re-Enter Contact Number */}
            <div>
              <label className="block text-sm font-medium text-darkpurple mb-2">
                Re-Enter Contact Number *
              </label>
              <input
                type="tel"
                {...register("confirmContactNumber")}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-700 focus:border-primary-700 transition-colors ${
                  errors.confirmContactNumber ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="91234567"
              />
              {errors.confirmContactNumber && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmContactNumber.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-darkpurple mb-2">
                Email *
              </label>
              <input
                type="email"
                {...register("email")}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-700 focus:border-primary-700 transition-colors ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="your.email@example.com"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-sm font-medium text-darkpurple mb-2">
                Date of Birth *
              </label>
              <input
                type="date"
                {...register("dateOfBirth")}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-700 focus:border-primary-700 transition-colors ${
                  errors.dateOfBirth ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.dateOfBirth && (
                <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth.message}</p>
              )}
            </div>

            {/* Re-Enter Date of Birth */}
            <div>
              <label className="block text-sm font-medium text-darkpurple mb-2">
                Re-Enter Date of Birth *
              </label>
              <input
                type="date"
                {...register("confirmDateOfBirth")}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-700 focus:border-primary-700 transition-colors ${
                  errors.confirmDateOfBirth ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.confirmDateOfBirth && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmDateOfBirth.message}
                </p>
              )}
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-darkpurple mb-2">
                Gender *
              </label>
              <div className="flex gap-6 mt-2">
                {["Male", "Female"].map((g) => (
                  <label key={g} className="flex items-center">
                    <input
                      type="radio"
                      value={g}
                      {...register("gender")}
                      className="mr-2 text-primary-700 focus:ring-primary-700"
                    />
                    {g}
                  </label>
                ))}
              </div>
              {errors.gender && (
                <p className="text-red-500 text-sm mt-1">{errors.gender.message}</p>
              )}
            </div>

            {/* Age */}
            <div>
              <label className="block text-sm font-medium text-darkpurple mb-2">
                Age *
              </label>
              <input
                type="number"
                {...register("age", { valueAsNumber: true })}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-700 focus:border-primary-700 transition-colors ${
                  errors.age ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="25"
                min={16}
                max={80}
              />
              {errors.age && (
                <p className="text-red-500 text-sm mt-1">{errors.age.message}</p>
              )}
            </div>

            {/* Nationality */}
            <div>
              <label className="block text-sm font-medium text-darkpurple mb-2">
                Nationality *
              </label>
              <div className="flex flex-wrap gap-4 mt-2">
                {["Singaporean", "Singapore PR", "Others"].map((n) => (
                  <label key={n} className="flex items-center">
                    <input
                      type="radio"
                      value={n}
                      {...register("nationality")}
                      className="mr-2 text-primary-700 focus:ring-primary-700"
                    />
                    {n}
                  </label>
                ))}
              </div>
              {errors.nationality && (
                <p className="text-red-500 text-sm mt-1">{errors.nationality.message}</p>
              )}
            </div>

            {/* Race */}
            <div>
              <label className="block text-sm font-medium text-darkpurple mb-2">
                Race *
              </label>
              <div className="grid grid-cols-2 gap-3 mt-2">
                {[
                  "Chinese",
                  "Malay",
                  "Indian",
                  "Eurasian",
                  "Caucasian",
                  "Punjabi",
                  "Others",
                ].map((r) => (
                  <label key={r} className="flex items-center">
                    <input
                      type="radio"
                      value={r}
                      {...register("race")}
                      className="mr-2 text-primary-700 focus:ring-primary-700"
                    />
                    {r}
                  </label>
                ))}
              </div>
              {errors.race && (
                <p className="text-red-500 text-sm mt-1">{errors.race.message}</p>
              )}
            </div>

            {/* Last 4 Digits of NRIC */}
            <div>
              <label className="block text-sm font-medium text-darkpurple mb-2">
                Last 4 Digits of NRIC *
              </label>
              <input
                type="text"
                {...register("last4NRIC")}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-700 focus:border-primary-700 transition-colors ${
                  errors.last4NRIC ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="1234"
                maxLength={4}
                inputMode="numeric"
              />
              {errors.last4NRIC && (
                <p className="text-red-500 text-sm mt-1">{errors.last4NRIC.message}</p>
              )}
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
