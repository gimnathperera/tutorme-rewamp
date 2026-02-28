import Image from "next/image";
import TutorImage from "../../../../public/images/banner/banner2.webp";

const OurTeam = () => {
  return (
    <div className="mx-auto max-w-7xl py-12 lg:py-16 px-4 lg:px-8">
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center leading-tight animate-on-scroll">
        Our team believes you deserve <br className="hidden md:block" /> only
        the best learning experience.
      </h2>
      <p className="text-base md:text-lg font-medium text-center pt-5 opacity-50 max-w-3xl mx-auto leading-relaxed animate-on-scroll stagger-1">
        We&apos;re dedicated to helping students and tutors connect through a
        trusted, easy-to-use platform.
        <br className="hidden md:block" />
        Every learner deserves quality education — and every tutor deserves
        recognition for their effort.
      </p>
      <div className="mt-8 rounded-2xl overflow-hidden shadow-lg animate-on-scroll stagger-2">
        <Image
          src={TutorImage}
          alt="office-image"
          height={684}
          width={1296}
          className="w-full h-auto object-cover"
        />
      </div>
    </div>
  );
};

export default OurTeam;
