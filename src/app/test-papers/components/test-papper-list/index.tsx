import Image from "next/image";
import React, { FC } from "react";

type Props = {
  availablePapers: {
    title: string;
    downloadAll: string;
    fileType: string;
    years: number[];
  }[];
};

const TestPapperList: FC<Props> = ({ availablePapers }) => {
  const hasSubjects =
    availablePapers.length > 0 &&
    availablePapers.some((subject) => subject.years.length > 0);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-3xl mt-8">
      {hasSubjects ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {availablePapers.map((subject, index) => (
            <div key={index} className="text-center">
              <h2 className="text-lg font-bold text-black">{subject.title}</h2>
              <a
                href="#"
                className="block text-blue-600 hover:underline font-semibold mt-2"
              >
                {subject.downloadAll}
              </a>
              <ul className="mt-4 space-y-1">
                <li>
                  <a href="#" className="text-gray-700 hover:underline">
                    2021 P1 English
                  </a>
                </li>
              </ul>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center p-6 rounded-lg">
          <Image
            src="/images/shared/empty.png"
            alt="gaby"
            width={64}
            height={64}
            className="inline-block m-auto mb-4"
          />
          <h2 className="text-lg font-semibold text-gray-700">
            No Test Papers Available
          </h2>
          <p className="text-gray-500 mt-2">Please search again!</p>
        </div>
      )}
    </div>
  );
};

export default TestPapperList;
