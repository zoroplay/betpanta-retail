/* eslint-disable @typescript-eslint/no-explicit-any */
import { FileText } from "lucide-react";
import React from "react";
import {
  BsChevronDoubleLeft,
  BsChevronDoubleRight,
  BsChevronLeft,
  BsChevronRight,
} from "react-icons/bs";
import Select from "../inputs/Select";

interface TableColumn {
  id: string;
  name: string;
  className?: string;
  render?: (value: any, row: any, rowIndex: number) => React.ReactNode;
}
interface PaginationProps {
  currentPage: number;
  total: number;
  perPage: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  nextPage: number;
  lastPage: number;
  prevPage: number;
}

interface PaginatedTableProps {
  columns: TableColumn[];
  data: any[];
  isLoading?: boolean;
  pagination?: PaginationProps;
  className: string;
  rounded?: string;
  onRowSelect?: (selection: any) => void;
}

const Table: React.FC<PaginatedTableProps> = ({
  columns,
  data,
  isLoading = false,
  pagination,
  className,
  rounded = "rounded-lg",
  onRowSelect,
}) => {
  let base_styles = "";
  if (className) {
    base_styles += ` ${className}`;
  } else {
    switch (columns.length) {
      case 5:
        base_styles += " grid-cols-5";
        break;
      case 6:
        base_styles += " grid-cols-6";
        break;
      case 7:
        base_styles += " grid-cols-7";
        break;
      case 8:
        base_styles += " grid-cols-8";
        break;
    }
  }
  //   grid-cols-[repeat(17,minmax(0,1fr))]
  return (
    <div
      className={`${rounded} overflow-hidden shadow-sm flex flex-col h-full border bg-white `}
    >
      {/* Table Header - Static */}
      <div
        className={`bg-black border-gray-800 w-full text-xs text-white pl-1`}
      >
        <div
          className={` grid gap-2 justify-start items-center ${base_styles}`}
        >
          {columns.map((item, index) => (
            <div
              key={index}
              className={`${item.className} ${
                index !== 0 ? "border-l h-full border-gray-700" : ""
              } text-xs font-semibold tracking-wide whitespace-nowrap flex justify-start items-center p-2 py-3 text-white`}
            >
              {item.name}
            </div>
          ))}
        </div>
      </div>

      {/* Table Rows - Scrollable */}
      <div className="flex-1 gap-2 h-full overflow-y-auto">
        {isLoading ? (
          Array.from({ length: pagination?.perPage || 6 }).map(
            (_, rowIndex) => (
              <div
                key={`skeleton-row-${rowIndex}`}
                className={`border-b border-l-4 border-l-transparent border-gray-600`}
              >
                <div
                  className={`${base_styles} grid p-1 px-2  animate-pulse gap-1`}
                >
                  {columns.map((col, colIndex) => (
                    <span
                      key={`skeleton-cell-${col.id}-${colIndex}`}
                      className={`h-5 rounded bg-gray-200  flex-1 p-2 ${
                        col.className
                      } ${colIndex !== 0 ? "border-gray-700 pl-1" : ""}`}
                    ></span>
                  ))}
                </div>
              </div>
            )
          )
        ) : !data || data?.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 p-10">
            <div
              className={`w-14 h-14 bg-gray-200 rounded-full flex items-center justify-center`}
            >
              <FileText size={26} className="text-gray-700" />
            </div>
            <div className="text-center">
              <p className={`text-base font-semibold text-gray-700 mb-1`}>
                No Data found
              </p>
              <p className={`text-xs text-gray-700 opacity-60`}>
                {"Try adjusting your filters or date range"}
              </p>
            </div>
          </div>
        ) : (
          data?.map((row: any, rowIndex: number) => (
            <div
              key={row.id || rowIndex}
              className={`border-b border-l-4 border-l-transparent hover:border-l-slate-500/80 border-gray-200`}
            >
              <div
                className={` grid gap-2 ${base_styles} hover:bg-slate-100 text-gray-600 hover:border-l-gray-600/80`}
                onClick={() => onRowSelect && onRowSelect(row)}
              >
                {columns.map((col, colIndex) => {
                  // Always map the value for this column id
                  const value = row[col.id];
                  return (
                    <span
                      key={col.id}
                      className={`justify-start items-center flex ${
                        col.className
                      } text-xs ${
                        colIndex !== 0 ? "border-l border-gray-200 " : ""
                      } p-2`}
                    >
                      {col.render ? col.render(value, row, rowIndex) : value}
                    </span>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
      {/* Table Footer - Static */}
      {pagination && (
        <div className={`bg-gray-100 text-gray-700 px-4 py-2`}>
          <div className="flex flex-row justify-between items-center">
            <div className="flex gap-2 justify-start items-center">
              <span
                className={`font-semibold  whitespace-nowrap text-gray-700 text-[11px]`}
              >
                Number of rows:
              </span>
              <div className="min-w-24">
                <Select
                  value={[String(pagination.perPage)]}
                  options={[
                    { id: "10", name: "10" },
                    { id: "15", name: "15" },
                    { id: "20", name: "20" },
                    { id: "25", name: "25" },
                    { id: "30", name: "30" },
                  ]}
                  onChange={(e) => pagination.onPageSizeChange(Number(e[0]))}
                  placeholder={""} // className="w-full"
                  className={`w-full border rounded-lg px-3 py-2 placeholder-slate-400 transition-all disabled:opacity-50`}
                />
              </div>
            </div>

            {/* Pagination Controls */}
            <div className="flex flex-row items-center gap-4">
              <span className={`font-semibold text-gray-700 text-[11px]`}>
                Page {pagination?.currentPage || 0} of{" "}
                {pagination?.lastPage || 0}
              </span>

              <div className="flex flex-row items-center gap-2">
                {/* Previous Page Button */}
                <button
                  type="button"
                  onClick={pagination && (() => pagination.onPageChange(1))}
                  disabled={
                    !pagination ||
                    !pagination.prevPage ||
                    pagination.prevPage < 1
                  }
                  className={`p-1 h-7 w-7 cursor-pointer hover:bg-gray-300 transition-all duration-300 flex justify-center items-center rounded bg-white ${
                    !pagination ||
                    !pagination.prevPage ||
                    pagination.prevPage < 1
                      ? `opacity-50 pointer-events-none text-gray-500`
                      : `bg-gray-200 text-gray-700`
                  }`}
                >
                  <BsChevronDoubleLeft size={18} />
                </button>
                <button
                  type="button"
                  onClick={
                    pagination &&
                    (() => pagination.onPageChange(pagination.currentPage - 1))
                  }
                  disabled={
                    !pagination ||
                    !pagination.prevPage ||
                    pagination.prevPage < 1
                  }
                  className={`p-1 h-7 w-7 cursor-pointer hover:bg-gray-300 transition-all duration-300 flex justify-center items-center rounded bg-white   ${
                    !pagination ||
                    !pagination.prevPage ||
                    pagination.prevPage < 1
                      ? `opacity-50 pointer-events-none text-gray-500`
                      : `bg-gray-200 text-gray-700`
                  }`}
                >
                  <BsChevronLeft size={18} />
                </button>

                {/* Next Page Button */}
                <button
                  type="button"
                  onClick={
                    pagination &&
                    (() => pagination.onPageChange(pagination.currentPage + 1))
                  }
                  disabled={
                    !pagination ||
                    !pagination.nextPage ||
                    pagination.nextPage < 1
                  }
                  className={`p-1 h-7 w-7 cursor-pointer hover:bg-gray-300 transition-all duration-300 flex justify-center items-center rounded bg-white ${
                    !pagination ||
                    !pagination.nextPage ||
                    pagination.nextPage < 1
                      ? `opacity-50 pointer-events-none text-gray-500`
                      : `bg-gray-200 text-gray-700`
                  }`}
                >
                  <BsChevronRight size={18} />
                </button>
                <button
                  type="button"
                  onClick={
                    pagination &&
                    (() => pagination.onPageChange(pagination.lastPage))
                  }
                  disabled={
                    pagination.currentPage === pagination.lastPage ||
                    !pagination ||
                    !pagination.lastPage ||
                    pagination.lastPage <= 1
                  }
                  className={`p-1 h-7 w-7 cursor-pointer hover:bg-gray-300 transition-all duration-300 flex justify-center items-center rounded bg-white ${
                    pagination.currentPage === pagination.lastPage ||
                    !pagination ||
                    !pagination.lastPage ||
                    pagination.lastPage <= 1
                      ? `opacity-50 pointer-events-none text-gray-500`
                      : `bg-gray-200 text-gray-700`
                  }`}
                >
                  <BsChevronDoubleRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Table;
