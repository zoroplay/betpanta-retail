"use client";
import BaseCard from "@/components/layout/BaseCard";
import { useState } from "react";

const topics = [
  {
    title: "How Commission Estimate Works",
    content: (
      <>
        <h2 className="font-semibold mb-2">What is Commission Estimate?</h2>
        <p className="mb-4">
          Commission Estimate is a report that provides an agent with visibility
          into his estimated commission per day. It has the capacity to drill
          down to see commission calculation based on commission band per
          coupon/ticket and the ability to export coupons to verify the
          authenticity.
        </p>
        <p className="mb-4">
          The Commission Estimate report is for both Sports and Virtual and can
          only be accessed using Agent`s admin account. The report is divided
          into 4 sub-title based on the product type as seen below:
        </p>
        <ol className="list-decimal list-inside mb-4">
          <li>Sports Commission Estimate</li>
          <li>BK Virtual Commission Estimate</li>
          <li>GB Virtual League Commission Estimate</li>
          <li>Color Color Commission Estimate</li>
        </ol>
        <p className="mb-4">
          The Commission Estimate report can be filtered into 3 segments
          reflecting the following;
        </p>
        <ol className="list-decimal list-inside mb-4">
          <li>
            1st segment by Date showing the combined estimated commission for
            the day for all settled bet
          </li>
          <li>
            2nd segment shows a breakdown of estimated commission reflecting the
            grouped ticket based on the number of selections and commission band
            attached to each
          </li>
          <li>
            3rd segment shows all the coupons codes and its export enabled for
            verification
          </li>
        </ol>
        <h2 className="font-semibold mb-2">How it works</h2>
        <p>
          The Commission Estimate report check flow will follow the steps below;
        </p>
        <ol className="list-decimal list-inside">
          <li>After the close of work daily, Agent log-in to Admin Account</li>
          {/* ...more steps as needed... */}
        </ol>
      </>
    ),
  },
  { title: "Agent Jackpot" },
  { title: "WithHolding Tax Summary" },
  { title: "Commission Payout" },
  { title: "How The Cash Desk Feature Works" },
  { title: "How To Play Combination Bet" },
  { title: "How To Reset Cashier Password" },
  { title: "How to Transfer Funds To/From a Cashier" },
  { title: "How to Transfer Funds To/From a Sub-Account User" },
];

export default function TutorialsPage() {
  const [activeIdx, setActiveIdx] = useState(0);

  return (
    <div className="bg-blue-50 min-h-screen p-2">
      <h1 className="text-xl font-bold text-gray-900 mb-2">Tutorials</h1>
      <div className="grid grid-cols-[1fr_2fr] justify-center items-start gap-2">
        {/* Sidebar */}

        <BaseCard title={"Topics"}>
          <div className="flex flex-col gap-2 p-2">
            {topics.map((topic, idx) => (
              <button
                key={topic.title}
                className={`text-left cursor-pointer hover:bg-blue-500/20 text-xs px-3 py-2 rounded border ${
                  activeIdx === idx
                    ? "bg-blue-50 border-blue-400 text-blue-700 font-semibold shadow-inner flex justify-between items-center"
                    : "bg-gray-50 border-gray-200 text-gray-600"
                }
                  ${
                    activeIdx === idx ? "ring-2 ring-blue-200" : ""
                  } flex items-center`}
                onClick={() => setActiveIdx(idx)}
                disabled={activeIdx === idx}
              >
                <span>{topic.title}</span>
                {activeIdx === idx && (
                  <span className="ml-auto text-blue-400">&gt;</span>
                )}
              </button>
            ))}
          </div>
        </BaseCard>

        <BaseCard title={topics[activeIdx].title}>
          <div className="p-2 text-gray-800 text-xs leading-relaxed">
            {topics[activeIdx].content || (
              <span className="text-gray-400">
                No content available for this topic.
              </span>
            )}
          </div>
        </BaseCard>
      </div>
    </div>
  );
}
