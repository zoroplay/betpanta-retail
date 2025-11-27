"use client";
import { useAppSelector } from "@/hooks/useAppDispatch";
import useWithdrawal from "@/hooks/useWithdrawal";
import environmentConfig from "@/redux/services/configs/environment.config";
import { ArrowLeft, Shield } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Input from "@/components/inputs/Input";
import SearchSelect from "@/components/inputs/SearchSelect";
import SingleSearchInput from "@/components/inputs/SingleSearchInput";
import BaseCard from "@/components/layout/BaseCard";

// Define the WithdrawalInputObject type
type WithdrawalInputObject = {
  amount: number;
  bankCode: string;
  accountNumber: string;
  accountName: string;
  type: string;
  source: string;
  clientId: string;
};

const ChangePassword = () => {
  return (
    <div className="p-4 bg-[#eaf3fa] min-h-screen">
      <div className="flex items-center gap-3 mb-4">
        <h1 className="text-xl font-bold text-gray-900">Change Password</h1>
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <BaseCard title="Update Password" className="p-0">
          <div className="p-4 flex-1">
            <form className="space-y-4">
              <div className="grid grid-cols-[1fr_4fr] items-center gap-2">
                <label className="block text-xs font-semibold text-gray-700">
                  Current Password:
                </label>
                <Input
                  type="password"
                  placeholder="Enter current password"
                  className="w-full bg-white border border-gray-200 rounded text-sm text-gray-700 px-4 py-2.5"
                  name="currentPassword"
                  onChange={() => {}}
                />
              </div>
              <div className="grid grid-cols-[1fr_4fr] items-center gap-2">
                <label className="block text-xs font-semibold text-gray-700">
                  New Password:
                </label>
                <Input
                  type="password"
                  placeholder="Enter new password"
                  className="w-full bg-white border border-gray-200 rounded text-sm text-gray-700 px-4 py-2.5"
                  name="newPassword"
                  onChange={() => {}}
                />
              </div>
              <div className="grid grid-cols-[1fr_4fr] items-center gap-2">
                <label className="block text-xs font-semibold text-gray-700">
                  Confirm New Password:
                </label>
                <Input
                  type="password"
                  placeholder="Re-enter new password"
                  className="w-full bg-white border border-gray-200 rounded text-sm text-gray-700 px-4 py-2.5"
                  name="confirmPassword"
                  onChange={() => {}}
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold text-xs transition-colors"
                >
                  Update password
                </button>
              </div>
            </form>
          </div>
        </BaseCard>
        <BaseCard title="Important Notice" className="p-0">
          <div className="p-4 flex-1">
            <div className="text-gray-800 text-sm">
              Your password MUST contain the following:
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Between 8 and 30 characters</li>
                <li>At least 1 UPPERCASE character</li>
                <li>At least 1 number</li>
                <li>At least 1 special character</li>
              </ul>
            </div>
          </div>
        </BaseCard>
      </div>
    </div>
  );
};

export default ChangePassword;
