"use client";
/* eslint-disable react/no-unescaped-entities */
import { PhotoIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import Select, { MultiValue } from "react-select";
import TutorTypeComponent from "./tutor-type";
import { PersonalInfoComponent } from "./personal-info";
import Image from "next/image";
import lesson from "../../../public/images/findTutor/lesson.png";

const subjectsOptions = [
  { value: "Math", label: "Math" },
  { value: "Science", label: "Science" },
  { value: "English", label: "English" },
  { value: "History", label: "History" },
];

const durationOptions = [
  { value: "30 minutes", label: "30 minutes" },
  { value: "1 hour", label: "1 hour" },
  { value: "2 hours", label: "2 hours" },
];

const frequencyOptions = [
  { value: "Once a week", label: "Once a week" },
  { value: "Twice a week", label: "Twice a week" },
  { value: "Daily", label: "Daily" },
];
type Tutor = {
  subjects: { value: string; label: string }[];
  duration: { value: string; label: string } | null;
  frequency: { value: string; label: string } | null;
};

export default function FindATutorForm() {
  const [numTutors, setNumTutors] = useState(0);
  const [tutors, setTutors] = useState([
    { subjects: [], duration: "", frequency: "" },
  ]);

  const handleTutorChange = (event: { target: { value: any } }) => {
    const value = Number(event.target.value);
    setNumTutors(value);
    setTutors(
      Array.from({ length: value }, () => ({
        subjects: [],
        duration: "",
        frequency: "",
      }))
    );
  };

  const handleChange = (
    index: number,
    field: string,
    value:
      | { value: string; label: string }
      | MultiValue<{ value: string; label: string }>
      | null
  ) => {
    const newTutors = [...tutors];

    setTutors(newTutors);
  };
  const handleSave = () => {
    // Save the form data
    console.log("Form data saved:", { numTutors, tutors });
    alert("Form data saved!");
  };

  const handleCancel = () => {
    // Clear the form data
    setNumTutors(0);
    setTutors([]);
  };
  return (
    <form>
      <div className="space-y-12 my-10 mx-10" id="find-a-tutor-section">
        <div>
          <p className="font-extrabold text-[40px]">Find A Tutor</p>
        </div>

        <PersonalInfoComponent />
        <div className="border-b border-gray-900/10 pb-12">
          <div className="flex flex-row items-center">
            <Image src={lesson} alt={""} className="h-[100px] w-[100px] mr-5" />
            <div>
              <h2 className="text-base font-semibold leading-7 text-gray-900">
                Lesson Details
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-600">
                This information will be displayed publicly so be careful what
                you share.
              </p>
            </div>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <label
                htmlFor="numTutors"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                How Many Tutors Do You Need
              </label>
              <div className="mt-2">
                <select
                  id="numTutors"
                  name="numTutors"
                  onChange={handleTutorChange}
                  className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                >
                  <option value="0">--Select--</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                </select>
              </div>
            </div>

            {Array.from({ length: numTutors }, (_, index) => (
              <div key={index} className="sm:col-span-4">
                <p className="font-bold">Tutor {index + 1}</p>
                <div>
                  <label
                    htmlFor={`subjects-${index}`}
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Subjects
                  </label>
                  <div className="mt-2">
                    <Select
                      id={`subjects-${index}`}
                      name={`subjects-${index}`}
                      isMulti
                      options={subjectsOptions}
                      onChange={(selectedOptions) =>
                        handleChange(index, "subjects", selectedOptions)
                      }
                      className="basic-multi-select"
                      classNamePrefix="select"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor={`duration-${index}`}
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Duration
                  </label>
                  <div className="mt-2">
                    <Select
                      id={`duration-${index}`}
                      name={`duration-${index}`}
                      options={durationOptions}
                      onChange={(selectedOption) =>
                        handleChange(index, "duration", selectedOption)
                      }
                      className="basic-single"
                      classNamePrefix="select"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor={`frequency-${index}`}
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Frequency
                  </label>
                  <div className="mt-2">
                    <Select
                      id={`frequency-${index}`}
                      name={`frequency-${index}`}
                      options={frequencyOptions}
                      onChange={(selectedOption) =>
                        handleChange(index, "frequency", selectedOption)
                      }
                      className="basic-single"
                      classNamePrefix="select"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Notification */}
        <TutorTypeComponent command={handleTutorChange} />

        <div className="flex justify-end space-x-4 m-5">
          <button
            type="button"
            className="justify-end text-xl font-semibold border border-black text-black  py-4 px-6 lg:px-12  rounded-full  bg-white hover:bg-btnblue"
            onClick={handleCancel}
          >
            Cancel
          </button>
          <button
            type="button"
            className="justify-end text-xl font-semibold text-white  py-4 px-6 lg:px-12  rounded-full  bg-blue hover:bg-btnblue"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
    </form>
  );
}
