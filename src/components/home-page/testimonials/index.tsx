"use client";
import { FC, useCallback, useEffect, useRef, useState } from "react";
import { StarIcon } from "@heroicons/react/24/solid";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { useFetchTestimonialsQuery } from "@/store/api/splits/testimonials";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useTranslateItems } from "@/hooks/useTranslateItems";

/* ─── Grid slide-in keyframe injected once ───────────────── */
const GRID_ANIM_STYLE = `
@keyframes testimonial-grid-in {
  from { opacity: 0; transform: translateY(22px); }
  to   { opacity: 1; transform: translateY(0);    }
}
.testimonial-card-animate {
  animation: testimonial-grid-in 1.1s cubic-bezier(0.22, 1, 0.36, 1) both;
}
.testimonial-card-animate:nth-child(1) { animation-delay: 0ms;   }
.testimonial-card-animate:nth-child(2) { animation-delay: 130ms; }
.testimonial-card-animate:nth-child(3) { animation-delay: 260ms; }
`;

/* ─── types ─────────────────────────────────────────────── */
type TestimonialItem = {
  owner: { name: string; role: string; avatar: string };
  content: string;
  rating: number;
};

/* ─── constants ─────────────────────────────────────────── */
const CARDS_PER_SLIDE = 3;

/* ─── Avatar fallback ───────────────────────────────────── */
const Avatar: FC<{ src: string; name: string }> = ({ src, name }) => {
  const [broken, setBroken] = useState(false);
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  if (!src || broken) {
    return (
      <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-bold flex-shrink-0">
        {initials}
      </div>
    );
  }
  return (
    <Image
      src={src}
      alt={name}
      width={40}
      height={40}
      onError={() => setBroken(true)}
      className="w-10 h-10 rounded-full object-cover flex-shrink-0 border-2 border-white shadow-sm"
    />
  );
};

