"use client";
import Input from "@/components/inputs/Input";
import SingleSearchInput from "@/components/inputs/SingleSearchInput";
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
    <main className="flex gap-4 p-4 relative">
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
            <div>
              <div className="p-2  bg-white rounded-lg rounded-t-none">
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
                  <div className="flex flex-col gap-2">
                    <Input
                      label=""
                      value={String(stake || "")}
                      onChange={(e) => {
                        const v = Number(e.target.value || 0);
                        updateStake({ stake: Number.isNaN(v) ? 0 : v });
                      }}
                      tabIndex={3}
                      bg_color="bg-gradient-to-r from-slate-800 to-slate-700"
                      border_color="border border-slate-600"
                      text_color="text-white"
                      className="w-full rounded-lg text-white placeholder-slate-400 transition-all duration-200"
                      placeholder="Enter stake amount"
                      name={""}
                      height={"h-[36px]"}
                      type="num_select"
                      num_select_placeholder={"NGN"}
                    />
                    <div className="grid grid-cols-2 gap-1">
                      <button className="p-2 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 border border-rose-500 text-white shadow-lg shadow-rose-600/25 text-sm font-semibold rounded-md h-9 flex justify-center items-center ">
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
          </div>

          {/* <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl border border-slate-700/50 shadow-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-white/20 rounded-lg flex items-center justify-center">
                      <Ticket size={12} className="text-white" />
                    </div>
                    <h2 className="text-white font-bold text-sm">
                      Betting Slip
                    </h2>
                    {selected_bets.length > 0 && (
                      <span className="bg-white/20 text-white text-[10px] font-semibold px-2 py-1 rounded-full">
                        {selected_bets.length} selection
                        {selected_bets.length !== 1 ? "s" : ""}
                      </span>
                    )}
                  </div>
                  <div className="text-white/80 text-xs font-medium">
                    Total Odds:{" "}
                    <span className="text-yellow-300 font-bold">
                      {selected_bets
                        .reduce(
                          (acc, bet) => acc * parseFloat(bet.game.odds || "1"),
                          1
                        )
                        .toFixed(2)}
                    </span>
                  </div>
                  <button
                    onClick={handleCancel}
                    className="bg-red-600/50 hover:bg-red-600/60 border border-red-500/50 text-red-300 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 hover:scale-105"
                  >
                    Clear All
                  </button>
                </div>
              </div>

              <div className={`${classes["bg-secondary"]} border-b ${classes.border}`}>
                <div className="grid grid-cols-[repeat(13,minmax(0,1fr))] gap-3 px-4 py-3">
                  <div className={`col-span-1 ${classes["text-secondary"]} text-xs font-semibold uppercase tracking-wider`}>
                    ID
                  </div>
                  <div className="col-span-4 text-slate-300 text-xs font-semibold uppercase tracking-wider">
                    Match
                  </div>
                  <div className="col-span-1 text-slate-300 text-xs font-semibold uppercase tracking-wider text-center">
                    Time
                  </div>
                  <div className="col-span-3 text-slate-300 text-xs font-semibold uppercase tracking-wider text-center">
                    Selection
                  </div>
                  <div className="col-span-1 text-slate-300 text-xs font-semibold uppercase tracking-wider text-center">
                    Odds
                  </div>
                  <div className="col-span-3 text-slate-300 text-xs font-semibold uppercase tracking-wider text-center">
                    Actions
                  </div>
                </div>
              </div>

              <div className="min-h-[300px]">
                {selected_bets.length === 0 ? (
                  <div className="py-16 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mb-4">
                      <Ticket size={24} className="text-slate-400" />
                    </div>
                    <h3 className="text-slate-300 text-lg font-semibold mb-2">
                      Empty Betting Slip
                    </h3>
                    <p className="text-slate-500 text-sm mb-1">
                      No selections yet
                    </p>
                    <p className="text-slate-600 text-xs max-w-sm">
                      Add games to your betting slip by entering Event ID and
                      Smart Code above
                    </p>
                  </div>
                ) : (
                  <div className="max-h-[500px] overflow-y-auto">
                    {selected_bets.map((bet, index) => (
                      <div
                        key={`${bet.game_id}-${index}`}
                        className={`group hover:${classes["bg-tertiary"]} transition-all duration-200 border-b ${classes.border} last:border-b-0`}>
                      >
                        <div className="grid grid-cols-[repeat(13,minmax(0,1fr))] gap-3 p-2 items-center">
                          <div className="col-span-1">
                            <div className="w-10 p-1 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center">
                              <span className="text-blue-400 text-xs font-bold">
                                {bet.game_id}
                              </span>
                            </div>
                          </div>

                          <div className="col-span-4">
                            <div
                              className="space-y-1"
                              title={bet.game.event_name}
                            >
                              <p className="text-white font-semibold text-xs leading-tight truncate">
                                {
                                  String(bet.game.event_name ?? "").split(
                                    "\n"
                                  )[0]
                                }
                              </p>
                              <div className="flex items-center gap-1">
                                <span className="text-xs text-slate-400 bg-slate-700/50 px-2 py-1 rounded truncate">
                                  {bet.game.market_name || "Unknown Market"}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="col-span-1 text-center h-full">
                            <div className="bg-slate-700/50 rounded-lg px-2 py-1 h-full flex items-center justify-center">
                              <span className="text-slate-300 text-base font-mono">
                                {bet.game.event_date
                                  ? AppHelper.formatMatchTime(
                                      new Date(bet.game.event_date)
                                    )
                                  : "--:--"}
                              </span>
                            </div>
                          </div>

                          <div className="col-span-3 text-center">
                            <div className="rounded-lg px-2 py-2 flex flex-col items-center">
                              <p className="text-green-300 font-bold text-xs truncate">
                                {bet.game.outcome_name}
                              </p>
                              <div className="flex items-center gap-1">
                                <span className="text-xs text-slate-400 border border-slate-600 bg-slate-700/50 px-2 py-1 rounded truncate font-bold">
                                  {bet.game.display_name || "Unknown Market"}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="col-span-1 text-center">
                            <div className=" rounded flex justify-center items-center h-10 w-10">
                              <span className="text-yellow-300 font-bold">
                                {bet.game.odds}
                              </span>
                            </div>
                          </div>

                          <div className="col-span-3">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                title="Edit Selection"
                                onClick={() => handleUpdateSelectedBet(bet)}
                                className="group/btn w-10 h-10 bg-emerald-600/40 border border-emerald-600 text-emerald-500 hover:bg-emerald-500/50 rounded-lg flex items-center justify-center transition-all duration-200  active:scale-95"
                              >
                                <Edit3
                                  size={18}
                                  className="text-emerald-500 group-hover/btn:scale-110 transition-transform"
                                />
                              </button>

                              <button
                                title="Remove Selection"
                                onClick={() => handleRemoveSelectedBet(bet)}
                                className="group/btn w-10 h-10 bg-red-600/40 border border-red-600 text-red-500 hover:bg-red-500/50 rounded-md flex items-center justify-center transition-all duration-200  active:scale-95"
                              >
                                <Trash2
                                  size={18}
                                  className="text-red-600 group-hover/btn:scale-110 transition-transform"
                                />
                              </button>
                              <button
                                className="ml-2 px-2 py-1 rounded bg-gray-700 text-white hover:bg-blue-600 transition"
                                title="Preview"
                                onClick={() => {
                                  openModal({
                                    modal_name: MODAL_COMPONENTS.GAME_OPTIONS,
                                    ref: bet.game.event_id,
                                  });
                                }}
                              >
                                &#9654;
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="px-4 pb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <div className="flex items-center gap-4 text-xs text-slate-400">
                            <span>
                              Match ID:{" "}
                              {bet.game.matchID || bet.game.match_id || "N/A"}
                            </span>
                            <span>•</span>
                            <span>
                              Market: {bet.game.market_name || "Standard"}
                            </span>
                            <span>•</span>
                            <span className="text-green-400">
                              Potential Return:{" "}
                              {(
                                parseFloat(bet.game.odds || "1") * (stake || 0)
                              ).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div> */}
        </section>

        {/* Right sidebar - Betting Controls */}
      </div>

      <div className="flex flex-col gap-4 min-w-[20rem]">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="bg-blue-600 text-white px-6 py-3 text-sm whitespace-nowrap font-semibold">
            Coupon Tools
          </div>
          <div className="p-2">
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
        </div>
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="bg-blue-600 text-white px-6 py-3 text-sm font-semibold whitespace-nowrap">
            Betslip
          </div>
          <div className="p-2">
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
        </div>
      </div>
    </main>
  );
};

export default CashDesk;
