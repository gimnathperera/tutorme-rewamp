import React from "react";

type Props = {};

const FormContactUs = ({}: Props) => {
  return (
    <form action="#" className="space-y-8">
      <div>
        <label
          htmlFor="text"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
        >
          Your Name
        </label>
        <input
          id="text"
          name="input1"
          type="text"
          autoComplete="current-password"
          required
          className="relative block w-full appearance-none  rounded-md border border-linegrey px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
          placeholder="Name..."
        />
      </div>
      <div>
        <label
          htmlFor="email"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
        >
          Your email
        </label>
        <input
          id="email"
          name="input2"
          type="email"
          autoComplete="current-password"
          required
          className="relative block w-full appearance-none  rounded-md border border-linegrey px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
          placeholder="xyz@email.com"
        />
      </div>
      <div className="sm:col-span-2">
        <label
          htmlFor="message"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400"
        >
          Your message
        </label>
        <textarea
          id="message"
          name="input3"
          className="relative block w-full appearance-none  rounded-md border border-linegrey px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
          placeholder="Leave a comment..."
        ></textarea>
      </div>
      <button
        type="submit"
        className="py-3 px-5 text-sm disabled:opacity-50 font-medium w-full text-center text-white rounded-lg bg-blue focus:ring-4 focus:outline-none focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
      >
        Send message
      </button>
    </form>
  );
};

export default FormContactUs;
