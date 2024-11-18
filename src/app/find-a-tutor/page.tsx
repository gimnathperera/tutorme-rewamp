"use client";
import FormFindATutor from "@/components/find-a-tutor/form-find-a-tutor";

const FindATutorForm = () => {
  return (
    <div className="px-4 sm:px-8 md:px-16 lg:px-32 mb-8">
      <p className="font-extrabold text-[40px] py-8">Find A Tutor</p>

      <FormFindATutor />
    </div>
  );
};

export default FindATutorForm;
