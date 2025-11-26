import { cn } from "@/lib/utils";
import React, { useRef, useEffect, useState } from "react";
import { IconType } from "react-icons/lib";
import { useTheme } from "@/components/providers/ThemeProvider";

type Props = {
  options: { id?: number; title: string; icon?: IconType }[];
  selected: number;
  onChange: (t: any) => void;
  className?: string;
  underlineColor?: string;
  textClassName?: string;
  selectedTextClassName?: string;
  underline?: boolean;
};

const UnderlineSwitchInput = ({
  options,
  selected,
  onChange,
  className,
  underlineColor = "bg-blue-600 h-[3px]",
  textClassName = "text-gray-500",
  selectedTextClassName = "text-blue-600",
  underline = true,
}: Props) => {
  const [underlineWidth, setUnderlineWidth] = useState(0);
  const [underlineLeft, setUnderlineLeft] = useState(0);
  const { theme } = useTheme();
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const selectedButton = buttonRefs.current[selected];
    if (selectedButton) {
      const { width, left } = selectedButton.getBoundingClientRect();
      const parentLeft =
        selectedButton.parentElement?.getBoundingClientRect().left || 0;
      const underlineW = width - 20;
      setUnderlineWidth(underlineW);
      setUnderlineLeft(left - parentLeft + (width - underlineW) / 2);
    }
  }, [selected]);

  return (
    <div className={cn("relative w-full", className)}>
      <div className="flex justify-between items-center w-full">
        {options.map((option, index) => (
          <button
            ref={(el) => {
              buttonRefs.current[index] = el;
            }}
            type="button"
            key={index}
            onClick={() => onChange(index)}
            className={cn(
              "relative cursor-pointer z-10 text-center tracking-wide py-2 px-4 transition-colors duration-300 whitespace-nowrap",
              selected === index ? selectedTextClassName : textClassName
            )}
          >
            <div className="flex items-center gap-2 whitespace-nowrap">
              {option.icon && (
                <option.icon fontSize={16} size={16} className={cn("")} />
              )}
              <span className="whitespace-nowrap font-semibold">
                {option.title}
              </span>
            </div>
          </button>
        ))}
        {/* Single underline element that moves */}
        <div
          className={cn(
            "absolute -bottom-0.5 z-20 rounded-full transition-all duration-300 ease-in-out",
            underlineColor
          )}
          style={{
            width: `${underlineWidth}px`,
            left: `${underlineLeft}px`,
          }}
        />
      </div>
      {underline && (
        <div
          className={`h-[1px] ${
            theme === "dark" ? "bg-[#a6adc4]/50" : "bg-[#a6adc4]"
          } w-full`}
        />
      )}
    </div>
  );
};

export default UnderlineSwitchInput;
