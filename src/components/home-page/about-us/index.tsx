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
    <div id="aboutus-section">
      <div className="mx-auto max-w-7xl px-4 py-20 my-24 lg:px-10 bg-lightgrey rounded-3xl relative overflow-hidden">
        <Image
          src={"/images/aboutus/dots.svg"}
          width={100}
          height={100}
          alt="dots-image"
          className="absolute bottom-1 -left-20"
        />

        {/* Section labels */}
        <h3 className="text-center text-blue text-sm md:text-base tracking-widest font-semibold uppercase animate-on-scroll">
          ABOUT US
        </h3>
        <h2 className="text-center text-3xl md:text-4xl lg:text-5xl font-bold mt-3 mb-2 animate-on-scroll stagger-1">
          Why Choose Home Tuition?
        </h2>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-12 gap-8 lg:gap-10">
          {Aboutdata.map((item, i) => (
            <div
              key={i}
              className={`hover:bg-navyblue bg-white rounded-3xl pt-10 pl-8 pb-10 pr-6 shadow-xl group animate-on-scroll ${staggerClasses[i]}`}
            >
              <h4 className="text-xl md:text-2xl font-semibold text-black mb-4 group-hover:text-white transition-colors duration-300">
                {item.heading}
              </h4>
              <Image
                src={item.imgSrc}
                alt={item.imgSrc}
                width={80}
                height={80}
                className="mb-5"
              />
              <p className="text-base font-normal text-black group-hover:text-offwhite mb-5 leading-relaxed transition-colors duration-300">
                {item.paragraph}
              </p>
              <Link
                href="#"
                className="text-base font-semibold group-hover:text-white text-blue hover-underline inline-flex items-center gap-1"
              >
                {item.link}
                <ChevronRightIcon width={18} height={18} />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
