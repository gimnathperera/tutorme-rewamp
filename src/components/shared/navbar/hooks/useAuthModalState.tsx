/* eslint-disable unused-imports/no-unused-vars */

import FormForgotPassword from "@/components/auth/form-forgot-password";
import FormLogin from "@/components/auth/form-login";
import FormSignUp from "@/components/auth/form-sign-up";
import { useAuthContext } from "@/contexts";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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
  const [isOpen, setIsOpen] = useState(false);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const [currentForm, setCurrentForm] = useState<FormType>(FormType.Login);
  const { user } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      setIsSignUpModalOpen(false);
      setIsOpen(false);
    }
  }, [user]);

  const handleOnChangeSignUpModalVisibility = () => {
    setIsSignUpModalOpen((show) => !show);
    setCurrentForm(FormType.Login);
  };

  const handleOnChangeDrawerVisibility = () => {
    setIsOpen((show) => !show);
  };

  const handleCloseAuthModal = () => {
    setIsOpen(false);
    setIsSignUpModalOpen(false);
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
        return "Login";
      case FormType.SignUp:
        return "Sign Up";
      case FormType.ForgotPassword:
        return "Forgot Password";
      default:
        return "Login";
    }
  };

  const getFormDescription = () => {
    switch (currentForm) {
      case FormType.Login:
        return "Login to access to your account";
      case FormType.SignUp:
        return "Sign up to create an account";
      case FormType.ForgotPassword:
        return "Please enter your email to reset your password";
      default:
        return "Login to access to your account";
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
