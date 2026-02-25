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
      <div className="grid grid-cols-1 lg:grid-cols-2 my-12 mx-4 gap-6">
        {/* JOIN card */}
        <div className="bg-darkblue bg-beliefs pt-12 px-8 sm:px-16 pb-48 md:pb-64 rounded-3xl animate-slide-left">
          <h2 className="text-sm md:text-base font-semibold text-white tracking-widest mb-4 text-center sm:text-start uppercase">
            JOIN
          </h2>
          <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-snug mb-5 text-center sm:text-start">
            Share{" "}
            <span className="text-grey">
              knowledge and inspire students worldwide.
            </span>
          </h3>
          <p className="text-offwhite text-base pt-2 mb-6 text-center sm:text-start leading-relaxed">
            Join our community of passionate tutors who make learning personal,
            flexible, and effective.
          </p>
          <div className="text-center sm:text-start">
            <button
              className="text-base md:text-lg py-4 px-10 mt-4 font-semibold text-white rounded-full bg-primary-700 hover:opacity-90 transition-all duration-300 hover:shadow-lg"
              onClick={handleRegisterTutor}
            >
              Become a Tutor
            </button>
          </div>
        </div>

        {/* FIND card */}
        <div className="bg-build pt-12 px-8 sm:px-16 pb-48 md:pb-64 rounded-3xl animate-slide-right">
          <h2 className="text-sm md:text-base font-semibold text-blue tracking-widest mb-4 text-center sm:text-start uppercase">
            FIND
          </h2>
          <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-black leading-snug mb-5 text-center sm:text-start">
            <span className="text-blue">Find</span> the perfect tutor for any
            subject, anytime.
          </h3>
          <p className="bluish text-base pt-2 mb-6 text-center sm:text-start leading-relaxed">
            Discover experienced tutors who match your learning goals and
            schedule.
          </p>
          <div className="text-center sm:text-start">
            <button
              className="text-base md:text-lg py-4 px-10 mt-4 font-semibold text-white rounded-full bg-primary-700 border border-blue hover:opacity-90 transition-all duration-300 hover:shadow-lg"
              onClick={handleOnLearnMoreClick}
            >
              Request a Tutor
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Beliefs;
