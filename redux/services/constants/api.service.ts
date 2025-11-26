/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  BaseQueryApi,
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import environmentConfig from "../configs/environment.config";
import { Mutex } from "async-mutex";
import { AUTH_ACTIONS } from "./route";
import { REQUEST_ACTIONS } from "./request-types";
import { logout } from "../../../hooks/useServerLogout";
import { setAccessToken } from "../actions/setAccessTokens";
import { getToken } from "../actions/getAccessToken";
import CryptoJS from "crypto-js";

const generateApiKey = (): string => {
  const key = CryptoJS.enc.Hex.stringify(
    CryptoJS.SHA256(
      `${environmentConfig.CLIENT_ID}:${environmentConfig.SITE_KEY || ""}`
    )
  );
  return key;
};

const aesEncrypt = (): string => {
  try {
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const iv = CryptoJS.lib.WordArray.random(16);

    const hexKey = generateApiKey();
    const key = CryptoJS.enc.Hex.parse(hexKey);

    const encrypted = CryptoJS.AES.encrypt(timestamp, key, {
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    const ivHex = iv.toString(CryptoJS.enc.Hex);
    const ciphertextHex = encrypted.ciphertext.toString(CryptoJS.enc.Hex);

    const signature = ivHex + ciphertextHex;
    return signature;
  } catch (error) {
    console.error("Encryption failed:", error);
    throw new Error("Encryption failed");
  }
};

// Token refresh rate limits configuration
const TOKEN_REFRESH_LIMIT = {
  maxAttempts: 3, // Max 3 refresh attempts
  windowMs: 30000, // Within 30 seconds
  minInterval: 5000, // At least 5 seconds between attempts
};

class RateLimitedMutex {
  private mutex = new Mutex();
  private lastRefreshAttempt = 0;
  private refreshCount = 0;
  private lastErrorTime = 0;

  async acquire() {
    const now = Date.now();

    // Check if we're in cooldown after an error
    if (now - this.lastErrorTime < TOKEN_REFRESH_LIMIT.minInterval) {
      throw new Error("Token refresh in cooldown after recent error");
    }

    // Check rate limits
    if (now - this.lastRefreshAttempt < TOKEN_REFRESH_LIMIT.minInterval) {
      throw new Error("Token refresh too frequent");
    }

    if (
      this.refreshCount >= TOKEN_REFRESH_LIMIT.maxAttempts &&
      now - this.lastRefreshAttempt < TOKEN_REFRESH_LIMIT.windowMs
    ) {
      throw new Error("Maximum token refresh attempts reached");
    }

    return this.mutex.acquire();
  }

  recordSuccess() {
    const now = Date.now();
    this.lastRefreshAttempt = now;
    this.refreshCount++;

    // Reset count if outside the time window
    if (now - this.lastRefreshAttempt > TOKEN_REFRESH_LIMIT.windowMs) {
      this.refreshCount = 1;
    }
  }

  recordError() {
    this.lastErrorTime = Date.now();
  }

  isLocked() {
    return this.mutex.isLocked();
  }

  waitForUnlock() {
    return this.mutex.waitForUnlock();
  }
}

const refreshMutex = new RateLimitedMutex();

const baseQuery = fetchBaseQuery({
  baseUrl: environmentConfig.API_BASE_URL,
  prepareHeaders: async (headers, { endpoint }) => {
    try {
      const token = await getToken();

      // Add client ID header
      headers.set("SBE-Client-ID", String(environmentConfig.CLIENT_ID));

      // Add authorization token for authenticated endpoints
      if (token && !["login", "forgotten"].includes(endpoint || "")) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      // Add encryption headers
      try {
        headers.set("SBE-API-KEY", generateApiKey());
        headers.set("SBE-API-SIGNATURE", aesEncrypt());
      } catch (encryptError) {
        console.error("Error adding encryption headers:", encryptError);
      }
    } catch (error) {
      console.log("Error getting access token:", error);
    }
    return headers;
  },
});

const baseQueryWithLogging = async (args: any, api: any, extraOptions: any) => {
  const fullUrl = typeof args === "string" ? args : args.url;
  console.log("🚀 API Request:", {
    fullUrl: `${fullUrl}`,
    method: args.method || "GET",
    body: args.body,
    headers: args.headers,
    timestamp: new Date().toISOString(),
  });

  try {
    const result = await baseQuery(args, api, extraOptions);
    console.log("✅ API Response:", {
      url: `${fullUrl}`,
      status: result.meta?.response?.status,
      data: result.data,
      error: result.error,
      timestamp: new Date().toISOString(),
    });
    return result;
  } catch (error: any) {
    console.log("❌ API Error:", {
      url: `${fullUrl}`,
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
    });

    if (error.message?.includes("Network request failed")) {
      // showToast({
      //   type: "error",
      //   title: "Network Error",
      //   description: "Please check your connection and try again.",
      // });
    }
    throw error;
  }
};

async function handleTokenRefresh(args: any, api: any, extraOptions: any) {
  if (!refreshMutex.isLocked()) {
    const release: any = await refreshMutex.acquire().catch((error) => {
      // Return proper error response when rate limited
      return {
        error: {
          status: 429,
          data: { message: error.message },
        },
      };
    });

    // If we got an error from acquire()
    if (release && release?.error) {
      return release;
    }

    try {
      const refreshResult: any = await baseQuery(
        {
          url: AUTH_ACTIONS.REFRESH_TOKEN,
          method: REQUEST_ACTIONS.POST,
          headers: {
            "X-RateLimit-Bypass": "token-refresh",
          },
        },
        api,
        extraOptions
      );

      if (refreshResult.data) {
        refreshMutex.recordSuccess();
        await setAccessToken(refreshResult.data.access_token);
        return await baseQuery(args, api, extraOptions);
      } else {
        refreshMutex.recordError();
        await logout(api.dispatch);
        return {
          error: {
            status: refreshResult.error?.status || 401,
            data: { message: "Refresh token failed" },
          },
        };
      }
    } catch (error) {
      refreshMutex.recordError();
      await logout(api.dispatch);
      return {
        error: {
          status: 401,
          data: { message: "Refresh token failed" },
        },
      };
    } finally {
      if (release && typeof release === "function") {
        release();
      }
    }
  }

  return {
    error: {
      status: 429,
      data: { message: "Token refresh in progress" },
    },
  };
}

const baseQueryWithReauthAndRateLimiting = async (
  args: any,
  api: BaseQueryApi,
  extraOptions: any
) => {
  const result = await baseQueryWithLogging(args, api, extraOptions);

  if (
    result.error &&
    (result.error.status === 401 ||
      result.error.status === 502 ||
      result.error.status === 503)
  ) {
    await logout(api.dispatch);
  }

  // Handle other error statuses
  if (result.error) {
    const status = (result.error as { status?: number }).status;
    const data = result.error.data as { message?: string };

    // if (status === 403) {
    //   showToast({
    //     type: "error",
    //     title: "Access Denied",
    //     description: "You don't have permission for this action",
    //   });
    // } else if (status === 429) {
    //   showToast({
    //     type: "error",
    //     title: "Too Many Requests",
    //     description: "Please slow down your requests",
    //   });
    // } else if (status === 500) {
    //   showToast({
    //     type: "error",
    //     title: "Server Error",
    //     description: "Please try again later",
    //   });
    // } else if (status === 503) {
    //   showToast({
    //     type: "error",
    //     title: "Service Unavailable",
    //     description:
    //       "Service temporarily unavailable. You have been logged out.",
    //   });
    // } else {
    //   showToast({
    //     type: "error",
    //     title: "Error",
    //     description: data?.message || "An unexpected error occurred",
    //   });
    // }
  }

  return result;
};

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauthAndRateLimiting,
  endpoints: (builder) => ({
    // Example endpoint with built-in rate limiting
    getUser: builder.query({
      query: (userId) => ({
        url: `/users/${userId}`,
        // Optionally skip auto-refresh for this endpoint
        extraOptions: { skipRefresh: true },
      }),
    }),
    refreshToken: builder.mutation({
      query: () => ({
        url: "/auth/refresh",
        method: "POST",
        // Mark this as a refresh endpoint
        isRefreshRequest: true,
      }),
    }),
  }),
  tagTypes: ["Chats", "Messages", "User", "Notifications"],
  keepUnusedDataFor: 50000,
  refetchOnReconnect: true,
});
