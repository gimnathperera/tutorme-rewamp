import SubmitButton from "@/components/shared/submit-button";

type Props = {
  onLoginClick: () => void;
};

const FormForgotPassword = ({ onLoginClick }: Props) => {
  return (
    <form action="#">
      <div className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
          >
            Email
          </label>
          <input
            name="input2"
            type="password"
            required
            className="relative block w-full appearance-none  rounded-md border border-linegrey px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            placeholder="jhon@xyz.com"
          />
        </div>
      </div>
      <div className="space-y-2 mt-8">
        <SubmitButton title="Send Verification Link" type="submit" />

        <div className="text-center">
          <p className="block mb-2 text-sm font-medium text-gray-900">
            Already have an account?{" "}
            <span
              className="text-blue cursor-pointer hover:underline"
              onClick={onLoginClick}
            >
              Login
            </span>
          </p>
        </div>
      </div>
    </form>
  );
};

export default FormForgotPassword;
