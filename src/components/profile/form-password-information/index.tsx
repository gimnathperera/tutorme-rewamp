import InputText from "@/components/shared/input-text";
import { FormProvider, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { PasswordInfoSchema, passwordInfoSchema } from "./schema";
import { FC } from "react";

const FormPasswordInfo: FC = () => {
  const passwordInfoForm = useForm({
    resolver: zodResolver(passwordInfoSchema),
    defaultValues: {} as PasswordInfoSchema,
    mode: "onChange",
  });

  const onSubmit = (data: PasswordInfoSchema) => {
    console.log("Form Submitted", data);
  };

  return (
    <div className="p-4 mb-4 bg-white  rounded-3xl 2xl:col-span-2  sm:p-6">
      <h3 className="mb-4 text-xl font-semibold ">Password information</h3>
      <FormProvider {...passwordInfoForm}>
        <form onSubmit={passwordInfoForm.handleSubmit(onSubmit)}>
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols- gap-6">
              <InputText
                label="Current password"
                name="currentPassword"
                placeholder="*******"
                type="password"
              />
              <InputText
                label="New password"
                name="newPassword"
                placeholder="*******"
                type="password"
              />
              <InputText
                label="Confirm password"
                name="confirmPassword"
                placeholder="*******"
                type="password"
              />
            </div>
            {/* <div className="col-span-6 sm:col-span-3">
              <InputText
                label="New password"
                name="New password"
                placeholder="*******"
                type="password"
              />
            </div>
            <div className="col-span-6 sm:col-span-3">
              <InputText
                label="Confirm password"
                name="Confirm password"
                placeholder="*******"
                type="password"
              />
            </div> */}
            <div className="col-span-6 sm:col-full">
              <button
                className="text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 mt-5 text-center   "
                type="submit"
              >
                Save all
              </button>
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default FormPasswordInfo;
