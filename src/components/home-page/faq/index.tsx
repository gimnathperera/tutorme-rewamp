"use client";
import { useEffect, useState } from "react";
import { useFetchFaqsQuery } from "@/store/api/splits/faqs";
import { Disclosure } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/20/solid";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

type FaqPillProps = {
  question: string;
  answer: string;
};

const FAQ_LIMIT = 4;

const FaqPill: React.FC<FaqPillProps> = ({ question, answer }) => (
  <div className="w-full rounded-2xl bg-white py-3 px-5 animate-on-scroll">
    <Disclosure>
      {({ open }) => (
        <>
          <Disclosure.Button className="flex w-full justify-between rounded-lg px-4 py-3 text-left text-base md:text-lg font-semibold hover:bg-gray-50 transition-colors duration-200">
            <span>{question}</span>
            <ChevronUpIcon
              className={`${!open ? "rotate-180 transform" : ""
                } h-5 w-5 text-blue flex-shrink-0 mt-0.5 transition-transform duration-300`}
            />
          </Disclosure.Button>
          <Disclosure.Panel className="px-4 pt-3 pb-3 text-sm md:text-base text-black font-normal opacity-60 leading-relaxed">
            {answer}
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  </div>
);

const FaqSkeleton = () => (
  <div className="w-full rounded-2xl bg-gray-300 py-4 px-6">
    <Skeleton height={28} width="80%" />
    <Skeleton height={18} width="90%" className="mt-4" />
    <Skeleton height={18} width="90%" />
  </div>
);

const Faqs = () => {
  const [page, setPage] = useState(1);
  const [faqs, setFaqs] = useState<FaqPillProps[]>([]);
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
      setFaqs((prevFaqs) => [...prevFaqs, ...data.results]);
    }
  }, [data]);

  return (
    <div
      id="faq-section"
      className="mx-auto max-w-7xl py-20 px-4 lg:px-12 bg-faqblue rounded-2xl my-16 faq-bg"
    >
      {/* Section heading */}
      <h3 className="text-sm md:text-base font-semibold text-white text-center mb-4 tracking-widest uppercase animate-on-scroll">
        FAQ
      </h3>
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center text-white mb-12 animate-on-scroll stagger-1">
        Frequently asked <br /> questions.
      </h2>

      {/* FAQ grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
        {isFetching && page === 1
          ? Array.from({ length: FAQ_LIMIT }, (_, index) => (
            <FaqSkeleton key={index} />
          ))
          : isError
            ? [
              <div
                key="error"
                className="w-full rounded-2xl bg-red-100 py-4 px-6 text-center text-red-700"
              >
                Failed to load FAQs. Please try again later.
              </div>,
            ]
            : faqs.map((faq, index) => (
              <FaqPill
                key={index}
                question={faq.question}
                answer={faq.answer}
              />
            ))}
      </div>

      {/* Load more */}
      {!isFetching && faqs.length < totalItems && (
        <div className="text-center mt-10">
          <button
            onClick={loadMore}
            className="px-8 py-3 border-white text-white text-sm font-semibold rounded-xl hover:bg-white transition-all hover:text-black border-2"
          >
            {isFetching ? "Loading..." : "See More"}
          </button>
        </div>
      )}
    </div>
  );
};

export default Faqs;
