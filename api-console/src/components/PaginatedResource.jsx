import React, { useState } from "react";
import { useAPI } from "../lib/API.js";

const PaginatedResource = ({ children, path, params = {}, pageSize = 10 }) => {
  const [pageHashes, setPageHashes] = useState([""]);
  const [data] = useAPI(path, { ...params, "page[size]": pageSize, "page[after]": pageHashes[pageHashes.length - 1] });

  return (
    <>
      <div>
        {data
          ? children({ data: data.data })
          : null
        }
      </div>
      <nav
        className="flex items-center justify-between border-t border-gray-200 bg-white pt-3 mt-10"
        aria-label="Pagination"
      >
        <div className="hidden sm:block">
          <p className="text-sm text-gray-700 py-3">
            Showing <span className="font-medium">{pageSize * (pageHashes.length - 1) + 1}</span> to <span
            className="font-medium">{pageSize * (pageHashes.length - 1) + (data?.data.length || 0)}</span> results
          </p>
        </div>
        <div className="flex flex-1 justify-between sm:justify-end">
          {data?.links?.prev && (
            <button
              key="prev"
              onClick={() => setPageHashes([...pageHashes.slice(0, -1)])}
              className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Previous
            </button>
          )}
          {data?.links?.next && (
            <button
              key="next"
              onClick={() => setPageHashes([...pageHashes, data?.links?.next.split('[after]=')[1]])}
              className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Next
            </button>
          )}
        </div>
      </nav>
    </>
  );
};

export default PaginatedResource;
