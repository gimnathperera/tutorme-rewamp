"use client";

import { useState } from "react";
import Modal from "../../shared/modal";
import FormContactUs from "../form-contact-us";

const KeepInTouch = () => {
  const [isOpenModal, setIsOpenModal] = useState(false);

  const handleModalVisibility = () => {
    setIsOpenModal((prev) => !prev);
  };

  return (
    <div className="bg-joinus mb-28 mt-0" id="keep-in-touch-section">
      <div className="mx-auto max-w-2xl lg:max-w-7xl py-8 lg:px-8">
        <div className="text-center animate-on-scroll">
          <h3 className="text-blue text-sm md:text-base font-semibold tracking-widest uppercase mb-4">
            KEEP IN TOUCH
          </h3>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold my-5 leading-tight">
            Take your learning or teaching journey
            <br className="hidden sm:block" /> to the next level.
          </h2>
          <p className="text-lightblack text-base font-normal max-w-2xl mx-auto leading-relaxed">
            Stay connected with us for updates, tips, and the latest tutoring
            opportunities.{" "}
            <br className="hidden md:block" />
            Whether you&apos;re a tutor sharing knowledge or a student chasing
            goals, our community is here to support your growth every step of
            the way.
          </p>
        </div>

        <div className="mx-auto max-w-4xl pt-8 flex justify-center animate-on-scroll stagger-2">
          <button
            type="button"
            className="text-base md:text-lg font-semibold text-white py-4 px-10 md:px-14 rounded-full bg-primary-700 hover:bg-btnblue transition-all duration-300 hover:shadow-lg"
            onClick={handleModalVisibility}
          >
            Send us a message
          </button>
        </div>
      </div>

      <Modal
        isOpen={isOpenModal}
        closeModal={handleModalVisibility}
        title="Contact Us"
        description="Contact us now? Want to send us a feedback?"
        imagePath="/images/contactus/contactus.svg"
      >
        <FormContactUs />
      </Modal>
    </div>
  );
};

export default KeepInTouch;
