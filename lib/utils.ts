import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { setCookie } from "nookies";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
// export function setLocaleCookie(locale: string) {
//   setCookie(null, "Next-Locale", locale, {
//     path: "/",
//   });
// }

// export function updateLocaleInUrl(languageCode: string) {
//   const currentUrl = new URL(window.location.href);
//   const pathSegments = currentUrl.pathname.split("/").filter(Boolean);

//   if (pathSegments.length > 0) {
//     pathSegments[0] = languageCode;
//   } else {
//     pathSegments.unshift(languageCode);
//   }

//   currentUrl.pathname = `/${pathSegments.join("/")}`;
//   window.location.href = currentUrl.toString();
// }
