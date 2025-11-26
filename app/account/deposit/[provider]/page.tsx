/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect } from "react";
import { showToast } from "@/components/tools/toast";
import Input from "@/components/inputs/Input";
import Spinner from "@/components/spinner/Spinner";
import { useAppSelector } from "@/hooks/useAppDispatch";
import {
  getEnvironmentVariable,
  ENVIRONMENT_VARIABLES,
} from "@/redux/services/configs/environment.config";
import { useInitializeTransactionMutation } from "@/redux/services/wallet.service";
import { ArrowLeft, Shield, Clock, CreditCard } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

const DepositForm = () => {
  const { provider } = useParams<{ provider: string }>();
  const router = useRouter();
  const [amount, setAmount] = useState<string>("");

  const { user } = useAppSelector((state) => state.user);
  const { global_variables } = useAppSelector((state) => state.app);

  const [initializeTransaction, { isLoading }] =
    useInitializeTransactionMutation();

  const clientId = getEnvironmentVariable(
    ENVIRONMENT_VARIABLES.CLIENT_ID
  ) as string;

  // Format number with commas
  const formatNumber = (num: number | string) => {
    if (!num) return "0";
    return Number(num).toLocaleString();
  };

  // Get provider display information
  const getProviderInfo = (providerName: string) => {
    const providerMap: Record<
      string,
      { name: string; image: string; color: string }
    > = {
      paystack: {
        name: "Paystack",
        image: "/images/paystack.png",
        color: "from-blue-500 to-cyan-500",
      },
      opay: {
        name: "OPay",
        image: "/images/opay.png",
        color: "from-green-500 to-emerald-500",
      },
      flutterwave: {
        name: "Flutterwave",
        image: "/images/flutterwave.png",
        color: "from-orange-500 to-yellow-500",
      },
      korapay: {
        name: "KoraPay",
        image: "/images/korapay.png",
        color: "from-purple-500 to-pink-500",
      },
      mgurush: {
        name: "mGurush",
        image: "/images/mgurush.png",
        color: "from-red-500 to-orange-500",
      },
      pawapay: {
        name: "PawaPay",
        image: "/images/pawapay.png",
        color: "from-indigo-500 to-purple-500",
      },
      palmpay: {
        name: "PalmPay",
        image: "/images/palmpay.png",
        color: "from-teal-500 to-green-500",
      },
      mtnmomo: {
        name: "MTN MoMo",
        image: "/images/mtnmomo.png",
        color: "from-yellow-500 to-orange-500",
      },
      tigo: {
        name: "Tigo",
        image: "/images/tigo.png",
        color: "from-blue-500 to-purple-500",
      },
    };

    return (
      providerMap[providerName] || {
        name: providerName?.toUpperCase() || "Unknown",
        image: "/images/default-payment.png",
        color: "from-gray-500 to-gray-600",
      }
    );
  };

  const providerInfo = getProviderInfo(provider || "");
  const minDeposit = Number(global_variables?.min_deposit || 1000);
  const currency = global_variables?.currency || "NGN";

  // Quick amount selection
  const quickAmounts = [1000, 5000, 10000, 25000, 50000];

  const updateAmount = (value: number) => {
    if (value === 0) {
      setAmount("0");
      return;
    }
    const currentAmount = Number(amount) || 0;
    const newAmount = currentAmount + value;
    setAmount(newAmount.toString());
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only numbers
    if (value === "" || /^\d+$/.test(value)) {
      setAmount(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const amountNum = Number(amount);

    // Validation
    if (!amountNum || amountNum < minDeposit) {
      showToast({
        type: "error",
        title: `Minimum deposit amount is ${currency} ${formatNumber(
          minDeposit
        )}`,
      });

      return;
    }

    if (amountNum > 1000000) {
      showToast({
        type: "error",
        title: "Maximum deposit amount is NGN 1,000,000",
      });
      return;
    }

    if (!provider) {
      showToast({
        type: "error",
        title: "Payment method not selected",
      });
      return;
    }

    try {
      const result = await initializeTransaction({
        amount: amountNum,
        paymentMethod: provider,
        clientId,
      }).unwrap();

      if (result.success && result.data.link) {
        // Redirect to payment gateway
        window.location.href = result.data.link;
      } else {
        showToast({
          type: "error",
          title: result.message || "Failed to initialize transaction",
        });
      }
    } catch (error: any) {
      showToast({
        type: "error",
        title: error?.data?.message || "An error occurred. Please try again.",
      });
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className=" p-4 ">
      <div className="">
        {/* Header */}
        <div className="flex items-center gap-3 p-2">
          <button
            onClick={handleGoBack}
            className="text-gray-600 hover:text-gray-900 flex items-center gap-2 text-xs transition-colors"
          >
            <ArrowLeft size={18} />
            <span>Go back</span>
          </button>
          <h1 className="text-base font-bold text-gray-900">
            Deposit Payment Method
          </h1>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left Side - Payment Form */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="bg-blue-600 text-white px-6 py-3 text-base font-semibold">
              Initiate Deposit
            </div>
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email Address */}
                <div className="grid grid-cols-[1fr_4fr]">
                  <label className="block text-xs font-semibold text-gray-700 pt-2">
                    Email Address:
                  </label>
                  <Input
                    type="email"
                    value={user?.email || ""}
                    disabled
                    height="h-[36px]"
                    className="w-full px-4 py-2.5 bg-gray-100 border border-gray-300 rounded text-sm text-gray-700"
                    name={""}
                    onChange={() => {}}
                    placeholder={""}
                  />
                </div>

                {/* Amount */}
                <div className="">
                  <div className="grid grid-cols-[1fr_4fr]">
                    <label className="block text-xs font-semibold text-gray-700 pt-2">
                      Amount:
                    </label>
                    <div>
                      <Input
                        value={amount}
                        onChange={(e) => handleAmountChange(e as any)}
                        placeholder={`₦${formatNumber(minDeposit)}`}
                        className="w-full px-4 py-2.5 bg-gray-100 border border-gray-300 rounded text-sm "
                        height="h-[36px]"
                        name={""}
                        type="num_select"
                        num_select_placeholder={"NGN"}
                        text_color="text-gray-900"
                      />
                      <div className="flex gap-2 mt-2">
                        {quickAmounts.map((quickAmount) => (
                          <button
                            key={quickAmount}
                            type="button"
                            onClick={() => setAmount(quickAmount.toString())}
                            className="px-2 py-1 bg-blue-100 text-blue-600 text-[11px] rounded-lg hover:bg-blue-200 transition-colors"
                          >
                            ₦{formatNumber(quickAmount)}
                          </button>
                        ))}
                      </div>
                      <p className="text-[11px] text-gray-500 mt-1">
                        Minimum Deposit Amount: ₦{formatNumber(minDeposit)}
                      </p>
                    </div>
                  </div>
                </div>
                {/* Deposit Method */}
                <div className="grid grid-cols-[1fr_4fr]">
                  <label className="block text-xs font-semibold text-gray-700 pt-2">
                    Deposit Method:
                  </label>
                  <Input
                    type="text"
                    value="Card"
                    disabled
                    height="h-[36px]"
                    className="w-full px-2 py-2 bg-gray-100 border border-gray-300 rounded text-sm text-gray-700"
                    name={""}
                    onChange={() => {}}
                    placeholder={""}
                  />
                </div>

                {/* Fee */}
                <div className="grid grid-cols-[1fr_4fr]">
                  <label className="block text-xs font-semibold text-gray-700 pt-2">
                    Fee:
                  </label>
                  <Input
                    value="0"
                    name={""}
                    onChange={() => {}}
                    height="h-[36px]"
                    placeholder={""}
                    className="w-full px-4 py-2.5 bg-gray-100 border border-gray-300 rounded text-sm text-gray-700"
                    type="num_select"
                    num_select_placeholder={"NGN"}
                  />
                </div>

                {/* Total Amount */}
                <div className="grid grid-cols-[1fr_4fr]">
                  <label className="block text-xs font-semibold text-gray-700 pt-2">
                    Total Amount:
                  </label>
                  <Input
                    value={amount ? `₦${formatNumber(amount)}` : "₦0"}
                    name={""}
                    onChange={() => {}}
                    placeholder={""}
                    height="h-[36px]"
                    className="w-full px-4 py-2.5 bg-gray-100 border border-gray-300 rounded text-sm text-gray-700"
                    type="num_select"
                    num_select_placeholder={"NGN"}
                  />
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={
                      isLoading || !amount || Number(amount) < minDeposit
                    }
                    className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-6 py-2 rounded font-semibold text-xs transition-colors"
                  >
                    {isLoading ? (
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
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="bg-blue-600 text-white px-6 py-3 text-base font-semibold">
              Important Notice
            </div>
            <div className="p-6">
              {/* Provider Logo */}
              <div className="mb-6">
                <img
                  src={providerInfo.image}
                  alt={providerInfo.name}
                  className="h-12 object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                  }}
                />
              </div>

              <p className="text-sm text-gray-700 mb-4 font-medium">
                Find below-outlined steps on how to fund your BetPanta Wallet
                using {providerInfo.name}:
              </p>

              <ol className="space-y-2 mb-4 text-xs list-decimal list-inside">
                <li className="text-gray-700">
                  Select {providerInfo.name} as your means of Deposit
                </li>
                <li className="text-gray-700">
                  Put in your intended amount to deposit e.g. ₦100
                </li>
                <li className="text-gray-700">
                  Select your deposit method (Card/Bank)
                </li>
                <li className="text-gray-700">Click on the Continue button.</li>
                <li className="text-gray-700">
                  Put in your Bank account/card details.
                </li>
                <li className="text-gray-700">
                  Put in your 4 digit pin and one-time password (OTP)
                </li>
                <li className="text-gray-700">
                  Reverify your details to ensure you have provided the right
                  details i.e. amount, etc.
                </li>
                <li className="text-gray-700">
                  Complete your request and get funded instantly.
                </li>
              </ol>

              <p className="text-sm text-gray-700 leading-relaxed">
                Transaction will expire in 30mins. If you are unable to complete
                the payment within this duration, kindly re-initiate the
                deposit.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepositForm;
