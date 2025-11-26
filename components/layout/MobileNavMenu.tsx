import React, { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { OVERVIEW, SETTINGS } from "@/data/routes/routes";
import { FaUser, FaCog, FaBuilding, FaUsers } from "react-icons/fa";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { setIsMenuOpen } from "@/redux/features/slice/app.slice";
import { navData } from "@/data/nav/data";
import { VscAccount } from "react-icons/vsc";

interface MobileNavMenuProps {
  isOpen: boolean;
}

const MobileNavMenu: React.FC<MobileNavMenuProps> = ({ isOpen }) => {
  const pathname = usePathname();
  const { role } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        dispatch(setIsMenuOpen(false));
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, dispatch]);

  // Helper function to check if a path matches a route pattern
  const isRouteActive = (route: string, subRefs: string[]) => {
    // Check exact matches first
    if (subRefs.includes(pathname)) return true;

    // Check if the path starts with any of the subRefs
    return subRefs.some((ref) => {
      // If the ref ends with a dynamic segment (e.g., 'day/[date]')
      if (ref.includes(":")) {
        // Get the base path before the dynamic segment
        const basePath = ref.split(":")[0];
        return pathname.startsWith(basePath);
      }
      return false;
    });
  };
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={menuRef}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className="fixed top-[62px] left-0 right-0 bg-white shadow-lg z-30 md:hidden"
        >
          <div className="flex flex-col divide-y divide-gray-200 p-4">
            {navData.map((item) => {
              const isActive = isRouteActive(item.href, item.sub_refs);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => dispatch(setIsMenuOpen(false))}
                  className={`flex rounded-2xl items-center gap-3 px-4 py-3 transition-colors hover:bg-blue-300 ${
                    isActive
                      ? "bg-gradient-to-br from-blue-500 to-blue-700 text-white hover:bg-gradient-to-br hover:from-blue-600 hover:to-blue-800 transition-all duration-300"
                      : "text-black bg-white"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
            <Link
              href={OVERVIEW.SETTINGS}
              className={`flex rounded-2xl items-center h-[48px] gap-2 w-full justify-start hover:bg-blue-300 transition-all duration-300  px-4 p-2 ${
                isRouteActive(OVERVIEW.SETTINGS, [
                  OVERVIEW.SETTINGS,
                  SETTINGS.COMPANY,
                  SETTINGS.COMPANY_DETAIL,
                ])
                  ? "bg-gradient-to-br from-blue-500 to-blue-700 text-white hover:bg-gradient-to-br hover:from-blue-600 hover:to-blue-800 transition-all duration-300"
                  : "text-black bg-white"
              }`}
            >
              {" "}
              <VscAccount fontSize={24} />
              <span className="text-sm font-medium">Settings</span>
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MobileNavMenu;
