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
  <div className="w-full rounded-2xl bg-white py-4 px-6">
    <Disclosure>
      {({ open }) => (
        <>
          <Disclosure.Button className="flex w-full justify-between rounded-lg px-4 py-2 text-left text-2xl font-medium">
            <span>{question}</span>
            <ChevronUpIcon
              className={`${
                !open ? "rotate-180 transform" : ""
              } h-5 w-5 text-purple-500`}
            />
          </Disclosure.Button>
          <Disclosure.Panel className="px-4 pt-4 pb-2 text-base text-black font-normal opacity-50">
            {answer}
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  </div>
);

const FaqSkeleton = () => (
  <div className="w-full rounded-2xl bg-gray-300 py-4 px-6">
    <Skeleton height={30} width="80%" />
    <Skeleton height={20} width="90%" className="mt-4" />
    <Skeleton height={20} width="90%" />
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
      className="mx-auto max-w-7xl py-24 lg:px-8 bg-faqblue rounded-2xl my-16 faq-bg"
    >
      <h3 className="text-xl font-normal text-white text-center mb-6">FAQ</h3>
      <h2 className="text-4xl lg:text-6xl font-semibold text-center text-white mb-12">
        Frequently asked <br /> questions.
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 px-4 lg:px-0 items-start">
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
      {!isFetching && faqs.length < totalItems && (
        <div className="text-center mt-8">
          <button
            onClick={loadMore}
            className="px-6 py-2 border-white text-white rounded-xl hover:bg-white transition-all hover:text-black border-2"
          >
            {isFetching ? "Loading..." : "See More"}
          </button>
        </div>
      )}
    </div>
  );
};

export default Faqs;
