"use client";

import { ForgotPasswordSchema } from "@/components/auth/form-forgot-password/schema";
import { LoginSchema } from "@/components/auth/form-login/schema";
import {
  useForgotPasswordMutation,
  useLoginMutation,
  useLogoutMutation,
} from "@/store/api/splits/auth";
import { AuthUserData, Tokens } from "@/types/auth-types";
import { UserLoginResponse } from "@/types/response-types";
import { getErrorInApiResult } from "@/utils/api";
import {
  getLocalStorageItem,
  LocalStorageKey,
  removeLocalStorageItem,
  setLocalStorageItem,
} from "@/utils/local-storage";
import { createContext, useState, ReactNode, useEffect } from "react";

export type AuthProviderType = {
  user: AuthUserData | null;
  isAuthError: string | null;
  isLoading: boolean;
  isUserLoaded: boolean;
  isUserLogoutLoading: boolean;
  login: (credentials: LoginSchema) => void;
  forgotPassword: (credentials: ForgotPasswordSchema) => void;
  logout: () => void;
  setIsAuthError: (error: string | null) => void;
};

interface AuthContextType {
  user: AuthUserData | null;
  isAuthError: string | null;
  isLoading: boolean;
  isUserLogoutLoading: boolean;
  isUserLoaded: boolean;
  login: (credentials: LoginSchema) => void;
  forgotPassword: (credentials: ForgotPasswordSchema) => void;
  logout: () => void;
  setIsAuthError: (error: string | null) => void;
}

const authProvider = {
  user: null,
  isAuthError: null,
  isLoading: false,
  isUserLoaded: false,
  isUserLogoutLoading: false,
  login: () => {},
  logout: () => {},
  forgotPassword: () => {},
  setIsAuthError: () => {},
};

const AuthContext = createContext<AuthContextType>(authProvider);

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUserData | null>(null);
  const [isUserLoaded, setIsUserLoaded] = useState(false);
  const [isAuthError, setIsAuthError] = useState<string | null>(null);
  const [handleUserLogin, { isLoading }] = useLoginMutation();
  const [handleUserForgotPassword] = useForgotPasswordMutation();
  const [handleUserLogout, { isLoading: isUserLogoutLoading }] =
    useLogoutMutation();

  useEffect(() => {
    const existingUserData = getLocalStorageItem<AuthUserData>(
      LocalStorageKey.USER_DATA
    );
    if (existingUserData) {
      setUser(existingUserData);
    }
    setIsUserLoaded(true);
  }, []);

  const login = async (credentials: LoginSchema) => {
    const result = await handleUserLogin(credentials);
    const error = getErrorInApiResult(result);
    if (error) {
      setIsAuthError(error);
      return;
    }
    if (result.data) {
      handleLoginSuccess(result.data);
    }
  };

  const forgotPassword = async (forgotPassword: ForgotPasswordSchema) => {
    const result = await handleUserForgotPassword(forgotPassword);
    const error = getErrorInApiResult(result);

    if (error) {
      setIsAuthError(error);
      throw new Error(error);
    }
    return {
      success: true,
      message: "Forgot password request sent successfully.",
    };
  };

  const handleLoginSuccess = ({ user, tokens }: UserLoginResponse) => {
    const userData: AuthUserData = {
      id: user.id,
      role: user.role,
      name: user.name,
      email: user.email,
      status: user.status,
    };

    setLocalStorageItem(LocalStorageKey.USER_DATA, userData);
    setLocalStorageItem(LocalStorageKey.TOKENS, tokens);
    setUser(user);
  };

  const logout = async () => {
    const tokens = getLocalStorageItem<LocalStorageKey.TOKENS>(
      LocalStorageKey.TOKENS
    ) as unknown as Tokens;
    if (!tokens) return;

    const existingRefreshToken = tokens.refresh.token;

    await handleUserLogout({
      refreshToken: existingRefreshToken,
    });

    removeLocalStorageItem(LocalStorageKey.USER_DATA);
    removeLocalStorageItem(LocalStorageKey.TOKENS);
    localStorage.clear();
    window.location.reload();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthError,
        isLoading,
        forgotPassword,
        login,
        logout,
        setIsAuthError,
        isUserLoaded,
        isUserLogoutLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
