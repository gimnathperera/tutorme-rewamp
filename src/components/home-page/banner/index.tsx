"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";

const Banner = () => {
  const route = useRouter();

  const handleOnFindATutorClick = () => {
    route.push("/find-a-tutor");
  };

  return (
    <div className="mx-auto max-w-7xl my-10 sm:py-10 px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 my-16">
        <div className="mx-auto sm:mx-0">
          <div className="py-3 text-center lg:text-start">
            <button className="text-blue bg-lightblue hover:shadow-xl text-sm md:text-lg font-bold px-6 py-1 rounded-3xl tracking-wider hover:text-white hover:bg-black">
              E-Learning Platform
            </button>
          </div>
          <div className="py-3 text-center lg:text-start">
            <h1 className="text-6xl lg:text-80xl font-bold text-darkpurple">
              Personalized Home <br />
              Tuition
            </h1>
          </div>
          <div className="my-7 text-center lg:text-start">
            <button
              className="text-sm md:text-xl font-semibold hover:shadow-xl bg-primary-700 text-white py-3 px-6 md:py-5 md:px-14 rounded-full hover:opacity-90"
              onClick={handleOnFindATutorClick}
            >
              Find a tutor
            </button>
          </div>
        </div>

        <div className="lg:-m-24 lg:pt-20 hidden lg:block">
          <Image
            src={"images/banner/banner.svg"}
            alt="hero-image"
            width={800}
            height={642}
            className="mix-blend-multiply"
          />
        </div>
      </div>
    </div>
  );
};

export default Banner;
