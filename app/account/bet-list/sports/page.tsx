"use client";

import DateRangeInput from "@/components/inputs/DateRangeInput";
import Input from "@/components/inputs/Input";
import SingleSearchInput from "@/components/inputs/SingleSearchInput";
import Table from "@/components/tables/Table";
import { ACCOUNT } from "@/data/routes/routes";
import Link from "next/link";
import { useState } from "react";
import { RiRefreshLine } from "react-icons/ri";

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
  { id: "coupon", name: "Coupon" },
  {
    id: "amount",
    name: (
      <span className="flex flex-col">
        <span>Amount</span>
        <span>Total:</span>
      </span>
    ),
  },
  { id: "result", name: "Result" },
  {
    id: "winning",
    name: (
      <span className="flex flex-col">
        <span>Winning</span>
        <span>Total:</span>
      </span>
    ),
  },
  { id: "cashier", name: "Cashier" },
  { id: "date", name: "Date" },
  {
    id: "actions",
    name: "",
    render: (value: any, row: any) => (
      <Link
        href={ACCOUNT.SPORTS_BET_LIST_BY_ID.replace(":sport_id", row.coupon)}
        className="p-2 px-3 justify-self-center self-start h-8 rounded-lg bg-blue-800 border text-white flex justify-center items-center gap-2 border-blue-600 hover:bg-blue-700 transition-colors text-xs cursor-pointer"
        onClick={() => {
          // Handle view details action
        }}
      >
        <span>Rebet</span>
        <RiRefreshLine fontSize={18} />
      </Link>
    ),
  },
];

const SportsPage = () => {
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

  // Mock data for betlist sports
  const betlist = [
    {
      coupon: "SPT12345",
      amount: 150,
      result: "Win",
      winning: 300,
      cashier: "Cashier 1",
      date: "2025-12-04",
    },
    {
      coupon: "SPT12346",
      amount: 80,
      result: "Lose",
      winning: 0,
      cashier: "Cashier 2",
      date: "2025-12-03",
    },
    {
      coupon: "SPT12347",
      amount: 120,
      result: "Win",
      winning: 240,
      cashier: "Cashier 3",
      date: "2025-12-02",
    },
  ];

  // Pagination helpers for mock data
  const totalTransactions = betlist.length;
  const totalPages = Math.ceil(totalTransactions / parseInt(pageSize)) || 1;
  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;
  const nextPage = hasNextPage ? currentPage + 1 : null;
  const prevPage = hasPrevPage ? currentPage - 1 : null;

  // No API call needed for mock data

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
        <h1 className="text-xl font-bold text-gray-900 mb-2">
          Bet List Sports
        </h1>
        {/* Filters */}
        <div className="flex flex-col gap-4 mb-2">
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-2">
            <SingleSearchInput
              type="text"
              placeholder="Search coupon code"
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
              placeholder="Select Cashier"
              className="w-full  px-4 py-2 rounded bg-white border border-gray-200 text-sm focus:outline-none"
              bg_color={`bg-white`}
              border_color={`border-gray-200`}
              height="h-[36px]"
              text_color="text-gray-700 text-xs"
              name={""}
              onChange={() => {}}
            />
            <Input
              type="text"
              placeholder="Select Outcome"
              className="w-full  px-4 py-2 rounded bg-white border border-gray-200 text-sm focus:outline-none"
              bg_color={`bg-white`}
              border_color={`border-gray-200`}
              height="h-[36px]"
              text_color="text-gray-700 text-xs"
              name={""}
              onChange={() => {}}
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
        <Table
          columns={tableColumns}
          data={betlist}
          isLoading={false}
          className="grid-cols-7"
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

export default SportsPage;
