"use client";
import { useEffect, useRef, useState } from "react";
import { useFetchFaqsQuery } from "@/store/api/splits/faqs";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

type FaqItem = {
  question: string;
  answer: string;
};

const FAQ_LIMIT = 4;

/** Animated accordion item — slides open/closed with max-height transition */
const FaqPill = ({
  question,
  answer,
  isOpen,
  onToggle,
}: FaqItem & { isOpen: boolean; onToggle: () => void }) => {
  const bodyRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  // Whenever open state changes, capture the real scrollHeight
  useEffect(() => {
    if (bodyRef.current) {
      setHeight(isOpen ? bodyRef.current.scrollHeight : 0);
    }
  }, [isOpen]);

  return (
    <div
      className="w-full rounded-2xl bg-white overflow-hidden"
      style={{ animation: "fadeIn 0.35s ease both" }}
    >
      {/* Header button */}
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between px-6 py-4 text-left gap-4 group"
        aria-expanded={isOpen}
      >
        <span className="text-sm sm:text-base font-semibold text-gray-900 leading-snug group-hover:text-blue-600 transition-colors duration-200">
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

      {/* Animated body */}
      <div
        ref={bodyRef}
        style={{
          maxHeight: `${height}px`,
          overflow: "hidden",
          transition: "max-height 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <p className="px-6 pb-5 text-sm text-gray-600 leading-relaxed">
          {answer}
        </p>
      </div>

      {/* Subtle bottom accent when open */}
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
  <div className="w-full rounded-2xl bg-white/30 py-4 px-6">
    <Skeleton
      height={24}
      width="70%"
      baseColor="#ffffff40"
      highlightColor="#ffffff60"
    />
    <Skeleton
      height={16}
      width="90%"
      className="mt-3"
      baseColor="#ffffff40"
      highlightColor="#ffffff60"
    />
  </div>
);

const Faqs = () => {
  const [page, setPage] = useState(1);
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const { data, isFetching, isError } = useFetchFaqsQuery({
    page,
    limit: FAQ_LIMIT,
  });

  const totalItems = data?.totalResults || 0;

  const loadMore = () => {
    if (faqs.length < totalItems) {
      setPage((prev) => prev + 1);
    }
  };

  useEffect(() => {
    if (data?.results) {
      setFaqs((prev) => [...prev, ...data.results]);
    }
  }, [data]);

  const handleToggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div
      id="faq-section"
      className="mx-auto max-w-7xl py-12 lg:py-16 px-4 lg:px-12 bg-faqblue rounded-2xl faq-bg"
    >
      {/* Section heading */}
      <h3 className="text-sm font-semibold text-white text-center mb-3 tracking-widest uppercase">
        FAQ
      </h3>
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center text-white mb-10">
        Frequently asked <br /> questions.
      </h2>

      {/* FAQ list — single column so expansions shift items fluidly */}
      <div className="flex flex-col gap-3 max-w-3xl mx-auto">
        {isFetching && page === 1 ? (
          Array.from({ length: FAQ_LIMIT }, (_, i) => <FaqSkeleton key={i} />)
        ) : isError ? (
          <div className="w-full rounded-2xl bg-red-100 py-4 px-6 text-center text-red-700">
            Failed to load FAQs. Please try again later.
          </div>
        ) : (
          faqs.map((faq, index) => (
            <FaqPill
              key={index}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === index}
              onToggle={() => handleToggle(index)}
            />
          ))
        )}
      </div>

      {/* Load more */}
      {!isFetching && faqs.length < totalItems && (
        <div className="text-center mt-8">
          <button
            onClick={loadMore}
            className="px-8 py-3 border-2 border-white text-white text-sm font-semibold rounded-xl hover:bg-white hover:text-blue-600 transition-all duration-300"
          >
            See More
          </button>
        </div>
      )}
    </div>
  );
};

export default Faqs;
