import React from "react";
import Image from "next/image";
import { Loader, LogOut, RefreshCw } from "lucide-react";
import { useTheme } from "../providers/ThemeProvider";
import { useAppSelector, useAppDispatch } from "@/hooks/useAppDispatch";
import { useLogin } from "@/hooks/useLogin";
import { logoutUser } from "@/redux/features/slice/user.slice";

const Header = () => {
  const { user } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const { theme } = useTheme();
  const { handleLogin, handleInputChange, formData, isLoading } = useLogin();

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <header className={`sticky top-0 z-[500] h-[48px] border-b bg-white`}>
      <div className="flex items-center justify-between h-full px-4 ">
        {/* Logo Section */}
        <div className="flex items-center">
          <div className="relative w-[140px] h-[32px]">
            <Image
              src="/logo.png"
              alt="Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* Divider for desktop */}
        <div className="hidden md:block h-10 w-px bg-blue-700/50 mx-6" />

        {/* User Actions Section */}
        <div className="flex items-center gap-3 flex-1 justify-end">
          {user?.id ? (
            // Logged In State
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-white font-semibold text-sm truncate max-w-[100px] hidden md:block">
                {user?.code}
              </span>
              <span className="text-white font-semibold text-sm truncate max-w-[120px]">
                {user?.username}
              </span>
              <div className="flex items-center">
                <div className="flex items-center gap-1 bg-blue-950/80 px-3 py-2 h-[36px]">
                  <span className="text-green-300 font-bold text-sm">
                    Balance: {user?.currency} {user.balance ?? 0}
                  </span>
                  <button
                    className="ml-2 text-gray-300 hover:text-white transition-colors"
                    title="Refresh balance"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex gap-1 items-center bg-red-600 hover:bg-red-700 px-3 py-2 h-[36px] text-xs font-bold shadow transition-all text-white"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden md:inline">Logout</span>
                </button>
              </div>
            </div>
          ) : (
            // Logged Out State - Login Form
            <div className="flex gap-2 items-center flex-wrap">
              <div className="flex items-center">
                <div className="text-gray-300 px-3 py-2 font-bold text-xs h-[36px] flex justify-center items-center bg-slate-800 border border-slate-600 border-r-0">
                  <span>+234</span>
                </div>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => handleInputChange(e)}
                  placeholder="Mobile Number"
                  name="username"
                  className="w-[140px] md:w-[180px] rounded-none placeholder-slate-400 h-[36px] text-sm bg-gradient-to-r from-slate-800 to-slate-700 text-gray-200 border border-slate-600 border-l-0 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange(e)}
                  placeholder="Password"
                  name="password"
                  className="w-[120px] md:w-[160px] rounded-none placeholder-slate-400 h-[36px] text-sm bg-gradient-to-r from-slate-800 to-slate-700 text-gray-200 border border-slate-600 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
                <button
                  onClick={handleLogin}
                  disabled={isLoading}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white px-4 py-2 font-bold text-xs h-[36px] shadow transition-all flex items-center justify-center min-w-[60px]"
                >
                  {isLoading ? (
                    <Loader size={16} className="animate-spin" />
                  ) : (
                    "Login"
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
