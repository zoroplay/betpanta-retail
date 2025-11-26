"use client";
import React, { useState } from "react";
import { FaCheck } from "react-icons/fa6";
import { cn } from "@/lib/utils";
import { FaAngleDown } from "react-icons/fa6";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/tools/select";
import ImageBlock from "./ImageBlock";
type Props = {
  name?: string;
  value?: string;
  label?: string;
  options: { id: string; flag?: string; name: string | number }[];
  number?: boolean;
  country?: boolean;
  required?: boolean;
  main?: boolean;
  disabled?: boolean;
  placeholder: string;
  defaultKey?: string;
  mainKey?: string;
  is_main_key?: boolean;
  error?: null | string;
  selectionMode?: "single" | "multiple";
  onChange: (t: any) => void;
  bottomLabel?: React.ReactElement;
  optionalLabel?: React.ReactElement;
  className: string;
  height?: string;
  maxHeight?: string;
};

const SelectInput = ({
  label,
  value,
  error,
  options,
  disabled,
  onChange,
  required,
  placeholder,
  bottomLabel,
  optionalLabel,
  className,
  height = "h-[46px]",
  maxHeight,
}: Props) => {
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <div className="flex justify-between items-center gap-4">
          <label className="text- font-semibold" htmlFor="">
            {label}
          </label>
          {optionalLabel && (
            <span className="text-[10px] text-slate-700">{optionalLabel}</span>
          )}
        </div>
      )}
      <Select
        onValueChange={onChange}
        value={value}
        // required={formData.edit ? false : true}
        required
      >
        <SelectTrigger
          className={`${className} !h-7 cursor-pointer transition-none min-w-24 ${height}`}
        >
          <SelectValue
            className={" text-white"}
            defaultValue={value}
            placeholder={placeholder}
          />
        </SelectTrigger>
        <SelectContent
          className={`${className} ${
            maxHeight ? maxHeight : ""
          } overflow-y-auto`}
          position="popper"
          sideOffset={4}
        >
          {options.length > 0 ? (
            options.map((option) => (
              <SelectItem
                key={option.id}
                className="cursor-pointer duration-150 hover:bg-blue-500 hover:text-white transition-all flex gap-2 items-center"
                value={option?.id}
              >
                <div className="flex gap-2 items-center justify-between w-full">
                  <p className={`truncate`}>{option.name}</p>
                  {option.flag && (
                    <div className="w-6 h-4 rounded-md overflow-hidden pointer-events-none">
                      <ImageBlock src={option.flag} />
                    </div>
                  )}
                </div>
              </SelectItem>
            ))
          ) : (
            <SelectItem
              className={`${className} text-[10px] p-2`}
              key="No options available"
              value="No options available"
            >
              No options available
            </SelectItem>
          )}
        </SelectContent>
      </Select>

      {bottomLabel && (
        <div className="flex justify-start items-center gap-4 w-full">
          {bottomLabel}
        </div>
      )}
      {error && (
        <div
          className={`overflow-hidden  ${error ? "h-4" : "h-0"} transition-all`}
        >
          <p
            className={`text-[10px] font-bold text-red transition-all ${
              error ? "opacity-1" : "opacity-0"
            }`}
          >
            *{error}
          </p>
        </div>
      )}
    </div>
  );
};

export default SelectInput;
