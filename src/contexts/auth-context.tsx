/* eslint-disable unused-imports/no-unused-vars */

"use client";

import { ForgotPasswordSchema } from "@/components/auth/form-forgot-password/schema";
import { LoginSchema } from "@/components/auth/form-login/schema";
import {
  useForgotPasswordMutation,
  useLazyMeQuery,
  useLoginMutation,
  useLogoutMutation,
} from "@/store/api/splits/auth";
import { useLazyGetProfileQuery } from "@/store/api/splits/users";
import { AuthUserData } from "@/types/auth-types";
import { UserBase, UserLoginResponse } from "@/types/response-types";
import { getErrorInApiResult } from "@/utils/api";
import {
  createContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from "react";

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
  updateUser: (user: Partial<AuthUserData>) => void;
  setAuthenticatedUser: (user: UserBase) => void;
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
  updateUser: (user: Partial<AuthUserData>) => void;
  setAuthenticatedUser: (user: UserBase) => void;
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
  updateUser: () => {},
  setAuthenticatedUser: () => {},
};

const AuthContext = createContext<AuthContextType>(authProvider);
const RESTRICTED_USER_STATUSES = ["suspended", "rejected"] as const;
const USER_STATUS_CHECK_INTERVAL_MS = 30000;
const LOGOUT_COUNTDOWN_SECONDS = 10;

type RestrictedUserStatus = (typeof RESTRICTED_USER_STATUSES)[number];

const getRestrictedUserStatus = (
  status?: string | null,
): RestrictedUserStatus | null => {
  const normalizedStatus = status?.trim().toLowerCase();

  return RESTRICTED_USER_STATUSES.includes(
    normalizedStatus as RestrictedUserStatus,
  )
    ? (normalizedStatus as RestrictedUserStatus)
    : null;
};

const getRestrictedStatusMessage = (status: RestrictedUserStatus) =>
  status === "suspended"
    ? "Your account has been suspended by an administrator."
    : "Your account has been rejected by an administrator.";

const toAuthUserData = (user: UserLoginResponse["user"]): AuthUserData => ({
  id: user.id,
  role: user.role,
  name: user.name,
  email: user.email,
  status: user.status,
});

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUserData | null>(null);
  const [isUserLoaded, setIsUserLoaded] = useState(false);
  const [isAuthError, setIsAuthError] = useState<string | null>(null);
  const [restrictedStatus, setRestrictedStatus] =
    useState<RestrictedUserStatus | null>(null);
  const [logoutCountdown, setLogoutCountdown] = useState(
    LOGOUT_COUNTDOWN_SECONDS,
  );
  const [handleUserLogin, { isLoading }] = useLoginMutation();
  const [handleUserForgotPassword] = useForgotPasswordMutation();
  const [handleUserLogout, { isLoading: isUserLogoutLoading }] =
    useLogoutMutation();
  const [fetchCurrentUserProfile] = useLazyGetProfileQuery();
  const [fetchCurrentUser] = useLazyMeQuery();

  useEffect(() => {
    const bootstrapSession = async () => {
      const result = await fetchCurrentUser();
      if (result.data?.user) {
        setUser(toAuthUserData(result.data.user));
      }
      setIsUserLoaded(true);
    };
    bootstrapSession();
  }, [fetchCurrentUser]);

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

  const handleLoginSuccess = ({ user }: UserLoginResponse) => {
    setUser(toAuthUserData(user));
    setRestrictedStatus(null);
    setLogoutCountdown(LOGOUT_COUNTDOWN_SECONDS);
  };

  // Used by the "Continue with Google" flow, which authenticates via a
  // different mutation/response shape than the regular login form.
  const setAuthenticatedUser = (user: UserBase) => handleLoginSuccess({ user });

  const clearSession = useCallback(() => {
    window.location.assign("/");
  }, []);

  const logout = useCallback(async () => {
    try {
      await handleUserLogout();
    } finally {
      clearSession();
    }
  }, [clearSession, handleUserLogout]);

  const updateUser = (userData: Partial<AuthUserData>) => {
    if (!user) return;

    setUser({ ...user, ...userData });
  };

  useEffect(() => {
    if (!isUserLoaded || !user || restrictedStatus) return;

    const locallyRestrictedStatus = getRestrictedUserStatus(user.status);
    if (locallyRestrictedStatus) {
      setRestrictedStatus(locallyRestrictedStatus);
      setLogoutCountdown(LOGOUT_COUNTDOWN_SECONDS);
      return;
    }

    let isMounted = true;

    const checkCurrentUserStatus = async () => {
      const result = await fetchCurrentUserProfile({
        userId: String(user.id),
      });

      if (!isMounted || !result.data?.status) return;

      const latestStatus = result.data.status;
      const restrictedLatestStatus = getRestrictedUserStatus(latestStatus);

      if (latestStatus !== user.status) {
        setUser({ ...user, status: latestStatus });
      }

      if (restrictedLatestStatus) {
        setRestrictedStatus(restrictedLatestStatus);
        setLogoutCountdown(LOGOUT_COUNTDOWN_SECONDS);
      }
    };

    checkCurrentUserStatus();

    const statusCheckInterval = window.setInterval(
      checkCurrentUserStatus,
      USER_STATUS_CHECK_INTERVAL_MS,
    );

    return () => {
      isMounted = false;
      window.clearInterval(statusCheckInterval);
    };
  }, [fetchCurrentUserProfile, isUserLoaded, restrictedStatus, user]);

  useEffect(() => {
    if (!restrictedStatus) return;

    if (logoutCountdown <= 0) {
      logout();
      return;
    }

    const countdownTimer = window.setTimeout(() => {
      setLogoutCountdown((currentCountdown) =>
        Math.max(currentCountdown - 1, 0),
      );
    }, 1000);

    return () => window.clearTimeout(countdownTimer);
  }, [logout, logoutCountdown, restrictedStatus]);

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
        updateUser,
        setAuthenticatedUser,
      }}
    >
      {children}
      {restrictedStatus && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 px-4"
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="restricted-account-title"
        >
          <div className="w-full max-w-md rounded-2xl bg-white p-6 text-center shadow-2xl">
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-red-600">
              Account {restrictedStatus}
            </p>
            <h2
              id="restricted-account-title"
              className="text-2xl font-bold text-gray-950"
            >
              Access has been paused
            </h2>
            <p className="mt-3 text-sm leading-6 text-gray-600">
              {getRestrictedStatusMessage(restrictedStatus)} You will be logged
              out from the portal in{" "}
              <span className="font-semibold text-gray-950">
                {logoutCountdown}
              </span>{" "}
              seconds. Please contact an administrator if you need help.
            </p>
            <button
              type="button"
              onClick={logout}
              disabled={isUserLogoutLoading}
              className="mt-6 w-full rounded-lg bg-red-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-300"
            >
              Logout now
            </button>
          </div>
        </div>
      )}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
