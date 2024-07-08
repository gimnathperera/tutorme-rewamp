"use client";

import { useState } from "react";
import Modal from "../modal";

const ContactUs = () => {
  const [isOpenModal, setIsOpenModal] = useState(false);

  const handleModalVisibility = () => {
    setIsOpenModal((prev) => !prev);
  };

  return (
    <div className="bg-joinus my-32">
      <div className="mx-auto max-w-2xl lg:max-w-7xl sm:py-4 lg:px-8">
        <div className="text-center">
          <h3 className="text-blue text-lg font-normal tracking-widest">
            KEEP IN TOUCH
          </h3>
          <h2 className="text-4xl sm:text-6xl font-bold my-6 leading-10">
            Take your business to <br /> the new level.
          </h2>
          <p className="text-lightblack text-base font-normal">
            Craven omni memoria patriae zombieland clairvius narcisse religionis
            sunt diri undead <br /> historiarum. Golums, zombies unrelenting et
            Raimi fascinati beheading.
          </p>
        </div>

        <div className="mx-auto max-w-4xl pt-5 flex justify-center">
          <button
            type="button"
            className="justify-end text-xl font-semibold text-white  py-4 px-6 lg:px-12  rounded-full  bg-blue hover:bg-btnblue"
            onClick={handleModalVisibility}
          >
            Contact Us
          </button>
        </div>
      </div>
      <Modal isOpen={isOpenModal} closeModal={handleModalVisibility}>
        <div>Modal content</div>
      </Modal>
    </div>
  );
};

export default ContactUs;
