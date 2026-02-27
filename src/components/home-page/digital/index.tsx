"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";

const Digital = () => {
  const route = useRouter();

  const handleOnLearnMoreClick = () => {
    route.push("/request-for-tutors");
  };

  return (
    <div className="px-4 lg:px-8">
      <div className="mx-auto max-w-7xl py-10 lg:py-0 lg:pb-20 lg:px-8 bg-digital rounded-3xl bg-primary-700 relative overflow-hidden min-h-[340px] lg:min-h-[420px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 py-10 lg:py-12">
          {/* COLUMN-1 */}
          <div className="lg:pl-16 xl:pl-24 animate-slide-left">
            <h3 className="text-sm font-semibold text-white mb-3 tracking-widest text-center lg:text-start uppercase">
              WHO WE ARE
            </h3>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-6 leading-snug text-center lg:text-start">
              Home tuition provides the convenience of studying at home.
            </h2>
            <div className="text-center lg:text-start">
              <button
                className="text-base font-semibold text-white bg-btnblue py-3.5 px-9 hover:opacity-90 rounded-full transition-all duration-300 hover:shadow-lg"
                onClick={handleOnLearnMoreClick}
              >
                Get Started
              </button>
            </div>
          </div>

          {/* COLUMN-2: Image */}
          <div className="hidden lg:block">
            <div className="lg:absolute girldoodle">
              <Image
                src={"/images/digital/girldoodle.webp"}
                alt="girldoodle"
                width={700}
                height={595}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Digital;
