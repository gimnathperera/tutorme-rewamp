"use client";

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
import { useParams } from "next/navigation";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { env } from "@/configs/env";
import { useGoogleAuthMutation } from "@/store/api/splits/auth";
import { getErrorInApiResult } from "@/utils/api";
import { writeGooglePrefill } from "@/utils/google-prefill";

const INCORRECT_CREDENTIALS_ERROR = "Incorrect email or password";

const INCORRECT_CREDENTIALS_BY_LOCALE: Record<string, string> = {
  en: "Incorrect email or password",
  si: "ඊමේල් ලිපිනය හෝ මුරපදය වැරදිය",
  ta: "தவறான மின்னஞ்சல் அல்லது கடவுச்சொல்",
};

type Props = {
  onRegisterClick: () => void;
  onForgotPasswordClick: () => void;
};

const FormLogin = ({ onRegisterClick, onForgotPasswordClick }: Props) => {
  const t = useTranslations("auth");
  const params = useParams();
  const locale = (params?.locale as string) ?? "en";
  const { login, isAuthError, setIsAuthError, isLoading, setAuthenticatedUser } =
    useAuthContext();
  const [googleAuth] = useGoogleAuthMutation();

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
    if (!isAuthError) return;
    const msg =
      isAuthError === INCORRECT_CREDENTIALS_ERROR
        ? (INCORRECT_CREDENTIALS_BY_LOCALE[locale] ?? isAuthError)
        : isAuthError;
    toast.error(msg, { id: "login-error", duration: 3000 });
  }, [isAuthError, locale]);

  const onSubmit = (data: LoginSchema) => {
    toast.dismiss("login-error");
    setIsAuthError(null);
    login(data);
  };

  const handleGoogleSuccess = async (
    credentialResponse: CredentialResponse,
  ) => {
    if (!credentialResponse.credential) return;

    const idToken = credentialResponse.credential;
    const result = await googleAuth({ idToken });
    const error = getErrorInApiResult(result);
    if (error) {
      setIsAuthError(error);
      return;
    }
    if (!result.data) return;

    if (!result.data.isNewProfile) {
      // An account already exists for this Google identity — log in directly.
      setAuthenticatedUser(result.data.user);
      return;
    }

    // No account exists yet — hand the verified profile off to the tutor
    // registration page so it can prefill Step 1, then navigate there.
    const { profile } = result.data;
    writeGooglePrefill({
      name: profile.name,
      email: profile.email,
      picture: profile.picture,
      idToken,
    });
    onRegisterClick();
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

          {env.google.clientId && (
            <div className="flex justify-center pt-2">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setIsAuthError("Google sign-in failed")}
                useOneTap={false}
                width="100%"
              />
            </div>
          )}

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
