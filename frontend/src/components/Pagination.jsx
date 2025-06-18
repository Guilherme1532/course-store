import React from "react";

const Pagination = ({ page, totalPageCount, onPrev, onNext }) => {
  if (totalPageCount <= 1) return null;

  return (
    <div className="flex justify-between my-4 gap-3">
      <button
        className={` flex items-center gap-2 px-3 py-2 rounded-full text-white 
    ${
      page === 1
        ? "bg-gray-400 cursor-default"
        : "cursor-pointer bg-orange-600 hover:bg-orange-200 hover:scale-105 transition duration-300 ease-in-out"
    }
  `}
        onClick={onPrev}
        disabled={page === 1}
      >
        Anterior
      </button>

      <div className="flex items-center gap-2 bg-orange-600 px-3 py-2 rounded-full text-white">
        <p>{page}</p>/<p>{totalPageCount || "1"}</p>
      </div>

      <button
        className={`flex items-center gap-2 px-3 py-2 rounded-full text-white 
    ${
      page === totalPageCount
        ? "bg-gray-400 cursor-default"
        : "cursor-pointer bg-orange-600 hover:bg-orange-200 hover:scale-105 transition duration-300 ease-in-out"
    }
  `}
        onClick={onNext}
        disabled={page === totalPageCount}
      >
        Próxima
      </button>
    </div>
  );
};

export default Pagination;
