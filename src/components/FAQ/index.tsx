"use client";
import { Disclosure } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/20/solid";

const FaqPill = () => (
  <div className="mx-auto w-full max-w-5xl rounded-2xl bg-white py-4 px-6 mb-5">
    <Disclosure>
      {({ open }) => (
        <>
          <Disclosure.Button className="flex w-full justify-between rounded-lg px-4 py-2 text-left text-2xl font-medium">
            <span>Can you design my site?</span>
            <ChevronUpIcon
              className={`${
                open ? "rotate-180 transform" : ""
              } h-5 w-5 text-purple-500`}
            />
          </Disclosure.Button>
          <Disclosure.Panel className="px-4 pt-4 pb-2 text-base text-black font-normal opacity-50">
            Craven omni memoria patriae zombieland clairvius narcisse <br />{" "}
            religionis sunt diri undead historiarum. Golums, zombies unrelenting{" "}
            <br /> et Raimi fascinati beheading.
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  </div>
);

const FAQ = () => {
  return (
    <div
      id="faq-section"
      className="mx-auto max-w-7xl py-24 lg:px-8 bg-faqblue rounded-2xl my-16 faq-bg"
    >
      <h3 className="text-xl font-normal text-white text-center mb-6">FAQ</h3>
      <h2 className="text-4xl lg:text-6xl font-semibold text-center text-white">
        Frequently asked <br /> questions.
      </h2>
      <div className="w-full flex">
        <div className="w-1/2 px-4 pt-16">
          <FaqPill />
          <FaqPill />
        </div>
        <div className="w-1/2 px-4 pt-16">
          <FaqPill />
          <FaqPill />
        </div>
      </div>
    </div>
  );
};

export default FAQ;
