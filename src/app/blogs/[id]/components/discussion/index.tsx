const Discussion: React.FC = () => {
  return (
    <section className="not-format">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg lg:text-2xl font-bold text-gray-900 ">
          Discussion (20)
        </h2>
      </div>
      <form className="mb-6">
        <div className="py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg border border-gray-200 ">
          <label htmlFor="comment" className="sr-only">
            Your comment
          </label>
          <textarea
            id="comment"
            rows={6}
            className="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0"
            placeholder="Write a comment..."
            required
          ></textarea>
        </div>
        <button
          type="submit"
          className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200 hover:bg-primary-800"
        >
          Post comment
        </button>
      </form>
      <article className="p-6 mb-6 text-base bg-white rounded-lg ">
        <footer className="flex justify-between items-center mb-2">
          <div className="flex items-center">
            <p className="inline-flex items-center mr-3 font-semibold text-sm text-gray-900 ">
              <img
                className="mr-2 w-6 h-6 rounded-full"
                src="https://flowbite.com/docs/images/people/profile-picture-2.jpg"
                alt="Michael Gough"
              />
              Michael Gough
            </p>
            <p className="text-sm text-gray-600">
              <time dateTime="2022-02-08" title="February 8th, 2022">
                Feb. 8, 2022
              </time>
            </p>
          </div>
          <button
            id="dropdownComment1Button"
            data-dropdown-toggle="dropdownComment1"
            className="inline-flex items-center p-2 text-sm font-medium text-center text-gray-500 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-50"
            type="button"
          >
            <svg
              className="w-4 h-4"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 16 3"
            >
              <path d="M2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6.041 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z" />
            </svg>
            <span className="sr-only">Comment settings</span>
          </button>
          <div
            id="dropdownComment1"
            className="hidden z-10 w-36 bg-white rounded divide-y divide-gray-100 shadow "
          >
            <ul
              className="py-1 text-sm text-gray-700"
              aria-labelledby="dropdownMenuIconHorizontalButton"
            >
              <li>
                <a href="#" className="block py-2 px-4 hover:bg-gray-100  ">
                  Edit
                </a>
              </li>
              <li>
                <a href="#" className="block py-2 px-4 hover:bg-gray-100  ">
                  Remove
                </a>
              </li>
              <li>
                <a href="#" className="block py-2 px-4 hover:bg-gray-100  ">
                  Report
                </a>
              </li>
            </ul>
          </div>
        </footer>
        <p>
          Very straight-to-point article. Really worth time reading. Thank you!
          But tools are just the instruments htmlFor the UX designers. The
          knowledge of the design tools are as important as the creation of the
          design strategy.
        </p>
        <div className="flex items-center mt-4 space-x-4">
          <button
            type="button"
            className="flex items-center font-medium text-sm text-gray-500 hover:underline"
          >
            <svg
              className="mr-1.5 w-3 h-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 18"
            >
              <path d="M18 0H2a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h2v4a1 1 0 0 0 1.707.707L10.414 13H18a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5 4h2a1 1 0 1 1 0 2h-2a1 1 0 1 1 0-2ZM5 4h5a1 1 0 1 1 0 2H5a1 1 0 0 1 0-2Zm2 5H5a1 1 0 0 1 0-2h2a1 1 0 0 1 0 2Zm9 0h-6a1 1 0 0 1 0-2h6a1 1 0 1 1 0 2Z" />
            </svg>
            Reply
          </button>
        </div>
      </article>
      <article className="p-6 mb-6 ml-6 lg:ml-12 text-base bg-white rounded-lg ">
        <footer className="flex justify-between items-center mb-2">
          <div className="flex items-center">
            <p className="inline-flex items-center mr-3 font-semibold text-sm text-gray-900 ">
              <img
                className="mr-2 w-6 h-6 rounded-full"
                src="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                alt="Jese Leos"
              />
              Jese Leos
            </p>
            <p className="text-sm text-gray-600">
              <time dateTime="2022-02-12" title="February 12th, 2022">
                Feb. 12, 2022
              </time>
            </p>
          </div>
          <button
            id="dropdownComment2Button"
            data-dropdown-toggle="dropdownComment2"
            className="inline-flex items-center p-2 text-sm font-medium text-center text-gray-500 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-50"
            type="button"
          >
            <svg
              className="w-4 h-4"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 16 3"
            >
              <path d="M2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6.041 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z" />
            </svg>
            <span className="sr-only">Comment settings</span>
          </button>
          <div
            id="dropdownComment2"
            className="hidden z-10 w-36 bg-white rounded divide-y divide-gray-100 shadow "
          >
            <ul
              className="py-1 text-sm text-gray-700"
              aria-labelledby="dropdownMenuIconHorizontalButton"
            >
              <li>
                <a href="#" className="block py-2 px-4 hover:bg-gray-100  ">
                  Edit
                </a>
              </li>
              <li>
                <a href="#" className="block py-2 px-4 hover:bg-gray-100  ">
                  Remove
                </a>
              </li>
              <li>
                <a href="#" className="block py-2 px-4 hover:bg-gray-100  ">
                  Report
                </a>
              </li>
            </ul>
          </div>
        </footer>
        <p>Much appreciated! Glad you liked it ☺️</p>
        <div className="flex items-center mt-4 space-x-4">
          <button
            type="button"
            className="flex items-center font-medium text-sm text-gray-500 hover:underline"
          >
            <svg
              className="mr-1.5 w-3 h-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 18"
            >
              <path d="M18 0H2a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h2v4a1 1 0 0 0 1.707.707L10.414 13H18a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5 4h2a1 1 0 1 1 0 2h-2a1 1 0 1 1 0-2ZM5 4h5a1 1 0 1 1 0 2H5a1 1 0 0 1 0-2Zm2 5H5a1 1 0 0 1 0-2h2a1 1 0 0 1 0 2Zm9 0h-6a1 1 0 0 1 0-2h6a1 1 0 1 1 0 2Z" />
            </svg>
            Reply
          </button>
        </div>
      </article>
      <article className="p-6 mb-6 text-base bg-white border-t border-gray-200">
        <footer className="flex justify-between items-center mb-2">
          <div className="flex items-center">
            <p className="inline-flex items-center mr-3 font-semibold text-sm text-gray-900 ">
              <img
                className="mr-2 w-6 h-6 rounded-full"
                src="https://flowbite.com/docs/images/people/profile-picture-3.jpg"
                alt="Bonnie Green"
              />
              Bonnie Green
            </p>
            <p className="text-sm text-gray-600">
              <time dateTime="2022-03-12" title="March 12th, 2022">
                Mar. 12, 2022
              </time>
            </p>
          </div>
          <button
            id="dropdownComment3Button"
            data-dropdown-toggle="dropdownComment3"
            className="inline-flex items-center p-2 text-sm font-medium text-center text-gray-500 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-50"
            type="button"
          >
            <svg
              className="w-4 h-4"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 16 3"
            >
              <path d="M2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6.041 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z" />
            </svg>
            <span className="sr-only">Comment settings</span>
          </button>
          <div
            id="dropdownComment3"
            className="hidden z-10 w-36 bg-white rounded divide-y divide-gray-100 shadow "
          >
            <ul
              className="py-1 text-sm text-gray-700"
              aria-labelledby="dropdownMenuIconHorizontalButton"
            >
              <li>
                <a href="#" className="block py-2 px-4 hover:bg-gray-100  ">
                  Edit
                </a>
              </li>
              <li>
                <a href="#" className="block py-2 px-4 hover:bg-gray-100  ">
                  Remove
                </a>
              </li>
              <li>
                <a href="#" className="block py-2 px-4 hover:bg-gray-100  ">
                  Report
                </a>
              </li>
            </ul>
          </div>
        </footer>
        <p>
          The article covers the essentials, challenges, myths and stages the UX
          designer should consider while creating the design strategy.
        </p>
        <div className="flex items-center mt-4 space-x-4">
          <button
            type="button"
            className="flex items-center font-medium text-sm text-gray-500 hover:underline"
          >
            <svg
              className="mr-1.5 w-3 h-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 18"
            >
              <path d="M18 0H2a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h2v4a1 1 0 0 0 1.707.707L10.414 13H18a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5 4h2a1 1 0 1 1 0 2h-2a1 1 0 1 1 0-2ZM5 4h5a1 1 0 1 1 0 2H5a1 1 0 0 1 0-2Zm2 5H5a1 1 0 0 1 0-2h2a1 1 0 0 1 0 2Zm9 0h-6a1 1 0 0 1 0-2h6a1 1 0 1 1 0 2Z" />
            </svg>
            Reply
          </button>
        </div>
      </article>
      <article className="p-6 text-base bg-white border-t border-gray-200">
        <footer className="flex justify-between items-center mb-2">
          <div className="flex items-center">
            <p className="inline-flex items-center mr-3 font-semibold text-sm text-gray-900 ">
              <img
                className="mr-2 w-6 h-6 rounded-full"
                src="https://flowbite.com/docs/images/people/profile-picture-4.jpg"
                alt="Helene Engels"
              />
              Helene Engels
            </p>
            <p className="text-sm text-gray-600">
              <time dateTime="2022-06-23" title="June 23rd, 2022">
                Jun. 23, 2022
              </time>
            </p>
          </div>
          <button
            id="dropdownComment4Button"
            data-dropdown-toggle="dropdownComment4"
            className="inline-flex items-center p-2 text-sm font-medium text-center text-gray-500 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-50"
            type="button"
          >
            <svg
              className="w-4 h-4"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 16 3"
            >
              <path d="M2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6.041 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z" />
            </svg>
          </button>
          <div
            id="dropdownComment4"
            className="hidden z-10 w-36 bg-white rounded divide-y divide-gray-100 shadow "
          >
            <ul
              className="py-1 text-sm text-gray-700"
              aria-labelledby="dropdownMenuIconHorizontalButton"
            >
              <li>
                <a href="#" className="block py-2 px-4 hover:bg-gray-100  ">
                  Edit
                </a>
              </li>
              <li>
                <a href="#" className="block py-2 px-4 hover:bg-gray-100  ">
                  Remove
                </a>
              </li>
              <li>
                <a href="#" className="block py-2 px-4 hover:bg-gray-100  ">
                  Report
                </a>
              </li>
            </ul>
          </div>
        </footer>
        <p>
          Thanks htmlFor sharing this. I do came from the Backend development
          and explored some of the tools to design my Side Projects.
        </p>
        <div className="flex items-center mt-4 space-x-4">
          <button
            type="button"
            className="flex items-center font-medium text-sm text-gray-500 hover:underline"
          >
            <svg
              className="mr-1.5 w-3 h-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 18"
            >
              <path d="M18 0H2a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h2v4a1 1 0 0 0 1.707.707L10.414 13H18a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5 4h2a1 1 0 1 1 0 2h-2a1 1 0 1 1 0-2ZM5 4h5a1 1 0 1 1 0 2H5a1 1 0 0 1 0-2Zm2 5H5a1 1 0 0 1 0-2h2a1 1 0 0 1 0 2Zm9 0h-6a1 1 0 0 1 0-2h6a1 1 0 1 1 0 2Z" />
            </svg>
            Reply
          </button>
        </div>
      </article>
    </section>
  );
};

export default Discussion;
