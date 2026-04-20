"use client";

import Link from "next/link";

const KeepInTouch = () => {
  return (
    <div className="bg-joinus pt-6 pb-8 lg:pt-8 lg:pb-12" id="keep-in-touch-section">
      <div className="mx-auto max-w-7xl">
        <div className="text-center animate-on-scroll">
          <h2 className="text-4xl font-bold leading-[1.2] text-[#111827] mb-4">
            Take your learning or teaching journey
            <br className="hidden sm:block" /> to the next level.
          </h2>
          <p className="text-[#4B5563] text-base font-normal max-w-2xl mx-auto leading-relaxed">
            Stay connected with us for updates, tips, and the latest tutoring
            opportunities. <br className="hidden md:block" />
            Whether you&apos;re a tutor sharing knowledge or a student chasing
            goals, our community is here to support your growth every step of
            the way.
          </p>
        </div>

        <div className="pt-8 flex justify-center animate-on-scroll stagger-2">
          <Link
            href="/contact-us"
            className="text-base font-semibold text-white py-3.5 px-9 rounded-full bg-primary-700 hover:bg-primary-800 transition-colors duration-200 hover:shadow-lg"
          >
            Send us a message
          </Link>
        </div>
      </div>
    </div>
  );
};

export default KeepInTouch;
