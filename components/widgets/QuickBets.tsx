"use client";
import React, { useEffect, useState } from "react";
import SingleSearchInput from "../inputs/SingleSearchInput";
import { useModal } from "@/hooks/useModal";
import { useBetting } from "@/hooks/useBetting";
import { showToast } from "../tools/toast";
import { AppHelper } from "@/lib/helper";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { PreMatchFixture } from "@/redux/features/types/fixtures.types";
import { useFetchFixturesMutation } from "@/redux/services/bets.service";
import {
  addCashDeskItem,
  setCashDeskItem,
  removeCashDeskItem,
} from "@/redux/features/slice/cashdesk.slice";
import { MODAL_COMPONENTS } from "@/redux/features/types";
import { Trash2, Grid } from "lucide-react";
import Input from "../inputs/Input";
import { Outcome } from "@/data/types/betting.types";

interface FormData {
  eventId: string;
  eventDate: string;
  event: string;
  smartCode: string;
  fixture?: PreMatchFixture;
  odds: string;
  is_edit: boolean;
}
type Props = {
  formData: FormData;
  is_empty_form: boolean;
  index: number;

  total: number;
};
const QuickBets = ({ formData: _form, total, index, is_empty_form }: Props) => {
  const [formData, setFormData] = useState<FormData>({
    eventId: _form.eventId,
    eventDate: _form.eventDate,
    event: _form.event,
    smartCode: _form.smartCode,
    odds: _form.odds || "",
    is_edit: false,
    fixture: _form.fixture,
  });
  useEffect(() => {
    setFormData({
      eventId: _form.eventId,
      eventDate: _form.eventDate,
      event: _form.event,
      smartCode: _form.smartCode,
      odds: _form.odds || "",
      is_edit: false,
      fixture: _form.fixture,
    });
  }, [_form]);
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
  const [
    getFixture,
    {
      data: fixturesData,
      isSuccess,
      isLoading: isFixtureLoading,
      error,
      isError,
    },
  ] = useFetchFixturesMutation();
  const [eventId, setEventId] = useState("");
  const { openModal } = useModal();
  const smartCodeInputRef = React.useRef<HTMLInputElement>(null);
  const eventIdInputRef = React.useRef<HTMLInputElement>(null);
  const [isFormLoading, setIsFormLoading] = useState(false);

  // Focus on Event ID input when component mounts or when form is empty
  useEffect(() => {
    if (eventIdInputRef.current && is_empty_form) {
      eventIdInputRef.current.focus();
    }
  }, [is_empty_form]);

  // Also focus when component first mounts
  useEffect(() => {
    if (eventIdInputRef.current) {
      eventIdInputRef.current.focus();
    }
  }, []);
  const handleSmartCodeChange = (text: string) => {
    const fixture = formData?.fixture;

    if (text === "") {
      const outcome = fixture?.outcomes?.find(
        (o: any) => o.displayName === formData.smartCode
      );

      removeBet({
        event_id: Number(fixture?.gameID) || 0,
        display_name: outcome?.displayName || "",
      });
    }
    // Find outcome by display name and add to quick bet entries
    if (formData.fixture && text) {
      const outcome = formData.fixture.outcomes?.find(
        (o: any) => o.displayName === text
      );

      if (outcome) {
        // Check if bet is already selected or in quick entries
        const isAlreadySelected = (selected_bets || []).some(
          (bet: any) =>
            bet.game_id === formData?.fixture?.gameID &&
            bet.game.display_name === outcome.displayName
        );

        if (!isAlreadySelected) {
          // Clear the smart code after successful addition
          console.log("Adding bet to quick entries:", outcome);
          setFormData((prev) => ({
            ...prev,
            odds: String(outcome.odds || ""),
          }));
          addBet({
            fixture_data: formData.fixture,
            outcome_data: outcome,
            element_id: formData.fixture.matchID,
            bet_type: "pre",
            global_vars: {},
            bonus_list: [],
          });
          !is_empty_form && dispatch(addCashDeskItem());

          // Remove from quick entries

          showToast({
            type: "success",
            title: "Bet Added!",
            description: `${outcome.marketName} @ ${formData.fixture?.name} added to your slip`,
          });
        } else {
          console.log("Bet already selected or in quick entries:", outcome);
          // Clear smart code and show info
          setFormData((prev) => ({
            ...prev,
            odds: String(outcome.odds || ""),
          }));

          // Show info toast
          showToast({
            type: "info",
            title: isAlreadySelected
              ? "Bet Already Selected"
              : "Already in Quick Entry",
            description: isAlreadySelected
              ? "This bet is already in your slip"
              : "This bet is already in quick entry",
          });
        }
      } else {
        // Outcome not found, clear only smart code and show error
        setFormData((prev) => ({ ...prev, smartCode: "" }));
        // Show error toast
        showToast({
          type: "error",
          title: "Invalid Outcome",
          description: `Outcome "${text}" not found`,
        });
      }
    }
    setFormData((prev) => ({ ...prev, smartCode: text }));
  };
  const fetchFixtureData = async (eventId: string) => {
    setIsFormLoading(true);
    console.log("Fetching fixture data for event ID:", eventId);
    try {
      const newQueryParams = {
        tournament_id: eventId,
        sport_id: "1",
        period: "all",
        markets: ["1", "10", "18"],
        specifier: "",
      };

      const result = await getFixture(newQueryParams);
    } catch (error) {
      console.error("Error fetching fixture:", error);
      setIsFormLoading(false);
    }
  };
  useEffect(() => {
    if (isSuccess) {
      const event_ids = selected_bets.map((bet) => bet.game_id);

      if (event_ids.includes(Number(fixturesData?.gameID))) {
        showToast({
          type: "error",
          title: "Game Already exists on Quick Entry",
          // description: "The selected fixture is not available.",
        });
        setTimeout(() => setIsFormLoading(false), 0);

        return;
      }
      setFormData((prev) => ({
        ...prev,
        eventId: fixturesData?.gameID || "",
        eventDate:
          AppHelper.convertToTimeString(new Date(fixturesData?.date)) || "",
        event: fixturesData?.name || "-",
        smartCode: "",
        fixture: fixturesData as unknown as PreMatchFixture,
        // odds: fixturesData?. || "",
      }));
      dispatch(
        setCashDeskItem({
          index,
          event_id: String(fixturesData?.gameID || ""),
          event_date:
            AppHelper.convertToTimeString(new Date(fixturesData?.date)) || "",
          event: fixturesData?.name || "-",
          smart_code: "",
          fixture: fixturesData as unknown as PreMatchFixture,
        })
      );
      setTimeout(() => setIsFormLoading(false), 0);
    }

    if (isError) {
      console.error("Error fetching fixture data:", error);
      setTimeout(() => setIsFormLoading(false), 0);
    }
  }, [isSuccess, fixturesData, isError]);
  useEffect(() => {
    if (formData.eventId && formData.event && smartCodeInputRef.current) {
      smartCodeInputRef.current.focus();
    }
  }, [formData.eventId, formData.event]);

  // Focus on smart code input when fixture is successfully loaded
  useEffect(() => {
    if (isSuccess && formData.fixture && smartCodeInputRef.current) {
      // Add a small delay to ensure the DOM has updated
      setTimeout(() => {
        smartCodeInputRef.current?.focus();
      }, 100);
    }
  }, [isSuccess, formData.fixture]);
  const handleEventIdChange = async (text: string) => {
    setFormData((prev) => ({ ...prev, eventId: text }));
    // If 4 digits entered, fetch fixture data from server
    if (text.length >= 4) {
      await fetchFixtureData(text);
    }
  };

  const handleEventIdKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && eventId.length >= 1) {
      fetchFixtureData(eventId);
    }
  };
  return (
    <>
      <div className="grid grid-cols-[repeat(17,minmax(0,1fr))] gap-2 px-2  bg-white border-b border-gray-200">
        {[
          {
            id: "down",
            name: (
              <div className="grid grid-cols-2  h-full">
                <div className="relative px-1 flex justify-center items-center ">
                  {total > 1 && (
                    <div
                      className={`relative flex justify-center items-center rounded-full h-8 w-8 bg-red-600/30 text-red-600 border border-red-600/60 bg-gray-700 hover:bg-red-600/70 hover:bg-grauy-200/20 transition cursor-pointer ${
                        !formData.eventId && !formData.fixture ? "!hidden" : ""
                      }`}
                      onClick={() => {
                        const outcome = formData?.fixture?.outcomes?.find(
                          (o: Outcome) => o.displayName === formData.smartCode
                        );
                        Promise.all([
                          removeBet({
                            event_id: Number(formData?.fixture?.gameID) || 0,
                            display_name: outcome?.displayName || "",
                          }),
                          dispatch(
                            removeCashDeskItem({
                              event_id: String(formData.eventId),
                            })
                          ),
                        ]);
                      }}
                    >
                      <Trash2 size={20} className=" mx-auto" />
                    </div>
                  )}
                </div>
                <div className="h-full border-l border-gray-300 px-1 flex justify-center text-sm items-center text-gray-600 ">
                  <span>{index + 1}.</span>
                </div>
              </div>
            ),
          },
          {
            id: "event_id",
            name: (
              <div className="relative">
                <SingleSearchInput
                  ref={eventIdInputRef}
                  value={formData.eventId}
                  onChange={(e) => {
                    // handleEventIdChange(e.target.value);
                    setEventId(e.target.value);
                  }}
                  onKeyDown={handleEventIdKeyPress}
                  // type="number"
                  tabIndex={1}
                  text_color="text-gray-700"
                  bg_color="bg-white"
                  border_color="border-gray-300"
                  className="w-full  text-xs border rounded-lg px-3 py-2  placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  placeholder="Enter 4-digit ID"
                  onSearch={(e) => {
                    handleEventIdChange(e);
                  }}
                  searchState={{
                    isValid: formData.eventId.length >= 4,
                    isNotFound: false,
                    // isNotFound: isError || !fixturesData?.gameID,
                    isLoading: isFormLoading,
                    message: "",
                  }}
                  height={"h-[32px]"}
                  error=""
                />
              </div>
            ),
          },
          {
            id: "date",
            name: (
              <>
                {" "}
                {isFormLoading ? (
                  <div className="h-full bg-slate-600 animate-pulse rounded w-full"></div>
                ) : (
                  <div className="flex justify-start items-center bg-white border border-gray-300 rounded-md px-3 py-2 h-[32px]">
                    <span className="text-gray-700 text-sm font-mono">
                      {formData.eventDate || "--:--"}
                      {/* {AppHelper.convertToTimeString(
                        new Date(formData.eventDate)
                      ) || "--:--"} */}
                    </span>
                  </div>
                )}
              </>
            ),
          },
          {
            id: "event",
            name: (
              <>
                {" "}
                {isFormLoading ? (
                  <div className="h-full bg-gray-300 animate-pulse rounded flex-1 w-full"></div>
                ) : (
                  <div className="bg-white border border-gray-300 rounded-md px-3 py-2 pb-1 min-h-[32px] flex items-center">
                    <span className="text-gray-700 text-xs font-medium truncate">
                      {formData.event || "Select an event ID first"}
                    </span>
                  </div>
                )}
              </>
            ),
          },
          {
            id: "code",
            name: (
              <>
                {" "}
                <div className="relative">
                  <Input
                    ref={smartCodeInputRef}
                    value={formData.smartCode}
                    onChange={(e) => handleSmartCodeChange(e.target.value)}
                    placeholder={
                      formData.fixture ? "Enter code" : "Set Event ID first"
                    }
                    tabIndex={2}
                    bg_color="bg-white"
                    border_color="border-gray-300"
                    className="w-full  rounded-lg px-3 py-2 text-gray-700 placeholder-gray-400 transition-all disabled:opacity-50"
                    name="smartCode"
                    disabled={!formData.fixture || isFormLoading}
                    height={"h-[32px]"}
                    text_color="text-xs text-gray-700"
                  />
                  {formData.fixture && !isFormLoading && (
                    <button
                      className="absolute right-2 top-[50%] transform -translate-y-1/2 p-1 hover:bg-slate-700 rounded transition-colors"
                      title="View available codes"
                      onClick={() => {
                        openModal({
                          modal_name: MODAL_COMPONENTS.GAME_OPTIONS,
                          ref: formData?.fixture?.gameID,
                        });
                      }}
                    >
                      <Grid className="text-slate-400" size={14} />
                    </button>
                  )}
                </div>
              </>
            ),
          },
          {
            id: "odds",
            name: (
              <div className="relative flex justify-center items-center h-8 text-gray-700 font-semibold">
                <p className="p-1 font-semibold">
                  {Number(formData.odds).toFixed(2) || "--:--"}
                </p>
              </div>
            ),
          },
          {
            id: "league",
            name: (
              <>
                {" "}
                {isFormLoading ? (
                  <div className="h-full bg-gray-300 animate-pulse rounded flex-1 w-full"></div>
                ) : (
                  <div className="bg-white border border-gray-300 rounded-md px-3 py-2 pb-1 min-h-[32px] flex items-center">
                    <span className="text-gray-700 text-xs font-medium truncate">
                      {formData?.fixture?.categoryName ||
                        "Select an event ID first"}
                    </span>
                  </div>
                )}
              </>
            ),
          },
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
            } text-slate-300 text-[11px] py-1 tracking-wide whitespace-nowrap ${
              index !== 0 ? "border-l border-gray-200 pl-1" : ""
            }`}
          >
            {item.name}
          </div>
        ))}
      </div>
      {/* Fixture Info Panel */}
      {formData.fixture && !isFormLoading && (
        <div className="p-1 px-2 bg-gradient-to-r from-blue-50 to-white border border-blue-500/20  rounded-t-none">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-gray-700 font-semibold text-xs">
                {formData.fixture.name}
              </p>
              <p className="text-slate-500 text-[11px]">
                Match ID: {formData.fixture.matchID} • Game ID:{" "}
                {formData.fixture.gameID}
              </p>
            </div>
            <div className="text-right">
              <p className="text-gray-700 text-[11px]">Available Markets</p>
              <p className="text-blue-600 font-bold text-xs">
                {formData.fixture.outcomes?.length || 0} outcomes
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default QuickBets;
