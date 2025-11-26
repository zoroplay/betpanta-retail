/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import React, { useEffect, useState } from "react";
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";
import Image from "next/image";
import dayjs, { Dayjs } from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import "dayjs/locale/en";
import { Checkbox } from "@heroui/checkbox";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/providers/ThemeProvider";
import { WebHelper } from "@/lib/helpers";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale("en");

type Props = {
  placeholder: string;
  name: string;
  value?: string;
  checked?: boolean;
  type?:
    | string
    | "text"
    | "password"
    | "email"
    | "number"
    | "tel"
    | "url"
    | "search"
    | "date"
    | "time"
    | "datetime-local"
    | "month"
    | "textarea"
    | "num_select"
    | "fx_select";
  optionalLabel?: React.ReactElement;
  bottomLabel?: React.ReactElement;
  error?: null | string;
  rows?: null | number;
  disabled?: boolean;
  password?: boolean;
  required?: boolean;
  doCopy?: boolean;
  textarea?: boolean;
  defaultValue?: string;
  num_select?: boolean;
  card?: boolean;
  label?: string;
  ref?: unknown;
  onFocus?: any;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  tabIndex?: number;
  data_testid?: string;
  changeDesc?: boolean;
  phoneNumber?: boolean;
  outline?: boolean;
  className?: string;
  fxSelect?: boolean;
  onChange: (
    t: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onSelect?: (t: unknown) => void;
  check_box?: boolean;
  options?: { id: string; name: string }[];
  selectValue?: string;
  bg_color?: string;
  border_color?: string;
  text_color?: string;
  accent_color?: string;
  height?: string;
  num_select_placeholder?: string | React.ReactElement;
  isLoading?: boolean;
  rounded?: string;
};

// Add this type definition for a generic blur handler
export type BlurHandler = (
  e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
) => void;

// Use FormEventHandler instead of InvalidEvent for compatibility
export type InvalidHandler = (
  e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>
) => void;

// Add this password validation function at the top of the file
const validatePassword = (
  password: string
): { isValid: boolean; message: string } => {
  if (!password) return { isValid: false, message: "Password is required" };

  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
  const isLongEnough = password.length >= 8;

  const requirements = [];
  if (!hasUpperCase) requirements.push("uppercase letter");
  if (!hasLowerCase) requirements.push("lowercase letter");
  if (!hasNumber) requirements.push("number");
  if (!hasSpecialChar) requirements.push("special character");
  if (!isLongEnough) requirements.push("minimum of 8 characters");

  if (requirements.length === 0) {
    return { isValid: true, message: "" };
  }

  const message = `Password must include ${requirements.join(", ")}`;
  return { isValid: false, message };
};

const Input = React.forwardRef<HTMLInputElement, Props>(
  (
    {
      placeholder,
      type = "text",
      textarea,
      password,
      doCopy = false,
      disabled = false,
      defaultValue,
      required = false,
      name,
      changeDesc,
      optionalLabel,
      bottomLabel,
      phoneNumber,
      outline,
      value,
      rows,
      label,
      card,
      onFocus,
      onKeyDown,
      tabIndex,
      num_select,
      num_select_placeholder,
      fxSelect,
      error,
      onChange,
      onSelect,
      className,
      options,
      selectValue,
      check_box,
      checked,
      border_color = "border-gray-300",
      bg_color = "bg-white",
      text_color = "text-gray-700",
      accent_color = "text-gray-500",
      height = "h-[38px]",
      isLoading = false,
      rounded = "rounded-md",
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const [showError, setShowError] = useState<boolean>(false);
    const [isFocused, setIsFocused] = useState(false);
    const [validationMessage, setValidationMessage] = useState<string>("");
    const [previousValue, setPreviousValue] = useState(value);
    const [passwordValidation, setPasswordValidation] = useState<{
      isValid: boolean;
      message: string;
    }>({
      isValid: true,
      message: "",
    });

    const { theme } = useTheme();

    const getBorderColor = () => {
      if (showError || error)
        return "border-[#ff6347] border ring-2 ring-[#ff6347]"; // tomato
      if (isFocused)
        return `${border_color} border ring-2 ring-[${border_color.replace(
          "border-",
          ""
        )}]`; // use the same color as border
      return `${border_color} border `; // gray-200
    };

    const inputStyle = `flex ${height} ${bg_color} w-full ${rounded} border border-input text-xs ring-offset-background file:border-0 file:text-xs file:font-medium placeholder:text-muted-foreground focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 transition-all  ${getBorderColor()} ${
      WebHelper.isDarkColor(bg_color)
        ? "hover:bg-blue-500/10 focus-within:bg-blue-500/10"
        : "hover:bg-blue-50/10 focus-within:bg-blue-50"
    } `;

    const [phoneNo, setPhoneNumber] = useState(value);

    const handlePhoneNumberChange = (
      e: React.ChangeEvent<HTMLInputElement>
    ) => {
      let newPhoneNumber = e.target.value;

      // If input is empty, don't add any prefix
      if (!newPhoneNumber) {
        setPhoneNumber("");
        onChange({
          target: { name: name || "phone_number", value: "" },
        } as React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>);
        return;
      }

      // Remove any non-digit characters except + at the start
      newPhoneNumber = newPhoneNumber.replace(/[^\d+]/g, "");

      // Ensure only one + at the start
      if (newPhoneNumber.startsWith("+")) {
        newPhoneNumber = "+" + newPhoneNumber.substring(1).replace(/\+/g, "");
      } else {
        newPhoneNumber = "+" + newPhoneNumber;
      }

      setPhoneNumber(newPhoneNumber);
      onChange({
        target: { name: name || "phone_number", value: newPhoneNumber },
      } as React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>);
    };

    useEffect(() => {
      if (value !== previousValue && (showError || error)) {
        setShowError(false);
        setValidationMessage("");
      }
      setPreviousValue(value);
    }, [value, previousValue, showError, error]);

    // Add password validation effect
    useEffect(() => {
      if (password && value) {
        const validation = validatePassword(value as string);
        setPasswordValidation(validation);
        if (!validation.isValid) {
          setShowError(true);
          setValidationMessage(validation.message);
        } else if (
          showError &&
          validationMessage === passwordValidation.message
        ) {
          setShowError(false);
          setValidationMessage("");
        }
      }
    }, [value, password]);

    // Update handleBlur to include password validation
    const handleBlur: BlurHandler = (e) => {
      if (password) {
        const validation = validatePassword(e.target.value);
        setPasswordValidation(validation);
        if (!validation.isValid) {
          setShowError(true);
          setValidationMessage(validation.message);
          return;
        }
      }

      if (e.target.validity.valid) {
        setShowError(false);
        setValidationMessage("");
      } else {
        setShowError(true);
        setValidationMessage(e.target.validationMessage);
      }
    };

    const handleInvalid: InvalidHandler = (e) => {
      e.preventDefault();
      setShowError(true);
      // Cast to HTMLInputElement to access validationMessage
      const target = e.target as HTMLInputElement | HTMLTextAreaElement;
      setValidationMessage(target.validationMessage);
    }; // Update to use FormEvent instead of InvalidEvent

    if (isLoading) {
      const loadingHeight =
        textarea || type === "textarea" ? "h-[220px]" : height;
      return (
        <div className="flex flex-col gap-1 w-full">
          {label && (
            <div className="flex justify-between items-center gap-4">
              <label
                className={`text-[11px] font-semibold text-inherit`}
                htmlFor=""
              >
                {label} {required && <span className="text-red-500">*</span>}
              </label>
              {optionalLabel && (
                <span className="text-[10px] text-slate-700">
                  {optionalLabel}
                </span>
              )}
            </div>
          )}
          <div
            className={`relative ${loadingHeight} w-full ${inputStyle} ${getBorderColor()} border ${bg_color} flex items-center justify-between px-3 ${className} bg-gray-200 animate-pulse`}
          >
            {/* Skeleton placeholder for loading */}
          </div>
        </div>
      );
    }

    // Determine input type for switch case
    const getInputType = () => {
      if (password) return "password";
      if (textarea || type === "textarea") return "textarea";
      if (num_select || type === "num_select") return "num_select";
      if (fxSelect || type === "fx_select") return "fx_select";
      if (changeDesc) return "changeDesc";
      if (check_box) return "check_box";
      if (phoneNumber || type === "tel") return "phoneNumber";
      if (card) return "card";
      if (outline && textarea) return "outline_textarea";
      if (outline) return "outline";
      return "default";
    };

    const inputType = getInputType();

    // Render label (common for all input types)
    const renderLabel = () => {
      if (!label && inputType !== "check_box") return null;

      return (
        <div className="flex justify-between items-center gap-2">
          <label
            className={`text-[11px] font-semibold tracking-wide ${
              showError || error ? "text-[tomato]" : ""
            } ${
              inputType === "check_box"
                ? cn("whitespace-nowrap text-xs text-white", className)
                : ""
            }`}
            htmlFor=""
          >
            {label} {required && <span className="text-red-500">*</span>}
          </label>
          {optionalLabel && (
            <span className="text-[10px] text-slate-700">{optionalLabel}</span>
          )}
        </div>
      );
    };

    // Render error message (common for all input types)
    const renderError = () => (
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
    );

    // Render bottom label (common for most input types)
    const renderBottomLabel = () => {
      if (!bottomLabel) return null;

      if (inputType === "textarea" || inputType === "outline_textarea") {
        return (
          <div className="flex justify-end items-center gap-4 w-full">
            {bottomLabel}
          </div>
        );
      }

      return (
        <div className="flex justify-end w-full items-center gap-4 text-[10px]">
          {bottomLabel}
        </div>
      );
    };

    // Render input field based on type
    const renderInputField = () => {
      switch (inputType) {
        case "password":
          return (
            <div className={`${inputStyle} ${className} overflow-hidden`}>
              {doCopy ? (
                <input
                  required
                  name={name}
                  onChange={onChange}
                  onKeyDown={onKeyDown}
                  tabIndex={tabIndex}
                  placeholder={placeholder}
                  value={value}
                  type={showPassword ? "text" : "password"}
                  className={`outline-none border-none disabled:cursor-not-allowed disabled:opacity-50 !bg-transparent w-full focus:!bg-transparent focus-within:!bg-transparent focus-visible:!bg-transparent  px-3 py-2`}
                  onBlur={handleBlur}
                  disabled={disabled}
                  onInvalid={handleInvalid}
                />
              ) : (
                <input
                  required
                  name={name}
                  disabled={disabled}
                  onChange={onChange}
                  onKeyDown={onKeyDown}
                  tabIndex={tabIndex}
                  placeholder={placeholder}
                  value={value}
                  onCopy={(e) => e.preventDefault()}
                  onPaste={(e) => e.preventDefault()}
                  type={showPassword ? "text" : "password"}
                  className={`outline-none border-none disabled:cursor-not-allowed disabled:opacity-50 !bg-transparent w-full focus:!bg-transparent focus-within:!bg-transparent focus-visible:!bg-transparent  px-3 py-2`}
                  onBlur={handleBlur}
                  onInvalid={handleInvalid}
                />
              )}
              <div
                onClick={() => setShowPassword((prev) => !prev)}
                className="w-12  min-w-[2rem] cursor-pointer  h-full flex justify-center items-center p-2 px-3"
              >
                {showPassword ? (
                  <BsEyeFill fontSize={24} />
                ) : (
                  <BsEyeSlashFill fontSize={24} />
                )}
              </div>
            </div>
          );

        case "textarea":
          return (
            <textarea
              required={required}
              name={name}
              disabled={disabled}
              value={value}
              rows={rows ?? 10}
              cols={6}
              onChange={onChange}
              onKeyDown={onKeyDown}
              tabIndex={tabIndex}
              autoFocus
              spellCheck={true}
              autoCapitalize=""
              placeholder={placeholder}
              className={`!h-auto resize-y ${inputStyle} ${className}  px-3 py-2 test-instructions`}
              onBlur={handleBlur}
            />
          );

        case "outline_textarea":
          return (
            <textarea
              required={required}
              name={name}
              disabled={disabled}
              value={value}
              rows={rows ?? 10}
              cols={6}
              onChange={(e) => onChange(e)}
              onKeyDown={onKeyDown}
              tabIndex={tabIndex}
              autoFocus
              autoCapitalize=""
              placeholder={placeholder}
              className={`cursor-pointer input`}
              onBlur={handleBlur}
            />
          );

        case "num_select":
          return (
            <div className={`${inputStyle} overflow-hidden`}>
              <input
                required={required}
                name={name}
                onChange={onChange}
                onKeyDown={onKeyDown}
                tabIndex={tabIndex}
                value={value}
                placeholder={placeholder}
                type={type}
                className="outline-none !bg-transparent w-full focus:!bg-transparent focus-within:!bg-transparent focus-visible:!bg-transparent  px-3 py-2"
                onBlur={handleBlur}
                onInvalid={handleInvalid}
              />
              <div
                onClick={() => setShowPassword((prev) => !prev)}
                className="w-16  min-w-[4rem] cursor-pointer text-gray-900 h-full flex justify-center items-center p-2 px-3"
              >
                {typeof num_select_placeholder === "string" ? (
                  <span
                    className={` ${
                      theme === "dark" ? "text-gray-300" : "text-[#737373]"
                    }`}
                  >
                    {num_select_placeholder}
                  </span>
                ) : (
                  num_select_placeholder
                )}
              </div>
            </div>
          );

        case "fx_select":
          return (
            <div className={`${inputStyle} `}>
              <input
                required={required}
                name={name}
                onChange={onChange}
                onKeyDown={onKeyDown}
                tabIndex={tabIndex}
                value={value}
                placeholder={"Enter value"}
                type={type}
                className="outline-none !bg-transparent w-full focus:!bg-transparent focus-within:!bg-transparent focus-visible:!bg-transparent  px-3 py-2"
                onBlur={handleBlur}
                onInvalid={handleInvalid}
              />
              <select
                value={selectValue}
                onChange={onSelect}
                className="p-2 min-w-20 outline-none -translate-x-2  cursor-pointer"
              >
                {options?.map((opt) => (
                  <option
                    key={opt.id}
                    value={opt.id}
                    className="cursor-pointer p-4"
                  >
                    {opt.name}
                  </option>
                ))}
              </select>
            </div>
          );

        case "check_box":
          return (
            <div className="flex items-semibold justify-start gap-2 ">
              <Checkbox
                size="sm"
                name={name}
                checked={checked}
                className="-translate-x-2"
                onChange={(e) =>
                  onChange({
                    target: { name, value: e.target.checked },
                  } as unknown as React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>)
                }
              />
              {renderLabel()}
            </div>
          );

        case "phoneNumber":
          return (
            <input
              required={required}
              name={name}
              type="tel"
              ref={ref}
              onFocus={onFocus}
              onKeyDown={onKeyDown}
              tabIndex={tabIndex}
              disabled={disabled}
              value={phoneNo}
              onChange={handlePhoneNumberChange}
              placeholder={placeholder}
              className={`${inputStyle} ${className} ${
                showError || error ? "border-2 border-[tomato]" : ""
              } px-3 py-2`}
              onBlur={handleBlur}
              onInvalid={handleInvalid}
              pattern="^\+[0-9]+$"
              title="Please enter a valid phone number starting with + followed by digits"
            />
          );

        case "card":
          return (
            <div className={`${inputStyle} overflow-hidden`}>
              <div className="w-20 min-w-[5rem] p-3 cursor-pointer h-full flex justify-center items-center">
                <div className="  h-full  flex justify-center items-center ">
                  <Image
                    src="/images/mastercard.svg"
                    alt={""}
                    width={80}
                    height={80}
                  />
                </div>
              </div>
              <input
                required={required}
                name={name}
                onChange={onChange}
                onKeyDown={onKeyDown}
                tabIndex={tabIndex}
                placeholder={placeholder}
                value={value}
                type={type}
                className="outline-none !bg-transparent w-full focus:!bg-transparent focus-within:!bg-transparent focus-visible:!bg-transparent  px-3 py-2"
                onBlur={handleBlur}
                onInvalid={handleInvalid}
              />
            </div>
          );

        case "outline":
          return (
            <input
              required={required}
              name={name}
              type={type}
              onKeyDown={onKeyDown}
              tabIndex={tabIndex}
              disabled={disabled}
              value={value}
              defaultValue={defaultValue}
              onChange={onChange}
              placeholder={placeholder}
              className={`cursor-pointer input`}
              onBlur={handleBlur}
              onInvalid={handleInvalid}
            />
          );

        case "default":
        default:
          return (
            <input
              required={required}
              name={name}
              type={type}
              ref={ref}
              onFocus={onFocus}
              onKeyDown={onKeyDown}
              tabIndex={tabIndex}
              disabled={disabled}
              value={value}
              defaultValue={defaultValue}
              onChange={onChange}
              placeholder={placeholder}
              className={`${inputStyle} ${className} ${text_color} px-3 py-2`}
              onBlur={handleBlur}
              onInvalid={handleInvalid}
            />
          );
      }
    };

    return (
      <div
        className={`flex flex-col ${
          inputType === "check_box" ? "gap-2" : "gap-0.5"
        } w-full ${
          inputType === "outline" || inputType === "outline_textarea"
            ? "input-container"
            : ""
        }`}
      >
        {inputType !== "check_box" && renderLabel()}
        {renderInputField()}
        {renderBottomLabel()}
        {renderError()}
      </div>
    );
  }
);
Input.displayName = "Input";

export default Input;
