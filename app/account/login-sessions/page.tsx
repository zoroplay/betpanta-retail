"use client";

import DateRangeInput from "@/components/inputs/DateRangeInput";
import Input from "@/components/inputs/Input";
import SingleSearchInput from "@/components/inputs/SingleSearchInput";
import Table from "@/components/tables/Table";
import { useState } from "react";
import { CheckCheck, FileText, ChevronLeft, ChevronRight } from "lucide-react";

interface Transaction {
  id: string;
  date: string;
  transaction: string;
  betslip: string;
  credit: string;
  debit: string;
  subject: string;
  balance: string;
}

const LoginSessionsPage = () => {
  // Table columns config for dynamic rendering
  const tableColumns = [
    { id: "session-start", name: "Session Start" },
    {
      id: "session-end",
      name: "Session End",
    },
    {
      id: "duration",
      name: "Duration",
    },
    {
      id: "ip",
      name: "IP",
    },
    {
      id: "location",
      name: "Location",
    },
  ];
  const [amountType, setAmountType] = useState<"all" | "credits" | "debits">(
    "all"
  );
  const [transactionType, setTransactionType] = useState("");
  const [normalChecked, setNormalChecked] = useState(true);
  const [virtualBetsChecked, setVirtualBetsChecked] = useState(true);

  // Set default date range: 2 days ago to today
  const getDefaultDateRange = () => {
    const today = new Date();
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(today.getDate() - 2);

    return {
      startDate: twoDaysAgo.toLocaleDateString("en-CA"), // YYYY-MM-DD format
      endDate: today.toLocaleDateString("en-CA"), // YYYY-MM-DD format
    };
  };

  const [dateRange, setDateRange] = useState(getDefaultDateRange());
  const [pageSize, setPageSize] = useState("15");
  const [currentPage, setCurrentPage] = useState(1);

  // Mock data for login sessions
  const transactions = [
    {
      "session-start": "2025-12-04 09:00",
      "session-end": "2025-12-04 17:00",
      duration: "8h",
      ip: "192.168.1.10",
      location: "Lagos, NG",
    },
    {
      "session-start": "2025-12-03 10:00",
      "session-end": "2025-12-03 18:00",
      duration: "8h",
      ip: "192.168.1.11",
      location: "Abuja, NG",
    },
    {
      "session-start": "2025-12-02 08:30",
      "session-end": "2025-12-02 16:30",
      duration: "8h",
      ip: "192.168.1.12",
      location: "Kano, NG",
    },
  ];

  // Pagination helpers for mock data
  const totalTransactions = transactions.length;
  const totalPages = Math.ceil(totalTransactions / parseInt(pageSize)) || 1;
  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;
  const nextPage = hasNextPage ? currentPage + 1 : null;
  const prevPage = hasPrevPage ? currentPage - 1 : null;

  const handleNextPage = () => {
    if (hasNextPage && nextPage) {
      setCurrentPage(nextPage);
      // Auto-fetch when page changes
    }
  };

  const handlePrevPage = () => {
    if (hasPrevPage && prevPage) {
      setCurrentPage(prevPage);
    }
  };

  // Auto-fetch when filters change
  // Re-fetch when any filter changes

  const handleCancel = () => {
    // Reset all filters to defaults
    setAmountType("all");
    setTransactionType("");
    setNormalChecked(true);
    setVirtualBetsChecked(true);
    setDateRange(getDefaultDateRange());
    setPageSize("15");
    setCurrentPage(1);
    // Auto-fetch will happen via useEffect
  };

  const handleContinue = () => {
    // Reset to first page when applying new filters
    setCurrentPage(1);
    // Auto-fetch will happen via useEffect

    console.log("Applying filters:", {
      amountType,
      transactionType,
      normalChecked,
      virtualBetsChecked,
      dateRange,
      pageSize,
      currentPage: 1,
    });
  };

  return (
    <div className="p-4">
      <div className="">
        <h1 className="text-xl font-bold text-gray-900 mb-2">View Sessions</h1>
        {/* Filters */}
        <div className="flex flex-col gap-4 mb-2">
          <div className="grid lg:grid-cols-5 grid-cols-2 gap-2">
            <div className="lg:col-span-2 text-gray-600">
              <SingleSearchInput
                type="text"
                placeholder="Search by cashier ID"
                className="w-full  rounded bg-white border border-gray-200 text-sm focus:outline-none"
                bg_color={`bg-white`}
                border_color={`border-gray-200`}
                height="h-[36px]"
                text_color="text-gray-700 text-xs"
                searchState={{
                  isValid: false,
                  isNotFound: false,
                  isLoading: false,
                  message: "",
                }}
                onSearch={() => {}}
              />
            </div>
            <Input
              type="text"
              placeholder="Select period"
              className="w-full  px-4 py-2 rounded bg-white border border-gray-200 text-sm focus:outline-none"
              bg_color={`bg-white`}
              border_color={`border-gray-200`}
              height="h-[36px]"
              text_color="text-gray-700 text-xs"
              name={""}
              onChange={() => {}}
            />
            <div className="col-span-2 text-gray-600 w-full">
              <DateRangeInput
                label=""
                value={dateRange}
                onChange={setDateRange}
                placeholder="DD/MM/YYYY"
                bg_color={`bg-white`}
                border_color={`border-gray-200`}
                height="h-[36px]"
                text_color="text-gray-700 "

                // height="h-[42px]"
              />
            </div>
          </div>
        </div>
        {/* Table Card */}
        <Table
          columns={tableColumns}
          data={transactions}
          isLoading={false}
          className="grid-cols-5"
          pagination={{
            currentPage,
            total: totalTransactions,
            perPage: parseInt(pageSize),
            onPageChange: setCurrentPage,
            onPageSizeChange: (size) => {
              setPageSize(String(size));
              setCurrentPage(1);
            },
            nextPage: nextPage || currentPage + 1,
            lastPage: totalPages,
            prevPage: prevPage || currentPage - 1,
          }}
        />
      </div>
    </div>
  );
};

export default LoginSessionsPage;
