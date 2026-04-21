import { Dispatch, FC, SetStateAction } from "react";

type Props = {
  currentPage: number;
  totalPages: number;
  onPageChange: Dispatch<SetStateAction<number>>;
  className?: string;
};

const Pagination: FC<Props> = ({
  currentPage,
  totalPages,
  onPageChange,
  className = "",
}) => {
  if (totalPages <= 1) return null;

  const goToPreviousPage = () => {
    onPageChange(Math.max(currentPage - 1, 1));
  };

  const goToNextPage = () => {
    onPageChange(Math.min(currentPage + 1, totalPages));
  };

  return (
    <div className={`flex justify-center items-center gap-2 ${className}`}>
      <button
        type="button"
        disabled={currentPage === 1}
        onClick={goToPreviousPage}
        className="px-4 py-2 text-sm rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
      >
        Previous
      </button>
      <span className="text-sm text-gray-500 px-2">
        {currentPage} / {totalPages}
      </span>
      <button
        type="button"
        disabled={currentPage === totalPages}
        onClick={goToNextPage}
        className="px-4 py-2 text-sm rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
