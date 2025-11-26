/* eslint-disable @typescript-eslint/no-explicit-any */
// src/hooks/useServerLogout.ts
import { logoutUser } from "@/redux/features/slice/user.slice";
import { AUTH } from "../data/routes/routes";
import { clearTokens } from "@/redux/services/actions/setAccessTokens";

// navigate is optional, since it won’t exist inside RTK or non-React logic
export const logout = async (
  dispatch: (t: any) => void,
  navigate?: (path: string) => void
) => {
  try {
    // Clear Redux user state
    dispatch(logoutUser());

    // Clear stored tokens
    await clearTokens();

    // Redirect only if we have navigate (like inside a React component)
    if (navigate) navigate(AUTH.SIGN_IN);

    console.log("User logged out successfully");
  } catch (error) {
    console.error("Logout failed:", error);

    // Still try redirect if navigate is available
    if (navigate) navigate(AUTH.SIGN_IN);
  }
};
