"use client";

import WhatsAppButton from "@/components/shared/whatapp-button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DEFAULT_FAQ_CATEGORY,
  FAQ_CATEGORY_OPTIONS,
  type FaqCategory,
} from "@/lib/faq-categories";
import { useFetchFaqsQuery } from "@/store/api/splits/faqs";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { useEffect, useRef, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

type FaqItem = {
  id?: string;
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
  const [activeCategory, setActiveCategory] =
    useState<FaqCategory>(DEFAULT_FAQ_CATEGORY);
  const [page, setPage] = useState(1);
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const { data, isFetching, isError } = useFetchFaqsQuery({
    page,
    limit: FAQ_PAGE_LIMIT,
    category: activeCategory,
  });

  const totalItems = data?.totalResults || 0;

  useEffect(() => {
    setPage(1);
    setFaqs([]);
    setOpenIndex(null);
  }, [activeCategory]);

  useEffect(() => {
    if (!data?.results) return;

    setFaqs((prev) => {
      if (page === 1) return data.results;

      const knownIds = new Set(prev.map((faq) => faq.id).filter(Boolean));
      const nextResults = data.results.filter(
        (faq) => !faq.id || !knownIds.has(faq.id),
      );

      return [...prev, ...nextResults];
    });
  }, [data, page]);

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category as FaqCategory);
  };

  const handleToggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  const loadMore = () => {
    if (faqs.length < totalItems) {
      setPage((prev) => prev + 1);
    }
  };

  const leftColumn = faqs.filter((_, i) => i % 2 === 0);
  const rightColumn = faqs.filter((_, i) => i % 2 !== 0);

  return (
    <div className="mx-auto max-w-7xl mt-10 px-6 lg:px-8 pb-10">
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
        <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-white/10" />
        <div className="absolute -right-4 bottom-0 w-24 h-24 rounded-full bg-white/5" />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:py-12 lg:px-10 rounded-3xl bg-lightgrey">
        <Tabs value={activeCategory} onValueChange={handleCategoryChange}>
          <TabsList className="mx-auto mb-8 flex h-auto w-full max-w-md rounded-2xl bg-white p-1 shadow-sm">
            {FAQ_CATEGORY_OPTIONS.map((option) => (
              <TabsTrigger
                key={option.value}
                value={option.value}
                className="!m-0 flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-600 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-sm"
              >
                {option.label}
              </TabsTrigger>
            ))}
          </TabsList>

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
              <div className="flex flex-col gap-4">
                {leftColumn.map((faq, i) => {
                  const globalIndex = i * 2;

                  return (
                    <FaqPill
                      key={faq.id || globalIndex}
                      question={faq.question}
                      answer={faq.answer}
                      isOpen={openIndex === globalIndex}
                      onToggle={() => handleToggle(globalIndex)}
                    />
                  );
                })}
              </div>

              <div className="flex flex-col gap-4">
                {rightColumn.map((faq, i) => {
                  const globalIndex = i * 2 + 1;

                  return (
                    <FaqPill
                      key={faq.id || globalIndex}
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

          {isFetching && page > 1 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
              {Array.from({ length: 2 }, (_, i) => (
                <FaqSkeleton key={i} />
              ))}
            </div>
          )}
        </Tabs>
      </div>
      <WhatsAppButton />
    </div>
  );
};

export default FaqPage;