/* ─── Single card ───────────────────────────────────────── */
const TestimonialCard: FC<{ item: TestimonialItem }> = ({ item }) => {
  const [expanded, setExpanded] = useState(false);
  const leaveTimer = useRef<ReturnType<typeof setTimeout>>();

  const handleMouseEnter = () => {
    clearTimeout(leaveTimer.current);
    setExpanded(true);
  };

  const handleMouseLeave = () => {
    leaveTimer.current = setTimeout(() => setExpanded(false), 150);
  };

  return (
    <div
      className="bg-white rounded-2xl shadow-md p-5 flex flex-col gap-3 cursor-default select-none"
      style={{
        minHeight: "220px",
        maxHeight: expanded ? "600px" : "220px",
        transition:
          "max-height 0.55s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.35s cubic-bezier(0.22, 1, 0.36, 1)",
        overflow: "hidden",
        boxShadow: expanded
          ? "0 12px 40px rgba(59,130,246,0.18)"
          : "0 2px 12px rgba(0,0,0,0.06)",
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Quote text + fade */}
      <div className="relative flex-1 min-h-0">
        <p className="text-sm text-[#4B5563] leading-relaxed">
          {item.content ?? "—"}
        </p>

        {/* Fade overlay — hides when expanded */}
        {!expanded && (
          <div
            className="absolute bottom-0 left-0 right-0 h-10 pointer-events-none"
            style={{
              background:
                "linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 100%)",
            }}
          />
        )}
      </div>

      {/* Divider + author row — always visible */}
      <div>
        <hr className="border-gray-100 mb-3" />
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <Avatar
              src={item.owner?.avatar ?? ""}
              name={item.owner?.name ?? "U"}
            />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-black truncate">
                {item.owner?.name}
              </p>
              <p className="text-xs text-[#6B7280] truncate">
                {item.owner?.role}
              </p>
            </div>
          </div>
          {item.rating > 0 && (
            <div className="flex gap-0.5 flex-shrink-0">
              {[...Array(item.rating)].map((_, i) => (
                <StarIcon key={i} className="w-3.5 h-3.5 star" />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ─── Skeleton card ─────────────────────────────────────── */
const SkeletonCard: FC = () => (
  <div
    className="bg-white rounded-2xl shadow-md p-5 flex flex-col gap-3 animate-pulse"
    style={{ height: "220px" }}
  >
    <div className="flex-1 space-y-2">
      <div className="h-3 bg-gray-100 rounded w-full" />
      <div className="h-3 bg-gray-100 rounded w-5/6" />
      <div className="h-3 bg-gray-100 rounded w-4/6" />
    </div>
    <hr className="border-gray-100" />
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-gray-100 flex-shrink-0" />
      <div className="flex-1 space-y-1.5">
        <div className="h-3 bg-gray-100 rounded w-1/2" />
        <div className="h-2.5 bg-gray-100 rounded w-1/3" />
      </div>
    </div>
  </div>
);

const AUTOPLAY_DELAY = 4000; // ms between auto-advances

/* ─── Main component ─────────────────────────────────────── */
const Testimonials: FC = () => {
  const t = useTranslations("testimonials");
  const [page, setPage] = useState(1);
  const [animKey, setAnimKey] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (document.getElementById("testimonial-grid-style")) return;
    const tag = document.createElement("style");
    tag.id = "testimonial-grid-style";
    tag.textContent = GRID_ANIM_STYLE;
    document.head.appendChild(tag);
  }, []);

  const { data, currentData, isFetching, isLoading } =
    useFetchTestimonialsQuery({
      page,
      limit: CARDS_PER_SLIDE,
      sortBy: "createdAt:desc",
    });

  const paginationData = currentData || data;
  const totalSlides = paginationData?.totalPages || 0;
  const activeSlide = Math.max(page - 1, 0);
  const visibleItems = currentData?.results || [];

  // Translate testimonial content, owner role, and owner name for non-English locales
  const translatedItems = useTranslateItems(
    visibleItems,
    (item) => [item.content ?? "", item.owner?.role ?? "", item.owner?.name ?? ""],
    (item, [content, role, name]) => ({
      ...item,
      content: content ?? item.content,
      owner: {
        ...item.owner,
        role: role ?? item.owner?.role ?? "",
        name: name ?? item.owner?.name ?? "",
      },
    }),
  );
  const hasPreviousPage = page > 1;
  const hasNextPage = totalSlides ? page < totalSlides : false;

  const goTo = useCallback((nextPage: number) => {
    setPage(nextPage);
    setAnimKey((key) => key + 1);
  }, []);

  const prev = () => {
    if (hasPreviousPage) {
      goTo(page - 1);
    }
  };

  const next = () => {
    if (hasNextPage) {
      goTo(page + 1);
    }
  };

  useEffect(() => {
    if (isPaused || totalSlides <= 1) return;
    const id = setInterval(() => {
      setPage((currentPage) =>
        currentPage >= totalSlides ? 1 : currentPage + 1,
      );
      setAnimKey((key) => key + 1);
    }, AUTOPLAY_DELAY);
    return () => clearInterval(id);
  }, [isPaused, totalSlides]);

  /* Keyboard support */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  });

  const showSkeletons =
    (isLoading || isFetching) && visibleItems.length < CARDS_PER_SLIDE;

  return (
    <section
      className="bg-testimonial  pb-6 lg:py-8"
      aria-label="Testimonials"
      id="testimonials-section"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        {/* ── Heading ── */}
        <div className="text-center animate-fade-in mb-10">
          <h2 className="text-4xl font-bold text-black leading-[1.2]">
            {t("sectionHeading")}
          </h2>
        </div>

        {/* ── Card grid ── */}
        <div className="px-4 lg:px-8">
          <div
            ref={trackRef}
            key={animKey}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {translatedItems.map((item, i) => (
              <div key={`${page}-${i}`} className="testimonial-card-animate">
                <TestimonialCard item={item} />
              </div>
            ))}
            {showSkeletons &&
              Array.from({ length: CARDS_PER_SLIDE - visibleItems.length }).map(
                (_, i) => (
                  <div key={`sk-${i}`} className="testimonial-card-animate">
                    <SkeletonCard />
                  </div>
                ),
              )}
          </div>
        </div>

        {/* ── Controls ── */}
        {(totalSlides > 1 || isFetching) && (
          <div className="mt-8 flex items-center justify-center gap-4">
            {/* Prev */}
            <button
              onClick={prev}
              disabled={!hasPreviousPage || isFetching}
              aria-label="Previous"
              className="w-9 h-9 rounded-full border border-gray-200 bg-white shadow-sm flex items-center justify-center hover:bg-blue-50 hover:border-blue-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
            >
              <ChevronLeftIcon className="w-4 h-4 text-gray-600" />
            </button>

            {/* Dots */}
            <div className="flex gap-2 items-center">
              {Array.from({
                length: totalSlides,
              }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i + 1)}
                  aria-label={`Slide ${i + 1}`}
                  className="transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
                  style={{
                    width: activeSlide === i ? "28px" : "8px",
                    height: "8px",
                    borderRadius: "9999px",
                    background: activeSlide === i ? "#2563eb" : "#d1d5db",
                  }}
                />
              ))}
              {isFetching && (
                <span className="w-2 h-2 rounded-full bg-blue-200 animate-pulse" />
              )}
            </div>

            {/* Next */}
            <button
              onClick={next}
              disabled={!hasNextPage || isFetching}
              aria-label="Next"
              className="w-9 h-9 rounded-full border border-gray-200 bg-white shadow-sm flex items-center justify-center hover:bg-blue-50 hover:border-blue-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
            >
              <ChevronRightIcon className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Testimonials;
