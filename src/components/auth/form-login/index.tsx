import InputText from "@/components/shared/input-text";
import SubmitButton from "@/components/shared/submit-button";
import React from "react";

type Props = {
  onRegisterClick: () => void;
  onForgotPasswordClick: () => void;
};

const FormLogin = ({ onRegisterClick, onForgotPasswordClick }: Props) => {
  return (
    <form action="#">
      <div className="space-y-4">
        <InputText
          label="Email"
          name="email"
          placeholder="jhon@xyz.com"
          type="email"
        />
        <InputText
          label="Password"
          name="password"
          placeholder="*******"
          type="password"
        />
      </div>
      <div className="pt-1">
        <p
          className="block mb-2 text-sm font-medium text-blue cursor-pointer hover:underline"
          onClick={onForgotPasswordClick}
        >
          Forgot password?
        </p>
      </div>
      <div className="space-y-2 mt-8">
        <SubmitButton title="Login" type="submit" />

        <div className="text-center">
          <p className="block mb-2 text-sm font-medium text-gray-900">
            {` Don't have an account?   `}
            <span
              className="text-blue cursor-pointer hover:underline"
              onClick={onRegisterClick}
            >
              Register
            </span>
          </p>
        </div>
      </div>
    </form>
  );
};

export default FormLogin;
