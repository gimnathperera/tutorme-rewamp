"use client";
import { useEffect, useRef, useState } from "react";
import { useFetchFaqsQuery } from "@/store/api/splits/faqs";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import WhatsAppButton from "@/components/shared/whatapp-button";

type FaqItem = {
  question: string;
  answer: string;
};

const FAQ_PAGE_LIMIT = 10;

const FaqPill = ({
  question,
  answer,
  isOpen,
  onToggle,
}: FaqItem & { isOpen: boolean; onToggle: () => void }) => {
  const bodyRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (bodyRef.current) {
      setHeight(isOpen ? bodyRef.current.scrollHeight : 0);
    }
  }, [isOpen]);

  return (
    <div className="w-full rounded-2xl bg-white border border-gray-100 overflow-hidden shadow-sm">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between px-6 py-4 text-left gap-4 group"
        aria-expanded={isOpen}
      >
        <span className="text-base font-semibold text-gray-900 leading-snug group-hover:text-blue-600 transition-colors duration-200">
          {question}
        </span>
        <span
          className={[
            "flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-full transition-all duration-300",
            isOpen
              ? "bg-blue-600 text-white rotate-180"
              : "bg-gray-100 text-gray-500 group-hover:bg-blue-50 group-hover:text-blue-600",
          ].join(" ")}
        >
          <ChevronDownIcon className="w-4 h-4" />
        </span>
      </button>

      <div
        ref={bodyRef}
        style={{
          maxHeight: `${height}px`,
          overflow: "hidden",
          transition: "max-height 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <p className="px-6 pb-5 text-base text-[#4B5563] leading-relaxed">
          {answer}
        </p>
      </div>

      <div
        style={{
          height: isOpen ? "3px" : "0px",
          transition: "height 0.35s ease",
        }}
        className="bg-blue-600 rounded-b-2xl"
      />
    </div>
  );
};

const FaqSkeleton = () => (
  <div className="w-full rounded-2xl bg-white border border-gray-100 py-5 px-6 shadow-sm">
    <Skeleton height={22} width="70%" />
  </div>
);

const FaqPage = () => {
  const [page, setPage] = useState(1);
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const { data, isFetching, isError } = useFetchFaqsQuery({
    page,
    limit: FAQ_PAGE_LIMIT,
  });

  const totalItems = data?.totalResults || 0;

  useEffect(() => {
    if (data?.results) {
      setFaqs((prev) => [...prev, ...data.results]);
    }
  }, [data]);

  const handleToggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  const loadMore = () => {
    if (faqs.length < totalItems) {
      setPage((prev) => prev + 1);
    }
  };

  // Split into two columns — odd indices left, even indices right
  const leftColumn = faqs.filter((_, i) => i % 2 === 0);
  const rightColumn = faqs.filter((_, i) => i % 2 !== 0);

  return (
    <div className="mx-auto max-w-7xl mt-10 px-6 lg:px-8 pb-10">
      {/* Hero banner — matches Blog page pattern exactly */}
      <div className="relative h-44 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl text-white px-8 py-6 flex flex-col justify-center overflow-hidden mb-8">
        <div className="relative z-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-200 mb-1">
            TuitionLanka Help
          </p>
          <h1 className="text-3xl text-white md:text-3xl font-bold leading-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-sm md:text-base text-white/80 mt-1">
            Find answers to common questions about TuitionLanka.
          </p>
        </div>
        {/* Decorative circles — same as blog */}
        <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-white/10" />
        <div className="absolute -right-4 bottom-0 w-24 h-24 rounded-full bg-white/5" />
      </div>

      {/* FAQ content area */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:py-12 lg:px-10 rounded-3xl bg-lightgrey">
        {isFetching && page === 1 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {Array.from({ length: 6 }, (_, i) => (
              <FaqSkeleton key={i} />
            ))}
          </div>
        ) : isError ? (
          <div className="w-full rounded-2xl bg-red-100 py-4 px-6 text-center text-red-700">
            Failed to load FAQs. Please try again later.
          </div>
        ) : faqs.length === 0 ? (
          <p className="text-center text-gray-500 py-12">
            No FAQs available at the moment.
          </p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
            {/* Left column */}
            <div className="flex flex-col gap-4">
              {leftColumn.map((faq, i) => {
                const globalIndex = i * 2;
                return (
                  <FaqPill
                    key={globalIndex}
                    question={faq.question}
                    answer={faq.answer}
                    isOpen={openIndex === globalIndex}
                    onToggle={() => handleToggle(globalIndex)}
                  />
                );
              })}
            </div>

            {/* Right column */}
            <div className="flex flex-col gap-4">
              {rightColumn.map((faq, i) => {
                const globalIndex = i * 2 + 1;
                return (
                  <FaqPill
                    key={globalIndex}
                    question={faq.question}
                    answer={faq.answer}
                    isOpen={openIndex === globalIndex}
                    onToggle={() => handleToggle(globalIndex)}
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* Load more — only shown when more items exist */}
        {!isFetching && faqs.length < totalItems && (
          <div className="text-center mt-8">
            <button
              onClick={loadMore}
              className="py-3 px-8 text-base font-semibold text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 transition-colors duration-200"
            >
              Load More
            </button>
          </div>
        )}

        {/* Loading indicator for subsequent pages */}
        {isFetching && page > 1 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
            {Array.from({ length: 2 }, (_, i) => (
              <FaqSkeleton key={i} />
            ))}
          </div>
        )}
      </div>
      <WhatsAppButton />
    </div>
  );
};

export default FaqPage;
