/* eslint-disable react/no-unescaped-entities */
"use client";
import { ACCOUNT } from "@/data/routes/routes";
import environmentConfig from "@/redux/services/configs/environment.config";
import { useFetchPaymentMethodsQuery } from "@/redux/services/wallet.service";
import { AlertCircle, CreditCard, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import Table from "@/components/tables/Table";

const Deposit = () => {
  const router = useRouter();
  const clientId = environmentConfig.CLIENT_ID;

  const { data, error, isLoading } = useFetchPaymentMethodsQuery();
  const paymentMethods = data?.data || [];

  // Filter out 'sbengine' provider as shown in the original component
  const filteredPaymentMethods = paymentMethods.filter(
    (item) => item.provider !== "sbengine"
  );

  const getProviderInfo = (provider: string) => {
    const providerMap: Record<
      string,
      {
        image: string;
        color: string;
        name: string;
        description: string;
      }
    > = {
      paystack: {
        image: "/images/paystack.png",
        color: "from-blue-500 to-cyan-500",
        name: "Paystack",
        description: "Cards, Bank Transfer & Mobile Money",
      },
      opay: {
        image: "/images/opay.png",
        color: "from-green-500 to-emerald-500",
        name: "OPay",
        description: "Digital Wallet & Bank Transfer",
      },
      flutterwave: {
        image: "/images/flutterwave.png",
        color: "from-orange-500 to-yellow-500",
        name: "Flutterwave",
        description: "Cards & Bank Transfer",
      },
      korapay: {
        image: "/images/korapay.png",
        color: "from-purple-500 to-pink-500",
        name: "KoraPay",
        description: "Bank Transfer & Cards",
      },
      mgurush: {
        image: "/images/mgurush.png",
        color: "from-red-500 to-orange-500",
        name: "mGurush",
        description: "Mobile Money & Banking",
      },
      pawapay: {
        image: "/images/pawapay.png",
        color: "from-indigo-500 to-purple-500",
        name: "PawaPay",
        description: "Mobile Money Platform",
      },
      palmpay: {
        image: "/images/palmpay.png",
        color: "from-teal-500 to-green-500",
        name: "PalmPay",
        description: "Digital Wallet & Transfer",
      },
      mtnmomo: {
        image: "/images/mtnmomo.png",
        color: "from-yellow-500 to-orange-500",
        name: "MTN MoMo",
        description: "Mobile Money Service",
      },
      tigo: {
        image: "/images/tigo.png",
        color: "from-blue-500 to-purple-500",
        name: "Tigo",
        description: "Mobile Payment Service",
      },
      coralpay: {
        image: "/images/coralpay.png",
        color: "from-coral-500 to-pink-500",
        name: "CoralPay",
        description: "Banking & Digital Payment",
      },
      fidelity: {
        image: "/images/fidelity.png",
        color: "from-navy-500 to-blue-500",
        name: "Fidelity Bank",
        description: "Bank Transfer & Cards",
      },
      globus: {
        image: "/images/globus.png",
        color: "from-green-600 to-teal-500",
        name: "Globus Bank",
        description: "Digital Banking Service",
      },
      providus: {
        image: "/images/providus.png",
        color: "from-blue-600 to-indigo-500",
        name: "Providus Bank",
        description: "Corporate Banking",
      },
      payonus: {
        image: "/images/payonus.png",
        color: "from-purple-600 to-pink-500",
        name: "Payonus",
        description: "Digital Payment Gateway",
      },
      smileandpay: {
        image: "/images/smileandpay.png",
        color: "from-yellow-600 to-orange-500",
        name: "Smile & Pay",
        description: "Mobile Payment Service",
      },
    };

    return (
      providerMap[provider] || {
        image: "/images/default-payment.png",
        color: "from-gray-500 to-gray-600",
        name: provider?.toUpperCase() || "Unknown",
        description: "Payment Service",
      }
    );
  };

  const handleDepositClick = (provider: string) => {
    // Navigate to deposit form page for specific provider
    router.push(ACCOUNT.DEPOSIT_FORM.replace(":provider", provider));
  };

  if (isLoading) {
    return (
      <div className="h-[calc(100vh-110px)] overflow-y-auto p-4">
        <div className="flex flex-col gap-4">
          {/* Header Skeleton */}
          <div className="h-8 w-32 bg-gray-200 animate-pulse rounded"></div>

          {/* Warning Banner Skeleton */}
          <div className="bg-gray-100 animate-pulse rounded p-4 h-20"></div>

          {/* Table Skeleton */}
          <div className="border rounded-lg overflow-hidden">
            {/* Table Header */}
            <div className="bg-gray-900 px-6 py-3">
              <div className="grid grid-cols-[3fr_4fr_1fr_1fr] gap-4">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="h-4 w-24 bg-gray-700 animate-pulse rounded"
                  ></div>
                ))}
              </div>
            </div>
            {/* Table Rows */}
            {[...Array(6)].map((_, index) => (
              <div key={index} className="border-b px-6 py-4">
                <div className="grid grid-cols-[3fr_4fr_1fr_1fr] gap-4 items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-200 animate-pulse rounded"></div>
                    <div className="h-4 w-32 bg-gray-200 animate-pulse rounded"></div>
                  </div>
                  <div className="h-4 w-48 bg-gray-200 animate-pulse rounded"></div>
                  <div className="h-4 w-16 bg-gray-200 animate-pulse rounded"></div>
                  <div className="flex items-center justify-between">
                    <div className="h-4 w-16 bg-gray-200 animate-pulse rounded"></div>
                    <div className="h-10 w-24 bg-gray-200 animate-pulse rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen flex justify-center items-center`}>
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CreditCard className="text-red-400" size={24} />
          </div>
          <h2 className="text-2xl font-semibold text-red-400 mb-2">
            Error Loading Payment Methods
          </h2>
          <p className={` mb-6`}>
            We're having trouble connecting to our payment services. Please try
            again later.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Table columns for payment methods
  const tableColumns = [
    { id: "method", name: "Payment Method" },
    { id: "description", name: "Description" },
    { id: "fee", name: "Fee" },
    { id: "minAmount", name: "Min Amount" },
    { id: "actions", name: "" },
  ];

  // Table data for payment methods
  const tableData = filteredPaymentMethods.map((item, index) => {
    const providerInfo = getProviderInfo(item.provider);
    return {
      method: (
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded flex items-center justify-center overflow-hidden bg-white border p-1">
            <img
              src={providerInfo.image}
              alt={`${providerInfo.name} logo`}
              className="w-full h-full object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
                const parent = target.parentElement;
                if (parent) {
                  parent.innerHTML = `<span class='text-xs font-bold text-gray-600'>${item.provider.toUpperCase()}</span>`;
                }
              }}
            />
          </div>
          <div>
            <div className="font-semibold text-sm text-gray-900">
              {providerInfo.name}
            </div>
            <div className="text-xs text-gray-600">
              {item.provider === "paystack" && "(Card/bank) Instant Credit"}
              {item.provider === "opay" &&
                "Instant Credit on deposits via Opay app and Opay agent shop"}
              {item.provider !== "paystack" &&
                item.provider !== "opay" &&
                providerInfo.description}
            </div>
          </div>
        </div>
      ),
      description: (
        <span className="text-xs text-gray-700">
          {item.provider === "paystack" && "(Card/bank) Instant Credit"}
          {item.provider === "interswitch" && "Instant Credit"}
          {item.provider === "opay" &&
            "Instant Credit on deposits via Opay app and Opay agent shop"}
          {item.provider === "quickteller" && "Instant Credit"}
          {item.provider === "transfer" &&
            "Deposit may take up to 24 hours to reflect"}
          {item.provider === "zenith" && "Instant Credit"}
          {![
            "paystack",
            "interswitch",
            "opay",
            "quickteller",
            "transfer",
            "zenith",
          ].includes(item.provider) && "Instant Credit"}
        </span>
      ),
      fee: <span className="font-semibold  text-gray-900">FREE</span>,
      minAmount: <span className="font-semibold  text-gray-900">N50</span>,
      actions: (
        <button
          onClick={() => handleDepositClick(item.provider)}
          className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold text-xs transition-all flex items-center gap-2"
        >
          Deposit
          <Plus size={14} className="bg-white rounded-full text-blue-600" />
        </button>
      ),
    };
  });

  return (
    <div className={` p-4`}>
      <div className="flex flex-col gap-2">
        {/* Header Section */}
        <h1 className={`text-xl font-bold text-gray-900`}>Deposit</h1>

        {/* Warning Banner */}
        <div className="bg-yellow-100 border border-yellow-500 p-2 flex items-start gap-3 rounded-lg">
          <AlertCircle
            className="flex-shrink-0 mt-0.5 text-yellow-600"
            size={20}
          />
          <p className="text-xs text-gray-800 leading-relaxed">
            Please note that default minimum deposit limits apply, and maximum
            deposit limits may be lower than your personal limits until
            verification is complete. Additionally, be aware that internet
            gambling restrictions may apply in your location; check local laws
            before proceeding with transactions.
          </p>
        </div>

        {/* Payment Methods Table */}

        <Table
          columns={tableColumns}
          data={tableData}
          isLoading={false}
          className="grid-cols-5"
        />
      </div>
    </div>
  );
};

export default Deposit;
