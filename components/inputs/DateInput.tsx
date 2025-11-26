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
  parse,
  isValid,
  getYear,
  isToday,
} from "date-fns";
import { ChevronLeft, ChevronRight, Calendar, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import SelectInput from "./SelectInput";
import { WebHelper } from "@/lib/helpers";
import { motion } from "framer-motion";

interface DateInputProps {
  value?: Date;
  onChange: ({ target }: { target: { value: string; name: string } }) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  required?: boolean;
  relative?: boolean;
  show_popup?: boolean;
  bg_color?: string;
  optional_label?: React.ReactElement;
  bottom_label?: React.ReactElement;
  name?: string;
  border_color?: string;
  text_color?: string;
  accent_color?: string;
  popup_position?: string;
  height?: string;
  isLoading?: boolean;
}

const DateInput: React.FC<DateInputProps> = (props) => {
  const {
    value,
    onChange,
    placeholder = "Select date",
    label,
    error,
    required = false,
    relative = false,
    show_popup = true,
    optional_label,
    bottom_label,
    name,
    bg_color = "bg-white",
    border_color = "border-gray-300",
    text_color = "text-gray-700",
    accent_color = "text-gray-500",
    popup_position = "inset-x-12 bottom-8",
    height = "h-[38px]",
    isLoading = false,
  } = props;
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    value ? new Date(value) : null
  );
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [dayInput, setDayInput] = useState("");
  const [monthInput, setMonthInput] = useState("");
  const [yearInput, setYearInput] = useState("");
  const [showYearDropdown, setShowYearDropdown] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);
  const yearDropdownRef = useRef<HTMLDivElement>(null);
  const dayRef = useRef<HTMLInputElement>(null);
  const monthRef = useRef<HTMLInputElement>(null);
  const yearRef = useRef<HTMLInputElement>(null);
  const selectedYearRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (value) {
      setSelectedDate(new Date(value));
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
      if (
        yearDropdownRef.current &&
        !yearDropdownRef.current.contains(event.target as Node)
      ) {
        setShowYearDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (showYearDropdown && selectedYearRef.current) {
      selectedYearRef.current.scrollIntoView({ block: "center" });
    }
  }, [showYearDropdown]);

  // Generate years for dropdown (from 1990 to current year + 10)
  const generateYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = 1990; i <= currentYear + 10; i++) {
      years.push(i);
    }
    return years;
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setDayInput(format(date, "dd"));
    setMonthInput(format(date, "MM"));
    setYearInput(format(date, "yyyy"));
    onChange({
      target: { value: format(date, "yyyy-MM-dd"), name: name ?? "" },
    });
  };

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentMonth(
      direction === "prev"
        ? subMonths(currentMonth, 1)
        : addMonths(currentMonth, 1)
    );
  };

  const handleDayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");

    if (value === "") {
      setDayInput("");
      return;
    }

    if (value.length <= 2) {
      const day = parseInt(value);
      const month = parseInt(monthInput) - 1; // JavaScript months are 0-based
      const year = parseInt(yearInput);

      // If we have a complete month and year, validate against actual days in that month
      if (monthInput.length === 2 && yearInput.length === 4) {
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        if (day > daysInMonth) {
          setDayInput("00");
          return;
        }
      }

      // Basic validation (1-31)
      if (day >= 1 && day <= 31) {
        setDayInput(value);
        if (value.length === 2) {
          monthRef.current?.focus();
        }
      }
    }
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");

    // Allow complete deletion
    if (value === "") {
      setMonthInput("");
      return;
    }

    // Handle single digit input (new input or replacement)
    if (value.length === 1) {
      const num = parseInt(value);

      // If current input is "01" and we get a new digit
      if (monthInput === "01") {
        if (num === 2) {
          setMonthInput("12"); // Special case: becomes "12"
        } else if (num >= 3 && num <= 9) {
          setMonthInput(`0${num}`); // Becomes "03"-"09"
        }
        yearRef.current?.focus();
        return;
      }

      // Normal single digit handling
      if (num === 0) {
        setMonthInput("0");
      } else if (num === 1) {
        setMonthInput("1");
      } else if (num >= 2 && num <= 9) {
        setMonthInput(`0${num}`);
        yearRef.current?.focus();
      }
      return;
    }

    // Handle two-digit input
    if (value.length === 2) {
      const num = parseInt(value);

      // Replacement cases when we have existing "01"
      if (monthInput === "01") {
        if (value === "12") {
          setMonthInput("12"); // Direct input of "12"
        } else if (num >= 3 && num <= 9) {
          setMonthInput(`0${value[1]}`); // Take second digit with leading zero
        }
        yearRef.current?.focus();
        return;
      }

      // Normal two-digit handling
      if (num >= 1 && num <= 12) {
        setMonthInput(value.padStart(2, "0"));
      } else {
        // If invalid month, keep previous value
        setMonthInput(monthInput);
      }

      // Validate day against month
      if (dayInput.length === 2 && yearInput.length === 4) {
        const day = parseInt(dayInput);
        const year = parseInt(yearInput);
        const month = parseInt(monthInput);
        const daysInMonth = new Date(year, month, 0).getDate();

        if (day > daysInMonth) {
          setDayInput("00");
        }
      }

      yearRef.current?.focus();
    }
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");

    if (value === "") {
      setYearInput("");
      return;
    }

    if (value.length <= 4) {
      // For replacement input, when we have a complete value and add a new digit
      if (value.length === 4 && yearInput.length === 4) {
        // Take the last three digits of current input and new digit
        const newValue = yearInput.slice(1) + value[3];
        setYearInput(newValue);

        // If we have a complete day and month, validate the day against the new year
        if (dayInput.length === 2 && monthInput.length === 2) {
          const day = parseInt(dayInput);
          const month = parseInt(monthInput);
          const year = parseInt(newValue);
          const daysInMonth = new Date(year, month, 0).getDate();

          if (day > daysInMonth) {
            setDayInput("00");
          }
        }
      } else {
        // For normal input (first digits or partial)
        setYearInput(value);

        // If we have a complete day and month, validate the day against the new year
        if (
          dayInput.length === 2 &&
          monthInput.length === 2 &&
          value.length === 4
        ) {
          const day = parseInt(dayInput);
          const month = parseInt(monthInput);
          const year = parseInt(value);
          const daysInMonth = new Date(year, month, 0).getDate();

          if (day > daysInMonth) {
            setDayInput("00");
          }
        }
      }

      // Update calendar view if we have a complete date
      if (
        dayInput.length === 2 &&
        monthInput.length === 2 &&
        value.length === 4
      ) {
        const day = parseInt(dayInput);
        const month = parseInt(monthInput) - 1;
        const year = parseInt(value);
        const newDate = new Date(year, month, day);
        if (isValid(newDate)) {
          setCurrentMonth(newDate);
        }
      }
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    type: "day" | "month" | "year"
  ) => {
    if (e.key === "Backspace") {
      if (type === "month" && monthInput === "") {
        dayRef.current?.focus();
      } else if (type === "year" && yearInput === "") {
        monthRef.current?.focus();
      }
    }
  };

  // Update the date and calendar when any input changes
  useEffect(() => {
    if (
      dayInput.length === 2 &&
      monthInput.length === 2 &&
      yearInput.length === 4
    ) {
      const day = parseInt(dayInput);
      const month = parseInt(monthInput) - 1; // JavaScript months are 0-based
      const year = parseInt(yearInput);

      // Validate day against actual days in the month
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      if (day > daysInMonth) {
        setDayInput("00");
        return;
      }

      const newDate = new Date(year, month, day);
      if (isValid(newDate)) {
        if (!selectedDate || !isSameDay(newDate, selectedDate)) {
          setSelectedDate(newDate);
          setCurrentMonth(newDate);
          onChange({
            target: {
              value: format(newDate, "yyyy-MM-dd"),
              name: name ?? "",
            },
          });
        }
      }
    }
  }, [dayInput, monthInput, yearInput, onChange]);

  // Update input values when selected date changes from calendar
  useEffect(() => {
    if (selectedDate) {
      setDayInput(format(selectedDate, "dd"));
      setMonthInput(format(selectedDate, "MM"));
      setYearInput(format(selectedDate, "yyyy"));
      setCurrentMonth(selectedDate); // Update calendar view
    } else {
      setDayInput("");
      setMonthInput("");
      setYearInput("");
    }
  }, [selectedDate]);

  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Get the first day of the month and its day of week (0-6, where 0 is Sunday)
  const firstDayOfMonth = startOfMonth(currentMonth);
  const firstDayOfWeek = firstDayOfMonth.getDay();

  // Create an array of padding days (empty cells) for the first week
  const paddingDays = Array(firstDayOfWeek).fill(null);
  const getBorderColor = () => {
    if (error) return "border-[#ff6347]"; // tomato
    if (isFocused) return border_color; // use the same color as border
    return border_color; // gray-200
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-0.5 w-full">
        {label && (
          <div className="flex justify-between items-center gap-4">
            <label
              className={`text-[11px] font-semibold text-inherit`}
              htmlFor=""
            >
              {label} {required && <span className="text-red-500">*</span>}
            </label>
          </div>
        )}
        <div
          className={`w-full ${bg_color} ${height} border rounded-lg focus:outline-none focus:ring-2 ${getBorderColor()} flex items-center justify-between pl-2 transition-all duration-200 bg-gray-200 animate-pulse`}
        >
          {/* Skeleton placeholder for loading */}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`w-full flex flex-col gap-0.5 ${relative ? "relative" : ""}`}
    >
      {label && (
        <label
          className={`block text-[11px] font-semibold tracking-wide  mb-1`}
        >
          {label}
          {required && <span className="text-red-500"> *</span>}
        </label>
      )}

      <div
        className={`w-full ${bg_color} ${height} border rounded-md focus:outline-none focus:ring-2 ${getBorderColor()} flex items-center justify-between pl-2 transition-all duration-200 ${
          isFocused
            ? `ring-2 ring-[${border_color.replace("border-", "")}]`
            : ""
        }`}
        onClick={() => {
          setIsFocused(true);
          dayRef.current?.focus();
        }}
        onBlur={(e) => {
          // Only set isFocused to false if the related target is not within our container
          if (!e.currentTarget.contains(e.relatedTarget as Node)) {
            setIsFocused(false);
          }
        }}
        tabIndex={-1}
      >
        <div className="flex items-center gap-1 overflow-hidden">
          <input
            ref={dayRef}
            type="text"
            value={dayInput}
            onChange={handleDayChange}
            onKeyDown={(e) => handleKeyDown(e, "day")}
            placeholder="DD"
            className={`${text_color} w-6 h-6 py-2 text-center outline-none text-xs bg-transparent`}
            maxLength={2}
            onFocus={() => setIsFocused(true)}
          />
          <span className={`${accent_color}`}>/</span>
          <input
            ref={monthRef}
            type="text"
            value={monthInput}
            onChange={handleMonthChange}
            onKeyDown={(e) => handleKeyDown(e, "month")}
            placeholder="MM"
            className={`${text_color} w-6 h-6 py-2 text-center outline-none text-xs bg-transparent`}
            maxLength={2}
            onFocus={() => setIsFocused(true)}
          />
          <span className={`${accent_color}`}>/</span>
          <input
            ref={yearRef}
            type="text"
            value={yearInput}
            onChange={handleYearChange}
            onKeyDown={(e) => handleKeyDown(e, "year")}
            placeholder="YYYY"
            className={`${text_color} w-10 h-6 py-2 text-center outline-none text-xs bg-transparent`}
            maxLength={4}
            onFocus={() => setIsFocused(true)}
          />
        </div>
        <div
          onClick={() => show_popup && setIsOpen(true)}
          className={`w-10 min-w-[2rem] cursor-pointer h-full flex justify-center items-center p-3  transition-all duration-300 rounded-r-lg ${
            WebHelper.isDarkColor(bg_color)
              ? isOpen
                ? "bg-gray-900 hover:bg-gray-100"
                : "hover:bg-gray-900"
              : isOpen
              ? "bg-gray-900 hover:bg-gray-100"
              : "hover:bg-gray-900"
          }`}
        >
          <Calendar size={16} className={`${accent_color}`} />
        </div>
      </div>

      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}

      {isOpen &&
        typeof window !== "undefined" &&
        ReactDOM.createPortal(
          <>
            {/* Modal-like backdrop */}
            <div
              className="fixed backdrop-blur-[2px] inset-0 z-[1908888] flex justify-center items-center bg-black/20"
              onClick={() => setIsOpen(false)}
            />
            {/* Calendar popup */}
            <div
              className="z-[1909999] rounded-lg flex justify-center items-center fixed"
              style={{
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 455,
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
                className={`max-h-max z-10 mt-2 ${
                  WebHelper.isDarkColor(bg_color) ? "bg-black/90  " : bg_color
                } rounded-lg backdrop-blur-[8px] shadow-lg border ${border_color} w-[455px]`}
              >
                <div className="flex items-center justify-between p-6 mb-6">
                  <button
                    type="button"
                    onClick={() => navigateMonth("prev")}
                    className={`p-2 ${
                      WebHelper.isDarkColor(bg_color)
                        ? "hover:bg-gray-100"
                        : "hover:bg-gray-400"
                    }  rounded-full cursor-pointer ${accent_color}`}
                  >
                    <ChevronLeft size={24} className={`${accent_color}`} />
                  </button>
                  <div className="relative">
                    <div
                      className={`flex items-center gap-2 cursor-pointer ${cn(
                        `hover:${border_color}/20`
                      )} ${text_color} px-2 py-1 rounded`}
                      onClick={() => setShowYearDropdown(true)}
                    >
                      <span className="font-medium text-lg">
                        {format(currentMonth, "MMMM")}
                      </span>
                      <span className="font-medium text-lg">
                        {format(currentMonth, "yyyy")}
                      </span>
                      <ChevronDown size={16} className={`${accent_color}`} />
                    </div>
                    {showYearDropdown && (
                      <div
                        ref={yearDropdownRef}
                        className={`absolute z-20 max-h-[12rem] p-2 mt-1 ${bg_color} border border-[#7b7c80] rounded-lg shadow-lg w-[120px] overflow-y-auto`}
                      >
                        {generateYears().map((year) => {
                          const isSelected = selectedDate
                            ? year === selectedDate.getFullYear()
                            : year === new Date().getFullYear();
                          return (
                            <div
                              key={year}
                              ref={isSelected ? selectedYearRef : null}
                              className={`px-4 py-3 rounded-sm cursor-pointer text-center text-xs ${
                                isSelected
                                  ? "bg-blue-600 text-white"
                                  : "hover:bg-blue-500 hover:text-white"
                              }`}
                              onClick={() =>
                                handleDateSelect(
                                  new Date(year, currentMonth.getMonth(), 1)
                                )
                              }
                            >
                              {year}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => navigateMonth("next")}
                    className={`p-2 ${
                      WebHelper.isDarkColor(bg_color)
                        ? "hover:bg-gray-100"
                        : "hover:bg-gray-400"
                    }  rounded-full cursor-pointer ${accent_color}`}
                  >
                    <ChevronRight size={24} />
                  </button>
                </div>

                <div className="grid grid-cols-7 gap-2 mb-4 px-6">
                  {weekDays.map((day) => (
                    <div
                      key={day}
                      className={`text-center text-xs font-medium ${accent_color} py-2`}
                    >
                      {day}
                    </div>
                  ))}
                </div>

                <div
                  className={`grid grid-cols-7 gap-2 px-6 pb-6 ${text_color}`}
                >
                  {/* Render padding days */}
                  {paddingDays.map((_, index) => (
                    <div
                      key={`padding-${index}`}
                      className="p-3 h-10 w-10 min-w-10 flex items-center justify-center rounded-full text-xs"
                    />
                  ))}
                  {/* Render actual days */}
                  {days.map((day) => (
                    <button
                      key={day.toString()}
                      type="button"
                      onClick={() => handleDateSelect(day)}
                      className={`p-3 h-10 w-10 min-w-10 flex items-center justify-center rounded-full text-xs cursor-pointer ${
                        !isSameMonth(day, currentMonth)
                          ? " text-gray-300"
                          : selectedDate && isSameDay(day, selectedDate)
                          ? "bg-gradient-to-br from-blue-500 to-blue-700 text-white hover:bg-gradient-to-br hover:from-blue-600 hover:to-blue-800 font-semibold"
                          : isToday(day)
                          ? "bg-gray-700 text-white font-semibold"
                          : `${
                              WebHelper.isDarkColor(bg_color)
                                ? "hover:bg-gray-100/30"
                                : "hover:bg-gray-400"
                            }`
                      }`}
                    >
                      {format(day, "d")}
                    </button>
                  ))}
                </div>
              </motion.div>
            </div>
          </>,
          document.body
        )}
    </div>
  );
};

export default DateInput;
