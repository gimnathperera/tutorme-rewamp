import InputText from "@/components/shared/input-text";
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
          <InputText
            label="Email"
            name="email"
            placeholder="jhon@xyz.com"
            type="email"
          />
        </div>
        <div>
          <InputText
            label="Password"
            name="password"
            placeholder="*******"
            type="password"
          />
        </div>
        <div>
          <InputText
            label="Confirm Password"
            placeholder="*******"
            type="password"
            name="confirmPassword"
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
