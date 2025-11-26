import { cn } from "@/lib/utils";
import React, { useState, useRef } from "react";
import { IconType } from "react-icons/lib";

type Props = {
  options: { title: string; icon?: IconType }[];
  selected: number;
  onChange: (t: any) => void;
  className?: string;
  rounded?: string;
  background?: string;
  thumb_background?: string;
  thumb_color?: string;
  text_color?: string;
  selected_text_color?: string;
  required?: boolean;
  error?: string;
  disabled?: boolean;
};

const SwitchInput = ({
  options,
  selected,
  onChange,
  className,
  rounded,
  background,
  thumb_background,
  thumb_color,
  text_color,
  selected_text_color,
  required = false,
  error,
  disabled = false,
}: Props) => {
  const [internalError, setInternalError] = useState<string | null>(null);
  const hiddenInputRef = useRef<HTMLInputElement>(null);

  const handleBlur = () => {
    if (hiddenInputRef.current) {
      const isValid = hiddenInputRef.current.checkValidity();
      if (!isValid) {
        setInternalError("Please make a selection");
      } else {
        setInternalError(null);
      }
    }
  };

  const handleInvalid = (e: React.InvalidEvent<HTMLInputElement>) => {
    e.preventDefault();
    setInternalError("Please make a selection");
  };

  return (
    <div
      className={`relative ${
        background ? background : "bg-[#F5F9FF]"
      } p-2 flex flex-col gap-1 w-full ${cn(className)} ${
        rounded ? rounded : "rounded-full"
      }`}
    >
      <div
        className={`relative flex justify-between items-center w-full ${
          thumb_background ? thumb_background : "bg-gray-200"
        } ${rounded ? rounded : "rounded-full"}`}
      >
        <div
          className={`absolute  ${thumb_color ? thumb_color : "bg-white"} ${
            options.length === 2
              ? "w-1/2"
              : options.length === 3
              ? "w-1/3"
              : options.length === 4
              ? "w-1/4"
              : options.length === 5
              ? "w-1/5"
              : options.length === 6
              ? "w-1/6"
              : options.length === 7
              ? "w-1/7"
              : "w-1/8"
          } h-full ${
            rounded ? rounded : "rounded-full"
          } transition-all duration-300 ease-in-out shadow-md`}
          style={{
            transform: `translateX(${selected * 100}%)`,
          }}
        />
        {options.map((option, index) => (
          <button
            type="button"
            key={index}
            onClick={() => {
              setInternalError(null);
              onChange(index);
            }}
            className={`relative cursor-pointer text-xs z-10 text-center tracking-wide ${
              options.length === 2
                ? "w-1/2"
                : options.length === 3
                ? "w-1/3"
                : options.length === 4
                ? "w-1/4"
                : "w-1/5"
            } flex gap-2 outline-none justify-center capitalize items-center py-1.5 rounded-full ${
              selected === index
                ? selected_text_color
                  ? selected_text_color
                  : "text-black font-semibold"
                : text_color
                ? text_color
                : "text-[#9096A2]"
            }`}
            disabled={disabled}
          >
            {option.icon && (
              <option.icon fontSize={16} size={16} className={cn("")} />
            )}
            {option.title}
          </button>
        ))}
      </div>
      {/* Hidden required checker */}
      {required && (
        <div className="hidden">
          <input
            ref={hiddenInputRef}
            required
            type="text"
            value={selected >= 0 ? "valid" : ""}
            onBlur={handleBlur}
            onInvalid={handleInvalid}
            disabled={disabled}
          />
        </div>
      )}
      {/* Error message display */}
      {(internalError || error) && (
        <p className="mt-1 text-[10px] text-[tomato] font-semibold">
          {internalError || error}
        </p>
      )}
    </div>
  );
};

export default SwitchInput;
