import InputText from "@/components/shared/input-text";
import SubmitButton from "@/components/shared/submit-button";

type Props = {
  onLoginClick: () => void;
};

const FormForgotPassword = ({ onLoginClick }: Props) => {
  return (
    <form action="#">
      <div className="space-y-4">
        <InputText
          label="Email"
          name="email"
          placeholder="jhon@xyz.com"
          type="email"
        />
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
