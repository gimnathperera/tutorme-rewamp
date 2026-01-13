"use client";

import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema, ResetPasswordSchema } from "./schema";
import InputText from "@/components/shared/input-text";
import SubmitButton from "@/components/shared/submit-button";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useResetPasswordMutation } from "@/store/api/splits/reset-password";
import toast from "react-hot-toast";
import ForgetPasswordImage from "../../../../../public/images/auth/forget-password.png";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogOverlay,
} from "@/components/ui/dialog";
import Image from "next/image";

const FormResetPassword = () => {
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const form = useForm<ResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (data: ResetPasswordSchema) => {
    if (!token) {
      setErrorMsg(
        "Reset link is not ready. Please wait a second and try again.",
      );
      return;
    }

    setErrorMsg("");
    setSuccessMsg("");

    try {
      const response = await resetPassword({
        token,
        password: data.password,
      }).unwrap();

      if (!response || Object.keys(response).length === 0) {
        toast.success("Password reset successful!");
      } else if (response.message) {
        toast.success(response.message);
      } else {
        toast.success("Password reset successful!");
      }

      setTimeout(() => router.push("/"), 1000);
    } catch (error: any) {
      toast.error(
        error?.data?.message || "Failed to reset password. Try again.",
      );

      const message =
        error?.data?.message || "Failed to reset password. Try again.";
      setErrorMsg(message);
    }
  };
  useEffect(() => {
    if (!open) router.push("/");
  }, [open, router]);

  return (
    <Dialog open={true}>
      <DialogOverlay className="fixed inset-0 bg-black/10 backdrop-blur-sm" />

      <DialogContent
        className="sm:max-w-md bg-white rounded-2xl p-6 shadow-xl"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <div className="flex justify-center items-center">
            <Image
              src={ForgetPasswordImage}
              alt={"Forget Password Image"}
              height={200}
            />
          </div>
          <DialogTitle className="text-2xl text-center font-semibold">
            Reset Password
          </DialogTitle>
          <DialogDescription className="text-center text-gray-500">
            Enter your new password below to reset your password
          </DialogDescription>
        </DialogHeader>

        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <InputText
              label="New Password"
              name="password"
              type="password"
              placeholder="Enter new password"
            />
            <InputText
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              placeholder="Confirm new password"
            />

            <div className="pt-2">
              <SubmitButton
                title={isLoading ? "Resetting..." : "Reset Password"}
                type="submit"
                disabled={isLoading}
              />
            </div>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};

export default FormResetPassword;
