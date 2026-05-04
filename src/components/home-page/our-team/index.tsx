import Image from "next/image";
import TutorImage from "../../../../public/images/banner/banner2.webp";

const OurTeam = () => {
  return (
    <div className="px-4 pb-8 lg:px-8 lg:pb-12">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col lg:flex-row items-center gap-8">
          <div className="lg:w-1/2 text-center lg:text-left">
            <h2 className="text-3xl sm:text-4xl font-semibold text-black leading-[1.2] animate-on-scroll">
              Our team believes you deserve <br className="hidden md:block" />{" "}
              only the best learning experience.
            </h2>

            <p className="text-base font-normal text-[#4B5563] pt-5 leading-relaxed animate-on-scroll stagger-1">
              We&apos;re dedicated to helping students and tutors connect
              through a safe, trusted, easy-to-use platform. Every learner
              deserves quality education in the comfort of their own home - and
              every tutor deserves recognition for their effort.
            </p>
          </div>
          <div className="lg:w-1/2 rounded-3xl overflow-hidden shadow-lg animate-on-scroll stagger-2">
            <Image
              src={TutorImage}
              alt="office-image"
              height={684}
              width={1296}
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OurTeam;
