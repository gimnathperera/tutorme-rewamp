import InputText from "@/components/shared/input-text";
import SubmitButton from "@/components/shared/submit-button";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { ForgotPasswordSchema, forgotPasswordSchema } from "./schema";

type Props = {
  onLoginClick: () => void;
};

const FormForgotPassword = ({ onLoginClick }: Props) => {
  const forgotPasswordForm = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {} as ForgotPasswordSchema,
    mode: "onChange",
  });

  const onSubmit = (data: ForgotPasswordSchema) => {
    console.log("Form Submitted", data);
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
    </FormProvider>
  );
};

export default FormForgotPassword;
