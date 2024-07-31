"use client";

import { useMotionValue, motion, useSpring, useTransform } from "framer-motion";
import React, { FC, useRef } from "react";
import { FiArrowRight } from "react-icons/fi";
import { grades } from "../page"; // Ensure grades is correctly imported

type Subject = {
  subjectId: number;
  attributes: {
    heading: string;
    subheading: string;
    image: string;
    link: string;
  };
};

const subjectDetails: Subject[] = [
  {
    subjectId: 1,
    attributes: {
      heading: "Sinhala",
      subheading: "Details learning Sinhala",
      image: "/images/subjects/sinhala.png",
      link: "#",
    },
  },
  {
    subjectId: 2,
    attributes: {
      heading: "Mathematics",
      subheading: "Details learning Mathematics",
      image: "/images/subjects/maths.png",
      link: "#",
    },
  },
  {
    subjectId: 3,
    attributes: {
      heading: "English",
      subheading: "Details learning English",
      image: "/images/subjects/english.png",
      link: "#",
    },
  },
];

const Subjects: FC = () => {
  // Assuming you want to display subjects for the first grade in the array
  const selectedGrade = grades[0];

  return (
    <div className="py-10">
      <div className="mx-auto max-w-7xl py-10">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center">
          Pick a Subject and Dive In!
        </h2>
        <h3 className="text-xl sm:text-2xl font-medium text-center pt-4 sm:pt-10 opacity-50">
          Discover fun and engaging lessons tailored to your interests.
          <br className="hidden sm:block" />
          Choose a subject to start your exciting learning journey!
        </h3>
      </div>
      <section className="bg-neutral-950 p-4 md:p-8">
        <div className="mx-auto max-w-5xl">
          {subjectDetails.map(({ subjectId, attributes }) => (
            <Link
              key={subjectId}
              heading={attributes.heading}
              subheading={attributes.subheading}
              imgSrc={attributes.image}
              href={`/grades/${selectedGrade.id}/subject/${subjectId}`}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

const Link: FC<{
  heading: string;
  imgSrc: string;
  subheading: string;
  href: string;
}> = ({ heading, imgSrc, subheading, href }) => {
  const ref = useRef<HTMLAnchorElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const top = useTransform(mouseYSpring, [0.5, -0.5], ["40%", "60%"]);
  const left = useTransform(mouseXSpring, [0.5, -0.5], ["60%", "70%"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();

      const width = rect.width;
      const height = rect.height;

      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const xPct = mouseX / width - 0.5;
      const yPct = mouseY / height - 0.5;

      x.set(xPct);
      y.set(yPct);
    }
  };

  return (
    <motion.a
      href={href}
      ref={ref}
      onMouseMove={handleMouseMove}
      initial="initial"
      whileHover="whileHover"
      className="group relative flex items-center justify-between border-b-2 border-neutral-700 py-4 transition-colors duration-500 hover:border-neutral-50 md:py-8"
    >
      <div>
        <motion.span
          variants={{
            initial: { x: 0 },
            whileHover: { x: -16 },
          }}
          transition={{
            type: "spring",
            staggerChildren: 0.075,
            delayChildren: 0.25,
          }}
          className="relative z-0 block text-3xl sm:text-3xl md:text-4xl font-bold text-neutral-500 transition-colors duration-500 group-hover:text-neutral-50"
        >
          {heading.split("").map((l, i) => (
            <motion.span
              variants={{
                initial: { x: 0 },
                whileHover: { x: 16 },
              }}
              transition={{ type: "spring" }}
              className="inline-block"
              key={i}
            >
              {l}
            </motion.span>
          ))}
        </motion.span>
        <span className="relative z-0 mt-2 block text-base text-neutral-500 transition-colors duration-500 group-hover:text-neutral-50">
          {subheading}
        </span>
      </div>

      <motion.img
        style={{
          top,
          left,
          translateX: "-50%",
          translateY: "-50%",
        }}
        variants={{
          initial: { scale: 0, rotate: "-12.5deg" },
          whileHover: { scale: 1, rotate: "12.5deg" },
        }}
        transition={{ type: "spring" }}
        src={imgSrc}
        className="absolute z-0 h-40 w-56 rounded-lg object-cover md:h-40 md:w-56"
        alt={`Image representing a link for ${heading}`}
      />

      <motion.div
        variants={{
          initial: {
            x: "25%",
            opacity: 0,
          },
          whileHover: {
            x: "0%",
            opacity: 1,
          },
        }}
        transition={{ type: "spring" }}
        className="relative z-0 p-4"
      >
        <FiArrowRight className="text-4xl text-neutral-50" />
      </motion.div>
    </motion.a>
  );
};

export default Subjects;
