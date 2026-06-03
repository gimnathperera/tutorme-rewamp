import InputText from "@/components/shared/input-text";
import SubmitButton from "@/components/shared/submit-button";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { initialFormValues, LoginSchema, createLoginSchema } from "./schema";
import InputPassword from "@/components/shared/input-password";
import { useAuthContext } from "@/contexts";
import { useEffect, useMemo } from "react";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";

type Props = {
  onRegisterClick: () => void;
  onForgotPasswordClick: () => void;
};

const FormLogin = ({ onRegisterClick, onForgotPasswordClick }: Props) => {
  const t = useTranslations("auth");
  const { login, isAuthError, setIsAuthError, isLoading } = useAuthContext();

  const loginSchema = useMemo(() => createLoginSchema(t), [t]);

  const loginForm = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: initialFormValues,
    mode: "onChange",
  });

  const emailValue = loginForm.watch("email");
  const passwordValue = loginForm.watch("password");

  useEffect(() => {
    if (isAuthError) setIsAuthError(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [emailValue, passwordValue]);

  useEffect(() => {
    if (emailValue && /\s/.test(emailValue)) {
      loginForm.setValue("email", emailValue.replace(/\s/g, ""), {
        shouldValidate: true,
      });
    }
  }, [emailValue, loginForm]);

  useEffect(() => {
    if (passwordValue && /\s/.test(passwordValue)) {
      loginForm.setValue("password", passwordValue.replace(/\s/g, ""), {
        shouldValidate: true,
      });
    }
  }, [passwordValue, loginForm]);

  useEffect(() => {
    if (isAuthError) {
      toast.error(isAuthError, {
        id: "login-error",
        duration: 3000,
      });
    }
  }, [isAuthError]);

  const onSubmit = (data: LoginSchema) => {
    toast.dismiss("login-error");
    setIsAuthError(null);
    login(data);
  };

  return (
    <FormProvider {...loginForm}>
      <form onSubmit={loginForm.handleSubmit(onSubmit)}>
        <div className="space-y-3">
          <InputText
            label={t("emailLabel")}
            name="email"
            placeholder="jhon@xyz.com"
            type="text"
          />
          <InputPassword
            label={t("passwordLabel")}
            name="password"
            placeholder="*******"
          />
        </div>

        <div className="pt-1">
          <p
            className="block mb-2 text-sm font-medium text-blue cursor-pointer hover:underline"
            onClick={onForgotPasswordClick}
          >
            {t("forgotPasswordLink")}
          </p>
        </div>
        <div className="space-y-2 mt-4">
          <SubmitButton
            title={t("loginButton")}
            type="submit"
            loading={isLoading}
          />

          <div className="text-center">
            <p className="block mb-2 text-sm font-medium text-gray-900">
              {` ${t("noAccount")}   `}
              <span
                className="text-blue cursor-pointer hover:underline"
                onClick={onRegisterClick}
              >
                {t("register")}
              </span>
            </p>
          </div>
        </div>
      </form>
    </FormProvider>
  );
};

export default FormLogin;
