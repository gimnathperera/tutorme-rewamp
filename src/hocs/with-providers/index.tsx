"use client";

import { FC, ReactElement } from "react";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/contexts/auth-context";
import { WithStore } from "../with-store";

interface Props {
  children: ReactElement;
}

const TOAST_GUTTER = 16;
const TOAST_DURATION = 3000;
const TOAST_POSITION = "bottom-right";
export const FOOTER_HEIGHT = 80;

export const WithProviders: FC<Props> = ({ children }) => {
  return (
    <WithStore>
      <AuthProvider>{children}</AuthProvider>
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
