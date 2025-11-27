"use client";

import DateRangeInput from "@/components/inputs/DateRangeInput";
import Input from "@/components/inputs/Input";
import SingleSearchInput from "@/components/inputs/SingleSearchInput";
import BaseCard from "@/components/layout/BaseCard";
import { AppHelper } from "@/lib/helper";
import { useLazyFetchTransactionsQuery } from "@/redux/services/bets.service";
import {
  getEnvironmentVariable,
  ENVIRONMENT_VARIABLES,
} from "@/redux/services/configs/environment.config";
import { CheckCheck, FileText, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";

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

const FastPrintPage = () => {
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

  // Lazy fetch hook - will be triggered by Continue button
  const [fetchTransactions, { data, isLoading }] =
    useLazyFetchTransactionsQuery();

  // Use API data if available, otherwise use sample data
  const transactions = Array.isArray(data?.data) ? data?.data : [];

  // Pagination helpers
  const totalTransactions = data?.meta?.total || 0;
  const totalPages = Math.ceil(totalTransactions / parseInt(pageSize)) || 1;
  const hasNextPage = data?.meta?.nextPage !== null;
  const hasPrevPage = data?.meta?.prevPage !== null;
  const nextPage = data?.meta?.nextPage;
  const prevPage = data?.meta?.prevPage;

  const handleNextPage = () => {
    if (hasNextPage && nextPage) {
      setCurrentPage(nextPage);
      // Auto-fetch when page changes
      fetchTransactions({
        clientId: getEnvironmentVariable(ENVIRONMENT_VARIABLES.CLIENT_ID)!,
        endDate: dateRange.endDate,
        page_size: parseInt(pageSize),
        startDate: dateRange.startDate,
        type: amountType,
        page: nextPage,
      });
    }
  };

  const handlePrevPage = () => {
    if (hasPrevPage && prevPage) {
      setCurrentPage(prevPage);
      // Auto-fetch when page changes
      fetchTransactions({
        clientId: getEnvironmentVariable(ENVIRONMENT_VARIABLES.CLIENT_ID)!,
        endDate: dateRange.endDate,
        page_size: parseInt(pageSize),
        startDate: dateRange.startDate,
        type: amountType,
        page: prevPage,
      });
    }
  };

  // Auto-fetch when filters change
  useEffect(() => {
    fetchTransactions({
      clientId: getEnvironmentVariable(ENVIRONMENT_VARIABLES.CLIENT_ID)!,
      endDate: dateRange.endDate,
      page_size: parseInt(pageSize),
      startDate: dateRange.startDate,
      type: amountType,
      page: currentPage,
    });
  }, [dateRange, pageSize, amountType, currentPage]); // Re-fetch when any filter changes

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
        <h1 className="text-xl font-bold text-gray-900 mb-6">Fast Print</h1>
        {/* Filters */}
        <div className="flex flex-col gap-4 mb-4">
          <div className="grid grid-cols-4 gap-2">
            <SingleSearchInput
              type="text"
              placeholder="Search messages"
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
            <Input
              type="text"
              placeholder="Select Period"
              className="w-full  px-4 py-2 rounded bg-white border border-gray-200 text-sm focus:outline-none"
              bg_color={`bg-white`}
              border_color={`border-gray-200`}
              height="h-[36px]"
              text_color="text-gray-700 text-xs"
              name={""}
              onChange={() => {}}
            />

            <div className="col-span-2 text-gray-600">
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
        <div className="bg-white rounded-lg">
          {/* Table Header */}
          <div className="bg-black rounded-t-lg  text-xs text-white  font-semibold grid grid-cols-[1fr_5fr]">
            <div className="py-2 px-4 flex justify-start items-center ">
              Printing Types
            </div>
          </div>
          {/* Table Rows */}
          <div className="divide-y divide-gray-200 text-gray-500">
            {transactions.length === 0 ? (
              <div className="text-center py-10  text-sm">
                No transactions found
              </div>
            ) : (
              transactions.map((transaction: any, idx: number) => (
                <div
                  key={transaction.id + idx}
                  className="grid grid-cols-7 text-xs items-center"
                >
                  <div className="py-2 px-4 whitespace-nowrap">
                    {transaction.id}
                  </div>
                  <div className="py-2 px-4 border-l border-gray-200 whitespace-nowrap">
                    {transaction.description}
                  </div>
                  <div className="py-2 px-4 border-l border-gray-200 whitespace-nowrap">
                    {transaction.amount}
                  </div>
                  <div className="py-2 px-4 border-l border-gray-200 whitespace-nowrap">
                    <span className="text-green-500 font-medium">
                      {transaction.status}
                    </span>

                    {/* {transaction.status === "Failed" && (
                      <span className="text-red-500 font-medium">Failed</span>
                    )} */}
                    {transaction.status === "Processing" && (
                      <span className="text-orange-500 font-medium">
                        Processing
                      </span>
                    )}
                    {transaction.status === "Pending" && (
                      <span className="text-gray-500 font-medium">Pending</span>
                    )}
                  </div>
                  <div className="py-2 px-4 border-l border-gray-200 whitespace-nowrap">
                    {transaction.balance}
                  </div>
                  <div className="py-2 px-4 border-l border-gray-200 whitespace-nowrap">
                    {AppHelper.formatTransactionDate(
                      transaction.transactionDate
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="bg-black text-xs text-white  font-semibold grid grid-cols-[1fr_5fr]">
            <div className="py-2 px-4 flex justify-start items-center ">
              Dates
            </div>
          </div>
          {/* Table Rows */}
          <div className="divide-y divide-gray-200 text-gray-500">
            {transactions.length === 0 ? (
              <div className="text-center py-10  text-sm">
                No transactions found
              </div>
            ) : (
              transactions.map((transaction: any, idx: number) => (
                <div
                  key={transaction.id + idx}
                  className="grid grid-cols-7 text-xs items-center"
                >
                  <div className="py-2 px-4 whitespace-nowrap">
                    {transaction.id}
                  </div>
                  <div className="py-2 px-4 border-l border-gray-200 whitespace-nowrap">
                    {transaction.description}
                  </div>
                  <div className="py-2 px-4 border-l border-gray-200 whitespace-nowrap">
                    {transaction.amount}
                  </div>
                  <div className="py-2 px-4 border-l border-gray-200 whitespace-nowrap">
                    <span className="text-green-500 font-medium">
                      {transaction.status}
                    </span>

                    {/* {transaction.status === "Failed" && (
                      <span className="text-red-500 font-medium">Failed</span>
                    )} */}
                    {transaction.status === "Processing" && (
                      <span className="text-orange-500 font-medium">
                        Processing
                      </span>
                    )}
                    {transaction.status === "Pending" && (
                      <span className="text-gray-500 font-medium">Pending</span>
                    )}
                  </div>
                  <div className="py-2 px-4 border-l border-gray-200 whitespace-nowrap">
                    {transaction.balance}
                  </div>
                  <div className="py-2 px-4 border-l border-gray-200 whitespace-nowrap">
                    {AppHelper.formatTransactionDate(
                      transaction.transactionDate
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FastPrintPage;
