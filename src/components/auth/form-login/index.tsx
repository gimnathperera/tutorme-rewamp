import InputText from "@/components/shared/input-text";
import SubmitButton from "@/components/shared/submit-button";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { initialFormValues, LoginSchema, loginSchema } from "./schema";
import InputPassword from "@/components/shared/input-password";
import { useAuthContext } from "@/contexts";

type Props = {
  onRegisterClick: () => void;
  onForgotPasswordClick: () => void;
};

const FormLogin = ({ onRegisterClick, onForgotPasswordClick }: Props) => {
  const { login, isAuthError, setIsAuthError, isLoading } = useAuthContext();

  const loginForm = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: initialFormValues,
    mode: "onChange",
  });

  const { watch } = loginForm;
  watch(() => {
    if (isAuthError) setIsAuthError(null);
  });

  const onSubmit = (data: LoginSchema) => {
    login(data);
  };

  return (
    <FormProvider {...loginForm}>
      <form onSubmit={loginForm.handleSubmit(onSubmit)}>
        <div className="space-y-4">
          <InputText
            label="Email"
            name="email"
            placeholder="jhon@xyz.com"
            type="email"
          />
          <InputPassword
            label="Password"
            name="password"
            placeholder="*******"
          />
          {isAuthError && (
            <span className="text-red-500 text-xs">{isAuthError}</span>
          )}
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
          <SubmitButton title="Login" type="submit" loading={isLoading} />

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
    </FormProvider>
  );
};

export default FormLogin;
