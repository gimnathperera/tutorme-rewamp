"use client";

import { FC, ReactElement } from "react";
import { Toaster } from "react-hot-toast";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "@/contexts/auth-context";
import { env } from "@/configs/env";
import { WithStore } from "../with-store";

interface Props {
  children: ReactElement;
}

const TOAST_GUTTER = 16;
const TOAST_DURATION = 3000;
const TOAST_POSITION = "bottom-right";
export const FOOTER_HEIGHT = 80;

const WithGoogleOAuth: FC<{ children: ReactElement }> = ({ children }) => {
  if (!env.google.clientId) {
    // No client ID configured (e.g. local dev without Google OAuth set up) —
    // render children as-is; the "Continue with Google" button hides itself.
    return children;
  }
  return (
    <GoogleOAuthProvider clientId={env.google.clientId}>
      {children}
    </GoogleOAuthProvider>
  );
};

export const WithProviders: FC<Props> = ({ children }) => {
  return (
    <WithStore>
      <WithGoogleOAuth>
        <AuthProvider>{children}</AuthProvider>
      </WithGoogleOAuth>
      <Toaster
        position={TOAST_POSITION}
        containerStyle={{ bottom: FOOTER_HEIGHT + TOAST_GUTTER }}
        gutter={TOAST_GUTTER}
        toastOptions={{
          className: "react-hot-toast",
          duration: TOAST_DURATION,
        }}
      />
    </WithStore>
  );
};
