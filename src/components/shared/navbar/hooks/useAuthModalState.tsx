/* eslint-disable unused-imports/no-unused-vars */

import FormForgotPassword from "@/components/auth/form-forgot-password";
import FormLogin from "@/components/auth/form-login";
import FormSignUp from "@/components/auth/form-sign-up";
import { useAuthContext } from "@/contexts";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

export enum FormType {
  Login = "Login",
  SignUp = "SignUp",
  ForgotPassword = "ForgotPassword",
}

type LogicReturnType = {
  isOpen: boolean;
  isSignUpModalOpen: boolean;
  formTitle: string;
  fromDescription: string;
  formImage: string;
  handleOnChangeSignUpModalVisibility: () => void;
  handleOnChangeDrawerVisibility: () => void;
  AuthForm: () => JSX.Element;
};

const useAuthModalState = (): LogicReturnType => {
  const t = useTranslations("auth");
  const [isOpen, setIsOpen] = useState(false);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const [currentForm, setCurrentForm] = useState<FormType>(FormType.Login);
  const { user, setIsAuthError } = useAuthContext();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("login") === "true") {
      setIsSignUpModalOpen(true);
    }
  }, [searchParams]);

  useEffect(() => {
    if (user) {
      setIsSignUpModalOpen(false);
      setIsOpen(false);
    }
  }, [user]);

  const handleOnChangeSignUpModalVisibility = () => {
    setIsSignUpModalOpen((show) => !show);
    setCurrentForm(FormType.Login);
    setIsAuthError(null);
  };

  const handleOnChangeDrawerVisibility = () => {
    setIsOpen((show) => !show);
  };

  const handleCloseAuthModal = () => {
    setIsOpen(false);
    setIsSignUpModalOpen(false);
    setIsAuthError(null);
  };

  const handleOnChangeForm = (formType: FormType) => {
    setCurrentForm(formType);
  };

  const showAuthForm = () => {
    switch (currentForm) {
      case FormType.Login:
        return (
          <FormLogin
            onRegisterClick={() => {
              handleCloseAuthModal();
              router.push("/register-tutor");
            }}
            onForgotPasswordClick={() =>
              handleOnChangeForm(FormType.ForgotPassword)
            }
          />
        );

      case FormType.SignUp:
        return (
          <FormSignUp onLoginClick={() => handleOnChangeForm(FormType.Login)} />
        );

      case FormType.ForgotPassword:
        return (
          <FormForgotPassword
            onLoginClick={() => handleOnChangeForm(FormType.Login)}
            onSuccess={handleCloseAuthModal}
          />
        );

      default:
        return (
          <FormLogin
            onRegisterClick={() => {
              handleCloseAuthModal();
              router.push("/request-for-tutors/create-request");
            }}
            onForgotPasswordClick={() =>
              handleOnChangeForm(FormType.ForgotPassword)
            }
          />
        );
    }
  };

  const getFormTitle = () => {
    switch (currentForm) {
      case FormType.Login:
        return t("loginTitle");
      case FormType.SignUp:
        return t("signUpTitle");
      case FormType.ForgotPassword:
        return t("forgotPasswordTitle");
      default:
        return t("loginTitle");
    }
  };

  const getFormDescription = () => {
    switch (currentForm) {
      case FormType.Login:
        return t("loginDescription");
      case FormType.SignUp:
        return t("signUpDescription");
      case FormType.ForgotPassword:
        return t("forgotPasswordDescription");
      default:
        return t("loginDescription");
    }
  };

  const getFormImage = () => {
    switch (currentForm) {
      case FormType.Login:
        return "/images/auth/login.svg";
      case FormType.SignUp:
        return "/images/auth/signup.svg";
      case FormType.ForgotPassword:
        return "/images/auth/forgotpassword.svg";
      default:
        return "/images/auth/login.svg";
    }
  };

  return {
    isOpen,
    isSignUpModalOpen,
    formTitle: getFormTitle(),
    fromDescription: getFormDescription(),
    formImage: getFormImage(),
    AuthForm: showAuthForm,
    handleOnChangeSignUpModalVisibility,
    handleOnChangeDrawerVisibility,
  };
};

export default useAuthModalState;
