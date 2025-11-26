import React, { useState } from "react";
import { VscAccount } from "react-icons/vsc";
import { BiHome, BiSolidBarChartAlt2 } from "react-icons/bi";

import Link from "next/dist/client/link";
import { Geist_Mono } from "next/font/google";
import { usePathname } from "next/navigation";
import { RiListSettingsLine } from "react-icons/ri";
import { useTheme } from "../providers/ThemeProvider";

import { User } from "@/data/types/user";
import { FaChevronDown, FaMoneyCheck } from "react-icons/fa";
import { MdBusiness } from "react-icons/md";
import { IconType } from "react-icons/lib";
import { HiChartBar } from "react-icons/hi2";
import { ACCOUNT, OVERVIEW } from "@/data/routes/routes";
import { useAppSelector } from "@/hooks/useAppDispatch";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Helper: Generate navData based on user role/context
interface NavItem {
  id: string;
  name: string;
  href?: string;
  icon: IconType;
  active_icon: IconType;
  sub_refs?: string[];
  sublinks?: NavItem[];
}

const SideBar = () => {
  const pathname = usePathname();
  const { theme } = useTheme();
  const user = useAppSelector((state) => state.user.user);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);

  function getNavDataForRole(_user: User | null): NavItem[] {
    return [
      {
        id: "my-account",
        name: "My Account",
        icon: VscAccount,
        active_icon: VscAccount,
        sublinks: [
          {
            id: "account-dashboard",
            name: "Account Dashboard",
            href: ACCOUNT.HOME,
            icon: BiHome,
            active_icon: BiHome,
            sub_refs: [ACCOUNT.HOME],
          },
          {
            id: "cash-desk",
            name: "Cash Desk",
            href: OVERVIEW.CASHDESK,
            icon: FaMoneyCheck,
            active_icon: FaMoneyCheck,
            sub_refs: [OVERVIEW.CASHDESK],
          },
          {
            id: "bet-list-sports",
            name: "Bet List Sports",
            href: ACCOUNT.BET_LIST,
            icon: BiSolidBarChartAlt2,
            active_icon: BiSolidBarChartAlt2,
            sub_refs: [ACCOUNT.BET_LIST],
          },
          {
            id: "bet-list-virtuals",
            name: "Bet List Virtuals",
            href: ACCOUNT.COUPON_BET_LIST,
            icon: BiSolidBarChartAlt2,
            active_icon: BiSolidBarChartAlt2,
            sub_refs: [ACCOUNT.COUPON_BET_LIST],
          },
          {
            id: "transactions",
            name: "Transactions",
            href: ACCOUNT.TRANSACTIONS,
            icon: RiListSettingsLine,
            active_icon: RiListSettingsLine,
            sub_refs: [ACCOUNT.TRANSACTIONS],
          },
          {
            id: "deposit",
            name: "Deposit",
            href: ACCOUNT.DEPOSIT,
            icon: BiHome,
            active_icon: BiHome,
            sub_refs: [ACCOUNT.DEPOSIT],
          },
          {
            id: "withdrawal",
            name: "Withdrawal",
            href: ACCOUNT.WITHDRAW,
            icon: BiHome,
            active_icon: BiHome,
            sub_refs: [ACCOUNT.WITHDRAW],
          },
        ],
      },
      {
        id: "account-details",
        name: "Account Details",
        icon: VscAccount,
        active_icon: VscAccount,
        sublinks: [
          {
            id: "profile",
            name: "Profile",
            href: ACCOUNT.PROFILE,
            icon: VscAccount,
            active_icon: VscAccount,
            sub_refs: [ACCOUNT.PROFILE],
          },
          {
            id: "account-detail",
            name: "Account Detail",
            href: ACCOUNT.ACCOUNT_DETAIL,
            icon: VscAccount,
            active_icon: VscAccount,
            sub_refs: [ACCOUNT.ACCOUNT_DETAIL],
          },
          {
            id: "change-password",
            name: "Change Password",
            href: ACCOUNT.CHANGE_PASSWORD,
            icon: VscAccount,
            active_icon: VscAccount,
            sub_refs: [ACCOUNT.CHANGE_PASSWORD],
          },
        ],
      },
      {
        id: "pos-section",
        name: "My Network",
        icon: MdBusiness,
        active_icon: MdBusiness,
        sublinks: [
          {
            id: "new-user",
            name: "New User",
            href: ACCOUNT.NEW_USER,
            icon: VscAccount,
            active_icon: VscAccount,
            sub_refs: [ACCOUNT.NEW_USER],
          },
          {
            id: "user-list",
            name: "User List",
            href: ACCOUNT.USER_LIST,
            icon: VscAccount,
            active_icon: VscAccount,
            sub_refs: [ACCOUNT.USER_LIST],
          },
          {
            id: "transfer-to-cashier",
            name: "Transfer to Cashier",
            href: ACCOUNT.TRANSFER_TO_CASHIER,
            icon: FaMoneyCheck,
            active_icon: FaMoneyCheck,
            sub_refs: [ACCOUNT.TRANSFER_TO_CASHIER],
          },
          {
            id: "transfer-to-player",
            name: "Transfer to Player",
            href: ACCOUNT.TRANSFER_TO_PLAYER,
            icon: FaMoneyCheck,
            active_icon: FaMoneyCheck,
            sub_refs: [ACCOUNT.TRANSFER_TO_PLAYER],
          },
        ],
      },
      {
        id: "reports",
        name: "Marketing Materials",
        icon: HiChartBar,
        active_icon: HiChartBar,
        sublinks: [
          {
            id: "commissions",
            name: "Commissions",
            href: ACCOUNT.COMMISSIONS,
            icon: FaMoneyCheck,
            active_icon: FaMoneyCheck,
            sub_refs: [ACCOUNT.COMMISSIONS],
          },
          {
            id: "sales",
            name: "Sales",
            href: ACCOUNT.SALES,
            icon: BiSolidBarChartAlt2,
            active_icon: BiSolidBarChartAlt2,
            sub_refs: [ACCOUNT.SALES],
          },
          {
            id: "bonus",
            name: "Bonus",
            href: ACCOUNT.BONUS,
            icon: FaMoneyCheck,
            active_icon: FaMoneyCheck,
            sub_refs: [ACCOUNT.BONUS],
          },
          {
            id: "credit-liability",
            name: "Credit Liability",
            href: ACCOUNT.CREDIT_LIABILITY,
            icon: FaMoneyCheck,
            active_icon: FaMoneyCheck,
            sub_refs: [ACCOUNT.CREDIT_LIABILITY],
          },
        ],
      },
    ];
  }

  // Helper: check if any sublink is active for a parent item
  const isAnySubRefActive = (item: NavItem) => {
    if (!item.sublinks) return false;
    return item.sublinks.some(
      (sub) =>
        (sub.sub_refs && sub.sub_refs.includes(pathname)) ||
        sub.href === pathname
    );
  };

  // Helper function to check if a path matches a route pattern
  const isRouteActive = (route: string | undefined, subRefs: string[] = []) => {
    if (!route) return false;
    if (subRefs.includes(pathname)) return true;
    return subRefs.some((ref) => {
      if (ref.includes(":")) {
        const basePath = ref.split(":")[0];
        return pathname.startsWith(basePath);
      }
      return false;
    });
  };

  // Toggle submenu - only one open at a time (accordion behavior)
  const toggleSubmenu = (menuId: string) => {
    setActiveSubmenu(activeSubmenu === menuId ? null : menuId);
  };

  // Get dynamic navData
  const navData = getNavDataForRole(user);

  return (
    <aside
      className={`
        w-72 z-1000 h-[calc(100vh-48px)] transition-all duration-300
        border-r flex-col sticky top-0 hidden md:flex bg-white border-gray-200
      
      `}
    >
      <div className="w-full flex flex-col h-full overflow-y-auto px-2 p-4">
        <div className={`${geistMono.className} flex flex-col`}>
          {navData.map((item, index) => (
            <div key={item.id} className="w-full">
              {/* Section Header - Always clickable for sections with sublinks */}
              <button
                onClick={() => toggleSubmenu(item.id)}
                className={`
                  flex items-center justify-between w-full px-4 py-3
                  font-semibold text-sm transition-all duration-200 ${
                    activeSubmenu === item.id
                      ? "rounded-t-md"
                      : index === 0
                      ? "rounded-t-md"
                      : navData.length - 1 === index
                      ? "rounded-b-md"
                      : ""
                  }
                  ${
                    theme === "dark"
                      ? isAnySubRefActive(item)
                        ? "bg-blue-600 text-white"
                        : activeSubmenu === item.id
                        ? "bg-blue-500/80 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-blue-200"
                      : isAnySubRefActive(item)
                      ? "bg-blue-600 text-white"
                      : activeSubmenu === item.id
                      ? "bg-blue-500/80 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }
                `}
              >
                <span className="flex items-center gap-2">
                  {/* <item.icon fontSize={18} /> */}
                  {item.name}
                </span>
                <FaChevronDown
                  className={`transition-transform duration-300 ${
                    activeSubmenu === item.id ? "rotate-180" : ""
                  }`}
                  fontSize={12}
                />
              </button>

              {/* Sublinks - Hidden by default, shown when section is active */}
              <div
                className={`
                  transition-all duration-300 overflow-hidden
                  ${activeSubmenu === item.id ? "max-h-[1000px]" : "max-h-0"}
                  ${theme === "dark" ? "bg-gray-850" : "bg-gray-50"}
                `}
              >
                {item.sublinks?.map((sub) => (
                  <Link
                    key={sub.id}
                    href={sub.href ?? ""}
                    className={`
                      flex items-center gap-3 px-6 py-2.5 text-xs
                      transition-all duration-200
                      ${
                        theme === "dark"
                          ? isRouteActive(sub.href, sub.sub_refs)
                            ? "bg-blue-100 text-gray-900 border-l-4 border-blue-400"
                            : "text-gray-700 hover:bg-blue-500/30 hover:text-gray-900"
                          : isRouteActive(sub.href, sub.sub_refs)
                          ? "bg-blue-100 text-blue-800 border-l-4 border-blue-600"
                          : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      }
                    `}
                  >
                    <sub.icon fontSize={14} />
                    {sub.name}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default SideBar;
