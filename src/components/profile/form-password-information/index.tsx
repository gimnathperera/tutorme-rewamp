import InputText from "@/components/shared/input-text";
import SubmitButton from "@/components/shared/submit-button";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PasswordInfoSchema, passwordInfoSchema } from "./schema";

type Props = {
  onRegisterClick: () => void;
  onForgotPasswordClick: () => void;
};

const FormLogin = ({ onRegisterClick, onForgotPasswordClick }: Props) => {
  const loginForm = useForm({
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
      <FormProvider {...loginForm}>
        <form onSubmit={loginForm.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-6 gap-6">
            <div className="col-span-6 sm:col-span-3">
              <InputText
                label="Current Password"
                name="Current password"
                placeholder="*******"
                type="password"
              />
            </div>
            <div className="col-span-6 sm:col-span-3">
              <InputText
                label="Current Password"
                name="Current password"
                placeholder="*******"
                type="password"
              />
              <div
                data-popover
                id="popover-password"
                role="tooltip"
                className="absolute z-10 invisible inline-block text-sm font-light text-gray-500 transition-opacity duration-300 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 w-72 "
              >
                <div className="p-3 space-y-2">
                  <h3 className="font-semibold text-gray-900 ">
                    Must have at least 6 characters
                  </h3>
                  <div className="grid grid-cols-4 gap-2">
                    <div className="h-1 bg-orange-300 "></div>
                    <div className="h-1 bg-orange-300 "></div>
                    <div className="h-1 bg-gray-200 "></div>
                    <div className="h-1 bg-gray-200 "></div>
                  </div>
                  <p>It’s better to have:</p>
                  <ul>
                    <li className="flex items-center mb-1">
                      <svg
                        className="w-4 h-4 mr-2 text-green-400"
                        aria-hidden="true"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clip-rule="evenodd"
                        ></path>
                      </svg>
                      Upper & lower case letters
                    </li>
                    <li className="flex items-center mb-1">
                      <svg
                        className="w-4 h-4 mr-2 text-gray-300 "
                        aria-hidden="true"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clip-rule="evenodd"
                        ></path>
                      </svg>
                      A symbol (#$&)
                    </li>
                    <li className="flex items-center">
                      <svg
                        className="w-4 h-4 mr-2 text-gray-300 "
                        aria-hidden="true"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clip-rule="evenodd"
                        ></path>
                      </svg>
                      A longer password (min. 12 chars.)
                    </li>
                  </ul>
                </div>
                <div data-popper-arrow></div>
              </div>
            </div>
            <div className="col-span-6 sm:col-span-3">
              <InputText
                label="Password"
                name="password"
                placeholder="*******"
                type="password"
              />
            </div>
            <div className="col-span-6 sm:col-full">
              <button
                className="text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center   "
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

export default FormLogin;
