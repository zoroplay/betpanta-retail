import {
  getPushToken,
  subscribeToPushNotifications,
} from "@/utils/pushNotificationService";
import { Middleware, AnyAction } from "@reduxjs/toolkit";

// Define a more specific type for your middleware
export const pushNotificationMiddleware: Middleware<{}, any, any> =
  (store) => (next) => (action: AnyAction) => {
    const result = next(action);

    if (
      action.type === "auth/loginSuccess" ||
      action.type === "auth/refreshTokenSuccess"
    ) {
      getPushToken().then((token) => {
        if (token) {
          subscribeToPushNotifications(token);
        }
      });
    }

    return result;
  };
