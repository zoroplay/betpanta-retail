import React from "react";
import { Questrial } from "next/font/google";

const questrial = Questrial({
  subsets: ["latin"],
  weight: ["400"],
});
export default function Layout({ children }: { children: React.ReactNode }) {
  return <div className={`${questrial.className}`}>{children}</div>;
}
