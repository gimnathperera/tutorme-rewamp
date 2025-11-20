"use client";
import MainForm from "@/app/find-a-tutor/components/form-find-a-tutor";

const FindATutorForm = () => {
  return (
    <div className="px-4 sm:px-8 md:px-16 lg:px-32 mb-8">
      <p className="font-extrabold text-[40px] py-8">Request A Tutor</p>
      <MainForm />
    </div>
  );
};

export default FindATutorForm;
