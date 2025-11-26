import React from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa6";

type Props = {};

const IncrementInput = (props: Props) => {
  return (
    <div className="flex flex-col items-center border border-[#9096AC] w-36 overflow-hidden h-[12rem] rounded-2xl">
      <button
        type="button"
        // onClick={incrementHours}
        className="p-1 h-8 w-full rounded flex cursor-pointer justify-center items-center hover:bg-gray-100 transition-all"
      >
        <FaChevronUp fontSize={24} color="#9096AC" />
      </button>
      <input
        type="number"
        min="0"
        max="23"
        // value={hours}
        // onChange={(e) => handleHoursChange(Number(e.target.value))}
        className="w-full no-spinner h-[8rem] text-6xl font-bold text-center outline-none border-none rounded-md"
      />
      <button
        type="button"
        // onClick={decrementHours}
        className="p-1 h-8 w-full flex cursor-pointer justify-center items-center hover:bg-gray-100 transition-all"
      >
        <FaChevronDown fontSize={24} color="#9096AC" />
      </button>
    </div>
  );
};

export default IncrementInput;
