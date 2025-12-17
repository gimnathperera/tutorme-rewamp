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
      <div className="mx-auto max-w-7xl px-4 my-40 pb-20 lg:pb-40 lg:px-8 bg-digital rounded-3xl bg-primary-700 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 my-16">
          {/* COLUMN-1 */}

          <div className="pt-24 lg:pl-24 ">
            <h3 className="text-lg font-normal text-white mb-5 tracking-widest text-center lg:text-start">
              WHO WE ARE
            </h3>
            <h4 className="text-4xl sm:text-6xl font-bold text-white mb-8 leading-snug text-center lg:text-start">
              Home tuition provides the convenience of studying at home.
            </h4>
            <div className="text-center lg:text-start">
              <button
                className="text-xl font-semibold text-white bg-btnblue py-4 px-12 hover:opacity-90 rounded-full"
                onClick={handleOnLearnMoreClick}
              >
                Get started
              </button>
            </div>
          </div>

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
