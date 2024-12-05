"use client";

import { FC, ReactElement } from "react";

import { AuthProvider } from "@/contexts/auth-context";
import { WithStore } from "../with-store";

interface Props {
  children: ReactElement;
}

export const WithProviders: FC<Props> = ({ children }) => {
  return (
    <WithStore>
      <AuthProvider>{children}</AuthProvider>
    </WithStore>
  );
};
