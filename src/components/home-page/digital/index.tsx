"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";

const Digital = () => {
  const route = useRouter();

  const handleOnLearnMoreClick = () => {
    route.push("/request-for-tutors");
  };

  return (
    <div className="mx-2">
      <div className="mx-auto max-w-7xl px-4 my-32 pb-16 lg:pb-36 lg:px-8 bg-digital rounded-3xl bg-primary-700 relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 my-12">
          {/* COLUMN-1 */}
          <div className="pt-20 lg:pl-24 animate-slide-left">
            <h3 className="text-sm md:text-base font-semibold text-white mb-4 tracking-widest text-center lg:text-start uppercase">
              WHO WE ARE
            </h3>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-8 leading-snug text-center lg:text-start">
              Home tuition provides the convenience of studying at home.
            </h2>
            <div className="text-center lg:text-start">
              <button
                className="text-base md:text-lg font-semibold text-white bg-btnblue py-4 px-10 hover:opacity-90 rounded-full transition-all duration-300 hover:shadow-lg"
                onClick={handleOnLearnMoreClick}
              >
                Get Started
              </button>
            </div>
          </div>

          {/* COLUMN-2: Image */}
          <div>
            <div className="lg:absolute girldoodle">
              <Image
                src={"/images/digital/girldoodle.webp"}
                alt="girldoodle"
                width={815}
                height={691}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Digital;
