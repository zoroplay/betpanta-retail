/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import React, { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isBefore,
  isAfter,
  parse,
  isValid,
} from "date-fns";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  ChevronDown,
  Minus,
} from "lucide-react";
import { GoDash } from "react-icons/go";
import { WebHelper } from "@/lib/helpers";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import SelectInput from "./SelectInput";
import { AppHelper } from "@/lib/helper";

interface DateRangeInputProps {
  value?: { startDate: string; endDate: string };
  onChange: (range: { startDate: string; endDate: string }) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  required?: boolean;
  bg_color?: string;
  border_color?: string;
  text_color?: string;
  accent_color?: string;
  height?: string;
}

const DateRangeInput: React.FC<DateRangeInputProps> = ({
  value,
  onChange,
  placeholder = "Select date range",
  label,
  error,
  required = false,
  bg_color = "bg-white",
  border_color = "border-gray-300",
  text_color = "text-gray-700",
  accent_color = "text-gray-500",
  height = "h-[42px]",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(
    value?.startDate ? new Date(value.startDate) : null
  );
  const [endDate, setEndDate] = useState<Date | null>(
    value?.endDate ? new Date(value.endDate) : null
  );
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [nextMonth, setNextMonth] = useState(addMonths(new Date(), 1));
  const [startDayInput, setStartDayInput] = useState("");
  const [startMonthInput, setStartMonthInput] = useState("");
  const [startYearInput, setStartYearInput] = useState("");
  const [endDayInput, setEndDayInput] = useState("");
  const [endMonthInput, setEndMonthInput] = useState("");
  const [endYearInput, setEndYearInput] = useState("");
  const calendarRef = useRef<HTMLDivElement>(null);
  const [inputValue, setInputValue] = useState("");
  const [showYearDropdown, setShowYearDropdown] = useState(false);
  const [activeCalendar, setActiveCalendar] = useState<"left" | "right" | null>(
    null
  );
  const yearDropdownRef = useRef<HTMLDivElement>(null);
  const startDayRef = useRef<HTMLInputElement>(null);
  const startMonthRef = useRef<HTMLInputElement>(null);
  const startYearRef = useRef<HTMLInputElement>(null);
  const endDayRef = useRef<HTMLInputElement>(null);
  const endMonthRef = useRef<HTMLInputElement>(null);
  const endYearRef = useRef<HTMLInputElement>(null);

  const leftSelectedYearRef = useRef<HTMLDivElement>(null);
  const rightSelectedYearRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (
      showYearDropdown &&
      activeCalendar === "left" &&
      leftSelectedYearRef.current
    ) {
      leftSelectedYearRef.current.scrollIntoView({ block: "center" });
    }
    if (
      showYearDropdown &&
      activeCalendar === "right" &&
      rightSelectedYearRef.current
    ) {
      rightSelectedYearRef.current.scrollIntoView({ block: "center" });
    }
  }, [showYearDropdown, activeCalendar, startDate, endDate]);

  const handleDateSelect = (date: Date) => {
    if (!startDate || (startDate && endDate)) {
      setStartDate(date);
      setEndDate(null);
      setStartDayInput(format(date, "dd"));
      setStartMonthInput(format(date, "MM"));
      setStartYearInput(format(date, "yyyy"));
      setEndDayInput("");
      setEndMonthInput("");
      setEndYearInput("");
    } else if (isBefore(date, startDate)) {
      setStartDate(date);
      setEndDate(null);
      setStartDayInput(format(date, "dd"));
      setStartMonthInput(format(date, "MM"));
      setStartYearInput(format(date, "yyyy"));
      setEndDayInput("");
      setEndMonthInput("");
      setEndYearInput("");
    } else {
      setEndDate(date);
      setEndDayInput(format(date, "dd"));
      setEndMonthInput(format(date, "MM"));
      setEndYearInput(format(date, "yyyy"));
      onChange({
        startDate: format(startDate, "yyyy-MM-dd"),
        endDate: format(date, "yyyy-MM-dd"),
      });
    }
  };

  const handleStartDayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");

    if (value === "") {
      setStartDayInput("");
      return;
    }

    if (value.length <= 2) {
      const day = parseInt(value);
      const month = parseInt(startMonthInput) - 1;
      const year = parseInt(startYearInput);

      if (startMonthInput.length === 2 && startYearInput.length === 4) {
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        if (day > daysInMonth) {
          setStartDayInput("00");
          return;
        }
      }

      if (day >= 1 && day <= 31) {
        setStartDayInput(value);
        if (value.length === 2) {
          startMonthRef.current?.focus();
        }
      }
    }
  };

  const handleStartMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");

    if (value === "") {
      setStartMonthInput("");
      return;
    }

    if (value.length === 1) {
      const num = parseInt(value);

      if (startMonthInput === "01") {
        if (num === 2) {
          setStartMonthInput("12");
        } else if (num >= 3 && num <= 9) {
          setStartMonthInput(`0${num}`);
        }
        startYearRef.current?.focus();
        return;
      }

      if (num === 0) {
        setStartMonthInput("0");
      } else if (num === 1) {
        setStartMonthInput("1");
      } else if (num >= 2 && num <= 9) {
        setStartMonthInput(`0${num}`);
        startYearRef.current?.focus();
      }
      return;
    }

    if (value.length === 2) {
      const num = parseInt(value);

      if (startMonthInput === "01") {
        if (value === "12") {
          setStartMonthInput("12");
        } else if (num >= 3 && num <= 9) {
          setStartMonthInput(`0${value[1]}`);
        }
        startYearRef.current?.focus();
        return;
      }

      if (num >= 1 && num <= 12) {
        setStartMonthInput(value.padStart(2, "0"));
      } else {
        setStartMonthInput(startMonthInput);
      }

      if (startDayInput.length === 2 && startYearInput.length === 4) {
        const day = parseInt(startDayInput);
        const year = parseInt(startYearInput);
        const month = parseInt(startMonthInput);
        const daysInMonth = new Date(year, month, 0).getDate();

        if (day > daysInMonth) {
          setStartDayInput("00");
        }
      }

      startYearRef.current?.focus();
    }
  };

  const handleStartYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");

    if (value === "") {
      setStartYearInput("");
      return;
    }

    if (value.length <= 4) {
      if (value.length === 4 && startYearInput.length === 4) {
        const newValue = startYearInput.slice(1) + value[3];
        setStartYearInput(newValue);

        if (startDayInput.length === 2 && startMonthInput.length === 2) {
          const day = parseInt(startDayInput);
          const month = parseInt(startMonthInput);
          const year = parseInt(newValue);
          const daysInMonth = new Date(year, month, 0).getDate();

          if (day > daysInMonth) {
            setStartDayInput("00");
          }
        }
      } else {
        setStartYearInput(value);

        if (
          startDayInput.length === 2 &&
          startMonthInput.length === 2 &&
          value.length === 4
        ) {
          const day = parseInt(startDayInput);
          const month = parseInt(startMonthInput);
          const year = parseInt(value);
          const daysInMonth = new Date(year, month, 0).getDate();

          if (day > daysInMonth) {
            setStartDayInput("00");
          }
        }
      }

      if (
        startDayInput.length === 2 &&
        startMonthInput.length === 2 &&
        value.length === 4
      ) {
        const day = parseInt(startDayInput);
        const month = parseInt(startMonthInput) - 1;
        const year = parseInt(value);
        const newDate = new Date(year, month, day);
        if (isValid(newDate)) {
          setStartDate(newDate);
          if (endDate && isBefore(endDate, newDate)) {
            setEndDate(null);
            setEndDayInput("");
            setEndMonthInput("");
            setEndYearInput("");
            onChange({
              startDate: format(newDate, "yyyy-MM-dd"),
              endDate: "",
            });
          } else {
            onChange({
              startDate: format(newDate, "yyyy-MM-dd"),
              endDate: endDate ? format(endDate, "yyyy-MM-dd") : "",
            });
          }
        }
      }
    }
  };

  const handleEndDayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");

    if (value === "") {
      setEndDayInput("");
      return;
    }

    if (value.length <= 2) {
      const day = parseInt(value);
      const month = parseInt(endMonthInput) - 1;
      const year = parseInt(endYearInput);

      if (endMonthInput.length === 2 && endYearInput.length === 4) {
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        if (day > daysInMonth) {
          setEndDayInput("00");
          return;
        }
      }

      if (day >= 1 && day <= 31) {
        setEndDayInput(value);
        if (value.length === 2) {
          endMonthRef.current?.focus();
        }
      }
    }
  };

  const handleEndMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");

    if (value === "") {
      setEndMonthInput("");
      return;
    }

    if (value.length === 1) {
      const num = parseInt(value);

      if (endMonthInput === "01") {
        if (num === 2) {
          setEndMonthInput("12");
        } else if (num >= 3 && num <= 9) {
          setEndMonthInput(`0${num}`);
        }
        endYearRef.current?.focus();
        return;
      }

      if (num === 0) {
        setEndMonthInput("0");
      } else if (num === 1) {
        setEndMonthInput("1");
      } else if (num >= 2 && num <= 9) {
        setEndMonthInput(`0${num}`);
        endYearRef.current?.focus();
      }
      return;
    }

    if (value.length === 2) {
      const num = parseInt(value);

      if (endMonthInput === "01") {
        if (value === "12") {
          setEndMonthInput("12");
        } else if (num >= 3 && num <= 9) {
          setEndMonthInput(`0${value[1]}`);
        }
        endYearRef.current?.focus();
        return;
      }

      if (num >= 1 && num <= 12) {
        setEndMonthInput(value.padStart(2, "0"));
      } else {
        setEndMonthInput(endMonthInput);
      }

      if (endDayInput.length === 2 && endYearInput.length === 4) {
        const day = parseInt(endDayInput);
        const year = parseInt(endYearInput);
        const month = parseInt(endMonthInput);
        const daysInMonth = new Date(year, month, 0).getDate();

        if (day > daysInMonth) {
          setEndDayInput("00");
        }
      }

      endYearRef.current?.focus();
    }
  };

  const handleEndYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");

    if (value === "") {
      setEndYearInput("");
      return;
    }

    if (value.length <= 4) {
      if (value.length === 4 && endYearInput.length === 4) {
        const newValue = endYearInput.slice(1) + value[3];
        setEndYearInput(newValue);

        if (endDayInput.length === 2 && endMonthInput.length === 2) {
          const day = parseInt(endDayInput);
          const month = parseInt(endMonthInput);
          const year = parseInt(newValue);
          const daysInMonth = new Date(year, month, 0).getDate();

          if (day > daysInMonth) {
            setEndDayInput("00");
          }
        }
      } else {
        setEndYearInput(value);

        if (
          endDayInput.length === 2 &&
          endMonthInput.length === 2 &&
          value.length === 4
        ) {
          const day = parseInt(endDayInput);
          const month = parseInt(endMonthInput);
          const year = parseInt(value);
          const daysInMonth = new Date(year, month, 0).getDate();

          if (day > daysInMonth) {
            setEndDayInput("00");
          }
        }
      }

      if (
        endDayInput.length === 2 &&
        endMonthInput.length === 2 &&
        value.length === 4
      ) {
        const day = parseInt(endDayInput);
        const month = parseInt(endMonthInput) - 1;
        const year = parseInt(value);
        const newDate = new Date(year, month, day);
        if (isValid(newDate)) {
          if (startDate && isAfter(newDate, startDate)) {
            setEndDate(newDate);
            onChange({
              startDate: format(startDate, "yyyy-MM-dd"),
              endDate: format(newDate, "yyyy-MM-dd"),
            });
          } else {
            setEndDate(null);
            setEndDayInput("");
            setEndMonthInput("");
            setEndYearInput("");
            onChange({
              startDate: startDate ? format(startDate, "yyyy-MM-dd") : "",
              endDate: "",
            });
          }
        }
      }
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    type: "day" | "month" | "year",
    isStart: boolean
  ) => {
    if (e.key === "Backspace") {
      if (
        type === "month" &&
        (isStart ? startMonthInput : endMonthInput) === ""
      ) {
        (isStart ? startDayRef : endDayRef).current?.focus();
      } else if (
        type === "year" &&
        (isStart ? startYearInput : endYearInput) === ""
      ) {
        (isStart ? startMonthRef : endMonthRef).current?.focus();
      }
    }
  };

  // Update input values when dates change from calendar
  useEffect(() => {
    if (startDate) {
      setStartDayInput(format(startDate, "dd"));
      setStartMonthInput(format(startDate, "MM"));
      setStartYearInput(format(startDate, "yyyy"));
    } else {
      setStartDayInput("");
      setStartMonthInput("");
      setStartYearInput("");
    }
    if (endDate) {
      setEndDayInput(format(endDate, "dd"));
      setEndMonthInput(format(endDate, "MM"));
      setEndYearInput(format(endDate, "yyyy"));
    } else {
      setEndDayInput("");
      setEndMonthInput("");
      setEndYearInput("");
    }
  }, [startDate, endDate]);

  // Update calendar months when dates change
  useEffect(() => {
    if (startDate) {
      setCurrentMonth(startDate);
      if (endDate) {
        // If end date is in the same month as start date, show next month
        if (isSameMonth(startDate, endDate)) {
          setNextMonth(addMonths(startDate, 1));
        } else {
          setNextMonth(endDate);
        }
      } else {
        setNextMonth(addMonths(startDate, 1));
      }
    } else if (endDate) {
      // If only end date is set, show previous month and end date's month
      setCurrentMonth(subMonths(endDate, 1));
      setNextMonth(endDate);
    } else {
      // If no dates are set, show current month and next month
      setCurrentMonth(new Date());
      setNextMonth(addMonths(new Date(), 1));
    }
  }, [startDate, endDate]);

  const navigateMonth = (
    direction: "prev" | "next",
    calendar: "left" | "right"
  ) => {
    if (calendar === "left") {
      setCurrentMonth(
        direction === "prev"
          ? subMonths(currentMonth, 1)
          : addMonths(currentMonth, 1)
      );
    } else {
      setNextMonth(
        direction === "prev" ? subMonths(nextMonth, 1) : addMonths(nextMonth, 1)
      );
    }
  };

  // Generate years for dropdown (from 1990 to current year + 10)
  const generateYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = 1990; i <= currentYear + 10; i++) {
      years.push(i);
    }
    return years;
  };

  // Handle year selection from dropdown
  const handleYearSelect = (year: number, calendar: "left" | "right") => {
    const currentDate = calendar === "left" ? currentMonth : nextMonth;
    const newDate = new Date(year, currentDate.getMonth(), 1);

    if (calendar === "left") {
      setCurrentMonth(newDate);
    } else {
      setNextMonth(newDate);
    }

    setShowYearDropdown(false);
    setActiveCalendar(null);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        yearDropdownRef.current &&
        !yearDropdownRef.current.contains(event.target as Node)
      ) {
        setShowYearDropdown(false);
        setActiveCalendar(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const renderCalendar = (month: Date, isLeft: boolean) => {
    const days = eachDayOfInterval({
      start: startOfMonth(month),
      end: endOfMonth(month),
    });

    const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    // Get the first day of the month and its day of week (0-6, where 0 is Sunday)
    const firstDayOfMonth = startOfMonth(month);
    const firstDayOfWeek = firstDayOfMonth.getDay();

    // Create an array of padding days (empty cells) for the first week
    const paddingDays = Array(firstDayOfWeek).fill(null);

    return (
      <div
        className={`w-1/2 p-6 ${bg_color} ${
          isLeft ? `border-r ${border_color}` : ""
        }`}
      >
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigateMonth("prev", isLeft ? "left" : "right")}
            className={`p-2 ${
              AppHelper.isDarkColor(bg_color)
                ? "hover:bg-gray-100"
                : "hover:bg-gray-400"
            } rounded-full cursor-pointer`}
          >
            <ChevronLeft size={24} className={`${accent_color}`} />
          </button>
          <div className="relative">
            <div
              className={`flex items-center gap-2 cursor-pointer  ${cn(
                `hover:${border_color}/20`
              )} ${text_color} px-2 py-1 rounded`}
              onClick={() => {
                setShowYearDropdown(true);
                setActiveCalendar(isLeft ? "left" : "right");
              }}
            >
              <span className="font-semibold text-base">
                {format(month, "MMMM")}
              </span>
              <span className="font-semibold text-base">
                {format(month, "yyyy")}
              </span>
              <ChevronDown size={16} className={`${accent_color}`} />
            </div>
            {showYearDropdown &&
              activeCalendar === (isLeft ? "left" : "right") && (
                <>
                  <div
                    className={`absolute z-20 mt-1 ${bg_color} border p-1 ${
                      AppHelper.isDarkColor(bg_color)
                        ? "border-[#7b7c80]/30"
                        : "border-gray-200"
                    }  rounded-lg shadow-lg max-h-[240px] w-[120px] overflow-y-auto`}
                    ref={yearDropdownRef}
                  >
                    {generateYears().map((year) => {
                      const selectedYear = isLeft
                        ? currentMonth?.getFullYear()
                        : nextMonth?.getFullYear();
                      const isSelected = year === selectedYear;

                      // Only assign the ref to the selected year
                      return (
                        <div
                          key={year}
                          ref={
                            isSelected
                              ? isLeft
                                ? leftSelectedYearRef
                                : rightSelectedYearRef
                              : undefined
                          }
                          className={`px-4 py-3 cursor-pointer font-semibold rounded-sm text-center text-xs ${
                            isSelected
                              ? "bg-blue-600 text-white"
                              : AppHelper.isDarkColor(bg_color)
                              ? "hover:bg-gray-600/30 text-gray-300"
                              : "hover:bg-gray-400 text-gray-700"
                          }`}
                          onClick={() =>
                            handleYearSelect(year, isLeft ? "left" : "right")
                          }
                        >
                          {year}
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
          </div>
          <button
            onClick={() => navigateMonth("next", isLeft ? "left" : "right")}
            className={`p-2 ${
              AppHelper.isDarkColor(bg_color)
                ? "hover:bg-gray-100"
                : "hover:bg-gray-400"
            }  rounded-full cursor-pointer ${accent_color}`}
          >
            <ChevronRight size={24} />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-2 mb-4">
          {weekDays.map((day) => (
            <div
              key={day}
              className={`text-center text-xs font-medium ${accent_color} py-2`}
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {/* Render padding days */}
          {paddingDays.map((_, index) => (
            <div
              key={`padding-${index}`}
              className="p-3 h-10 w-10 min-w-10 flex items-center justify-center rounded-full text-xs"
            />
          ))}
          {/* Render actual days */}
          {days.map((day) => {
            const isInRange =
              startDate &&
              endDate &&
              isAfter(day, startDate) &&
              isBefore(day, endDate);
            const isStart = startDate && isSameDay(day, startDate);
            const isEnd = endDate && isSameDay(day, endDate);

            return (
              <button
                key={day.toString()}
                onClick={() => handleDateSelect(day)}
                className={`p-3 h-10 w-10 min-w-10 flex items-center justify-center rounded-full text-xs cursor-pointer ${
                  !isSameMonth(day, month)
                    ? "text-gray-300"
                    : isInRange
                    ? `${
                        AppHelper.isDarkColor(bg_color)
                          ? "bg-gradient-to-br from-blue-500/50 to-blue-700/50 text-gray-300"
                          : "bg-gradient-to-br from-blue-500/80 to-blue-700/80 text-gray-200 font-semibold"
                      }`
                    : isStart || isEnd
                    ? "bg-gradient-to-br from-blue-500 to-blue-700 text-gray-300 hover:bg-gradient-to-br hover:from-blue-600 hover:to-blue-800 font-semibold"
                    : `${
                        AppHelper.isDarkColor(bg_color)
                          ? "hover:bg-gray-100/30 text-gray-300"
                          : "hover:bg-gray-400"
                      }`
                }`}
              >
                {format(day, "d")}
              </button>
            );
          })}
        </div>
      </div>
    );
  };
  const getBorderColor = () => {
    if (error) return "border-[#ff6347]"; // tomato
    if (isFocused) return border_color; // use the same color as border
    return border_color; // gray-200
  };
  return (
    <div className="relative w-full gap-0.5 flex flex-col">
      {label && (
        <label className="block text-[11px] font-semibold text-inherit">
          {label}
          {required && <span className="text-red-500"> *</span>}
        </label>
      )}

      <div
        className={`w-full ${bg_color} text-[13px] ${height} border rounded-md focus-within:ring-2 ${getBorderColor()} flex items-center justify-between pl-1 transition-all duration-200 ${
          isFocused
            ? `ring-2 ring-[${border_color.replace("border-", "")}]`
            : ""
        }`}
      >
        <div className="flex items-center justify-between w-[16rem]">
          <div className="flex items-center gap-1">
            <input
              ref={startDayRef}
              type="text"
              value={startDayInput}
              onChange={handleStartDayChange}
              onKeyDown={(e) => handleKeyDown(e, "day", true)}
              placeholder="DD"
              className="w-8 h-8 py-2 text-center outline-none bg-transparent"
              maxLength={2}
              onFocus={() => setIsFocused(true)}
            />
            <span className={`${accent_color}`}>/</span>
            <input
              ref={startMonthRef}
              type="text"
              value={startMonthInput}
              onChange={handleStartMonthChange}
              onKeyDown={(e) => handleKeyDown(e, "month", true)}
              placeholder="MM"
              className="w-8 h-8 py-2 text-center outline-none bg-transparent"
              maxLength={2}
              onFocus={() => setIsFocused(true)}
            />
            <span className={`${accent_color}`}>/</span>
            <input
              ref={startYearRef}
              type="text"
              value={startYearInput}
              onChange={handleStartYearChange}
              onKeyDown={(e) => handleKeyDown(e, "year", true)}
              placeholder="YYYY"
              className="w-12 h-8 py-2 text-center outline-none bg-transparent"
              maxLength={4}
              onFocus={() => setIsFocused(true)}
            />
          </div>
          <span className={`${accent_color}`}>
            <Minus size={20} />
          </span>
          <div className="flex items-center gap-1">
            <input
              ref={endDayRef}
              type="text"
              value={endDayInput}
              onChange={handleEndDayChange}
              onKeyDown={(e) => handleKeyDown(e, "day", false)}
              placeholder="DD"
              className="w-8 h-8 py-2 text-center outline-none bg-transparent"
              maxLength={2}
              onFocus={() => setIsFocused(true)}
            />
            <span className={`${accent_color}`}>/</span>
            <input
              ref={endMonthRef}
              type="text"
              value={endMonthInput}
              onChange={handleEndMonthChange}
              onKeyDown={(e) => handleKeyDown(e, "month", false)}
              placeholder="MM"
              className="w-8 h-8 py-2 text-center outline-none bg-transparent"
              maxLength={2}
              onFocus={() => setIsFocused(true)}
            />
            <span className={`${accent_color}`}>/</span>
            <input
              ref={endYearRef}
              type="text"
              value={endYearInput}
              onChange={handleEndYearChange}
              onKeyDown={(e) => handleKeyDown(e, "year", false)}
              placeholder="YYYY"
              className="w-12 h-8 py-2 text-center outline-none bg-transparent"
              maxLength={4}
              onFocus={() => setIsFocused(true)}
            />
          </div>
        </div>
        <div
          onClick={() => setIsOpen(true)}
          className={`w-12 min-w-[2rem] cursor-pointer ${
            AppHelper.isDarkColor(bg_color)
              ? isOpen
                ? "bg-black/50 hover:bg-gray-100"
                : `hover:bg-gray-200 ${bg_color}`
              : isOpen
              ? "bg-white/50 hover:bg-gray-100"
              : `hover:bg-gray-200 ${bg_color}`
          } h-full flex justify-center items-center p-3  rounded-r-lg`}
        >
          <Calendar size={20} />
        </div>
      </div>

      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}

      {isOpen &&
        typeof window !== "undefined" &&
        ReactDOM.createPortal(
          <>
            {/* Modal-like backdrop */}
            <div
              className="fixed inset-0 backdrop-blur-[2px] z-[1908888] flex justify-center items-center bg-black/20"
              onClick={() => setIsOpen(false)}
            ></div>
            {/* Calendar popup */}
            <div
              className="z-[1909999] rounded-lg flex justify-center items-center fixed"
              style={{
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 700,
                transition: "opacity 0.2s, transform 0.2s",
                opacity: 1,
              }}
            >
              <motion.div
                ref={calendarRef}
                key={"calendar"}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ delay: 0.25, ease: "easeOut", duration: 0.25 }}
                className={`rounded-lg shadow-lg overflow-hidden border ${
                  AppHelper.isDarkColor(bg_color) ? "bg-black/90  " : bg_color
                } backdrop-blur-[8px] border w-[700px] ${border_color}`}
              >
                <div className="flex ">
                  {renderCalendar(currentMonth, true)}
                  {renderCalendar(nextMonth, false)}
                </div>
              </motion.div>
            </div>
          </>,
          document.body
        )}
    </div>
  );
};

export default DateRangeInput;
