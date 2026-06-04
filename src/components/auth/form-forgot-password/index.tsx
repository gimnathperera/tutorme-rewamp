import InputText from "@/components/shared/input-text";
import SubmitButton from "@/components/shared/submit-button";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { ForgotPasswordSchema, createForgotPasswordSchema } from "./schema";
import { useAuthContext } from "@/contexts";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";
import { useMemo } from "react";

type Props = {
  onLoginClick: () => void;
  onSuccess: () => void;
};

const FormForgotPassword = ({ onLoginClick, onSuccess }: Props) => {
  const t = useTranslations("auth");
  const { forgotPassword, isAuthError, setIsAuthError, isLoading } =
    useAuthContext();

  const forgotPasswordSchema = useMemo(
    () => createForgotPasswordSchema(t),
    [t],
  );

  const forgotPasswordForm = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
    mode: "onChange",
  });

  const onSubmit = async (data: ForgotPasswordSchema) => {
    setIsAuthError("");

    try {
      await forgotPassword(data);
      toast.success(t("passwordResetSent"));
      forgotPasswordForm.reset();
      onSuccess();
    } catch (error: any) {
      const errorMessage = error?.message || t("somethingWentWrong");
      setIsAuthError(errorMessage);
    }
  };

  return (
    <FormProvider {...forgotPasswordForm}>
      <form onSubmit={forgotPasswordForm.handleSubmit(onSubmit)}>
        <div className="space-y-3">
          <InputText
            label={t("emailLabel")}
            name="email"
            placeholder="jhon@xyz.com"
            type="email"
          />
        </div>

        {isAuthError && (
          <p className="text-red-500 text-xs mt-3 text-center">{isAuthError}</p>
        )}

        <div className="space-y-2 mt-4">
          <SubmitButton
            title={isLoading ? t("sending") : t("sendVerificationLink")}
            type="submit"
            disabled={isLoading}
          />

          <div className="text-center">
            <p className="block mb-2 text-sm font-medium text-gray-900">
              {t("alreadyHaveAccount")}{" "}
              <span
                className="text-blue cursor-pointer hover:underline"
                onClick={onLoginClick}
              >
                {t("loginButton")}
              </span>
            </p>
          </div>
        </div>
      </form>
    </FormProvider>
  );
};

export default FormForgotPassword;
