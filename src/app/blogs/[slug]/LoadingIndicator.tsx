import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const LoadingIndicator = () => {
  return (
    <div>
      <div className="m-10 space-y-10">
        <div className="relative w-full h-[350px] md:h-[450px] rounded-lg overflow-hidden shadow-lg">
          <Skeleton className="w-full h-full rounded-lg" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 space-y-3">
            <Skeleton className="h-10 w-2/3 mx-auto" />
            <Skeleton className="h-6 w-1/2 mx-auto" />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 mt-6">
          <div className="flex-1 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 space-y-6">
            <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg shadow-sm">
              <Skeleton className="w-12 h-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-48" />
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {Array(5)
                .fill(0)
                .map((_, idx) => (
                  <Skeleton key={idx} className="h-6 w-20 rounded-full" />
                ))}
            </div>

            <Skeleton className="w-full h-[300px] rounded-lg" />

            <div className="space-y-4">
              {Array(6)
                .fill(0)
                .map((_, idx) => (
                  <Skeleton key={idx} className="h-4 w-full" />
                ))}
            </div>
          </div>
          <aside className="w-full md:w-[30%] flex flex-col gap-6">
            <div>
              <Skeleton className="h-6 w-1/2 mb-4" />
              <ul className="space-y-4">
                {Array(3)
                  .fill(0)
                  .map((_, idx) => (
                    <li
                      key={idx}
                      className="flex items-center gap-3 p-2 rounded-lg shadow-sm bg-white dark:bg-gray-800"
                    >
                      <Skeleton className="w-16 h-16 rounded-md" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </li>
                  ))}
              </ul>
            </div>

            <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-lg shadow-sm">
              <Skeleton className="h-6 w-1/3 mb-4" />
              <div className="space-y-3">
                {Array(3)
                  .fill(0)
                  .map((_, idx) => (
                    <Skeleton key={idx} className="h-4 w-full" />
                  ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default LoadingIndicator;
