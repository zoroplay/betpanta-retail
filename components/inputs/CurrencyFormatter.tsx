import { useAppSelector } from "@/hooks/useAppDispatch";
import React, { useState } from "react";

type Props = {
  amount: number | string;
  className: string;
  spanClassName: string;
  precision?: number;
};

const CurrencyFormatter = ({
  amount = 0,
  className = "",
  spanClassName = "",
  precision = 1,
}: Props) => {
  const [isAbbreviated, setIsAbbreviated] = useState(false);
  const { global_variables } = useAppSelector((state) => state.app);
  const locale = global_variables?.currency_code === "NGN" ? "en-NG" : "en-US";
  const currency = global_variables?.currency_code || "NGN";

  let numeric_amount = typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(numeric_amount)) numeric_amount = 0;

  const formatAbbreviated = (value: number) => {
    const absValue = Math.abs(value);

    // Don't abbreviate numbers under 1,000
    if (absValue < 1000) {
      return new Intl.NumberFormat(locale, {
        style: "currency",
        currency: currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    }

    // Handle larger numbers
    if (absValue >= 1e9) {
      return `${global_variables?.currency}${(value / 1e9).toFixed(
        precision
      )}B`;
    }
    if (absValue >= 1e6) {
      return `${global_variables?.currency}${(value / 1e6).toFixed(
        precision
      )}M`;
    }
    if (absValue >= 1e3) {
      return `${global_variables?.currency}${(value / 1e3).toFixed(
        precision
      )}K`;
    }
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency || "NGN",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatCurrency = (value: number) => {
    if (isAbbreviated) {
      const formatted = formatAbbreviated(value);
      // If the value is under 1000, check if it's under 100
      if (Math.abs(value) < 1000) {
        // For values under $100, render as usual (no splitting)
        if (Math.abs(value) < 100) {
          return {
            integer: formatted,
            decimal: "",
          };
        }
        // For values $100-$999, split integer and decimal parts
        const parts = formatted.split(".");
        return {
          integer: parts[0],
          decimal: parts[1] || "",
        };
      }
      return {
        integer: formatted,
        decimal: "",
      };
    }

    const formatted = new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency || "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);

    // For values under $100, render as usual (no splitting)
    if (Math.abs(value) < 100) {
      return {
        integer: formatted,
        decimal: "",
      };
    }

    // For values $100 and above, split integer and decimal parts
    const parts = formatted.split(".");
    return {
      integer: parts[0],
      decimal: parts[1] || "00",
    };
  };

  const formatted = formatCurrency(numeric_amount);

  const handleClick = () => {
    // Only allow toggling for numbers >= 1000
    if (Math.abs(numeric_amount) >= 1000) {
      setIsAbbreviated(!isAbbreviated);
    }
  };

  return (
    <div
      className={`text-inherit ${className}  ${
        Math.abs(numeric_amount) >= 1000
          ? "cursor-pointer hover:opacity-80"
          : ""
      } transition-opacity`}
      onClick={handleClick}
      title={
        Math.abs(numeric_amount) >= 1000
          ? isAbbreviated
            ? "Click to show full amount"
            : "Click to show abbreviated amount"
          : undefined
      }
    >
      <span className={`text-inherit ${className}`}>{formatted.integer}</span>
      {!isAbbreviated && formatted.decimal && (
        <span className={`${spanClassName} text-[#9096A2]`}>
          .{formatted.decimal}
        </span>
      )}
      {isAbbreviated && formatted.decimal && (
        <span className={`${spanClassName} text-[#9096A2]`}>
          .{formatted.decimal}
        </span>
      )}
    </div>
  );
};

export default CurrencyFormatter;
