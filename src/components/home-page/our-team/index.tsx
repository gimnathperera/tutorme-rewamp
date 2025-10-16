import Image from "next/image";
import TutorImage from "../../../../public/images/banner/banner2.jpg";

const OurTeam = () => {
  return (
    <div className="mx-auto max-w-7xl sm:py-4 lg:px-8 m-32">
      <h2 className="text-4xl sm:text-65xl font-bold text-center">
        Our team belives you deserve <br /> only the best learning experience.
      </h2>
      <h3 className="text-2xl font-medium text-center pt-10 opacity-50">
        We&apos;re dedicated to helping students and tutors connect through a
        trusted, easy-to-use platform.
        <br />
        Every learner deserves quality education — and every tutor deserves
        recognition for their effort.
      </h3>
      <div className="grid grid-cols-1 my-16">
        <Image src={TutorImage} alt="office-image" height={684} width={1296} />
      </div>
    </div>
  );
};

export default OurTeam;
