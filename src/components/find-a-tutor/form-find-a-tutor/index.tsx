import { FC, ReactNode } from "react";
import { PersonalInfoComponent } from "../personal-info";
import LessonDetails from "../lesson-details";
import TutorTypeComponent from "../tutor-type";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { TutorSchema, tutorSchema } from "./schema";

type FormCardProps = {
  children: ReactNode;
};

const FormCard: FC<FormCardProps> = ({ children }) => {
  return <div className="bg-white p-10 rounded-3xl">{children}</div>;
};

const FormFindATutor: FC = () => {
  const findATutorForm = useForm({
    resolver: zodResolver(tutorSchema),
    defaultValues: {} as TutorSchema,
    mode: "onChange",
  });

  const onSubmit = (data: TutorSchema) => {
    console.log("Form Submitted", data);
  };

  return (
    <FormProvider {...findATutorForm}>
      <form onSubmit={findATutorForm.handleSubmit(onSubmit)}>
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
