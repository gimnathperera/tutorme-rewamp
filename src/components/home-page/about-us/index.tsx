import Link from "next/link";
import { ChevronRightIcon } from "@heroicons/react/20/solid";
import Image from "next/image";

interface datatype {
  heading: string;
  imgSrc: string;
  paragraph: string;
  link: string;
}

const Aboutdata: datatype[] = [
  {
    heading: "Personalized Learning",
    imgSrc: "/images/aboutus/imgOne.svg",
    paragraph:
      "Tutors adapt teaching methods to suit the student's learning style.",
    link: "Learn more",
  },
  {
    heading: "Academic Support",
    imgSrc: "/images/aboutus/imgTwo.svg",
    paragraph:
      "Students receive help with homework, test preparation, and subject understanding.",
    link: "Learn more",
  },
  {
    heading: "Confidence Building",
    imgSrc: "/images/aboutus/imgThree.svg",
    paragraph: "One-on-one attention boosts confidence and motivation.",
    link: "Learn more",
  },
];

const staggerClasses = ["stagger-1", "stagger-2", "stagger-3"];

const AboutUs = () => {
  return (
    <div id="aboutus-section" className="px-4 lg:px-8">
      <div className="mx-auto max-w-7xl px-4 py-12 lg:py-16 lg:px-10 bg-lightgrey rounded-3xl relative overflow-hidden">
        <Image
          src={"/images/aboutus/dots.svg"}
          width={100}
          height={100}
          alt="dots-image"
          className="absolute bottom-1 -left-20"
        />

        {/* Section labels */}
        <h3 className="text-center text-blue text-sm tracking-widest font-semibold uppercase animate-on-scroll">
          ABOUT US
        </h3>
        <h2 className="text-center text-3xl md:text-4xl lg:text-5xl font-bold mt-2 mb-2 animate-on-scroll stagger-1">
          Why Choose Home Tuition?
        </h2>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-8 gap-6">
          {Aboutdata.map((item, i) => (
            <div
              key={i}
              className={`hover:bg-navyblue bg-white rounded-3xl pt-8 pl-8 pb-8 pr-6 shadow-md group animate-on-scroll transition-all duration-300 hover:shadow-xl ${staggerClasses[i]}`}
            >
              <h4 className="text-xl font-semibold text-black mb-3 group-hover:text-white transition-colors duration-300">
                {item.heading}
              </h4>
              <Image
                src={item.imgSrc}
                alt={item.imgSrc}
                width={72}
                height={72}
                className="mb-4"
              />
              <p className="text-sm font-normal text-black group-hover:text-offwhite leading-relaxed transition-colors duration-300">
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
