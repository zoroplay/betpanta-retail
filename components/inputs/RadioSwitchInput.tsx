import React from "react";
import Switch from "react-switch";
import { useTheme } from "../providers/ThemeProvider";

interface RadioSwitchInputProps {
  icon: React.ReactNode;
  head: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  show_status?: string;
  onClick?: () => void;
}

const RadioSwitchInput: React.FC<RadioSwitchInputProps> = ({
  icon,
  head,
  checked,
  onChange,
  disabled = false,
  show_status,
  onClick,
}) => {
  const { theme } = useTheme();
  const is_dark = theme === "dark";
  return (
    <div
      className={`w-full  cursor-pointer border h-[38px] min-w-[200px] rounded-md flex justify-between items-center gap-4 ${
        disabled ? "opacity-50 cursor-not-allowed pointer-events-none" : ""
      }  ${
        is_dark
          ? "border-slate-600/50 focus:border-slate-500 bg-gradient-to-br from-slate-900/50 to-slate-800/50 backdrop-blur-sm"
          : "border-gray-300 bg-white"
      }`}
    >
      <div
        onClick={() => {
          if (onClick) {
            onClick();
          }
        }}
        className="flex justify-start items-center gap-1.5 w-full px-3"
      >
        <span
          className={`min-w-]  ${is_dark ? "text-gray-500" : "text-gray-600"}`}
        >
          {icon}
        </span>
        <p
          className={`font-semibold text-xs ${
            is_dark ? "text-gray-400" : "text-gray-700"
          }`}
        >
          {head}
        </p>
      </div>
      {show_status && (
        <span className="text-[10px] whitespace-nowrap text-gray-500">
          {show_status}
        </span>
      )}
      <div className=" flex justify-center items-center px-2 scale-80">
        <Switch
          onColor="#3B82F6"
          onHandleColor="#FFFFFF"
          handleDiameter={20}
          uncheckedIcon={false}
          checkedIcon={false}
          boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
          activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
          // height={24}
          // width={48}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
        />
      </div>
    </div>
  );
};

export default RadioSwitchInput;
