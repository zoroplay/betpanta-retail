"use client";

import CurrencyFormatter from "@/components/inputs/CurrencyFormatter";
import DateRangeInput from "@/components/inputs/DateRangeInput";
import Input from "@/components/inputs/Input";
import SingleSearchInput from "@/components/inputs/SingleSearchInput";
import Table from "@/components/tables/Table";
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

const tableColumns = [
  { id: "transactionId", name: "Transaction ID" },
  { id: "description", name: "Description" },
  { id: "amount", name: "Amount" },
  { id: "status", name: "Status" },
  { id: "balance", name: "Balance" },
  { id: "date", name: "Date" },
];

const TransactionsPage = () => {
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
  const [fetchTransactions, { data, isFetching: isLoading }] =
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

  const getStatus = (status: number) => {
    switch (status) {
      case 1:
        return <span className="text-green-600">Successful</span>;
      case 2:
        return <span className="text-red-600">Failed</span>;
      default:
        return <span className="text-gray-600">Unknown</span>;
    }
  };

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
        userId: null,
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
        userId: null,
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
      userId: null,
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
        <h1 className="text-xl font-bold text-gray-900 mb-2">Transactions</h1>
        {/* Filters */}
        <div className="flex flex-col gap-4 mb-2">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
            <SingleSearchInput
              type="text"
              placeholder="Search by transaction ID"
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
              placeholder="Select period"
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
        <Table
          columns={[
            {
              id: "id",
              name: "Transaction ID",
              className: "col-span-2",
            },
            {
              id: "description",
              name: "Description",
              className: "col-span-3",
            },
            {
              id: "amount",
              name: "Amount",
              className: "col-span-2",
            },

            {
              id: "status",
              name: "Status",
              className: "col-span-3",
            },
            {
              id: "balance",
              name: "Balance",
              className: "col-span-2",
            },
            {
              id: "date",
              name: "Date",
              className: "col-span-3",
            },
          ]}
          className="grid-cols-[repeat(15,minmax(0,1fr))]"
          pagination={{
            total: data?.meta?.total || 0,
            perPage: parseInt(pageSize),
            onPageSizeChange: (size: number) => {
              setPageSize(String(size));
            },
            currentPage: currentPage,
            lastPage: totalPages,
            nextPage: nextPage || 0,
            prevPage: prevPage || 0,
            onPageChange: (page: number) => {
              setCurrentPage(page);
            },
          }}
          data={transactions.map((transaction) => ({
            id: transaction.id,
            date: AppHelper.formatDate(transaction.transactionDate),
            description: transaction.description,

            amount: (
              <CurrencyFormatter
                amount={transaction.amount}
                className={""}
                spanClassName={""}
              />
            ),
            status: getStatus(transaction.status),
            balance: (
              <CurrencyFormatter
                amount={transaction.balance}
                className={""}
                spanClassName={""}
              />
            ),
          }))}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default TransactionsPage;
