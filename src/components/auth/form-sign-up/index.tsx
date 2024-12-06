import InputText from "@/components/shared/input-text";
import SubmitButton from "@/components/shared/submit-button";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { initialFormValues, SignUpSchema, signUpSchema } from "./schema";
import { useRegisterUserMutation } from "@/store/api/splits/users";
import { getErrorInApiResult } from "@/utils/api";
import { omit } from "lodash-es";
import toast from "react-hot-toast";
import InputPassword from "@/components/shared/input-password";

type Props = {
  onLoginClick: () => void;
};

const FormSignUp = ({ onLoginClick }: Props) => {
  const signupForm = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: initialFormValues as SignUpSchema,
    mode: "onChange",
  });

  const [registerUser, { isLoading }] = useRegisterUserMutation();

  const onSubmit = async (data: SignUpSchema) => {
    const result = await registerUser(omit(data, ["confirmPassword"]));
    const error = getErrorInApiResult(result);
    if (error) {
      return toast.error(error);
    }

    if (result.data) {
      onRegisterSuccess();
    }
  };

  const onRegisterSuccess = () => {
    signupForm.reset();
    toast.success("User registered successfully");
    onLoginClick();
  };

  return (
    <FormProvider {...signupForm}>
      <form onSubmit={signupForm.handleSubmit(onSubmit)}>
        <div className="space-y-4">
          <InputText
            label="Full Name"
            name="name"
            placeholder="Jhon Doe"
            type="text"
          />
          <InputText
            label="Email"
            name="email"
            placeholder="jhon@xyz.com"
            type="email"
          />

          <InputPassword
            label="Password"
            name="password"
            placeholder="*******"
          />

          <InputPassword
            label="Confirm Password"
            placeholder="*******"
            name="confirmPassword"
          />
        </div>
        <div className="space-y-2 mt-8">
          <SubmitButton title="Register" type="submit" loading={isLoading} />

          <div className="text-center">
            <p className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
              Already have an account?{" "}
              <span className="text-blue cursor-pointer" onClick={onLoginClick}>
                Login
              </span>
            </p>
          </div>
        </div>
      </form>
    </FormProvider>
  );
};

export default FormSignUp;
