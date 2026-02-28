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
    <div className="px-4 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* JOIN card */}
          <div className="bg-darkblue bg-beliefs pt-10 px-8 sm:px-12 pb-10 sm:pb-12 rounded-3xl animate-slide-left">
            <h2 className="text-sm font-semibold text-white tracking-widest mb-3 text-center sm:text-start uppercase">
              JOIN
            </h2>
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-snug mb-4 text-center sm:text-start">
              Share{" "}
              <span className="text-grey">
                knowledge and inspire students worldwide.
              </span>
            </h3>
            <p className="text-offwhite text-sm sm:text-base mb-6 text-center sm:text-start leading-relaxed">
              Join our community of passionate tutors who make learning
              personal, flexible, and effective.
            </p>
            <div className="text-center sm:text-start">
              <button
                className="text-sm sm:text-base py-3.5 px-9 font-semibold text-white rounded-full bg-primary-700 hover:opacity-90 transition-all duration-300 hover:shadow-lg"
                onClick={handleRegisterTutor}
              >
                Become a Tutor
              </button>
            </div>
          </div>

          {/* FIND card */}
          <div className="bg-build pt-10 px-8 sm:px-12 pb-10 sm:pb-12 rounded-3xl animate-slide-right">
            <h2 className="text-sm font-semibold text-blue tracking-widest mb-3 text-center sm:text-start uppercase">
              FIND
            </h2>
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black leading-snug mb-4 text-center sm:text-start">
              <span className="text-blue">Find</span> the perfect tutor for any
              subject, anytime.
            </h3>
            <p className="bluish text-sm sm:text-base mb-6 text-center sm:text-start leading-relaxed">
              Discover experienced tutors who match your learning goals and
              schedule.
            </p>
            <div className="text-center sm:text-start">
              <button
                className="text-sm sm:text-base py-3.5 px-9 font-semibold text-white rounded-full bg-primary-700 border border-blue hover:opacity-90 transition-all duration-300 hover:shadow-lg"
                onClick={handleOnLearnMoreClick}
              >
                Request a Tutor
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Beliefs;
