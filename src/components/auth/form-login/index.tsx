import React from "react";

type Props = {
  onRegisterClick: () => void;
  onForgotPasswordClick: () => void;
};

const FormLogin = ({ onRegisterClick, onForgotPasswordClick }: Props) => {
  return (
    <form action="#">
      <div className="space-y-4">
        <div>
          <label
            htmlFor="text"
            className="block mb-2 text-sm font-medium text-gray-900"
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
            className="block mb-2 text-sm font-medium text-gray-900"
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
        <button
          type="submit"
          className="py-3 px-5 text-sm disabled:opacity-50 font-medium w-full text-center text-white rounded-lg bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
        >
          Login
        </button>
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
