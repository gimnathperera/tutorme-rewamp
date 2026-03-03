"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useRef } from "react";

const Banner = () => {
  const route = useRouter();
  const heroImageRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  const handleOnFindATutorClick = () => {
    route.push("/request-for-tutors");
  };

  // Parallax scroll effect on hero image
  useEffect(() => {
    const handleScroll = () => {
      if (heroImageRef.current) {
        const scrollY = window.scrollY;
        heroImageRef.current.style.transform = `translateY(${scrollY * 0.18}px)`;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fade-up animation on mount for text content
  useEffect(() => {
    const elements = [
      { el: badgeRef.current, delay: 0 },
      { el: headlineRef.current, delay: 150 },
      { el: ctaRef.current, delay: 300 },
    ];
    elements.forEach(({ el, delay }) => {
      if (el) {
        setTimeout(() => {
          el.style.opacity = "1";
          el.style.transform = "translateY(0)";
        }, delay);
      }
    });
  }, []);

  return (
    <div className="mx-auto max-w-7xl py-6 sm:py-10 px-6 lg:px-8 overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 mt-4 lg:mt-8 mb-6 lg:mb-10 items-center gap-4">
        {/* Left: Text Content */}
        <div className="mx-auto sm:mx-0 w-full">
          {/* Badge */}
          <div
            ref={badgeRef}
            className="py-2 text-center lg:text-start"
            style={{
              opacity: 0,
              transform: "translateY(30px)",
              transition: "opacity 0.6s ease, transform 0.6s ease",
            }}
          >
            <button className="text-blue bg-lightblue hover:shadow-xl text-sm font-bold px-5 py-1.5 rounded-3xl tracking-wider hover:text-white hover:bg-black transition-all duration-300">
              E-Learning Platform
            </button>
          </div>

          {/* Headline */}
          <div
            ref={headlineRef}
            className="py-2 text-center lg:text-start"
            style={{
              opacity: 0,
              transform: "translateY(30px)",
              transition: "opacity 0.6s ease, transform 0.6s ease",
            }}
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-6xl xl:text-7xl font-bold text-darkpurple leading-tight">
              Personalized Home <br />
              Tuition
            </h1>
          </div>

          {/* CTA Button */}
          <div
            ref={ctaRef}
            className="mt-6 mb-4 text-center lg:text-start"
            style={{
              opacity: 0,
              transform: "translateY(30px)",
              transition: "opacity 0.6s ease, transform 0.6s ease",
            }}
          >
            <button
              className="text-sm md:text-base font-semibold hover:shadow-xl bg-primary-700 text-white py-3.5 px-9 rounded-full hover:opacity-90 transition-all duration-300"
              onClick={handleOnFindATutorClick}
            >
              Request a Tutor
            </button>
          </div>
        </div>

        {/* Right: Hero Image with Parallax */}
        <div className="lg:-m-24 lg:pt-20 hidden lg:block">
          <div ref={heroImageRef} className="parallax-hero">
            <Image
              src={"/images/banner/banner.png"}
              alt="hero-image"
              width={800}
              height={642}
              className="mix-blend-multiply"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
