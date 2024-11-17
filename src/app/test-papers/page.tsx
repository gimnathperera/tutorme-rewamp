const TestPapers = () => {
  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl py-4 m-3">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center">
          Get Your Study Materials!
        </h2>
        <h3 className="text-xl sm:text-2xl font-medium text-center pt-4 sm:pt-10 opacity-50">
          Select your grade and subject to download the papers you need for your
          studies.
          <br className="hidden sm:block" />
          It&apos;s quick, easy, and free!
        </h3>
      </div>
      <div>
        <div className="max-w-4xl mx-auto p-6 bg-white">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            Download Test Papers
          </h2>

          <div className="mb-6">
            <label
              htmlFor="grade"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Grade
            </label>
            <select
              id="grade"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            >
              <option selected>Choose a grade</option>
              <option value="9">Grade 9</option>
              <option value="10">Grade 10</option>
              <option value="11">Grade 11</option>
              <option value="12">Grade 12</option>
            </select>
          </div>

          <div className="mb-6">
            <label
              htmlFor="subject"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Subject
            </label>
            <select
              id="subject"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            >
              <option selected>Choose a subject</option>
              <option value="math">Mathematics</option>
              <option value="science">Science</option>
              <option value="english">English</option>
              <option value="history">History</option>
            </select>
          </div>

          <div className="mt-20">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">
              Available Test Papers
            </h3>
            <ul className="space-y-2">
              <li className="flex items-center justify-between bg-gray-100 p-3 rounded-lg">
                <span className="text-gray-800">Term Test Papers</span>
                <button className="mt-4 text-xl font-semibold text-white bg-btnblue py-2 px-6 hover:bg-hoblue rounded-full">
                  Download
                </button>
              </li>
              <li className="flex items-center justify-between bg-gray-100 p-3 rounded-lg">
                <span className="text-gray-800">Colombo School Papers</span>
                <button className="mt-4 text-xl font-semibold text-white bg-btnblue py-2 px-6 hover:bg-hoblue rounded-full">
                  Download
                </button>
              </li>
              <li className="flex items-center justify-between bg-gray-100 p-3 rounded-lg">
                <span className="text-gray-800">Model Papers</span>
                <button className="mt-4 text-xl font-semibold text-white bg-btnblue py-2 px-6 hover:bg-hoblue rounded-full">
                  Download
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestPapers;
