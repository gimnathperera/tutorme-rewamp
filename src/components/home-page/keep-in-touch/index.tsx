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
    <div className="bg-joinus mb-32 mt-0" id="keep-in-touch-section">
      <div className="mx-auto max-w-2xl lg:max-w-7xl sm:py-4 lg:px-8">
        <div className="text-center">
          <h3 className="text-blue text-lg font-normal tracking-widest">
            KEEP IN TOUCH
          </h3>
          <h2 className="text-4xl sm:text-6xl font-bold my-6 leading-10">
            Take your learning or teaching journey
            <br /> to the next level.
          </h2>
          <p className="text-lightblack text-base font-normal">
            Stay connected with us for updates, tips, and the latest tutoring
            opportunities. <br />
            Whether you&apos;re a tutor sharing knowledge or a student chasing
            goals, our community is here to support your growth every step of
            the way.
          </p>
        </div>

        <div className="mx-auto max-w-4xl pt-5 flex justify-center">
          <button
            type="button"
            className="justify-end text-xl font-semibold text-white  py-4 px-6 lg:px-12  rounded-full  bg-primary-700 hover:bg-btnblue"
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
