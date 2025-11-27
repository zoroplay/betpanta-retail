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
import {
  CheckCheck,
  FileText,
  ChevronLeft,
  ChevronRight,
  Receipt,
} from "lucide-react";
import { useState, useEffect } from "react";
import { FaRegStar } from "react-icons/fa";
import { FiFileText, FiPrinter } from "react-icons/fi";
import { LiaBasketballBallSolid } from "react-icons/lia";
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

const AccountsPage = () => {
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
    <div className="p-4 flex flex-col gap-2">
      <div className="flex justify-between items-center ">
        <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
        <div className="flex justify-end items-center gap-2">
          <button className="text-xs bg-blue-800 p-2 flex justify-center items-center gap-1  rounded-md px-4 text-white">
            <span>Cash Desk</span>
            <span>
              <FiFileText fontSize={16} />
            </span>
          </button>
          <button className="text-xs bg-blue-800 p-2 flex justify-center items-center gap-1  rounded-md px-4 text-white">
            <span>Print Odds</span>
            <span>
              <FiPrinter fontSize={16} />
            </span>
          </button>
          <button className="text-xs bg-blue-800 p-2 flex justify-center items-center gap-1  rounded-md px-4 text-white">
            <span>Virtual Games</span>
            <span>
              <FaRegStar fontSize={16} />
            </span>
          </button>
          <button className="text-xs bg-blue-800 p-2 flex justify-center items-center gap-1  rounded-md px-4 text-white">
            <span>BetPanta Virtual</span>
            <span>
              <LiaBasketballBallSolid fontSize={16} />
            </span>
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <BaseCard title="Check Coupon" className="p-2">
          <div className="flex justify-between items-center gap-2">
            <SingleSearchInput
              placeholder={"Enter coupon code"}
              value={""}
              // onChange={(e) => handleBookingNumberChange(e.target.value)}
              onChange={(e) => {}}
              // onClear={() => setBookingNumber("")}
              // isLoading={isFindingBet}
              // height="h-[36px]"
              onSearch={() => {}}
              searchState={{
                isValid: false,
                isNotFound: false,
                isLoading: false,
                message: "",
              }}
              className="w-full  rounded bg-white border border-gray-200 text-sm focus:outline-none"
              bg_color={`bg-white`}
              border_color={`border-gray-200`}
              height="h-[36px]"
              text_color="text-gray-700 text-xs"
            />{" "}
            <button className="text-xs bg-blue-800 p-2  rounded-md px-4 text-white">
              Check
            </button>
          </div>
        </BaseCard>
        <BaseCard title="Search Odds" className="p-2">
          <div className="flex justify-between items-center gap-2">
            <SingleSearchInput
              placeholder={"Search by category, tournament or team"}
              value={""}
              // onChange={(e) => handleBookingNumberChange(e.target.value)}
              onChange={(e) => {}}
              // onClear={() => setBookingNumber("")}
              // isLoading={isFindingBet}
              // height="h-[36px]"
              onSearch={() => {}}
              searchState={{
                isValid: false,
                isNotFound: false,
                isLoading: false,
                message: "",
              }}
              className="w-full  rounded bg-white border border-gray-200 text-sm focus:outline-none"
              bg_color={`bg-white`}
              border_color={`border-gray-200`}
              height="h-[36px]"
              text_color="text-gray-700 text-xs"
            />{" "}
            <button className="text-xs bg-blue-800 p-2  rounded-md px-4 text-white">
              Check
            </button>
          </div>
        </BaseCard>
        <BaseCard title="Account Overview" className="p-2">
          <div className="flex justify-between items-center gap-2"></div>
        </BaseCard>
        <BaseCard title="Cashiers" className="p-2">
          <div className="flex justify-between items-center gap-2"></div>
        </BaseCard>
        <BaseCard title="Recent Messages" className="p-2">
          <div className="flex justify-between items-center gap-2"></div>
        </BaseCard>
        <BaseCard title="Downloads" className="p-2">
          <div className="flex justify-between items-center gap-2"></div>
        </BaseCard>
        <div className="col-span-2">
          <BaseCard title="Recent Transactions" className="p-2">
            <div className="flex justify-between items-center gap-2"></div>
          </BaseCard>
        </div>
      </div>
    </div>
  );
};

export default AccountsPage;
