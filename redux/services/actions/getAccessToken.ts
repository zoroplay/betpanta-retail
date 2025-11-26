"use server";

import { cookies } from "next/headers";

export const getToken = async (): Promise<string> => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token");

    if (!token) {
      console.error("Access token cookie not found");
      return "";
    }

    if (!token.value) {
      console.error("Access token value is empty");
      return "";
    }

    return token.value;
  } catch (error) {
    console.error("Error retrieving access token:", error);
    return "";
  }
};

export const getAuthToken = async (): Promise<string> => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token");

    if (!token) {
      console.error("Auth token cookie not found");
      return "";
    }

    if (!token.value) {
      console.error("Auth token value is empty");
      return "";
    }

    return token.value;
  } catch (error) {
    console.error("Error retrieving auth token:", error);
    return "";
  }
};
