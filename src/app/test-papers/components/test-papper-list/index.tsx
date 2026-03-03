import Image from "next/image";
import React, { FC } from "react";
import Skeleton from "react-loading-skeleton";
import { Paper } from "@/types/response-types";
import "react-loading-skeleton/dist/skeleton.css";
import Empty from "../../../../../public/images/shared/empty.png";
type Props = {
  availablePapers: Paper[];
  isPapersLoading: boolean;
};

const TestPaperList: FC<Props> = ({ availablePapers, isPapersLoading }) => {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-3xl mt-8">
      {isPapersLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array(4)
            .fill(null)
            .map((_, index) => (
              <div key={index} className="text-center">
                <Skeleton width={120} height={24} className="mb-2" />
                <Skeleton width={150} height={16} className="mb-4" />
                <Skeleton count={3} height={14} className="mb-2" />
              </div>
            ))}
        </div>
      ) : availablePapers?.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {availablePapers.map((paper) => (
            <div key={paper.id} className="text-center">
              <h2 className="text-lg font-bold text-black">
                {paper.subject.title}
              </h2>

              <a
                href={paper.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-blue-600 hover:underline font-semibold mt-2"
              >
                Download Paper
              </a>

              <ul className="mt-4 space-y-1">
                <li>
                  <a
                    href={paper.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-700 hover:underline"
                  >
                    {paper.title} ({paper.year})
                  </a>
                </li>
              </ul>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center p-6 rounded-lg">
          <Image
            src={Empty}
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

export default TestPaperList;
