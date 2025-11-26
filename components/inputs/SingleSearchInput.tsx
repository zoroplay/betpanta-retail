/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { AppHelper } from "@/lib/helper";
import React, { useState, useRef, useCallback, useEffect } from "react";
// import { FaCheckCircle, FaCheckDouble, FaSearch } from "react-icons/fa";
// import { IoCheckmarkDone } from "react-icons/io5";
// import { MdOutlineErrorOutline } from "react-icons/md";

export type SearchState = {
  isValid: boolean;
  isNotFound: boolean;
  isLoading: boolean;
  message: string;
};

export type SingleSearchInputProps = {
  placeholder: string;
  label?: string;
  onSearch: (query: string) => void;
  searchState: SearchState;
  required?: boolean;
  className?: string;
  error?: null | string;
  value?: string;
  fetchThreshold?: number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onResetSearchState?: () => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  tabIndex?: number;
  type?: "text" | "email" | "number";
  height?: string;
  name?: string;
  bg_color?: string;
  border_color?: string;
  text_color?: string;
  accent_color?: string;
};

const SingleSearchInput = React.forwardRef<
  HTMLInputElement,
  SingleSearchInputProps
>(
  (
    {
      placeholder,
      label,
      onSearch,
      searchState,
      required = false,
      className = "",
      error,
      value = "",
      fetchThreshold = 4,
      onResetSearchState,
      onChange,
      onKeyDown,
      tabIndex,
      type = "text",
      name,
      height = "h-[42px]",
      bg_color = "bg-white",
      border_color = "border-gray-300",
      text_color = "text-gray-700",
      accent_color = "text-gray-500",
    }: SingleSearchInputProps,
    ref: React.ForwardedRef<HTMLInputElement>
  ) => {
    const [query, setQuery] = useState<string>(value || "");
    const [showError, setShowError] = useState<boolean>(false);
    const [validationMessage, setValidationMessage] = useState<string>("");
    const [isValidFormat, setIsValidFormat] = useState<boolean>(true);
    const [isFocused, setIsFocused] = useState<boolean>(false);
    const inputRef = useRef<HTMLInputElement>(null);

    // Combine internal ref with forwarded ref
    const combinedRef = useCallback(
      (node: HTMLInputElement) => {
        inputRef.current = node;
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      },
      [ref]
    );

    const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

    const [hasSearched, setHasSearched] = useState(false);
    const lastQueryRef = useRef<string>(query);

    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const validateInput = (value: string): boolean => {
      if (type === "email") {
        const isValid = emailRegex.test(value);
        setIsValidFormat(isValid);
        if (!isValid && value.length > 0) {
          setValidationMessage("Please enter a valid email address");
          setShowError(true);
        } else {
          setShowError(false);
          setValidationMessage("");
        }
        return isValid;
      }
      return true;
    };

    const handleFocus = () => {
      setIsFocused(true);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      if (required && !query) {
        setShowError(true);
        setValidationMessage("This field is required");
      } else if (type === "email") {
        validateInput(query);
      }
    };

    const inputStyle = `flex ${bg_color} ${text_color} w-full rounded-md border border-input text-sm ring-offset-background file:border-0 file:text-xs file:font-medium placeholder:text-muted-foreground focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 transition-all  ${
      AppHelper.isDarkColor(bg_color)
        ? "focus-within:bg-blue-500/30 hover:bg-blue-500/30"
        : "focus-within:bg-blue-50 hover:bg-blue-50"
    } `;

    useEffect(() => {
      setShowError(Boolean(error));
    }, [error]);

    const handleInvalid = (event: React.InvalidEvent<HTMLInputElement>) => {
      event.preventDefault();
      setValidationMessage(event.target.validationMessage);
      setShowError(true);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setQuery(newValue);

      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      if (newValue !== lastQueryRef.current) {
        setHasSearched(false);
        if (onResetSearchState) {
          onResetSearchState();
        }
      }

      // Validate the input format
      const isValid = validateInput(newValue);

      // Only trigger search if the input is valid (for email) or if type is text
      if (
        newValue.length >= fetchThreshold &&
        !hasSearched &&
        (type !== "email" || isValid)
      ) {
        debounceTimerRef.current = setTimeout(() => {
          onSearch(newValue);
          setHasSearched(true);

          lastQueryRef.current = newValue;
        }, 500);
      }
      if (onChange) {
        onChange(e);
      }
    };

    useEffect(() => {
      if (value !== undefined && value !== query) {
        setQuery(value);
        setHasSearched(false);
        lastQueryRef.current = value;
        if (type === "email") {
          validateInput(value);
        }
      }
    }, [value]);

    const getBorderColor = () => {
      let baseStyle = "";

      // Base border color
      if (showError || searchState.isNotFound || !isValidFormat) {
        baseStyle =
          "ring-2 ring-[tomato] outline-2 outline-[tomato] border-[tomato] border";
      } else if (searchState.isValid && isValidFormat) {
        baseStyle = "border-green-500";
      } else {
        baseStyle = border_color;
      }

      // Add focus ring if focused
      if (isFocused) {
        if (searchState.isValid && isValidFormat) {
          baseStyle += " ring-2 ring-green-500";
        } else if (showError || searchState.isNotFound || !isValidFormat) {
          baseStyle += " ring-2 ring-[tomato]";
        } else {
          baseStyle += ` ring-2 ring-[${border_color.replace("border-", "")}]`;
        }
      }

      return baseStyle;
    };

    return (
      <div className="flex flex-col gap-1 w-full">
        {label && (
          <div className="flex justify-between items-center gap-4">
            <label
              className={`text-xs font-semibold ${
                showError || searchState.isNotFound || !isValidFormat
                  ? "text-[tomato]"
                  : text_color
              }`}
              htmlFor=""
            >
              {label}{" "}
              {required && <span className="text-[tomato] ml-1">*</span>}
            </label>{" "}
          </div>
        )}
        <div className="relative">
          <input
            ref={combinedRef}
            type={type}
            placeholder={placeholder}
            value={query}
            name={name}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={onKeyDown}
            tabIndex={tabIndex}
            className={`${inputStyle} $ ${height} w-full ${className} px-3 py-2 text-black rounded-md ${getBorderColor()} focus:outline-none transition-all`}
            disabled={searchState.isLoading}
            onInvalid={handleInvalid}
          />

          {searchState.isLoading && (
            <div className="absolute inset-0 flex items-center overflow-hidden justify-center opacity-50 rounded-md">
              <div className="h-full w-full bg-slate-100 overflow-hidden">
                <div className="progress w-full h-full bg-slate-500 left-right" />
              </div>
            </div>
          )}
        </div>
        {/* {!searchState.isNotFound &&
        !searchState.isLoading &&
        searchState.isValid &&
        isValidFormat && (
          <div className="flex items-center justify-start gap-2">
         <span className="text-[10px] text-green-500 font-semibold tracking-wide">
              {searchState.message || "Item found!"}
            </span>
          </div>
        )} */}
        {!searchState.isLoading && searchState.isNotFound && isValidFormat && (
          <div className="flex items-center gap-2">
            {/* <MdOutlineErrorOutline className="text-[tomato] text-xl" /> */}
            <p className="text-[10px] text-[tomato] font-semibold  tracking-wide">
              {searchState.message || "Item not found."}
            </p>
          </div>
        )}
        {!isValidFormat && query.length > 0 && (
          <div className="flex items-center gap-2">
            {/* <MdOutlineErrorOutline className="text-[tomato] text-xl" /> */}
            <p className="text-[10px] text-[tomato] font-semibold  tracking-wide">
              Please enter a valid email address
            </p>
          </div>
        )}
        {/* {searchState.isLoading && (
        <p className="text-[10px] text-gray-500">Searching...</p>
      )} */}
        {/* {(showError || error) && (
        <div
          className={`overflow-hidden ${
            showError || error ? "min-h-5" : "h-0"
          } transition-all duration-200`}
        >
          <p
            className={`text-[10px] capitalize font-bold text-[tomato] transition-all ${
              showError || error ? "opacity-100" : "opacity-0"
            }`}
          >
            {validationMessage || error || ""}
          </p>
        </div>
      )} */}

        {/* <div
        className={`overflow-hidden  ${
          showError ? "h-4" : "h-4"
        } transition-all`}
      >
        <p
          className={`text-[10px] capitalize font-bold text-red transition-all ${
            showError ? "opacity-1" : "opacity-0"
          }`}
        >
          * {validationMessage || error}
        </p>
      </div> */}
      </div>
    );
  }
);

SingleSearchInput.displayName = "SingleSearchInput";

export default SingleSearchInput;
