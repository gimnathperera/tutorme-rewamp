/* eslint-disable unused-imports/no-unused-vars */

import FormForgotPassword from "@/components/auth/form-forgot-password";
import FormLogin from "@/components/auth/form-login";
import FormSignUp from "@/components/auth/form-sign-up";
import { useAuthContext } from "@/contexts";
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

  const handleOnChangeForm = (formType: FormType) => {
    setCurrentForm(formType);
  };

  const showAuthForm = () => {
    switch (currentForm) {
      case FormType.Login:
        return (
          <FormLogin
            onRegisterClick={() => handleOnChangeForm(FormType.SignUp)}
            onForgotPasswordClick={() =>
              handleOnChangeForm(FormType.ForgotPassword)
            }
          />
        );
      case FormType.SignUp:
        return (
          <FormSignUp onLoginClick={() => handleOnChangeForm(FormType.Login)} />
        );
      default:
        return (
          <FormForgotPassword
            onLoginClick={() => handleOnChangeForm(FormType.Login)}
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
      default:
        return "Forgot Password";
    }
  };

  const getFormDescription = () => {
    switch (currentForm) {
      case FormType.Login:
        return "Login to access to your account";
      case FormType.SignUp:
        return "Sign up to create an account";
      default:
        return "Please enter your email to reset your password";
    }
  };

  const getFormImage = () => {
    switch (currentForm) {
      case FormType.Login:
        return "/images/auth/login.svg";
      case FormType.SignUp:
        return "/images/auth/signup.svg";
      default:
        return "/images/auth/forgotpassword.svg";
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
