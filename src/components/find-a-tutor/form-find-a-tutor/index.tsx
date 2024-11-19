import { zodResolver } from "@hookform/resolvers/zod";
import { FC, ReactNode } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { PersonalInfoComponent } from "../personal-info";
import TutorTypeComponent from "../tutor-type";
import { initialFormValues, TutorSchema, tutorSchema } from "./schema";
import LessonDetails from "../lesson-details";

type FormCardProps = {
  children: ReactNode;
};

const FormCard: FC<FormCardProps> = ({ children }) => {
  return <div className="bg-white p-10 rounded-3xl">{children}</div>;
};

const FormFindATutor: FC = () => {
  const findATutorForm = useForm({
    resolver: zodResolver(tutorSchema),
    defaultValues: initialFormValues as TutorSchema,
    mode: "onChange",
  });

  const { handleSubmit, reset } = findATutorForm;

  const onSubmit = (data: TutorSchema) => {
    console.log("Form Submitted", data);
  };

  const onReset = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    reset();
  };

  return (
    <FormProvider {...findATutorForm}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-12">
          <FormCard>
            <PersonalInfoComponent />
          </FormCard>

          <FormCard>
            <LessonDetails />
          </FormCard>

          <FormCard>
            <TutorTypeComponent />
          </FormCard>

          <div className="flex justify-end space-x-4 my-5 bg-white p-10 rounded-3xl">
            <button
              type="button"
              className="justify-end text-xl font-semibold bg-transparent py-4 px-6 lg:px-12 navbutton rounded-full hover:bg-navyblue hover:text-white"
              onClick={onReset}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="justify-end text-xl font-semibold text-white  py-4 px-6 lg:px-12  rounded-full  bg-primary-700 hover:bg-btnblue"
            >
              Save
            </button>
          </div>
        </div>
      </form>
    </FormProvider>
  );
};

export default FormFindATutor;
