/* eslint-disable react/no-unescaped-entities */
import React from "react";
import Image from "next/image";
import TutorImage from "../../../../public/images/findTutor/tutor.png";

const TutorTypeComponent = (props: {
  command: React.ChangeEventHandler<HTMLSelectElement> | undefined;
}) => {
  return (
    <div>
      <div className="border-b border-gray-900/10 pb-12">
        <div className="flex flex-row items-center">
          <Image
            src={TutorImage}
            alt={""}
            className="h-[100px] w-[100px] mr-5"
          />
          <div>
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Tutor Type Selection
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              We'll always let you know about important changes, but you pick
              what else you want to hear about.
            </p>
          </div>
        </div>

        <div className="mt-10 space-y-10">
          <fieldset>
            <legend className="text-sm font-semibold leading-6 text-gray-900">
              Tutor Type
            </legend>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Please select your preferred tutor type
            </p>
            <div className="mt-6 space-y-6">
              <div className="flex items-center gap-x-3">
                <input
                  id="push-everything"
                  name="push-notifications"
                  type="radio"
                  className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                />
                <label
                  htmlFor="push-everything"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Part Time Tutors
                </label>
              </div>
              <div className="flex items-center gap-x-3">
                <input
                  id="push-email"
                  name="push-notifications"
                  type="radio"
                  className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                />
                <label
                  htmlFor="push-email"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Full Time Tutors
                </label>
              </div>
              <div className="flex items-center gap-x-3">
                <input
                  id="push-nothing"
                  name="push-notifications"
                  type="radio"
                  className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                />
                <label
                  htmlFor="push-nothing"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Ex / Current Government School Tutors
                </label>
              </div>
            </div>
          </fieldset>

          <div className="sm:col-span-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Students School
            </label>
            <div className="mt-2">
              <input
                id="school"
                name="school"
                type="school"
                autoComplete="school"
                className="block px-2 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div className="sm:col-span-4">
            <label
              htmlFor="numTutors"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Gender Preference
            </label>
            <div className="mt-2">
              <select
                id="numTutors"
                name="numTutors"
                onChange={props.command} //handle tutor change
                className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
              >
                <option value="0">--Select--</option>
                <option value="1">Male</option>
                <option value="2">Female</option>
                <option value="3">No Gender Preference</option>
              </select>
            </div>
          </div>
          <div className="sm:col-span-4">
            <label
              htmlFor="numTutors"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Is Bilingual Tutor Required?
            </label>
            <div className="mt-2">
              <select
                id="numTutors"
                name="numTutors"
                onChange={props.command} //handle tutor change
                className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
              >
                <option value="0">--Select--</option>
                <option value="1">Yes</option>
                <option value="2">No</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorTypeComponent;
