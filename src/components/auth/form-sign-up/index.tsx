import InputText from "@/components/shared/input-text";
import SubmitButton from "@/components/shared/submit-button";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { initialFormValues, SignUpSchema, createSignUpSchema } from "./schema";
import { useRegisterUserMutation } from "@/store/api/splits/users";
import { getErrorInApiResult } from "@/utils/api";
import { omit } from "lodash-es";
import toast from "react-hot-toast";
import InputPassword from "@/components/shared/input-password";
import { useTranslations } from "next-intl";
import { useMemo } from "react";

type Props = {
  onLoginClick: () => void;
};

const FormSignUp = ({ onLoginClick }: Props) => {
  const t = useTranslations("auth");

  const signUpSchema = useMemo(() => createSignUpSchema(t), [t]);

  const signupForm = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: initialFormValues as SignUpSchema,
    mode: "onChange",
  });

  const [registerUser, { isLoading }] = useRegisterUserMutation();

  const onSubmit = async (data: SignUpSchema) => {
    const result = await registerUser(omit(data, ["confirmPassword"]));
    const error = getErrorInApiResult(result);
    if (error) {
      return toast.error(error);
    }

    if (result.data) {
      onRegisterSuccess();
    }
  };

  const onRegisterSuccess = () => {
    signupForm.reset();
    toast.success(t("registerSuccess"));
    onLoginClick();
  };

  return (
    <FormProvider {...signupForm}>
      <form onSubmit={signupForm.handleSubmit(onSubmit)}>
        <div className="space-y-3">
          <div>
            <label className="mb-1 text-sm font-medium text-gray-700">
              {t("fullNameLabel")} <span className="text-red-500">*</span>
            </label>
            <InputText name="name" placeholder="Jhon Doe" type="text" />
          </div>
          <div>
            <label className="mb-1 text-sm font-medium text-gray-700">
              {t("emailLabel")} <span className="text-red-500">*</span>
            </label>
            <InputText name="email" placeholder="jhon@xyz.com" type="email" />
          </div>

          <div>
            <label className="mb-1 text-sm font-medium text-gray-700">
              {t("passwordLabel")} <span className="text-red-500">*</span>
            </label>
            <InputPassword name="password" placeholder="*******" />
          </div>
          <div>
            <label className="mb-1 text-sm font-medium text-gray-700">
              {t("confirmPasswordLabel")}{" "}
              <span className="text-red-500">*</span>
            </label>
            <InputPassword placeholder="*******" name="confirmPassword" />
          </div>
        </div>
        <div className="space-y-2 mt-4">
          <SubmitButton
            title={t("registerButton")}
            type="submit"
            loading={isLoading}
          />

          <div className="text-center">
            <p className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
              {t("alreadyHaveAccount")}{" "}
              <span className="text-blue cursor-pointer" onClick={onLoginClick}>
                {t("loginButton")}
              </span>
            </p>
          </div>
        </div>
      </form>
    </FormProvider>
  );
};

export default FormSignUp;
