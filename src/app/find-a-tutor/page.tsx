"use client";
import { FC, ReactNode } from "react";
import LessonDetails from "./lesson-details";
import { PersonalInfoComponent } from "./personal-info";
import TutorTypeComponent from "./tutor-type";

type FormCardProps = {
  children: ReactNode;
};

const FormCard: FC<FormCardProps> = ({ children }) => {
  return <div className="bg-white p-10 rounded-3xl">{children}</div>;
};

const FindATutorForm = () => {
  return (
    <div className="px-4 sm:px-8 md:px-16 lg:px-32 mb-8">
      <p className="font-extrabold text-[40px] py-8">Find A Tutor</p>

      <form>
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
              type="button"
              className="justify-end text-xl font-semibold text-white  py-4 px-6 lg:px-12  rounded-full  bg-primary-700 hover:bg-btnblue"
            >
              Save
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default FindATutorForm;
