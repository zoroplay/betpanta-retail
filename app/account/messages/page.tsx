"use client";

import DateRangeInput from "@/components/inputs/DateRangeInput";
import Input from "@/components/inputs/Input";
import SingleSearchInput from "@/components/inputs/SingleSearchInput";
import Table from "@/components/tables/Table";
import { useRouter } from "next/navigation";
import { useState } from "react";

const SportsPage = () => {
  const [amountType, setAmountType] = useState<"all" | "credits" | "debits">(
    "all"
  );
  const [transactionType, setTransactionType] = useState("");
  const [normalChecked, setNormalChecked] = useState(true);
  const [virtualBetsChecked, setVirtualBetsChecked] = useState(true);
  const router = useRouter();
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

  // Mock messages data
  const messages = [
    {
      id: "MSG001",
      description: "Welcome to the platform!",
      amount: "High",
      status: "Read",
      transactionDate: "2025-12-04",
    },
    {
      id: "MSG002",
      description: "Your account has been updated.",
      amount: "Medium",
      status: "Unread",
      transactionDate: "2025-12-03",
    },
    {
      id: "MSG003",
      description: "Maintenance scheduled for tomorrow.",
      amount: "Low",
      status: "Unread",
      transactionDate: "2025-12-02",
    },
  ];

  // Pagination helpers for mock data
  const totalMessages = messages.length;
  const totalPages = Math.ceil(totalMessages / parseInt(pageSize)) || 1;
  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;
  const nextPage = hasNextPage ? currentPage + 1 : null;
  const prevPage = hasPrevPage ? currentPage - 1 : null;

  const handleNextPage = () => {
    if (hasNextPage && nextPage) {
      setCurrentPage(nextPage);
    }
  };

  const handlePrevPage = () => {
    if (hasPrevPage && prevPage) {
      setCurrentPage(prevPage);
    }
  };

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
        <h1 className="text-xl font-bold text-gray-900 mb-2">Messages</h1>
        {/* Filters */}
        <div className="flex flex-col gap-4 mb-4">
          <div className="grid lg:grid-cols-4 grid-cols-2 gap-2">
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
        {/* Table Card - replaced with Table component */}
        <Table
          columns={[
            { id: "id", name: "Message ID" },
            { id: "description", name: "Subject" },
            { id: "amount", name: "Priority" },
            { id: "status", name: "Status" },
            { id: "transactionDate", name: "Date" },
          ]}
          data={messages}
          isLoading={false}
          className="grid-cols-5"
          onRowSelect={(sel) => {
            router.push(`/account/messages/${sel.id}`);
          }}
          pagination={{
            currentPage,
            total: totalMessages,
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
