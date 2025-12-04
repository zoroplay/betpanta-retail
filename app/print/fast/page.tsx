"use client";

import { useState } from "react";

const printingTypes = [
  { label: "Football", value: "football" },
  { label: "Basketball", value: "basketball" },
  { label: "Tennis", value: "tennis" },
];

const mockDates = [
  "Thu. 22 May",
  "Fri. 23 May",
  "Sat. 24 May",
  "Sun. 25 May",
  "Mon. 26 May",
  "Tue. 27 May",
  "Wed. 28 May",
  "Thu. 29 May",
  "Fri. 30 May",
  "Sat. 31 May",
  "Sun. 01 Jun",
  "Mon. 02 Jun",
  "Tue. 03 Jun",
  "Wed. 04 Jun",
  "Thu. 05 Jun",
  "Fri. 06 Jun",
  "Sat. 07 Jun",
  "Sun. 08 Jun",
  "Mon. 09 Jun",
  "Tue. 10 Jun",
];

export default function FastPrintPage() {
  const [selectedType, setSelectedType] = useState<string>("tennis");
  const [selectedDates, setSelectedDates] = useState<string[]>([]);

  const handleTypeSelect = (value: string) => {
    setSelectedType(value);
  };

  const handleDateToggle = (date: string) => {
    setSelectedDates((prev) =>
      prev.includes(date) ? prev.filter((d) => d !== date) : [...prev, date]
    );
  };

  const handleSelectAllDates = () => {
    setSelectedDates([...mockDates]);
  };

  // Split dates into 4 columns for grid
  const dateColumns = [[], [], [], []] as string[][];
  mockDates.forEach((date, idx) => {
    dateColumns[idx % 4].push(date);
  });

  return (
    <div className="bg-blue-50 min-h-screen p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-gray-900">Fast Print</h1>
        <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold text-sm flex items-center gap-2">
          Proceed to print <span className="ml-1">&gt;</span>
        </button>
      </div>
      <div className="bg-white rounded-lg">
        {/* Printing Types Header */}
        <div className="bg-black text-xs text-white font-semibold grid grid-cols-1 rounded-t-lg">
          <div className="py-2 px-4 flex justify-start items-center">
            Printing Types
          </div>
        </div>
        {/* Printing Types Row */}
        <div className="grid grid-cols-3 border-b border-gray-200">
          {printingTypes.map((type) => (
            <label
              key={type.value}
              className="flex items-center gap-2 py-4 px-6 cursor-pointer justify-center border-r last:border-r-0 border-gray-200"
            >
              <input
                type="checkbox"
                checked={selectedType === type.value}
                onChange={() => handleTypeSelect(type.value)}
                className="accent-red-600 w-5 h-5"
              />
              <span
                className={`text-base ${
                  selectedType === type.value
                    ? "font-semibold text-red-600"
                    : "text-gray-700"
                }`}
              >
                {type.label}
              </span>
            </label>
          ))}
        </div>
        {/* Dates Header */}
        <div className="bg-black text-xs text-white font-semibold grid grid-cols-[1fr_auto]">
          <div className="py-2 px-4 flex justify-start items-center">Dates</div>
          <button
            className="text-xs text-blue-100 hover:text-white font-semibold px-2 py-1"
            onClick={handleSelectAllDates}
          >
            Select all
          </button>
        </div>
        {/* Dates Grid */}
        <div className="grid grid-cols-4 gap-0 divide-x divide-gray-200">
          {dateColumns.map((col, colIdx) => (
            <div key={colIdx} className="flex flex-col">
              {col.map((date) => (
                <label
                  key={date}
                  className="flex items-center gap-2 py-3 px-6 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedDates.includes(date)}
                    onChange={() => handleDateToggle(date)}
                    className="accent-gray-400 w-5 h-5"
                  />
                  <span className="text-base text-gray-700">{date}</span>
                </label>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
