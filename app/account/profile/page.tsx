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

const Profile = () => {
  const { user } = useAppSelector((state) => state.user);
  const { global_variables } = useAppSelector((state) => state.app);
  const router = useRouter();

  const clientId = String(environmentConfig.CLIENT_ID);
  const currency = global_variables?.currency || "NGN";

  const [verified, setVerified] = useState(false);
  const [errMessage, setErrMessage] = useState("");
  const [amount, setAmount] = useState<string>("");

  // Use withdrawal hook
  const {
    banks,
    banksLoading,
    verificationData,
    verifyLoading,
    withdrawalLoading,
    verifyBankAccount,
    submitBankWithdrawal,
  } = useWithdrawal();

  const [inputObject, setInputObject] = useState<WithdrawalInputObject>({
    amount: 0,
    bankCode: "",
    accountNumber: "",
    accountName: "",
    type: "online",
    source: "retail",
    clientId: clientId,
  });

  // Format number with commas
  const formatNumber = (num: number | string) => {
    if (!num) return "0";
    return Number(num).toLocaleString();
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    e.preventDefault();
    setInputObject({
      ...inputObject,
      [e.target.name]: e.target.value,
    });
  };

  const handleAmountChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = e.target.value;
    // Allow only numbers
    if (value === "" || /^\d+$/.test(value)) {
      setAmount(value);
      setInputObject({ ...inputObject, amount: Number(value) || 0 });
      setErrMessage("");
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  const updateAmount = (value: number) => {
    if (value === 0) {
      setAmount("0");
      setInputObject({ ...inputObject, amount: 0 });
      return;
    }
    const currentAmount = Number(amount) || 0;
    const newAmount = currentAmount + value;
    setAmount(newAmount.toString());
    setInputObject({ ...inputObject, amount: newAmount });
  };

  // Quick amount selection
  const quickAmounts = [100, 200, 500, 1000];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const amountNum = Number(amount);

    // Validation
    if (!amountNum || amountNum < 100) {
      setErrMessage("Minimum withdrawal amount is ₦100");
      return;
    }

    if (!inputObject.bankCode) {
      setErrMessage("Please select a bank");
      return;
    }

    if (!inputObject.accountNumber || inputObject.accountNumber.length !== 10) {
      setErrMessage("Please enter a valid 10-digit account number");
      return;
    }

    if (!verified || !inputObject.accountName) {
      setErrMessage("Please verify your account number first");
      return;
    }

    setErrMessage("");
    try {
      await submitBankWithdrawal({
        amount: inputObject.amount,
        bankCode: inputObject.bankCode,
        accountNumber: inputObject.accountNumber,
        accountName: inputObject.accountName,
        type: inputObject.type,
        source: inputObject.source,
      });

      // Reset form
      setAmount("0");
      setInputObject({
        amount: 0,
        bankCode: "",
        accountNumber: "",
        accountName: "",
        type: "online",
        source: "retail",
        clientId: clientId,
      });
      setVerified(false);
    } catch (err: unknown) {
      let errorMsg = "Error occurred during withdrawal";
      if (err && typeof err === "object" && "message" in err) {
        errorMsg = (err as { message?: string }).message || errorMsg;
      }
      setErrMessage(errorMsg);
    }
  };

  const doVerify = async (accountNumber: string) => {
    if (!inputObject.bankCode) {
      setErrMessage("Please select a bank first");
      return;
    }

    if (accountNumber.length !== 10) {
      return;
    }

    setErrMessage("");
    try {
      const result = await verifyBankAccount(
        accountNumber,
        inputObject.bankCode
      );

      setVerified(true);
      // setVerificationData(result);
      setInputObject({
        ...inputObject,
        accountName: result.message, // The API returns account name in message
        accountNumber,
      });
    } catch (err: unknown) {
      setVerified(false);
      setInputObject({ ...inputObject, accountName: "", accountNumber });
      let errorMsg = "Failed to verify account";
      if (err && typeof err === "object" && "message" in err) {
        errorMsg = (err as { message?: string }).message || errorMsg;
      }
      setErrMessage(errorMsg);
    }
  };

  return (
    <div className="p-4 bg-[#eaf3fa] min-h-screen">
      <div className="flex items-center gap-3 mb-2">
        <h1 className="text-xl font-bold text-gray-900">Personal Details</h1>
      </div>
      <div className="grid lg:grid-cols-2 gap-4">
        <BaseCard title="Personal Information" className="p-0">
          <div className="p-2 px-4 flex-1">
            <form className="space-y-4">
              {/* First Name */}
              <div className="grid grid-cols-[1fr_4fr] items-center gap-2">
                <label className="block text-xs font-semibold text-gray-700">
                  First Name:
                </label>
                <Input
                  value="Adeyinka"
                  disabled
                  className="w-full bg-gray-100 border border-gray-200 rounded text-sm text-gray-700 px-4 py-2.5"
                  name="firstName"
                  onChange={() => {}}
                  placeholder={""}
                />
              </div>
              {/* Last Name */}
              <div className="grid grid-cols-[1fr_4fr] items-center gap-2">
                <label className="block text-xs font-semibold text-gray-700">
                  Last Name:
                </label>
                <Input
                  value="Thomas"
                  disabled
                  className="w-full bg-gray-100 border border-gray-200 rounded text-sm text-gray-700 px-4 py-2.5"
                  name="lastName"
                  onChange={() => {}}
                  placeholder={""}
                />
              </div>
              {/* Username */}
              <div className="grid grid-cols-[1fr_4fr] items-center gap-2">
                <label className="block text-xs font-semibold text-gray-700">
                  Username:
                </label>
                <Input
                  value="BE-3840493"
                  disabled
                  className="w-full bg-gray-100 border border-gray-200 rounded text-sm text-gray-700 px-4 py-2.5"
                  name="username"
                  onChange={() => {}}
                  placeholder={""}
                />
              </div>
              {/* Gender */}
              <div className="grid grid-cols-[1fr_4fr] items-center gap-2">
                <label className="block text-xs font-semibold text-gray-700">
                  Gender:
                </label>
                <Input
                  value="Male"
                  disabled
                  className="w-full bg-gray-100 border border-gray-200 rounded text-sm text-gray-700 px-4 py-2.5"
                  name="gender"
                  onChange={() => {}}
                  placeholder={""}
                />
              </div>
              {/* Date of Birth */}
              <div className="grid grid-cols-[1fr_4fr] items-center gap-2">
                <label className="block text-xs font-semibold text-gray-700">
                  Date of Birth:
                </label>
                <Input
                  value="31/08/1990"
                  disabled
                  className="w-full bg-gray-100 border border-gray-200 rounded text-sm text-gray-700 px-4 py-2.5"
                  name="dob"
                  onChange={() => {}}
                  placeholder={""}
                />
              </div>
              {/* Email */}
              <div className="grid grid-cols-[1fr_4fr] items-center gap-2">
                <label className="block text-xs font-semibold text-gray-700">
                  Email:
                </label>
                <Input
                  value="adeyinkathomas@gmail.com"
                  disabled
                  className="w-full bg-gray-100 border border-gray-200 rounded text-sm text-gray-700 px-4 py-2.5"
                  name="email"
                  onChange={() => {}}
                  placeholder={""}
                />
              </div>
              {/* Phone number */}
              <div className="grid grid-cols-[1fr_4fr] items-center gap-2">
                <label className="block text-xs font-semibold text-gray-700">
                  Phone number:
                </label>
                <Input
                  value="2348109894382"
                  disabled
                  className="w-full bg-gray-100 border border-gray-200 rounded text-sm text-gray-700 px-4 py-2.5"
                  name="phone"
                  onChange={() => {}}
                  placeholder={""}
                />
              </div>
              {/* Country */}
              <div className="grid grid-cols-[1fr_4fr] items-center gap-2">
                <label className="block text-xs font-semibold text-gray-700">
                  Country:
                </label>
                <Input
                  value="Nigeria"
                  disabled
                  className="w-full bg-gray-100 border border-gray-200 rounded text-sm text-gray-700 px-4 py-2.5"
                  name="country"
                  onChange={() => {}}
                  placeholder={""}
                />
              </div>
              {/* State */}
              <div className="grid grid-cols-[1fr_4fr] items-center gap-2">
                <label className="block text-xs font-semibold text-gray-700">
                  State:
                </label>
                <Input
                  value="Katsina"
                  disabled
                  className="w-full bg-gray-100 border border-gray-200 rounded text-sm text-gray-700 px-4 py-2.5"
                  name="state"
                  onChange={() => {}}
                  placeholder={""}
                />
              </div>
              {/* LGA */}
              <div className="grid grid-cols-[1fr_4fr] items-center gap-2">
                <label className="block text-xs font-semibold text-gray-700">
                  LGA:
                </label>
                <Input
                  value="Funtua"
                  disabled
                  className="w-full bg-gray-100 border border-gray-200 rounded text-sm text-gray-700 px-4 py-2.5"
                  name="lga"
                  onChange={() => {}}
                  placeholder={""}
                />
              </div>
              {/* Address */}
              <div className="grid grid-cols-[1fr_4fr] items-center gap-2">
                <label className="block text-xs font-semibold text-gray-700">
                  Address:
                </label>
                <Input
                  value="BCJ STREET, Funtua, Katsina"
                  disabled
                  className="w-full bg-gray-100 border border-gray-200 rounded text-sm text-gray-700 px-4 py-2.5"
                  name="address"
                  onChange={() => {}}
                  placeholder={""}
                />
              </div>
              {/* Referral Code */}
              <div className="grid grid-cols-[1fr_4fr] items-center gap-2">
                <label className="block text-xs font-semibold text-gray-700">
                  Referral Code:
                </label>
                <Input
                  value=""
                  placeholder="Enter referral code"
                  className="w-full bg-white border border-gray-200 rounded text-sm text-gray-700 px-4 py-2.5"
                  name="referral"
                  onChange={() => {}}
                />
              </div>
              {/* Update profile button */}
              <div className="flex justify-end">
                <button
                  type="button"
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold text-base transition-colors text-xs"
                >
                  Update profile
                </button>
              </div>
            </form>
          </div>
        </BaseCard>
        <BaseCard title="Bank Account Details" className="p-0">
          <div className="p-2 px-4 flex-1">
            {/* Default Bank Profile */}
            <div className="mb-2">
              <div className="text-gray-700 font-semibold text-sm mb-2">
                Default Bank Profile
              </div>
              <div className="grid grid-cols-[1fr_2fr] items-center gap-2 mb-2">
                <label className="block text-xs font-semibold text-gray-700">
                  Bank:
                </label>
                <Input
                  value="First Bank of Nigeria"
                  disabled
                  className="w-full bg-gray-100 border border-gray-200 rounded text-sm text-gray-700 px-4 py-2.5"
                  name="bank"
                  onChange={() => {}}
                  placeholder={""}
                />
              </div>
              <div className="grid grid-cols-[1fr_2fr] items-center gap-2 mb-2">
                <label className="block text-xs font-semibold text-gray-700">
                  Account Number:
                </label>
                <div>
                  <Input
                    value="3047874909"
                    disabled
                    className="w-full bg-gray-100 border border-gray-200 rounded text-sm text-gray-700 px-4 py-2.5 mb-1"
                    name="accountNumber"
                    onChange={() => {}}
                    placeholder={""}
                  />
                  <div className="text-xs text-gray-500 pl-1">
                    ADEBOLA IFENAYI-UCHE
                  </div>
                </div>
              </div>
            </div>
            {/* Add Another Bank */}
            <div className="mb-2">
              <div className="text-gray-700 font-semibold text-sm mb-2">
                Add Another Bank
              </div>
              <div className="grid grid-cols-[1fr_2fr] items-center gap-2 mb-2">
                <label className="block text-xs font-semibold text-gray-700">
                  Bank:
                </label>
                <Input
                  value=""
                  placeholder="Select bank"
                  className="w-full bg-white border border-gray-200 rounded text-sm text-gray-700 px-4 py-2.5"
                  name="addBank"
                  onChange={() => {}}
                />
              </div>
              <div className="grid grid-cols-[1fr_2fr] items-center gap-2 mb-2">
                <label className="block text-xs font-semibold text-gray-700">
                  Account Number:
                </label>
                <Input
                  value=""
                  placeholder="Enter account number"
                  className="w-full bg-white border border-gray-200 rounded text-sm text-gray-700 px-4 py-2.5"
                  name="addAccountNumber"
                  onChange={() => {}}
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold text-base transition-colors text-xs"
              >
                Save
              </button>
            </div>
          </div>
        </BaseCard>
      </div>
    </div>
  );
};

export default Profile;
