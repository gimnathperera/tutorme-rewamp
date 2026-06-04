"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

interface datatype {
  heading: string;
  imgSrc: string;
  paragraph: string;
}

const staggerClasses = ["stagger-1", "stagger-2", "stagger-3"];

const AboutUs = () => {
  const t = useTranslations("aboutUs");

  const Aboutdata: datatype[] = [
    {
      heading: t("card1Heading"),
      imgSrc: "/images/aboutus/imgOne.svg",
      paragraph: t("card1Text"),
    },
    {
      heading: t("card2Heading"),
      imgSrc: "/images/aboutus/imgTwo.svg",
      paragraph: t("card2Text"),
    },
    {
      heading: t("card3Heading"),
      imgSrc: "/images/aboutus/imgThree.svg",
      paragraph: t("card3Text"),
    },
  ];

  return (
    <div id="aboutus-section" className="px-4 pb-8 lg:px-8 lg:pb-12">
      <div className="mx-auto max-w-7xl">
        {/* Section labels */}
        <h2 className="text-center text-4xl font-bold leading-[1.2] mt-2 mb-2 text-black animate-on-scroll stagger-1">
          {t("sectionHeading")}
        </h2>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-8 gap-6">
          {Aboutdata.map((item, i) => (
            <div
              key={i}
              className={`hover:bg-navyblue bg-white rounded-3xl pt-8 pl-8 pb-8 pr-6 shadow-md group animate-on-scroll transition-all duration-700 ease-in-out hover:shadow-xl ${staggerClasses[i]}`}
            >
              <h4 className="text-xl font-semibold leading-[1.3] text-black mb-3 group-hover:text-white transition-colors duration-700 ease-in-out">
                {item.heading}
              </h4>
              <Image
                src={item.imgSrc}
                alt={item.imgSrc}
                width={72}
                height={72}
                className="mb-4"
              />
              <p className="text-base font-normal text-black group-hover:text-offwhite leading-relaxed transition-colors duration-700 ease-in-out">
                {item.paragraph}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
