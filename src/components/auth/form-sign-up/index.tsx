import SubmitButton from "@/components/shared/submit-button";
import React from "react";

type Props = {
  onLoginClick: () => void;
};

const FormSignUp = ({ onLoginClick }: Props) => {
  return (
    <form action="#">
      <div className="space-y-4">
        <div>
          <label
            htmlFor="text"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
          >
            Email
          </label>
          <input
            name="input1"
            type="text"
            required
            className="relative block w-full appearance-none  rounded-md border border-linegrey px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            placeholder="jhon@xyz.com"
          />
        </div>
        <div>
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
          >
            Password
          </label>
          <input
            name="input2"
            type="password"
            required
            className="relative block w-full appearance-none  rounded-md border border-linegrey px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            placeholder="*******"
          />
        </div>
        <div>
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
          >
            Confirm Password
          </label>
          <input
            name="input2"
            type="password"
            required
            className="relative block w-full appearance-none  rounded-md border border-linegrey px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            placeholder="*******"
          />
        </div>
      </div>
      <div className="space-y-2 mt-8">
        <SubmitButton title="Register" type="submit" />

        <div className="text-center">
          <p className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
            Already have an account?{" "}
            <span className="text-blue cursor-pointer" onClick={onLoginClick}>
              Login
            </span>
          </p>
        </div>
      </div>
    </form>
  );
};

export default FormSignUp;
