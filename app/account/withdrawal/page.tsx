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

const Withdrawal = () => {
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
    <div className="p-4">
      <div className="">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={handleGoBack}
            className="text-gray-600 hover:text-gray-900 flex items-center gap-2 text-xs transition-colors"
          >
            <ArrowLeft size={18} />
            <span>Go back</span>
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Withdrawal</h1>
        </div>
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left Side - Withdrawal Form */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden p-0 border flex flex-col">
            <div className="bg-blue-700 text-white px-6 py-3 text-base font-semibold rounded-t-lg">
              Initiate Withdrawal
            </div>
            <div className="p-6 flex-1">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Available Balance */}
                <div className="grid grid-cols-[1fr_4fr] items-center gap-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Available Balance:
                  </label>
                  <Input
                    type="text"
                    value={`₦${formatNumber(
                      user?.availableBalance || user?.balance || 0
                    )}`}
                    disabled
                    className="w-full bg-gray-100 border border-gray-200 rounded text-sm text-gray-700 px-4 py-2.5"
                    name="balance"
                    onChange={() => {}}
                    placeholder=""
                  />
                </div>
                {/* Amount */}
                <div className="grid grid-cols-[1fr_4fr] items-center gap-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Amount:
                  </label>
                  <div>
                    <Input
                      value={amount}
                      onChange={handleAmountChange}
                      placeholder="₦"
                      className="w-full bg-white border border-gray-200 rounded text-sm text-gray-900 px-4 py-2.5"
                      height="h-[36px]"
                      name="amount"
                      type="num_select"
                      num_select_placeholder={currency}
                    />
                    <div className="flex gap-2 mt-2">
                      {[1000, 5000, 10000, 25000].map((quickAmount) => (
                        <button
                          key={quickAmount}
                          type="button"
                          onClick={() => setAmount(quickAmount.toString())}
                          className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full hover:bg-blue-200 transition-colors"
                        >
                          ₦{formatNumber(quickAmount)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                {/* Bank */}
                <div className="grid grid-cols-[1fr_4fr] items-center gap-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Bank:
                  </label>
                  <SearchSelect
                    label="Select bank"
                    value={[inputObject.bankCode]}
                    text_color="text-gray-900"
                    isLoading={banksLoading}
                    options={banks.map(
                      (bank: { code: string; name: string }) => ({
                        id: bank.code,
                        name: bank.name,
                      })
                    )}
                    onChange={(e) => {
                      setVerified(false);
                      setInputObject((prev) => ({
                        ...prev,
                        bankCode: e[0] as string,
                        accountName: "",
                      }));
                    }}
                    height="h-[36px]"
                    placeholder="Select bank"
                    className="w-full bg-white border border-gray-200 rounded px-4 py-2.5 text-gray-900"
                  />
                </div>
                {/* Account Number */}
                <div className="grid grid-cols-[1fr_4fr] items-center gap-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Account Number:
                  </label>
                  <SingleSearchInput
                    label="Account Number"
                    value={inputObject.accountNumber}
                    onChange={(e) => {
                      handleChange(e);
                      setVerified(false);
                      setErrMessage("");
                      if (e.target.value.length === 10) {
                        doVerify(e.target.value);
                      }
                    }}
                    searchState={{
                      isValid: false,
                      isNotFound: verificationData?.success === false,
                      isLoading: verifyLoading,
                      message: "",
                    }}
                    onSearch={() => {}}
                    placeholder=""
                    name="accountNumber"
                    height="h-[36px]"
                    className="w-full bg-white border border-gray-200 rounded text-gray-900 px-4 py-2.5"
                  />
                </div>
                {/* Fee */}
                <div className="grid grid-cols-[1fr_4fr] items-center gap-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Fee:
                  </label>
                  <Input
                    value="₦"
                    name="fee"
                    onChange={() => {}}
                    height="h-[36px]"
                    placeholder=""
                    className="w-full bg-gray-100 border border-gray-200 rounded text-sm text-gray-700 px-4 py-2.5"
                    type="num_select"
                    num_select_placeholder={currency}
                    disabled
                  />
                </div>
                {/* Total Amount */}
                <div className="grid grid-cols-[1fr_4fr] items-center gap-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Total Amount:
                  </label>
                  <Input
                    value={amount ? `₦${formatNumber(amount)}` : "₦"}
                    name="total"
                    onChange={() => {}}
                    placeholder=""
                    height="h-[36px]"
                    className="w-full bg-gray-100 border border-gray-200 rounded text-sm text-gray-700 px-4 py-2.5"
                    type="num_select"
                    num_select_placeholder={currency}
                    disabled
                  />
                </div>
                {/* Submit Button */}
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={
                      withdrawalLoading || !amount || Number(amount) < 100
                    }
                    className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-6 py-2 rounded font-semibold text-base transition-colors"
                  >
                    {withdrawalLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Processing...
                      </div>
                    ) : (
                      "Continue"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
          {/* Right Side - Instructions */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden p-0 border flex flex-col">
            <div className="bg-blue-700 text-white px-6 py-3 text-base font-semibold rounded-t-lg">
              Important Notice
            </div>
            <div className="p-6 flex-1">
              <ul className="list-disc pl-4 space-y-3 text-sm text-gray-800 mb-6">
                <li>
                  For faster withdrawal verification, ensure your bank account
                  details match your BetPanta account info, especially your
                  first name and last name.
                </li>
                <li>
                  Winnings above ₦500,000 require a valid ID for prompt
                  withdrawal processing. Email cs@betpanta.com with your user ID
                  and a clear picture of your ID card.
                </li>
                <li>
                  Payouts to some banks may take longer than 48 hours due to
                  bank delays.
                </li>
              </ul>
              <div className="flex items-start gap-3 bg-yellow-50 border border-yellow-400 rounded p-4">
                <span className="text-yellow-600 text-xl mt-1">&#8505;</span>
                <div className="text-yellow-900 text-sm">
                  Payouts may be delayed due to a payment processing issue.
                  We&apos;re working to resolve it within a few hours. For
                  assistance, please contact our{" "}
                  <a
                    href="#"
                    className="underline text-yellow-800 hover:text-yellow-900"
                  >
                    customer support
                  </a>
                  .
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Withdrawal;
