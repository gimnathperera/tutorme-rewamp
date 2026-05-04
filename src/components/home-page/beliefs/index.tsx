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
    <div className="px-4 pb-8 lg:px-8 lg:pb-12">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* JOIN card */}
          <div className="bg-darkblue pt-8 px-6 sm:px-10 pb-8 sm:pb-10 rounded-3xl animate-slide-left flex flex-col">
            <h3 className="text-3xl lg:text-4xl font-bold text-white leading-[1.25] mb-4 text-center sm:text-start">
              Share{" "}
              <span className="text-grey">
                knowledge and inspire students worldwide.
              </span>
            </h3>
            <p className="text-offwhite text-base mb-6 text-center sm:text-start leading-relaxed">
              Join our community of passionate tutors - including university
              students earning while they inspire the next generation. Make
              learning personal, flexible, and effective.
            </p>
            <div className="mt-auto text-center sm:text-start">
              <button
                className="text-base py-3.5 px-9 font-semibold text-white rounded-full bg-primary-700 hover:bg-primary-800 transition-colors duration-200 hover:shadow-lg"
                onClick={handleRegisterTutor}
              >
                Become a Tutor
              </button>
            </div>
          </div>

          {/* FIND card */}
          <div className="bg-build pt-8 px-6 sm:px-10 pb-8 sm:pb-10 rounded-3xl animate-slide-right flex flex-col">
            <h3 className="text-3xl lg:text-4xl font-bold text-black leading-[1.25] mb-4 text-center sm:text-start">
              <span className="text-blue">Find</span> the perfect tutor for any
              subject, anytime.
            </h3>
            <p className="bluish text-base mb-6 text-center sm:text-start leading-relaxed">
              Discover experienced tutors who match your learning goals and
              schedule.
            </p>
            <div className="mt-auto text-center sm:text-start">
              <button
                className="text-base py-3.5 px-9 font-semibold text-white rounded-full bg-primary-700 border border-blue hover:bg-primary-800 transition-colors duration-200 hover:shadow-lg"
                onClick={handleOnLearnMoreClick}
              >
                Request for Tutor
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Beliefs;
