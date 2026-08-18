"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";

const OurTeam = () => {
  const t = useTranslations("ourTeam");
  const videoWrapperRef = useRef<HTMLDivElement>(null);
  const [isVideoVisible, setIsVideoVisible] = useState(false);

  useEffect(() => {
    const el = videoWrapperRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVideoVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.4,
      },
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  return (
    <div className="px-4 pb-8 lg:px-8 lg:pb-12">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col lg:flex-row items-center gap-8">
          <div className="lg:w-1/2 text-center lg:text-left">
            <h2 className="text-3xl sm:text-4xl font-semibold text-black leading-[1.2] animate-on-scroll">
              {t("heading")}
            </h2>

            <p className="text-base font-normal text-[#4B5563] pt-5 leading-relaxed animate-on-scroll stagger-1">
              {t("body")}
            </p>
          </div>
          <div
            ref={videoWrapperRef}
            className="lg:w-1/2 rounded-3xl overflow-hidden shadow-lg animate-on-scroll stagger-2 aspect-video"
          >
            {isVideoVisible && (
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/iH7i5RI0Tek?autoplay=1&mute=1&loop=1&playlist=iH7i5RI0Tek"
                title="Tuition Lanka | Best platform to find home tuition"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OurTeam;
