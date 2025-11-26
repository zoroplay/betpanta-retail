"use client";
import React, { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import { ChevronLeft, Clock } from "lucide-react";
import { GoDotFill } from "react-icons/go";
import { BsChevronBarLeft, BsChevronLeft } from "react-icons/bs";
import { AnimatePresence, motion } from "framer-motion";
import { WebHelper } from "@/lib/helpers";
import { BlurHandler, InvalidHandler } from "./Input";

interface TimeInputProps {
  value?: Date;
  onChange: (e: { target: { value: string; name: string } }) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  name?: string;
  required?: boolean;
  bg_color?: string;
  border_color?: string;
  text_color?: string;
  accent_color?: string;
  format?: "12h" | "24h";
  relative?: boolean;
  disabled?: boolean;
  theme?: "dark" | "light";
  popup_position?: string;
}

const TimeInput: React.FC<TimeInputProps> = ({
  value,
  onChange,
  placeholder = "Select time",
  label,
  error,
  name,
  required = false,
  bg_color = "bg-white",
  border_color = "border-gray-300",
  text_color = "text-gray-700",
  accent_color = "text-gray-200 bg-gray-600",
  format = "12h",
  relative = false,
  disabled = false,
  theme = "light",
  popup_position = "inset-x-12 bottom-8",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState<{
    hours: number;
    minutes: number;
    period: "AM" | "PM";
  } | null>({
    hours: 0,
    minutes: 0,
    period: "AM",
  });
  const [isHourMode, setIsHourMode] = useState(true);
  const [hoursInput, setHoursInput] = useState("");
  const [showError, setShowError] = useState<boolean>(false);
  const [validationMessage, setValidationMessage] = useState<string>("");
  const [minutesInput, setMinutesInput] = useState("");
  const [periodInput, setPeriodInput] = useState("AM");
  const clockRef = useRef<HTMLDivElement>(null);
  const hoursRef = useRef<HTMLInputElement>(null);
  const minutesRef = useRef<HTMLInputElement>(null);
  const periodRef = useRef<HTMLInputElement>(null);
  const hiddenInputRef = useRef<HTMLInputElement>(null);
  const [internalError, setInternalError] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const inputWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        clockRef.current &&
        !clockRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (value instanceof Date) {
      let hours = value.getHours();
      const minutes = value.getMinutes();
      let period: "AM" | "PM" = "AM";

      if (format === "12h") {
        period = hours >= 12 ? "PM" : "AM";
        hours = hours % 12;
        if (hours === 0) hours = 12;
      }

      const newTime = {
        hours,
        minutes,
        period,
      };

      setSelectedTime(newTime);
      setHoursInput(String(hours).padStart(2, "0"));
      setMinutesInput(String(minutes).padStart(2, "0"));
      setPeriodInput(period);
    } else {
      setSelectedTime(null);
      setHoursInput("");
      setMinutesInput("");
      setPeriodInput("AM");
    }
  }, [value, format]);

  const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInternalError(null);
    const value = e.target.value.replace(/[^0-9]/g, "");

    // Allow clearing the input
    if (value === "") {
      setHoursInput("");
      return;
    }

    // If we have a valid number
    if (value.length <= 2) {
      const hour = parseInt(value);

      // If we have a complete hour value
      if (value.length === 2) {
        let validHour = hour;

        if (format === "24h") {
          // 24-hour format validation
          if (hour > 23) {
            validHour = hour % 24;
          }
        } else {
          // 12-hour format validation
          if (hour > 12) {
            validHour = hour % 12;
            if (validHour === 0) validHour = 12;
          }
          if (hour === 0) {
            validHour = 12;
          }
        }

        setHoursInput(String(validHour).padStart(2, "0"));

        if (selectedTime) {
          const newTime = { ...selectedTime, hours: validHour };
          setSelectedTime(newTime);
          updateTimeValue(newTime);
        } else {
          setSelectedTime({
            hours: validHour,
            minutes: 0,
            period: "AM" as const,
          });
        }

        // Move focus to minutes after valid hour input
        minutesRef.current?.focus();
      } else {
        // Allow partial input (single digit)
        setHoursInput(value);
      }
    }
  };

  const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInternalError(null);
    const value = e.target.value.replace(/[^0-9]/g, "");

    // Allow clearing the input without affecting hours
    if (value === "") {
      setMinutesInput("");
      return;
    }

    // If we have a valid number
    if (value.length <= 2) {
      // For rolling input, when we have a complete value and add a new digit
      if (value.length === 2 && minutesInput.length === 2) {
        // Take the last digit of current input and new digit
        const newValue = minutesInput[1] + value[1];
        const minute = parseInt(newValue);

        // Validate minute value and wrap around from 60 to 00
        if (minute >= 0) {
          const validMinute = minute % 60;
          setMinutesInput(String(validMinute).padStart(2, "0"));
          if (selectedTime) {
            const newTime = { ...selectedTime, minutes: validMinute };
            setSelectedTime(newTime);
            updateTimeValue(newTime);
          }
          periodRef.current?.focus();
        }
      } else {
        // For normal input (first digit or partial)
        const minute = parseInt(value);
        if (minute >= 0) {
          // Handle single digit input
          if (value.length === 1) {
            setMinutesInput(value);
          } else {
            // Handle two digit input with wrapping
            const validMinute = minute % 60;
            setMinutesInput(String(validMinute).padStart(2, "0"));
            if (selectedTime) {
              const newTime = { ...selectedTime, minutes: validMinute };
              setSelectedTime(newTime);
              updateTimeValue(newTime);
            }
            periodRef.current?.focus();
          }
        }
      }
    }
  };

  const handlePeriodChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInternalError(null);
    const value = e.target.value.toUpperCase();

    // Allow clearing the input
    if (value === "") {
      setPeriodInput("AM");
      return;
    }

    // Handle keyboard input
    if (value === "A") {
      const period = "AM" as const;
      setPeriodInput(period);
      if (selectedTime) {
        const newTime = { ...selectedTime, period };
        setSelectedTime(newTime);
        updateTimeValue(newTime);
      }
    } else if (value === "P") {
      const period = "PM" as const;
      setPeriodInput(period);
      if (selectedTime) {
        const newTime = { ...selectedTime, period };
        setSelectedTime(newTime);
        updateTimeValue(newTime);
      }
    }
  };

  const handlePeriodClick = () => {
    if (selectedTime) {
      const newPeriod =
        selectedTime.period === "AM" ? ("PM" as const) : ("AM" as const);
      setPeriodInput(newPeriod);
      const newTime = { ...selectedTime, period: newPeriod };
      setSelectedTime(newTime);
      updateTimeValue(newTime);
    }
  };

  const handleTimeSelect = (value: number) => {
    if (isHourMode) {
      const newTime = {
        ...selectedTime!,
        hours: value,
        period: selectedTime?.period || ("AM" as const),
      };
      setSelectedTime(newTime);
      setIsHourMode(false);
      setHoursInput(String(value).padStart(2, "0"));
      minutesRef.current?.focus();
    } else {
      const newTime = {
        ...selectedTime!,
        minutes: value,
      };
      setSelectedTime(newTime);
      setMinutesInput(String(value).padStart(2, "0"));
      periodRef.current?.focus();
      updateTimeValue(newTime);
    }
  };

  const handlePeriodSelect = (period: "AM" | "PM") => {
    setSelectedTime({ ...selectedTime!, period });
    setPeriodInput(period);
    updateTimeValue({ ...selectedTime!, period });
  };

  const formatTime = (time: {
    hours: number;
    minutes: number;
    period: "AM" | "PM";
  }) => {
    return `${time.hours}:${String(time.minutes).padStart(2, "0")} ${
      time.period
    }`;
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    type: "hours" | "minutes" | "period"
  ) => {
    if (e.key === "Backspace") {
      if (type === "minutes" && minutesInput === "") {
        hoursRef.current?.focus();
      } else if (type === "period" && periodInput === "") {
        minutesRef.current?.focus();
      }
    }
  };

  const updateTimeValue = (time: {
    hours: number;
    minutes: number;
    period: "AM" | "PM";
  }) => {
    let hours = time.hours;

    if (format === "12h") {
      // Convert 12-hour to 24-hour
      hours =
        time.period === "PM" && time.hours !== 12
          ? time.hours + 12
          : time.period === "AM" && time.hours === 12
          ? 0
          : time.hours;
    }

    // Create new Date object
    const newDate = value ? new Date(value) : new Date();
    newDate.setHours(hours);
    newDate.setMinutes(time.minutes);
    newDate.setSeconds(0);
    newDate.setMilliseconds(0);

    onChange({ target: { value: newDate.toISOString(), name: name || "" } });
  };

  const renderClockNumbers = () => {
    const numbers = isHourMode
      ? format === "24h"
        ? Array.from({ length: 24 }, (_, i) => i)
        : Array.from({ length: 12 }, (_, i) => i + 1)
      : Array.from({ length: 12 }, (_, i) => i * 5);
    const radius = 140;
    const center = { x: radius, y: radius };

    const selectedAngle = isHourMode
      ? format === "24h"
        ? ((selectedTime?.hours || 0) % 24) * (360 / 24) * (Math.PI / 180)
        : ((selectedTime?.hours || 12) % 12) * (360 / 12) * (Math.PI / 180)
      : ((selectedTime?.minutes || 0) * (360 / 60) * Math.PI) / 180;

    return (
      <>
        {/* Clock hands */}
        <div
          className="absolute w-0.5 h-[100px] bg-blue-500 origin-bottom transition-transform duration-300"
          style={{
            left: `${radius - 0.8}px`,
            top: `${radius - 100}px`,
            transform: `rotate(${selectedAngle}rad)`,
            transformOrigin: "center bottom",
          }}
        />
        <div
          className="absolute w-0.5 h-[70px] bg-blue-500 origin-bottom transition-transform duration-300"
          style={{
            left: `${radius - 0.8}px`,
            top: `${radius - 70}px`,
            transform: `rotate(${selectedAngle}rad)`,
            transformOrigin: "center bottom",
            opacity: isHourMode ? 0.5 : 1,
          }}
        />

        {/* Center ring */}
        <div
          className="absolute w-4 h-4 rounded-full border-2 border-blue-500 bg-white"
          style={{
            left: `${radius - 8}px`,
            top: `${radius - 8}px`,
          }}
        />

        {/* Clock numbers/markers */}
        {numbers.map((number, index) => {
          const angle = isHourMode
            ? format === "24h"
              ? (index * (360 / 24) * Math.PI) / 180
              : ((index * (360 / 12) + 30) * Math.PI) / 180
            : (index * (360 / 12) * Math.PI) / 180;

          const x = center.x + radius * Math.sin(angle) * 0.85;
          const y = center.y - radius * Math.cos(angle) * 0.85;

          const isSelected = isHourMode
            ? selectedTime?.hours === number
            : selectedTime?.minutes === number;

          return (
            <button
              type="button"
              key={number}
              onClick={() => handleTimeSelect(number)}
              className={`absolute font-semibold w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                isSelected
                  ? "bg-blue-500 text-white font-semibold"
                  : ` ${
                      theme === "dark"
                        ? "hover:bg-gray-400 text-gray-200"
                        : "hover:bg-gray-100 text-gray-700"
                    }`
              }`}
              style={{
                left: `${x}px`,
                top: `${y}px`,
                transform: `translate(-50%, -50%)`,
              }}
            >
              {number}
            </button>
          );
        })}

        {/* Minute markers */}
        {!isHourMode && (
          <>
            {Array.from({ length: 60 }, (_, i) => {
              const angle = (i * (360 / 60) * Math.PI) / 180;
              const x = center.x + radius * Math.sin(angle) * 0.9;
              const y = center.y - radius * Math.cos(angle) * 0.9;
              const isMajor = i % 5 === 0;
              const isSelected = selectedTime?.minutes === i;

              return (
                <button
                  type="button"
                  key={i}
                  onClick={() => handleTimeSelect(i)}
                  className={`absolute cursor-pointer transition-colors ${
                    isMajor ? "w-1 h-4" : "w-0.5 h-2"
                  } ${
                    isSelected
                      ? "bg-blue-500 !w-1 !h-3"
                      : `${
                          theme === "dark"
                            ? "bg-gray-600 hover:bg-gray-500"
                            : "bg-gray-300 hover:bg-gray-500"
                        }`
                  }`}
                  style={{
                    left: `${x}px`,
                    top: `${y}px`,
                    transform: `translate(-50%, -50%) rotate(${angle}rad)`,
                    transformOrigin: "center",
                  }}
                />
              );
            })}
          </>
        )}
      </>
    );
  };

  const inputStyle = `flex h-[58px] w-full rounded-md border border-input text-sm ring-offset-background file:border-0 file:text-sm file:font-medium placeholder:text-muted-foreground focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 transition-all focus-within:bg-blue-50/20 hover:bg-blue-50/20`;

  const handleOpen = () => {
    setInternalError(null);
    setIsHourMode(true);
    setIsOpen(true);
  };

  // useEffect(() => {
  //   if (internalError || error) {
  //     setInternalError("");
  //   }
  // }, [internalError, error]);

  const getBorderColor = () => {
    if (internalError || error)
      return "border-[#ff6347] border ring-2 ring-[#ff6347]"; // tomato
    if (isFocused)
      return `ring-2 ring-[${border_color.replace("border-", "")}]`;
    return `${border_color} border`; // gray-200
  };

  const handleInvalid: InvalidHandler = (e) => {
    e.preventDefault();
    setInternalError("Please select a time");
    setShowError(true);
  };

  const handleBlur: BlurHandler = (e) => {
    if (hiddenInputRef.current) {
      const isValid = hiddenInputRef.current.checkValidity();
      if (!isValid) {
        setInternalError("Please select a time");
        setShowError(true);
      } else {
        setInternalError(null);
        setShowError(false);
      }
    }
  };

  // Helper to check if the time is filled
  const isTimeFilled = () => {
    if (format === "12h") {
      return hoursInput && minutesInput && periodInput ? "valid" : "";
    }
    return hoursInput && minutesInput ? "valid" : "";
  };

  // Add effect to check required on change

  const handleBackdropClick = () => {
    setIsOpen(false);
    setIsFocused(false);
  };

  return (
    <div
      className={`w-full flex flex-col gap-1 ${relative ? "relative" : ""}`}
      ref={inputWrapperRef}
    >
      {label && (
        <label
          className={`block text-sm font-semibold mb-1 ${
            internalError || error ? "text-[tomato]" : ""
          }`}
        >
          {label}
          {required && <span className="text-[TOMATO]"> *</span>}
        </label>
      )}

      <div
        className={`w-full ${bg_color} ${
          disabled ? "opacity-50 cursor-not-allowed pointer-events-none" : ""
        } h-[58px] border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${getBorderColor()} flex items-center justify-between pl-4 ring-offset-background file:border-0 file:text-sm file:font-medium placeholder:text-muted-foreground focus-within:outline-none focus-within:ring-2 hover:ring-2 hover:ring-ring focus-within:ring-ring focus-within:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 transition-all focus-within:bg-blue-50/20 hover:bg-blue-50/20`}
      >
        {/* Time display section */}

        <div className="flex items-center gap-1 py-2">
          <input
            ref={hoursRef}
            type="text"
            value={hoursInput}
            onChange={handleHoursChange}
            onKeyDown={(e) => handleKeyDown(e, "hours")}
            placeholder="HH"
            className="w-8 h-8 py-2 text-center outline-none bg-transparent"
            maxLength={2}
            disabled={disabled}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
          <span className="text-gray-500 flex flex-col justify-center items-center h-5 w-2">
            <GoDotFill fontSize={12} />
            <GoDotFill fontSize={12} />
          </span>
          <input
            ref={minutesRef}
            type="text"
            value={minutesInput}
            onChange={handleMinutesChange}
            onKeyDown={(e) => handleKeyDown(e, "minutes")}
            placeholder="MM"
            className="w-8 h-8 py-2 text-center outline-none bg-transparent"
            maxLength={2}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
          {format === "12h" && (
            <>
              <input
                ref={periodRef}
                type="text"
                value={periodInput}
                onChange={handlePeriodChange}
                onClick={handlePeriodClick}
                onKeyDown={(e) => handleKeyDown(e, "period")}
                placeholder="AM"
                className="w-8 text-center outline-none bg-transparent cursor-pointer"
                maxLength={2}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
              />
            </>
          )}
        </div>
        <div
          onClick={handleOpen}
          className={`w-12 min-w-[2rem] cursor-pointer text-gray-400 h-full flex justify-center items-center p-3 hover:bg-gray-100/50 rounded-r-lg ${
            isOpen ? "bg-black/50" : ""
          }`}
        >
          <Clock size={20} />
        </div>
      </div>
      {required && (
        <div className="hidden">
          <input
            ref={hiddenInputRef}
            required
            type="text"
            value={isTimeFilled()}
            onBlur={handleBlur}
            onInvalid={handleInvalid}
            disabled={disabled}
          />
        </div>
      )}
      {/* Error message display */}
      {(internalError || error) && (
        <p className="mt-1 text-xs text-[tomato] font-semibold">
          {internalError || error}
        </p>
      )}

      {isOpen &&
        typeof window !== "undefined" &&
        ReactDOM.createPortal(
          <>
            {/* Modal-like backdrop */}
            <div
              className="fixed inset-0 backdrop-blur-[2px] z-[1239440] flex justify-center items-center bg-black/20"
              onClick={handleBackdropClick}
            />
            {/* Time picker popup */}
            <div
              className={`z-[23394098] rounded-lg flex justify-center items-center fixed`}
              style={{
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 310,
                transition: "opacity 0.2s, transform 0.2s",
                opacity: 1,
              }}
            >
              <motion.div
                ref={clockRef}
                key={"am-pm"}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ delay: 0.25, ease: "easeOut", duration: 0.25 }}
                className={`h-max z-10 mt-2 rounded-lg overflow-hidden shadow-lg border ${border_color} p-3 ${bg_color} transition-all duration-200`}
                style={{ width: "310px" }}
              >
                <div className="flex items-start justify-between py-2">
                  <div
                    className={`flex gap-1 items-center justify-center min-w-[60px] font-mono text-6xl select-none ${
                      theme === "dark" ? "text-gray-400" : "text-gray-700"
                    }`}
                  >
                    {/* Clickable hour and minute for switching modes */}
                    <span
                      className={`h-14 w-17 flex justify-center items-center rounded-md cursor-pointer transition-colors select-none
                  ${
                    isHourMode
                      ? "bg-blue-100/80 text-blue-700 dark:bg-blue-800/70 dark:text-blue-200 shadow-sm"
                      : "hover:bg-gray-200/70 dark:hover:bg-gray-700/60 text-gray-700 dark:text-gray-200"
                  }
                `}
                      onClick={() => setIsHourMode(true)}
                      tabIndex={0}
                      role="button"
                    >
                      <span className="translate-y-0.5">
                        {hoursInput ? hoursInput.padStart(2, "0") : "--"}
                      </span>
                    </span>
                    <span className="mx-1">:</span>
                    <span
                      className={`h-14 w-17 flex justify-center items-center rounded-md cursor-pointer transition-colors select-none
                  ${
                    !isHourMode
                      ? "bg-blue-100/80 text-blue-700 dark:bg-blue-800/70 dark:text-blue-200 shadow-sm"
                      : "hover:bg-gray-200/70 dark:hover:bg-gray-700/60 text-gray-700 dark:text-gray-200"
                  }
                `}
                      onClick={() => setIsHourMode(false)}
                      tabIndex={0}
                      role="button"
                    >
                      <span className="translate-y-0.5">
                        {minutesInput ? minutesInput.padStart(2, "0") : "--"}
                      </span>
                    </span>
                    {format === "12h" && (
                      <motion.div
                        key={"am-pm"}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ ease: "easeOut", duration: 0.25 }}
                        className={`mx-2 -translate-y-2 flex flex-row w-16 h-8 items-center justify-center border overflow-hidden rounded-full shadow-sm transition-colors duration-200 ${
                          theme === "dark"
                            ? "border-slate-600/50 bg-gray-800/70"
                            : "border-gray-300 bg-gray-100/80"
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => handlePeriodSelect("AM")}
                          className={`flex-1 h-full text-xs font-semibold tracking-widest transition-colors cursor-pointer rounded-none border-0 outline-none 
                          ${
                            selectedTime?.period === "AM"
                              ? "bg-blue-100/80 text-blue-700 dark:bg-blue-800/70 dark:text-blue-200 shadow-sm"
                              : "hover:bg-gray-200/70 dark:hover:bg-gray-700/60 text-gray-700 dark:text-gray-200"
                          }
                        `}
                        >
                          AM
                        </button>
                        <button
                          type="button"
                          onClick={() => handlePeriodSelect("PM")}
                          className={`flex-1 h-full text-xs font-semibold tracking-widest transition-colors cursor-pointer rounded-none outline-none focus:outline-none 
                          ${
                            selectedTime?.period === "PM"
                              ? "bg-blue-100/80 text-blue-700 dark:bg-blue-800/70 dark:text-blue-200 shadow-sm"
                              : "hover:bg-gray-200/70 dark:hover:bg-gray-700/60 text-gray-700 dark:text-gray-200"
                          }
                        `}
                        >
                          PM
                        </button>
                      </motion.div>
                    )}
                  </div>
                </div>

                <div
                  className={`relative transition-all duration-200 mx-auto rounded-full border ${
                    theme === "dark"
                      ? `${border_color} ${bg_color}`
                      : "border-gray-200 bg-white"
                  }`}
                  style={{
                    width: "280px",
                    height: "280px",
                    aspectRatio: "1/1",
                  }}
                >
                  {renderClockNumbers()}
                </div>
              </motion.div>
            </div>
          </>,
          document.body
        )}
    </div>
  );
};

export default TimeInput;
