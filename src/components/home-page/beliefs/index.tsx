"use client";

import { useRouter } from "next/navigation";

const Beliefs = () => {
  const route = useRouter();
  const handleRegisterTutor = () => {
    route.push("/register-tutor");
  };
  const handleOnLearnMoreClick = () => {
    route.push("/request-for-tutors");
  };
  return (
    <div className="mx-auto max-w-2xl lg:max-w-7xl sm:py-4 lg:px-8 rounded-3xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 my-16 mx-5 gap-5">
        <div className="bg-darkblue bg-beliefs pt-12 px-10 sm:px-24 pb-52 md:pb-70 rounded-3xl">
          <h2 className="text-lg font-normal text-white tracking-widest mb-5 text-center sm:text-start">
            JOIN
          </h2>
          <h3 className="text-4xl sm:text-65xl font-bold text-white leading-snug mb-5 text-center sm:text-start">
            Share{" "}
            <span className="text-grey">
              knowledge and inspire students worldwide.
            </span>
          </h3>
          <h5 className="text-offwhite pt-2 mb-5 text-center sm:text-start">
            Join our community of passionate tutors who make learning personal,
            flexible, and effective.
          </h5>
          <div className="text-center sm:text-start">
            <button className="text-xl py-5 px-14 mt-5 font-semibold text-white rounded-full bg-primary-700 hover:opacity-90">
              Become a Tutor
            </button>
          </div>
        </div>

        <div className="bg-build pt-12 px-10 sm:px-24 pb-52 md:pb-70 rounded-3xl">
          <h2 className="text-lg font-normal text-blue tracking-widest mb-5 text-center sm:text-start">
            FIND
          </h2>
          <h3 className="text-4xl sm:text-65xl font-bold text-black leading-snug mb-5 text-center sm:text-start">
            <span className="text-blue">Find</span> the perfect tutor for any
            subject, anytime.
          </h3>
          <h5 className="bluish pt-2 mb-5 text-center sm:text-start">
            Discover experienced tutors who match your learning goals and
            schedule.
          </h5>
          <div className="text-center sm:text-start">
            <button
              className="text-xl py-5 px-14 mt-5 font-semibold text-white rounded-full bg-primary-700 border border-blue hover:opacity-90"
              onClick={handleOnLearnMoreClick}
            >
              Find a Tutor
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Beliefs;
