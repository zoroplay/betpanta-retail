"use server";
import { cookies } from "next/headers";

export const setAccessToken = async (value: string) => {
  const cookie = await cookies();

  cookie.set({
    name: "access_token",
    value: `${value}`,
    httpOnly: true,
    path: "/",
  });
};
export const setAuthToken = async (value: string) => {
  const cookie = await cookies();

  cookie.set({
    name: "auth_token",
    value: `${value}`,
    httpOnly: true,
    path: "/",
  });
};

export const clearTokens = async () => {
  const cookie = await cookies();
  cookie.delete("auth_token");
  cookie.delete("access_token");
  cookie.delete("user_id");
};

export const getUserId = async () => {
  const cookie = await cookies();
  return cookie.get("user_id")?.value;
};

export const storeUserId = async (value: string) => {
  const cookie = await cookies();
  cookie.set({
    name: "user_id",
    value: `${value}`,
    httpOnly: true,
    path: "/",
  });
};
