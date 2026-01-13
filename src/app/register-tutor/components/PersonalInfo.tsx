"use client";

import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const PersonalInfo = () => {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  const dateOfBirth = watch("dateOfBirth");

  useEffect(() => {
    if (!dateOfBirth) return;

    const dob = new Date(dateOfBirth);
    const today = new Date();

    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }

    if (age >= 0) {
      setValue("age", age, { shouldValidate: true });
    }
  }, [dateOfBirth, setValue]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <Label>Full Name *</Label>
        <Input
          {...register("fullName")}
          placeholder="Full Name"
          className="border rounded border-gray-300 bg-white"
        />
        {errors.fullName && (
          <p className="text-sm text-red-500">{`${errors.fullName.message}`}</p>
        )}
      </div>

      <div>
        <Label>Email *</Label>
        <Input
          {...register("email")}
          placeholder="Email"
          className="border rounded border-gray-300 bg-white"
        />
        {errors.email && (
          <p className="text-sm text-red-500">{`${errors.email.message}`}</p>
        )}
      </div>

      <div>
        <Label>Contact Number *</Label>
        <Input
          {...register("contactNumber")}
          placeholder="Contact Number"
          className="border rounded border-gray-300 bg-white"
        />
        {errors.contactNumber && (
          <p className="text-sm text-red-500">
            {`${errors.contactNumber.message}`}
          </p>
        )}
      </div>

      <div>
        <Label>Date of Birth *</Label>
        <Input
          type="date"
          {...register("dateOfBirth")}
          className="border rounded border-gray-300 bg-white"
        />
        {errors.dateOfBirth && (
          <p className="text-sm text-red-500">
            {`${errors.dateOfBirth.message}`}
          </p>
        )}
      </div>

      <div>
        <Label>Age *</Label>
        <Input
          type="number"
          {...register("age", { valueAsNumber: true })}
          disabled
          placeholder="Age"
          className="border rounded border-gray-300 bg-white"
        />
        {errors.age && (
          <p className="text-sm text-red-500">{`${errors.age.message}`}</p>
        )}
      </div>

      <div>
        <Label>Gender *</Label>
        <select
          {...register("gender")}
          className="w-full border border-gray-300 rounded p-2 bg-white"
        >
          <option value="">Select</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
        {errors.gender && (
          <p className="text-sm text-red-500">{`${errors.gender.message}`}</p>
        )}
      </div>

      <div>
        <Label>Nationality *</Label>
        <select
          {...register("nationality")}
          className="w-full border rounded p-2 border-gray-300 bg-white"
        >
          <option value="">Select</option>
          <option value="Sri Lankan">Sri Lankan</option>
          <option value="Others">Others</option>
        </select>
        {errors.nationality && (
          <p className="text-sm text-red-500">
            {`${errors.nationality.message}`}
          </p>
        )}
      </div>

      <div>
        <Label>Race *</Label>
        <select
          {...register("race")}
          className="w-full border rounded p-2 border-gray-300 bg-white"
        >
          <option value="">Select</option>
          <option value="Sinhalese">Sinhalese</option>
          <option value="Tamil">Tamil</option>
          <option value="Muslim">Muslim</option>
          <option value="Burgher">Burgher</option>
          <option value="Others">Others</option>
        </select>
        {errors.race && (
          <p className="text-sm text-red-500">{`${errors.race.message}`}</p>
        )}
      </div>
    </div>
  );
};

export default PersonalInfo;
