"use client";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { FaWhatsapp } from "react-icons/fa";

const Banner = () => {
  const route = useRouter();
  const badgeRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const ctaSizeClass =
    "w-full max-w-[18rem] !px-5 !py-3 !text-sm sm:w-auto sm:max-w-none sm:!px-9 sm:!py-3.5 sm:!text-base";

  const handleOnFindATutorClick = () => {
    route.push("/request-for-tutors");
  };

  const handleScrollDown = () => {
    const bannerEl = document.getElementById("hero-section");
    if (bannerEl) {
      const nextSection = bannerEl.nextElementSibling as HTMLElement;
      if (nextSection) {
        nextSection.scrollIntoView({ behavior: "smooth" });
      } else {
        window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
      }
    }
  };

  // Signal to <html> that the hero is active — used by CSS to style the navbar
  useEffect(() => {
    document.documentElement.setAttribute("data-hero", "true");
    return () => {
      document.documentElement.removeAttribute("data-hero");
    };
  }, []);

  // Fade-up animation on mount for text content
  useEffect(() => {
    const elements = [
      { el: badgeRef.current, delay: 200 },
      { el: headlineRef.current, delay: 400 },
      { el: ctaRef.current, delay: 600 },
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
    <section id="hero-section" className="hero-section">
      {/* Background Video */}
      <video
        className="hero-video"
        src="/videos/home/home.mp4"
        autoPlay
        muted
        loop
        playsInline
      />

      {/* Dark overlay */}
      <div className="hero-overlay" />

      {/* Main content — centered */}
      <div className="hero-content">
        {/* Headline */}
        <div
          ref={headlineRef}
          style={{
            opacity: 0,
            transform: "translateY(30px)",
            transition: "opacity 0.6s ease, transform 0.6s ease",
          }}
        >
          <h1 className="hero-title">
            Personalized & Verified <br className="sm:hidden" />
            Home Tuition
          </h1>
        </div>

        {/* CTA Buttons */}
        <div
          ref={ctaRef}
          style={{
            opacity: 0,
            transform: "translateY(30px)",
            transition: "opacity 0.6s ease, transform 0.6s ease",
          }}
          className="flex flex-col sm:flex-row flex-wrap gap-4 items-center justify-center mt-6 w-full px-4"
        >
          <button
            className={`hero-cta ${ctaSizeClass}`}
            onClick={handleOnFindATutorClick}
          >
            Request for Tutor
          </button>

          <button
            className={`hero-cta-secondary ${ctaSizeClass}`}
            onClick={() => route.push("/register-tutor")}
          >
            Register as a Tutor
          </button>

          <button
            className={`hero-cta-whatsapp ${ctaSizeClass}`}
            onClick={() => {
              const num = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";
              const formattedNum = num.startsWith("0")
                ? `94${num.slice(1)}`
                : num;
              window.open(`https://wa.me/${formattedNum}`, "_blank");
            }}
          >
            <FaWhatsapp size={20} />
            Enquire on Whatsapp
          </button>
        </div>
      </div>

      {/* Scroll-down arrow */}
      <button
        className="hero-scroll-arrow"
        onClick={handleScrollDown}
        aria-label="Scroll down"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="hero-scroll-icon"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
    </section>
  );
};

export default Banner;
