import Image from "next/image";
import React, { FC, useEffect, useMemo, useState } from "react";
import Skeleton from "react-loading-skeleton";
import Pagination from "@/components/shared/pagination";
import { Paper } from "@/types/response-types";
import { Download, FileText, GraduationCap, BookOpen } from "lucide-react";
import "react-loading-skeleton/dist/skeleton.css";
import Empty from "../../../../../public/images/shared/empty.png";

type Props = {
  availablePapers: Paper[];
  isPapersLoading: boolean;
};

const PAPERS_PER_PAGE = 12;

const TestPaperList: FC<Props> = ({ availablePapers, isPapersLoading }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(availablePapers.length / PAPERS_PER_PAGE);

  const visiblePapers = useMemo(() => {
    const startIndex = (currentPage - 1) * PAPERS_PER_PAGE;
    return availablePapers.slice(startIndex, startIndex + PAPERS_PER_PAGE);
  }, [availablePapers, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [availablePapers]);

  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white rounded-3xl mt-8">
      {isPapersLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array(4)
            .fill(null)
            .map((_, index) => (
              <div key={index} className="rounded-2xl border border-gray-100 p-5 shadow-sm">
                <Skeleton circle width={48} height={48} className="mb-3" />
                <Skeleton width={140} height={20} className="mb-1" />
                <Skeleton width={90} height={16} className="mb-4" />
                <Skeleton height={1} className="mb-4" />
                <Skeleton width={160} height={14} className="mb-2" />
                <Skeleton width={180} height={14} className="mb-4" />
                <Skeleton height={36} borderRadius={8} />
              </div>
            ))}
        </div>
      ) : availablePapers?.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {visiblePapers.map((paper) => (
              <div
                key={paper.id}
                className="flex flex-col rounded-2xl border border-gray-100 bg-white p-5 shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                {/* Icon + Subject + Year */}
                <div className="flex items-start gap-3 mb-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                    <FileText className="text-blue-500" size={22} />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-gray-900 leading-tight">
                      {paper.subject?.title}
                    </h2>
                    {paper.year && (
                      <p className="text-sm font-semibold text-blue-500 mt-0.5">
                        {paper.year}
                      </p>
                    )}
                  </div>
                </div>

                {/* Divider */}
                <hr className="border-gray-100 mb-4" />

                {/* Grade */}
                {paper.grade?.title && (
                  <div className="flex items-start gap-2 mb-2">
                    <GraduationCap size={15} className="text-blue-400 mt-0.5 flex-shrink-0" />
                    <span className="text-xs text-gray-600 leading-tight">
                      {paper.grade.title}
                    </span>
                  </div>
                )}

                {/* Paper title */}
                <div className="flex items-start gap-2 mb-5">
                  <BookOpen size={15} className="text-blue-400 mt-0.5 flex-shrink-0" />
                  <span className="text-xs text-gray-600 leading-tight">
                    {paper.title}
                  </span>
                </div>

                {/* Download button */}
                <div className="mt-auto">
                  <a
                    href={paper.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full rounded-xl border border-blue-500 py-2 text-sm font-semibold text-blue-500 hover:bg-blue-50 transition-colors duration-150"
                  >
                    <Download size={15} />
                    Download Paper
                  </a>
                </div>
              </div>
            ))}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            className="mt-6"
          />
        </>
      ) : (
        <div className="text-center p-6 rounded-lg">
          <Image
            src={Empty}
            alt="gaby"
            width={64}
            height={64}
            className="inline-block m-auto mb-4"
          />
          <h2 className="text-base font-semibold text-gray-700">
            No Past Exam Papers Available
          </h2>
          <p className="text-sm text-gray-500 mt-2">
            No papers found for the selected filters. Try adjusting your search.
          </p>
        </div>
      )}
    </div>
  );
};

export default TestPaperList;
