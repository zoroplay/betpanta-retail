/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import Input from "@/components/inputs/Input";
import SingleSearchInput from "@/components/inputs/SingleSearchInput";
import BaseCard from "@/components/layout/BaseCard";
import Image from "next/image";
import { useState } from "react";

interface Transaction {
  id: string;
  date: string;
  transaction: string;
  betslip: string;
  credit: string;
  debit: string;
  subject: string;
  balance: string;
}

const mockRegions = [
  {
    flag: "https://upload.wikimedia.org/wikipedia/en/a/a4/Flag_of_the_United_Kingdom.svg",
    name: "England",
    leagues: [
      "Premier League",
      "Championship",
      "League One",
      "League Two",
      "FA Cup",
      "National League",
      "FA Cup Women",
    ],
  },
  {
    flag: "https://upload.wikimedia.org/wikipedia/commons/9/9a/Flag_of_Spain.svg",
    name: "Spain",
    leagues: ["LaLiga", "LaLiga2", "Segunda Federacion", "Primera Federacion"],
  },
  {
    flag: "https://upload.wikimedia.org/wikipedia/commons/0/03/Flag_of_Italy.svg",
    name: "Italy",
    leagues: ["Serie A", "Serie B", "Serie C Playoffs", "Primavera 1"],
  },
  {
    flag: "https://upload.wikimedia.org/wikipedia/en/b/ba/Flag_of_Germany.svg",
    name: "Germany",
    leagues: ["Bundesliga", "Bundesliga 2", "Bundesliga 3", "DFB Pokal"],
  },
  {
    flag: "https://upload.wikimedia.org/wikipedia/en/c/c3/Flag_of_France.svg",
    name: "France",
    leagues: ["Ligue 1", "National", "Coupe de France", "Division 1 Feminines"],
  },
  {
    flag: "https://upload.wikimedia.org/wikipedia/commons/2/20/Flag_of_the_Netherlands.svg",
    name: "Netherlands",
    leagues: ["Eredivisie", "Eredivisie Women", "Bundesliga 3", "DFB Pokal"],
  },
  {
    flag: "https://upload.wikimedia.org/wikipedia/commons/5/5c/Flag_of_Portugal.svg",
    name: "Portugal",
    leagues: [
      "Primeira Liga",
      "Segunda Liga",
      "Taca de Portugal",
      "U23 Championship",
      "Liga 3",
    ],
  },
  {
    flag: "https://upload.wikimedia.org/wikipedia/commons/6/65/Flag_of_Belgium.svg",
    name: "Belgium",
    leagues: ["Bundesliga", "Bundesliga 2", "Bundesliga 3", "DFB Pokal"],
  },
  {
    flag: "https://upload.wikimedia.org/wikipedia/commons/1/10/Flag_of_Scotland.svg",
    name: "Scotland",
    leagues: ["Bundesliga", "Bundesliga 2", "Bundesliga 3", "DFB Pokal"],
  },
];

const FastPrintPage = () => {
  const [amountType, setAmountType] = useState<"all" | "credits" | "debits">(
    "all"
  );
  const [selectedLeagues, setSelectedLeagues] = useState<string[]>([
    "Serie C Playoffs",
  ]);

  const handleLeagueToggle = (league: string) => {
    setSelectedLeagues((prev) =>
      prev.includes(league)
        ? prev.filter((l) => l !== league)
        : [...prev, league]
    );
  };

  const handleSelectAll = () => {
    const allLeagues = mockRegions.flatMap((region) => region.leagues);
    setSelectedLeagues(allLeagues);
  };

  return (
    <div className="bg-blue-50 min-h-screen p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-gray-900">Standard Print</h1>
        <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold text-sm flex items-center gap-2">
          Next <span className="ml-1">&gt;</span>
        </button>
      </div>
      <div className="flex gap-2 mb-4">
        <Input
          type="text"
          placeholder="Search by region/type or league"
          className="w-full rounded bg-white border border-gray-200 text-sm focus:outline-none"
          bg_color={`bg-white`}
          border_color={`border-gray-200`}
          height="h-[36px]"
          text_color="text-gray-700 text-xs"
          name={"search"}
          onChange={() => {}}
        />
        <Input
          type="text"
          placeholder="Type: Football"
          className="w-full rounded bg-white border border-gray-200 text-sm focus:outline-none"
          bg_color={`bg-white`}
          border_color={`border-gray-200`}
          height="h-[36px]"
          text_color="text-gray-700 text-xs"
          name={"type"}
          onChange={() => {}}
        />
        <Input
          type="text"
          placeholder="Date: ALL"
          className="w-full rounded bg-white border border-gray-200 text-sm focus:outline-none"
          bg_color={`bg-white`}
          border_color={`border-gray-200`}
          height="h-[36px]"
          text_color="text-gray-700 text-xs"
          name={"date"}
          onChange={() => {}}
        />
      </div>
      <BaseCard
        title="Football Prematch"
        headerClassName="flex justify-between items-center"
        optionalLabel={
          <button
            className="text-xs text-blue-100 hover:text-white font-semibold px-2 py-1"
            onClick={handleSelectAll}
          >
            Select all
          </button>
        }
      >
        <div className="bg-white">
          <div className="bg-black text-xs text-white font-semibold grid grid-cols-[1fr_5fr]">
            <div className="py-2 px-4 flex justify-start items-center">
              Region/Type
            </div>
            <div className="py-2 px-4 border-l border-gray-700 flex justify-start items-center">
              Leagues
            </div>
          </div>
          {mockRegions.map((region) => (
            <div
              key={region.name}
              className="grid grid-cols-[1fr_5fr] border-b border-gray-200"
            >
              <div className="flex items-center gap-2 py-2 px-4">
                <Image
                  src={region.flag}
                  alt={region.name + " flag"}
                  className="w-6 h-4 rounded border"
                  width={100}
                  height={100}
                />
                <span className="font-semibold text-gray-800 text-xs">
                  {region.name}
                </span>
              </div>
              <div className="grid grid-cols-5 gap-2 py-2 px-4">
                {region.leagues.map((league) => (
                  <label
                    key={league}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedLeagues.includes(league)}
                      onChange={() => handleLeagueToggle(league)}
                      className="accent-blue-600 w-4 h-4"
                    />
                    <span
                      className={`text-xs ${
                        selectedLeagues.includes(league)
                          ? "font-semibold text-red-600"
                          : "text-gray-700"
                      }`}
                    >
                      {league}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </BaseCard>
    </div>
  );
};

export default FastPrintPage;
