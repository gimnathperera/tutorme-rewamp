import { Dispatch, FC, SetStateAction } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  currentPage: number;
  totalPages: number;
  onPageChange: Dispatch<SetStateAction<number>>;
  className?: string;
  previousLabel?: string;
  nextLabel?: string;
};

const getPageNumbers = (
  currentPage: number,
  totalPages: number,
): (number | "...")[] => {
  if (totalPages <= 8) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const result: (number | "...")[] = [];

  if (currentPage <= 5) {
    for (let i = 1; i <= 7; i++) result.push(i);
    result.push("...");
    result.push(totalPages);
    return result;
  }

  if (currentPage >= totalPages - 4) {
    result.push(1);
    result.push("...");
    for (let i = totalPages - 6; i <= totalPages; i++) result.push(i);
    return result;
  }

  result.push(1);
  result.push("...");
  for (let i = currentPage - 2; i <= currentPage + 2; i++) result.push(i);
  result.push("...");
  result.push(totalPages);
  return result;
};

const Pagination: FC<Props> = ({
  currentPage,
  totalPages,
  onPageChange,
  className = "",
  previousLabel = "Previous",
  nextLabel = "Next",
}) => {
  if (totalPages <= 1) return null;

  const pages = getPageNumbers(currentPage, totalPages);

  return (
    <div className={`flex justify-center items-center gap-1 ${className}`}>
      <button
        type="button"
        disabled={currentPage === 1}
        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
        className="flex items-center gap-1 px-3 py-2 text-sm rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
      >
        <ChevronLeft size={15} />
        <span className="hidden sm:inline">{previousLabel}</span>
      </button>

      {pages.map((page, index) =>
        page === "..." ? (
          <span
            key={`ellipsis-${index}`}
            className="px-2 py-2 text-sm text-gray-400 select-none"
          >
            ...
          </span>
        ) : (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            className={`min-w-[36px] h-9 px-2 text-sm rounded-lg font-medium transition ${
              page === currentPage
                ? "bg-blue-600 text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {page}
          </button>
        ),
      )}

      <button
        type="button"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
        className="flex items-center gap-1 px-3 py-2 text-sm rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
      >
        <span className="hidden sm:inline">{nextLabel}</span>
        <ChevronRight size={15} />
      </button>
    </div>
  );
};

export default Pagination;
