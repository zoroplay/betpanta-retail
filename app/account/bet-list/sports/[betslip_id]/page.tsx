"use client";
import React from "react";
import Table from "@/components/tables/Table";
import BaseCard from "@/components/layout/BaseCard";

const couponDetails = {
  couponCode: "8NJY-MMTZX-2-SDXE",
  date: "May 1 2025 8:43",
  betType: "Multiple",
  status: "Lost",
};

const singleMultipleDetails = {
  amount: "₦5,000.00",
  maxBonus: "₦0.00",
  potentialWinnings: "₦14,816.10",
  totalOdds: "2.96",
};

const eventList = [
  {
    eventId: "1002311213",
    event:
      "Football - Brazil - Campeonato Brasileiro Serie A Women - Sao Paulo FC SP (W) - America MG (W)",
    pick: "1 X 2",
    type: "1",
    odds: "1.31",
    result: "FT: 1 - 3\nHT: 0 - 0\n2HT: 1 - 3",
    outcome: "Lost",
    date: "May 1 2025 8:43",
  },
  {
    eventId: "1002311213",
    event: "Football - Chile - Copa - CD Palestino - Deportes Concepcion",
    pick: "Double Chance & Total Goals 4.5",
    type: "1X And Under (4.50)",
    odds: "1.30",
    result: "FT: 4 - 4\nHT: 1 - 1\n2HT: 3 - 3",
    outcome: "Lost",
    date: "May 1 2025 8:43",
  },
  {
    eventId: "1002311213",
    event: "Football - UEFA - Champions League - FC Barcelona - Inter",
    pick: "1 X 2",
    type: "1",
    odds: "1.31",
    result: "FT: 3 - 3\nHT: 2 - 2\n2HT: 1 - 1",
    outcome: "Lost",
    date: "May 1 2025 8:43",
  },
];

const eventTableColumns = [
  { id: "eventId", name: "Event ID" },
  { id: "event", name: "Event" },
  { id: "pick", name: "Pick" },
  { id: "type", name: "Type" },
  { id: "odds", name: "Odds" },
  { id: "result", name: "Result" },
  { id: "outcome", name: "Outcome" },
  { id: "date", name: "Date" },
];

const CouponDetailsPage = () => {
  return (
    <div className="bg-blue-50 min-h-screen p-6">
      <div className="mb-4 flex items-center gap-2">
        <span className="text-gray-600 cursor-pointer">&lt; Go back</span>
        <h2 className="text-lg font-bold text-gray-900">
          Coupon Details Sports
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <BaseCard title="Coupon Details">
          <table className="w-full text-xs">
            <tbody>
              <tr>
                <td className="py-2 px-4 text-gray-700">Coupon Code</td>
                <td className="py-2 px-4 text-gray-900 font-semibold">
                  {couponDetails.couponCode}
                </td>
              </tr>
              <tr>
                <td className="py-2 px-4 text-gray-700">Date</td>
                <td className="py-2 px-4 text-gray-900">
                  {couponDetails.date}
                </td>
              </tr>
              <tr>
                <td className="py-2 px-4 text-gray-700">Bet Type</td>
                <td className="py-2 px-4 text-gray-900">
                  {couponDetails.betType}
                </td>
              </tr>
              <tr>
                <td className="py-2 px-4 text-gray-700">Status</td>
                <td className="py-2 px-4 text-red-600 font-semibold">
                  {couponDetails.status}
                </td>
              </tr>
            </tbody>
          </table>
        </BaseCard>
        <BaseCard title="Single/Multiple Details">
          <table className="w-full text-xs">
            <tbody>
              <tr>
                <td className="py-2 px-4 text-gray-700">Amount</td>
                <td className="py-2 px-4 text-gray-900 font-semibold">
                  {singleMultipleDetails.amount}
                </td>
              </tr>
              <tr>
                <td className="py-2 px-4 text-gray-700">Max. Bonus Applied</td>
                <td className="py-2 px-4 text-gray-900">
                  {singleMultipleDetails.maxBonus}
                </td>
              </tr>
              <tr>
                <td className="py-2 px-4 text-gray-700">Potential Winnings</td>
                <td className="py-2 px-4 text-gray-900">
                  {singleMultipleDetails.potentialWinnings}
                </td>
              </tr>
              <tr>
                <td className="py-2 px-4 text-gray-700">Total Odds</td>
                <td className="py-2 px-4 text-gray-900">
                  {singleMultipleDetails.totalOdds}
                </td>
              </tr>
            </tbody>
          </table>
        </BaseCard>
      </div>
      <BaseCard title="Event List" className="">
        <Table
          columns={eventTableColumns}
          data={eventList}
          isLoading={false}
          className="grid-cols-8"
          rounded="rounded-b-lg border-0"
        />
      </BaseCard>
    </div>
  );
};

export default CouponDetailsPage;
