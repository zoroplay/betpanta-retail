import BaseCard from "@/components/layout/BaseCard";
import React from "react";

const messageDetails = {
  id: "1913930132",
  dateSent: "Apr 26 2025 10:44",
  readOn: "May 1 2025 8:43",
  priority: "High",
  subject: "Withdrawal Completed",
  body: `Hi Damilare Beson (Username: KA-FUN-0005),\n\nWithdrawal Completed: Your request for withdrawal of ₦ 50000.00 (Transaction Id: 771939906) has been completed by BetKing. Please check your Bank account statement for updated balance and please connect with your bank if any queries.\n\nYou can also check the status of withdrawal under Account Dashboard.`,
};

const MessageDetailsPage = () => {
  return (
    <div className="bg-blue-50 min-h-screen p-6">
      <div className="mb-4 flex items-center gap-2">
        <span className="text-gray-600 cursor-pointer">&lt; Go back</span>
        <h2 className="text-lg font-bold text-gray-900">Message Details</h2>
        <button className="ml-auto bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded text-sm font-semibold">
          Delete
        </button>
      </div>
      <div className="grid grid-cols-1 gap-4 mb-4">
        <BaseCard title="Message Details">
          <table className="w-full text-sm">
            <tbody>
              <tr>
                <td className="py-2 px-4 text-gray-700">Message ID</td>
                <td className="py-2 px-4 text-gray-900 font-semibold">
                  {messageDetails.id}
                </td>
              </tr>
              <tr>
                <td className="py-2 px-4 text-gray-700">Date Sent</td>
                <td className="py-2 px-4 text-gray-900">
                  {messageDetails.dateSent}
                </td>
              </tr>
              <tr>
                <td className="py-2 px-4 text-gray-700">Read On</td>
                <td className="py-2 px-4 text-gray-900">
                  {messageDetails.readOn}
                </td>
              </tr>
              <tr>
                <td className="py-2 px-4 text-gray-700">Priority</td>
                <td className="py-2 px-4 text-orange-500 font-semibold">
                  {messageDetails.priority}
                </td>
              </tr>
              <tr>
                <td className="py-2 px-4 text-gray-700">Subject</td>
                <td className="py-2 px-4 text-gray-900">
                  {messageDetails.subject}
                </td>
              </tr>
            </tbody>
          </table>
        </BaseCard>
        <BaseCard title="Message View">
          <div className="whitespace-pre-line text-gray-800 text-sm p-2">
            {messageDetails.body}
            <br />
            <br />
            You can also check the status of withdrawal under{" "}
            <a href="#" className="text-blue-700 underline">
              Account Dashboard
            </a>
            .
          </div>
        </BaseCard>
      </div>
    </div>
  );
};

export default MessageDetailsPage;
