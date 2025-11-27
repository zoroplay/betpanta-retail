"use client";
import Input from "@/components/inputs/Input";
import SingleSearchInput from "@/components/inputs/SingleSearchInput";
import BaseCard from "@/components/layout/BaseCard";
import QuickBets from "@/components/widgets/QuickBets";
import { useAppDispatch, useAppSelector } from "@/hooks/useAppDispatch";
import { useBetting } from "@/hooks/useBetting";
import { addCashDeskItem } from "@/redux/features/slice/cashdesk.slice";
import { Grid } from "lucide-react";
import React from "react";

const CashDesk = () => {
  const { form_data } = useAppSelector((state) => state.cashdesk);
  const dispatch = useAppDispatch();
  const {
    selected_bets = [],
    total_odds,
    stake,
    potential_winnings,
    updateStake,
    clearBets,
    addBet,
    removeBet,
    updateBetOdds,
  } = useBetting();
  const addForm = () => {
    dispatch(addCashDeskItem());
  };
  return (
    <main className="flex flex-col lg:flex-row gap-4 p-4  relative">
      <div className="flex flex-col lg:flex-row gap-2">
        {/* Left: main content */}
        <section className="flex-1">
          {/* Event Details Form - Modern Betting Platform Design */}
          <div
            className={`bg-black text-white rounded-md shadow-lg overflow-hidden mb-1`}
          >
            {/* Header */}
            <div className={`px-4 py-3`}>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-white/20 rounded-lg flex items-center justify-center">
                    <Grid size={12} className="text-white" />
                  </div>
                  <h2 className="text-white font-bold text-sm">
                    Quick Bet Entry
                  </h2>
                </div>
                <div className="addFormflex items-center gap-2">
                  <button
                    onClick={addForm}
                    className="bg-white/20 border border-blue-400 hover:bg-white/30 text-white text-xs font-medium px-3 py-1.5 rounded-full transition"
                  >
                    Add Another
                  </button>
                </div>
              </div>
              {/* {isFormLoading && (
                <div className="flex items-center gap-2 bg-white/20 rounded-full px-3 py-1">
                  <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                  <span className="text-white text-xs">Loading...</span>
                </div>
              )} */}
            </div>

            {/* Form Content */}
            <div className="">
              <div
                className={`grid grid-cols-[repeat(17,minmax(0,1fr))] gap-2 px-2 bg-secondary border-b border-gray-800 border mb-1`}
              >
                {[
                  { id: "down", name: "" },
                  { id: "event_id", name: "Event Id" },
                  { id: "date", name: "Match Date" },
                  { id: "event", name: "Event " },
                  { id: "code", name: "Smart Code" },
                  { id: "odds", name: "Odds" },
                  { id: "league", name: "League" },
                ].map((item, index) => (
                  <div
                    key={index}
                    className={`${
                      item.id === "event" || item.id === "league"
                        ? "col-span-4"
                        : item.id === "odds" || item.id === "down"
                        ? "col-span-1"
                        : item.id === "code"
                        ? "col-span-3"
                        : "col-span-2"
                    } text-slate-300 py-2 text-[11px] font-semibold uppercase tracking-wide whitespace-nowrap  ${
                      index !== 0 ? "border-l border-gray-700 pl-1" : ""
                    }`}
                  >
                    {item.name}
                  </div>
                ))}
              </div>
              <div className="max-h-[70vh] overflow-y-auto">
                {form_data.map((_formData, index) => (
                  <QuickBets
                    key={index}
                    formData={_formData}
                    total={form_data.length}
                    index={index}
                    is_empty_form={form_data.some((fd) => !fd.eventId)}
                  />
                ))}
              </div>
            </div>
          </div>
          <div>
            <div className="p-2 rounded-t-none">
              <div className="grid grid-cols-[2fr_1fr] gap-2">
                <div className="grid grid-cols-3 gap-2">
                  {[
                    {
                      label: "Total Selections",
                      value: selected_bets.length,
                    },
                    {
                      label: "Min Bonus",
                      value: "",
                    },
                    {
                      label: "Min Win",
                      value: "",
                    },
                    {
                      label: "Total Odds",
                      value: total_odds.toFixed(2),
                    },
                    {
                      label: "Max Bonus",
                      value: "",
                    },
                    {
                      label: "Max Win",
                      value: potential_winnings.toFixed(2),
                    },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className={`p-2 text-xs flex flex-col text-gray-300 border border-gray-700/50 rounded-md bg-gradient-to-r from-gray-700 to-slate-800 flex justify-between items-start gap-2`}
                    >
                      <p>{item.label}</p>
                      <p>{item.value}</p>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col gap-2 text-gray-700">
                  <Input
                    label="Stake"
                    value={String(stake || "")}
                    onChange={(e) => {
                      const v = Number(e.target.value || 0);
                      updateStake({ stake: Number.isNaN(v) ? 0 : v });
                    }}
                    tabIndex={3}
                    bg_color="bg-white"
                    border_color="border border-slate-300"
                    text_color="text-gray-700"
                    className="w-full rounded-lg text-gray-700 placeholder-slate-400 transition-all duration-200"
                    placeholder="Enter stake amount"
                    name={""}
                    height={"h-[36px]"}
                    type="num_select"
                    num_select_placeholder={"NGN"}
                  />
                  <div className="grid grid-cols-2 gap-1">
                    <button className="p-2 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 border border-rose-500 text-white shadow-md shadow-rose-600/25 text-sm font-semibold rounded-md h-9 flex justify-center items-center ">
                      Cancel
                    </button>
                    <button className="p-2 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 border border-emerald-500 text-white shadow-lg shadow-emerald-600/25 text-sm font-semibold rounded-md h-9 flex justify-center items-center ">
                      Proceed
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Right sidebar - Betting Controls */}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-1 gap-4 min-w-[20rem]">
        <BaseCard title="Coupon Tools" className="p-2">
          <div className="grid grid-cols-3 gap-2">
            <button className="p-2 bg-gray-900 text-white text-xs rounded-md">
              Smart bet
            </button>
            <button className="p-2 bg-gray-900 text-white text-xs rounded-md">
              Quickbet
            </button>
            <button className="p-2 bg-gray-900 text-white text-xs rounded-md">
              Verify Coupon
            </button>
          </div>
          <div className="">
            <SingleSearchInput
              placeholder={"Insert Booking Number"}
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
          </div>
        </BaseCard>
        <BaseCard title="Betslip" className="p-2">
          <div className="grid grid-cols-2 gap-2">
            <button className="p-2 bg-gray-900 text-white text-xs rounded-md">
              Current Betslip
            </button>
            <button className="p-2 bg-gray-900 text-white text-xs rounded-md">
              My Bets
            </button>
          </div>
          <div className="flex justify-center items-center">
            <p className="p-2 text-black text-[11px] rounded-md">
              click on the odds or enter a code to be loaded
            </p>
          </div>
          <div className="">
            <SingleSearchInput
              placeholder={"Insert Booking Number"}
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
          </div>
        </BaseCard>
      </div>
    </main>
  );
};

export default CashDesk;
