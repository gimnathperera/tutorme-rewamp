"use client";
import { FC, useCallback, useEffect, useRef, useState } from "react";
import { StarIcon } from "@heroicons/react/24/solid";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { useFetchTestimonialsQuery } from "@/store/api/splits/testimonials";

/* ─── Grid slide-in keyframe injected once ───────────────── */
const GRID_ANIM_STYLE = `
@keyframes testimonial-grid-in {
  from { opacity: 0; transform: translateY(18px); }
  to   { opacity: 1; transform: translateY(0);    }
}
.testimonial-grid-animate {
  animation: testimonial-grid-in 0.45s cubic-bezier(0.22, 1, 0.36, 1) both;
}
`;

/* ─── types ─────────────────────────────────────────────── */
type TestimonialItem = {
  owner: { name: string; role: string; avatar: string };
  content: string;
  rating: number;
};

/* ─── constants ─────────────────────────────────────────── */
const PAGE_SIZE = 9; // fetch 9 at a time; show 3 per slide → 3 slides per batch
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
    <img
      src={src}
      alt={name}
      onError={() => setBroken(true)}
      className="w-10 h-10 rounded-full object-cover flex-shrink-0 border-2 border-white shadow-sm"
    />
  );
};

/* ─── Single card ───────────────────────────────────────── */
const TestimonialCard: FC<{ item: TestimonialItem }> = ({ item }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="bg-white rounded-2xl shadow-md p-5 flex flex-col gap-3 cursor-pointer select-none"
      style={{
        /* Fixed collapsed height; expands on hover via max-height transition */
        maxHeight: expanded ? "600px" : "220px",
        transition:
          "max-height 0.55s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.35s cubic-bezier(0.22, 1, 0.36, 1), transform 0.35s cubic-bezier(0.22, 1, 0.36, 1)",
        overflow: "hidden",
        transform: expanded ? "translateY(-3px) scale(1.012)" : "translateY(0) scale(1)",
        boxShadow: expanded
          ? "0 12px 40px rgba(59,130,246,0.18)"
          : "0 2px 12px rgba(0,0,0,0.06)",
      }}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
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

/* ─── Main component ─────────────────────────────────────── */
const Testimonials: FC = () => {
  const [page, setPage] = useState(1);
  const [allItems, setAllItems] = useState<TestimonialItem[]>([]);
  const [slide, setSlide] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  /* Inject grid animation CSS once */
  useEffect(() => {
    if (document.getElementById("testimonial-grid-style")) return;
    const tag = document.createElement("style");
    tag.id = "testimonial-grid-style";
    tag.textContent = GRID_ANIM_STYLE;
    document.head.appendChild(tag);
  }, []);

  const { data, isFetching } = useFetchTestimonialsQuery({
    page,
    limit: PAGE_SIZE,
    ...({ sortBy: "createdAt:desc" } as any),
  });

  /* Accumulate pages */
  useEffect(() => {
    if (data?.results) {
      setAllItems((prev) => [...prev, ...data.results]);
    }
  }, [data]);

  const totalSlides =
    Math.ceil(allItems.length / CARDS_PER_SLIDE) + (isFetching ? 1 : 0);
  const maxKnownSlide = Math.ceil(allItems.length / CARDS_PER_SLIDE) - 1;

  /* Auto-fetch next page when user reaches the last loaded slide */
  const goTo = useCallback(
    (idx: number) => {
      const clamped = Math.max(0, Math.min(idx, totalSlides - 1));
      setSlide(clamped);
      setAnimKey((k) => k + 1); // re-trigger grid entrance animation

      // If we are at the last known slide and there are more pages to load, fetch
      const totalFetched = data?.totalResults ?? 0;
      if (
        clamped >= maxKnownSlide &&
        allItems.length < totalFetched &&
        !isFetching
      ) {
        setPage((p) => p + 1);
      }
    },
    [
      totalSlides,
      maxKnownSlide,
      allItems.length,
      data?.totalResults,
      isFetching,
    ],
  );

  const prev = () => goTo(slide - 1);
  const next = () => goTo(slide + 1);

  /* Keyboard support */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  });

  /* Visible cards for current slide */
  const visibleItems = allItems.slice(
    slide * CARDS_PER_SLIDE,
    slide * CARDS_PER_SLIDE + CARDS_PER_SLIDE,
  );
  const showSkeletons = isFetching && visibleItems.length < CARDS_PER_SLIDE;

  return (
    <section
      className="bg-testimonial py-8 lg:py-12"
      aria-label="Testimonials"
    >
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        {/* ── Stacked heading ── */}
        <div className="text-center overflow-hidden animate-fade-in mb-10">
          <h2 className="text-4xl font-bold text-black leading-[1.2] my-1">
            See what others are saying.
          </h2>
          <h2 className="text-4xl font-bold text-black leading-[1.2] opacity-40 lg:mr-48 my-1 hidden sm:block">
            See what others are saying.
          </h2>
          <h2 className="text-4xl font-bold text-black leading-[1.2] opacity-20 lg:-mr-32 my-1 hidden sm:block">
            See what others are saying.
          </h2>
        </div>

        {/* ── Card grid ── */}
        <div className="px-4 lg:px-8">
          <div
            ref={trackRef}
            key={animKey}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 testimonial-grid-animate"
          >
          {visibleItems.map((item, i) => (
            <TestimonialCard key={`${slide}-${i}`} item={item} />
          ))}
          {showSkeletons &&
            Array.from({ length: CARDS_PER_SLIDE - visibleItems.length }).map(
              (_, i) => <SkeletonCard key={`sk-${i}`} />,
            )}
          </div>
        </div>

        {/* ── Controls ── */}
        {(allItems.length > CARDS_PER_SLIDE || isFetching) && (
          <div className="mt-8 flex items-center justify-center gap-4">
            {/* Prev */}
            <button
              onClick={prev}
              disabled={slide === 0}
              aria-label="Previous"
              className="w-9 h-9 rounded-full border border-gray-200 bg-white shadow-sm flex items-center justify-center hover:bg-blue-50 hover:border-blue-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
            >
              <ChevronLeftIcon className="w-4 h-4 text-gray-600" />
            </button>

            {/* Dots */}
            <div className="flex gap-2 items-center">
              {Array.from({
                length: Math.ceil(allItems.length / CARDS_PER_SLIDE),
              }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  aria-label={`Slide ${i + 1}`}
                  className="transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
                  style={{
                    width: slide === i ? "28px" : "8px",
                    height: "8px",
                    borderRadius: "9999px",
                    background: slide === i ? "#2563eb" : "#d1d5db",
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
              disabled={
                slide >= maxKnownSlide &&
                !isFetching &&
                allItems.length >= (data?.totalResults ?? 0)
              }
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
