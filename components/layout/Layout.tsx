/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useEffect, useRef } from "react";
import {
  redirect,
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import ModalProvider from "../dialogs/ModalProvider";
import { HeroUIProvider } from "@heroui/system";
import { ToastComponent } from "../tools/toast";
import { Questrial } from "next/font/google";
import { AUTH } from "@/data/routes/routes";
import { useAppSelector, useAppDispatch } from "@/hooks/useAppDispatch";
import SideBar from "./SideBar";
import Header from "./Header";
import { useGetGlobalVariablesQuery } from "@/redux/services/app.service";
const questrial = Questrial({
  subsets: ["latin"],
  weight: ["400"],
});
const Layout = ({
  children,
  modeKey,
}: Readonly<{
  children: React.ReactNode;
  modeKey: string;
}>) => {
  let pathname = usePathname();
  pathname = pathname || "";
  const router = useRouter();
  const { refetch_user, user } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  useGetGlobalVariablesQuery();

  useEffect(() => {
    // if (
    //   !user?.metadata.is_sample &&
    //   !user?.metadata?.onboarding_completed &&
    //   nav_pathname_3 !== ONBOARDING.HOME.split("/")[1] &&
    //   nav_pathname_3 !== SETTINGS.HOME.split("/")[1] &&
    //   nav_pathname === OVERVIEW.HOME
    // ) {
    //   redirect(
    //     handleDynamicLink({
    //       locale: locale as string,
    //       link: ONBOARDING.HOME,
    //     })
    //   );
    // }
  }, [pathname]);

  useEffect(() => {
    // if (
    //   !user?.metadata.is_sample &&
    //   user?.metadata?.onboarding_completed &&
    //   nav_pathname_3 == ONBOARDING.HOME.split("/")[1]
    // ) {
    //   redirect(
    //     handleDynamicLink({
    //       locale: locale as string,
    //       link: OVERVIEW.HOME,
    //     })
    //   );
    // }
  }, [refetch_user]);

  useEffect(() => {
    if (!pathname.startsWith("/auth")) {
      const fetchData = async () => {
        // fetchUser("");
        // const token = await getToken();
        // if (user?.refresh_token) {
        //   // refreshToken({ user_id: user?.user_id! });
        // }
        // if (user?.user_role?.role_name === ROLES_ENUM.BUSINESS_USER) {
        //   fetchOrganization("");
        // }
      };
      fetchData();
      const intervalId = setInterval(fetchData, 60000); // 60 seconds
      return () => clearInterval(intervalId);
    }
  }, []);

  // useEffect(() => {
  //   if (!pathname.startsWith("/auth")) {
  //     fetchUser("");
  //   }
  // }, [fetchUser, pathname]);
  // useEffect(() => {
  //   const params = new URLSearchParams(searchParams.toString());
  //   params.delete("modal");
  //   params.delete("ref");
  //   router.replace(`?${params.toString()}`);
  //   dispatch(closeModal());
  // }, [pathname]);

  // useEffect(() => {
  //   fetch({
  //     locale: locale as string,
  //   });
  // }, [userRefetch, router]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={modeKey}
        initial={{ opacity: 0, y: -25 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -25 }}
        transition={{ delay: 0.25, ease: "easeOut", duration: 0.25 }}
      >
        <HeroUIProvider>
          <main
            className={`${
              questrial.className
            } flex flex-col transition-all duration-300 ${"bg-gray-50 border-[#a6adc4]/40"}`}
          >
            {/* <div className="w-full h-full bg-blue-800 fixed blur-[4px] backdrop-blur-[4px]">
        <Image
          src={"/backgrounds/bilderboken.jpg"}
          alt="alt"
          width={3060}
          height={3060}
          className="w-full h-full object-cover opacity-20"
        />
      </div> */}
            <Header />
            <main className="z-10 flex w-full transition-all duration-300">
              <SideBar />
              <section className="w-full h-[calc(100vh-48px)] overflow-y-auto relative overflow-y-auto bg-blue-50">
                {children}
              </section>
            </main>
          </main>
          {/* <main className={`bg-white text-black`}>{children}</main> */}
          <ToastComponent />
        </HeroUIProvider>
        <ModalProvider />
      </motion.div>
    </AnimatePresence>
  );
};

export default Layout;
