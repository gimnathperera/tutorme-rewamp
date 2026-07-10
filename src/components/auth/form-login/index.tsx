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
            <div className="relative flex justify-center pt-2">
              {/*
                Google's rendered button is a cross-origin iframe with no
                Sinhala/Tamil translation, so we draw our own translated
                button underneath and let the real (invisible) Google
                button sit on top to actually receive the click — this
                keeps the genuine Google auth flow intact while showing
                localized text.
              */}
              <div
                aria-hidden="true"
                className="pointer-events-none flex w-full items-center justify-center gap-2 rounded-md border border-gray-300 bg-white py-2.5 text-sm font-medium text-gray-700 shadow-sm"
              >
                <svg
                  className="h-[18px] w-[18px]"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    fill="#FFC107"
                    d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                  />
                  <path
                    fill="#FF3D00"
                    d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                  />
                  <path
                    fill="#4CAF50"
                    d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                  />
                  <path
                    fill="#1976D2"
                    d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                  />
                </svg>
                {t("continueWithGoogle")}
              </div>
              <div className="absolute inset-0 flex justify-center overflow-hidden opacity-0">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => setIsAuthError("Google sign-in failed")}
                  useOneTap={false}
                  width="320"
                />
              </div>
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
