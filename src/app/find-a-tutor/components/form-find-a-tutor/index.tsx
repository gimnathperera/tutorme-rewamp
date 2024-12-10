import { zodResolver } from "@hookform/resolvers/zod";
import { FC, ReactNode } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { PersonalInfoComponent } from "../personal-info";
import TutorTypeComponent from "../tutor-type";
import { initialFormValues, TutorSchema, tutorSchema } from "./schema";
import LessonDetails from "../lesson-details";
import useLogic from "../../hooks/useLogic";
import { useAddTutorRequestMutation } from "@/store/api/splits/tutor-request";
import { FindMyTutorRequest } from "@/types/request-types";
import { getErrorInApiResult } from "@/utils/api";
import toast from "react-hot-toast";
import SubmitButton from "@/components/shared/submit-button";
import { useReward } from "react-rewards";

type FormCardProps = {
  children: ReactNode;
};

const FormCard: FC<FormCardProps> = ({ children }) => {
  return <div className="bg-white p-10 rounded-3xl">{children}</div>;
};

const MainForm: FC = () => {
  const {
    derivedData: { gradesOptions, subjectsOptions },
    loading: { isGradesLoading, isSubjectsLoading },
  } = useLogic();

  const [addTutorRequest, { isLoading }] = useAddTutorRequestMutation();

  const findATutorForm = useForm({
    resolver: zodResolver(tutorSchema),
    defaultValues: initialFormValues as TutorSchema,
    mode: "onChange",
  });

  const { handleSubmit, reset, formState } = findATutorForm;

  const isSaveDisabled = !formState.isDirty || !formState.isValid;

  const onSubmit = (data: TutorSchema) => {
    const payload = {
      personalInfo: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phoneNumber: data.phoneNumber,
        city: data.city,
        state: data.state,
        zip: data.zip,
        region: data.region,
        grade: data.grade,
      },
      lessonInfo: {
        tutorCount: data.tutorCount,
        lessonDetails: data.tutors ?? [],
      },
      tutorTypeInfo: {
        tutorType: data.tutorType,
        studentSchool: data.school,
        genderPreference: data.genderPreference,
        isBilingualTutor: data.bilingualTutor === "Yes",
      },
    };

    onHandleAddTutorRequest(payload);
  };

  const onHandleAddTutorRequest = async (payload: FindMyTutorRequest) => {
    const response = await addTutorRequest(payload);
    const error = getErrorInApiResult(response);

    if (error) {
      toast.error(error);
      return;
    }

    reset();
    // Since scrolling takes time, we need to wait for it to finish before resetting the form
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 1000);
    toast.success("Tutor request submitted successfully");
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
            <PersonalInfoComponent
              gradesOptions={gradesOptions}
              isGradesLoading={isGradesLoading}
            />
          </FormCard>

          <FormCard>
            <LessonDetails
              subjectsOptions={subjectsOptions}
              isSubjectsLoading={isSubjectsLoading}
            />
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
            <SubmitButton
              type="submit"
              className="justify-end text-xl font-semibold text-white  py-4 px-6 lg:px-12  rounded-full  bg-primary-700 hover:bg-btnblue  disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
              loading={isLoading}
              disabled={isSaveDisabled}
              title="Request Tutor"
            />
          </div>
        </div>
      </form>
    </FormProvider>
  );
};

export default MainForm;
