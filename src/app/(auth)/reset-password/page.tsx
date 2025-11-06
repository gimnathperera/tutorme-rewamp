"use client";

import { Suspense } from "react";
import FormResetPassword from "./components/FormResetPassword";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";

export default function FormResetPasswordWrapper() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center gap-4 min-h-screen">
          <Badge>
            <Spinner />
            Loading...
          </Badge>
        </div>
      }
    >
      <FormResetPassword />
    </Suspense>
  );
}
