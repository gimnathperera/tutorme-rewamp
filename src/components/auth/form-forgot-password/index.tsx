import InputText from "@/components/shared/input-text";
import SubmitButton from "@/components/shared/submit-button";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { ForgotPasswordSchema, forgotPasswordSchema } from "./schema";
import { useAuthContext } from "@/contexts";
import toast from "react-hot-toast";

type Props = {
  onLoginClick: () => void;
};

const FormForgotPassword = ({ onLoginClick }: Props) => {
  const { forgotPassword, isAuthError, setIsAuthError, isLoading } =
    useAuthContext();

  const forgotPasswordForm = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
    mode: "onChange",
  });

  const onSubmit = async (data: ForgotPasswordSchema) => {
    setIsAuthError("");

    try {
      const response = await forgotPassword(data);

      if (response.success) {
        toast.success(response.message);
      }
    } catch (error: any) {
      const errorMessage =
        error?.message || "Something went wrong. Please try again.";
      setIsAuthError(errorMessage);
    }
  };

  return (
    <FormProvider {...forgotPasswordForm}>
      <form onSubmit={forgotPasswordForm.handleSubmit(onSubmit)}>
        <div className="space-y-4">
          <InputText
            label="Email"
            name="email"
            placeholder="jhon@xyz.com"
            type="email"
          />
        </div>
        {isAuthError && (
          <p className="text-red-500 text-sm mt-3 text-center">{isAuthError}</p>
        )}

        <div className="space-y-2 mt-8">
          <SubmitButton
            title={isLoading ? "Sending..." : "Send Verification Link"}
            type="submit"
            disabled={isLoading}
          />

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
    </FormProvider>
  );
};

export default FormForgotPassword;
