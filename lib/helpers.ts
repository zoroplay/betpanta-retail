import crypto from "crypto";

export class WebHelper {
  private static algorithm = "aes-256-cbc";

  static isDarkColor = (color: string | undefined) => {
    if (!color) return false;

    // If color is a gradient (contains from-, via-, or to-), extract all stops
    if (/from-|via-|to-/.test(color)) {
      // Extract all color stops
      const stops = [];
      const fromMatch = color.match(/from-([a-zA-Z0-9-]+)/);
      const viaMatch = color.match(/via-([a-zA-Z0-9-]+)/);
      const toMatch = color.match(/to-([a-zA-Z0-9-]+)/);
      if (fromMatch) stops.push(fromMatch[1]);
      if (viaMatch) stops.push(viaMatch[1]);
      if (toMatch) stops.push(toMatch[1]);
      // If no stops found, fallback to original logic
      if (stops.length === 0) return false;
      // Compute brightness for each stop
      let darkCount = 0;
      let total = 0;
      for (const stop of stops) {
        if (WebHelper.isDarkColor(stop)) darkCount++;
        total++;
      }
      // If majority of stops are dark, treat as dark
      return darkCount / total >= 0.5;
    }

    // Tailwind color mapping to hex values
    const tailwindColors: { [key: string]: string } = {
      // Slate
      "slate-50": "#f8fafc",
      "slate-100": "#f1f5f9",
      "slate-200": "#e2e8f0",
      "slate-300": "#cbd5e1",
      "slate-400": "#94a3b8",
      "slate-500": "#64748b",
      "slate-600": "#475569",
      "slate-700": "#334155",
      "slate-800": "#1e293b",
      "slate-900": "#0f172a",
      "slate-950": "#020617",
      // Gray
      "gray-50": "#f9fafb",
      "gray-100": "#f3f4f6",
      "gray-200": "#e5e7eb",
      "gray-300": "#d1d5db",
      "gray-400": "#9ca3af",
      "gray-500": "#6b7280",
      "gray-600": "#4b5563",
      "gray-700": "#374151",
      "gray-800": "#1f2937",
      "gray-900": "#111827",
      "gray-950": "#030712",
      // Red
      "red-50": "#fef2f2",
      "red-100": "#fee2e2",
      "red-200": "#fecaca",
      "red-300": "#fca5a5",
      "red-400": "#f87171",
      "red-500": "#ef4444",
      "red-600": "#dc2626",
      "red-700": "#b91c1c",
      "red-800": "#991b1b",
      "red-900": "#7f1d1d",
      "red-950": "#450a0a",
      // Blue
      "blue-50": "#eff6ff",
      "blue-100": "#dbeafe",
      "blue-200": "#bfdbfe",
      "blue-300": "#93c5fd",
      "blue-400": "#60a5fa",
      "blue-500": "#3b82f6",
      "blue-600": "#2563eb",
      "blue-700": "#1d4ed8",
      "blue-800": "#1e40af",
      "blue-900": "#1e3a8a",
      "blue-950": "#172554",
      // Green
      "green-50": "#f0fdf4",
      "green-100": "#dcfce7",
      "green-200": "#bbf7d0",
      "green-300": "#86efac",
      "green-400": "#4ade80",
      "green-500": "#22c55e",
      "green-600": "#16a34a",
      "green-700": "#15803d",
      "green-800": "#166534",
      "green-900": "#14532d",
      "green-950": "#052e16",
      // Yellow
      "yellow-50": "#fefce8",
      "yellow-100": "#fef3c7",
      "yellow-200": "#fed7aa",
      "yellow-300": "#fcd34d",
      "yellow-400": "#fbbf24",
      "yellow-500": "#f59e0b",
      "yellow-600": "#d97706",
      "yellow-700": "#b45309",
      "yellow-800": "#92400e",
      "yellow-900": "#78350f",
      "yellow-950": "#451a03",
      // Purple
      "purple-50": "#faf5ff",
      "purple-100": "#f3e8ff",
      "purple-200": "#e9d5ff",
      "purple-300": "#d8b4fe",
      "purple-400": "#c084fc",
      "purple-500": "#a855f7",
      "purple-600": "#9333ea",
      "purple-700": "#7c3aed",
      "purple-800": "#6b21a8",
      "purple-900": "#581c87",
      "purple-950": "#3b0764",
      // Pink
      "pink-50": "#fdf2f8",
      "pink-100": "#fce7f3",
      "pink-200": "#fbcfe8",
      "pink-300": "#f9a8d4",
      "pink-400": "#f472b6",
      "pink-500": "#ec4899",
      "pink-600": "#db2777",
      "pink-700": "#be185d",
      "pink-800": "#9d174d",
      "pink-900": "#831843",
      "pink-950": "#500724",
      // Indigo
      "indigo-50": "#eef2ff",
      "indigo-100": "#e0e7ff",
      "indigo-200": "#c7d2fe",
      "indigo-300": "#a5b4fc",
      "indigo-400": "#818cf8",
      "indigo-500": "#6366f1",
      "indigo-600": "#4f46e5",
      "indigo-700": "#4338ca",
      "indigo-800": "#3730a3",
      "indigo-900": "#312e81",
      "indigo-950": "#1e1b4b",
      // Cyan
      "cyan-50": "#ecfeff",
      "cyan-100": "#cffafe",
      "cyan-200": "#a5f3fc",
      "cyan-300": "#67e8f9",
      "cyan-400": "#22d3ee",
      "cyan-500": "#06b6d4",
      "cyan-600": "#0891b2",
      "cyan-700": "#0e7490",
      "cyan-800": "#155e75",
      "cyan-900": "#164e63",
      "cyan-950": "#083344",
      // Teal
      "teal-50": "#f0fdfa",
      "teal-100": "#ccfbf1",
      "teal-200": "#99f6e4",
      "teal-300": "#5eead4",
      "teal-400": "#2dd4bf",
      "teal-500": "#14b8a6",
      "teal-600": "#0d9488",
      "teal-700": "#0f766e",
      "teal-800": "#115e59",
      "teal-900": "#134e4a",
      "teal-950": "#042f2e",
      // Emerald
      "emerald-50": "#ecfdf5",
      "emerald-100": "#d1fae5",
      "emerald-200": "#a7f3d0",
      "emerald-300": "#6ee7b7",
      "emerald-400": "#34d399",
      "emerald-500": "#10b981",
      "emerald-600": "#059669",
      "emerald-700": "#047857",
      "emerald-800": "#065f46",
      "emerald-900": "#064e3b",
      "emerald-950": "#022c22",
      // Orange
      "orange-50": "#fff7ed",
      "orange-100": "#ffedd5",
      "orange-200": "#fed7aa",
      "orange-300": "#fdba74",
      "orange-400": "#fb923c",
      "orange-500": "#f97316",
      "orange-600": "#ea580c",
      "orange-700": "#c2410c",
      "orange-800": "#9a3412",
      "orange-900": "#7c2d12",
      "orange-950": "#431407",
      // Black and White
      black: "#000000",
      white: "#ffffff",
    };

    let hexColor: string;

    // Check if it's a Tailwind color class
    if (color.includes("-")) {
      // Extract color from Tailwind class (e.g., "bg-blue-500" -> "blue-500")
      const colorMatch = color.match(
        /(?:bg-|text-|border-)?([a-z]+-?\d+|black|white)/
      );
      if (colorMatch) {
        const tailwindColor = colorMatch[1];
        hexColor = tailwindColors[tailwindColor];
        if (!hexColor) return false; // Unknown Tailwind color
      } else {
        return false;
      }
    } else if (color.startsWith("#")) {
      // It's already a hex color
      hexColor = color;
    } else if (tailwindColors[color]) {
      // It's a direct Tailwind color name
      hexColor = tailwindColors[color];
    } else {
      return false; // Unknown color format
    }

    // Convert hex to RGB
    const hex = hexColor.replace("#", "");
    if (hex.length !== 6) return false;

    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    // Calculate brightness using the formula: (0.299*R + 0.587*G + 0.114*B)
    const brightness = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    // Return true if the color is dark (brightness < 0.5)
    return brightness < 0.5;
  };

  static camelToWords = (str: string): string => {
    return str
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/([A-Z])([A-Z][a-z])/g, "$1 $2");
  };

  static getDatePart = (datetime: string): string => {
    if (!datetime || !datetime.includes("T")) {
      return datetime;
    }
    return datetime.split("T")[0];
  };
  static extractAddressComponents(addressComponents: any) {
    const mappedAddress = {
      country: "",
      landmark: "",
      postalCode: "",
      direction_url: "", // You may need to generate this separately
      district: "",
      apartment: "",
      city: "",
      building: "",
      street: "",
    };

    addressComponents.forEach((component: any) => {
      if (component.types.includes("country")) {
        mappedAddress.country = component?.longText;
      }
      if (component.types.includes("postal_code")) {
        mappedAddress.postalCode = component?.longText;
      }
      if (component.types.includes("administrative_area_level_1")) {
        mappedAddress.district = component?.longText;
      }
      if (
        component.types.includes("sublocality") ||
        component.types.includes("administrative_area_level_2") ||
        component.types.includes("sublocality_level_1")
      ) {
        mappedAddress.city = component?.longText;
      }
      if (component.types.includes("street_number")) {
        mappedAddress.building = component?.longText;
      }
      if (component.types.includes("street_number")) {
        mappedAddress.street = component?.longText;
      }
      if (
        component.types.includes("locality") ||
        component.types.includes("neighborhood")
      ) {
        mappedAddress.landmark = component?.longText;
      }
    });

    return mappedAddress;
  }

  static formatDateTime = (dateString: string): string => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    return `${hours}:${minutes} ${ampm}   ${day}-${month}-${year}`;
  };

  static getCurrentDateTime = (): string => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${day}-${month}-${year} ${hours}:${minutes}`;
  };
  static getCurrentTime = (): string => {
    const date = new Date();
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  static getCurrentDate = (): string => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  static formatAddress = (address: any): string => {
    const parts = [
      address?.street,
      address?.building,
      address?.apartment,
      address?.city,
      address?.state,
      address?.country,
      address?.postal_code,
    ];

    return parts.filter(Boolean).join(", ");
  };

  static formatDate = (datetime: string): string => {
    if (!datetime || !datetime.includes("T")) {
      return datetime;
    }
    const [date, time] = datetime.split("T");
    const [hours, minutes] = time.split(":");
    return `${date} ${hours}:${minutes}`;
  };
  static convertToHoursMinutesString(date: Date) {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      date = new Date(); // Fallback to the current date
    }
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return { hours, minutes };
  }
  static convertToTimeString(date: Date): string {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      return "";
    }
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  }

  static getCurrentDateFormatted = (date: Date): string => {
    if (isNaN(date.getTime())) {
      date = new Date(); // Fallback to the current date
    }
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  static calculatePercentage = (available: number, total: number): number => {
    if (!total) return 0;
    const percentage = (available / total) * 100;
    return Number(percentage.toFixed(2));
  };

  static getSubtitleColor = (subtitle: number) => {
    if (subtitle <= 40) {
      return "danger";
    } else if (subtitle > 40 && subtitle <= 60) {
      return "warning";
    } else if (subtitle > 60 && subtitle <= 100) {
      return "success";
    }
    return "danger";
  };

  static calculateDuration(startTime: string, endTime: string): string {
    if (!endTime) {
      return "0 hours 0 minutes"; // Return an empty string if endTime is not provided
    }

    const start = new Date(startTime);
    const end = new Date(endTime);

    // Check if end time is earlier than start time
    if (end < start) {
      return "0 hours 0 minutes";
    }

    // Check if times are equal
    if (end.getTime() === start.getTime()) {
      return "0 hours 0 minutes";
    }

    const diffInMs = end.getTime() - start.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const hours = Math.floor(diffInMinutes / 60);
    const minutes = diffInMinutes % 60;

    const hoursText = hours > 0 ? `${hours} hour${hours !== 1 ? "s" : ""}` : "";
    const minutesText =
      minutes > 0 ? `${minutes} minute${minutes !== 1 ? "s" : ""}` : "";

    // If both hours and minutes are 0, return "0 hours 0 minutes"
    if (!hoursText && !minutesText) {
      return "0 hours 0 minutes";
    }

    return [hoursText, minutesText].filter(Boolean).join(" ");
  }

  static convertToDatetimeString({
    date,
    time = "00:00",
  }: {
    date: string;
    time: string;
  }) {
    try {
      // Default to midnight if time is null/undefined/empty
      if (!time) time = "00:00";

      // Validate time format (HH:mm)
      const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
      if (!timeRegex.test(time)) {
        time = "00:00"; // Default to midnight for invalid time format
      }

      const [hour, minute] = time.split(":").map(Number);
      const now = new Date(date);

      // Validate date
      if (isNaN(now.getTime())) {
        throw new Error("Invalid date");
      }

      now.setHours(hour);
      now.setMinutes(minute);
      now.setSeconds(0);
      now.setMilliseconds(0);

      return now.toISOString();
    } catch (error) {
      console.error("Error converting datetime:", error);
      // Return current date/time as fallback
      return new Date().toISOString();
    }
  }

  static getGreeting(lang: string): string {
    const greetings: any = {
      en: {
        morning: "Good morning",
        afternoon: "Good afternoon",
        evening: "Good evening",
        night: "Good night",
      },

      ru: {
        morning: "Доброе утро",
        afternoon: "Добрый день",
        evening: "Добрый вечер",
        night: "Спокойной ночи",
      },
    };

    const currentTime = new Date();
    const currentHour = currentTime.getHours();

    const timeOfDay =
      currentHour >= 5 && currentHour < 12
        ? "morning"
        : currentHour >= 12 && currentHour < 18
        ? "afternoon"
        : currentHour >= 18 && currentHour < 22
        ? "evening"
        : "night";

    const greeting = greetings[lang][timeOfDay];
    return `${greeting}`;
  }

  static getMonthName(monthNumber: number, lang: string): string {
    const monthNames: Record<string, string[]> = {
      en: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ],
      ru: [
        "Январь",
        "Февраль",
        "Март",
        "Апрель",
        "Май",
        "Июнь",
        "Июль",
        "Август",
        "Сентябрь",
        "Октябрь",
        "Ноябрь",
        "Декабрь",
      ],
    };

    if (monthNumber < 0 || monthNumber > 11) {
      return "Invalid month number";
    }

    return monthNames[lang][monthNumber];
  }

  static hashData(data: string) {
    return crypto.createHash("sha256").update(data).digest("hex");
  }

  static encryptData(data: string | number): string {
    const secretKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY as string;
    if (!secretKey) {
      throw new Error("Secret key is not defined in environment variables.");
    }

    // Ensure the secret key is 32 bytes long
    const key = crypto.createHash("sha256").update(secretKey).digest();

    // Use a fixed IV derived from the key (for this use case only)
    const iv = crypto.createHash("md5").update(key).digest();

    const cipher = crypto.createCipheriv(this.algorithm, key, iv);

    let encrypted = cipher.update(data.toString(), "utf8", "base64");
    encrypted += cipher.final("base64");

    // Convert to base64url by removing '=' and replacing characters
    const base64url = encrypted
      .replace(/=/g, "")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");

    // Prepend with `bus-`
    return `bus-${base64url}`;
  }

  static decryptData(encryptedData: string): string {
    const secretKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY as string;
    if (!secretKey) {
      throw new Error("Secret key is not defined in environment variables.");
    }

    // Ensure the secret key is 32 bytes long
    const key = crypto.createHash("sha256").update(secretKey).digest();

    // Use the same fixed IV derived from the key
    const iv = crypto.createHash("md5").update(key).digest();

    // Remove the `bus-` prefix
    const base64url = encryptedData.replace(/^bus-/, "");

    // Convert back to standard base64 by replacing characters and adding padding
    const base64 = base64url.replace(/-/g, "+").replace(/_/g, "/");
    const paddedBase64 = base64.padEnd(
      base64.length + ((4 - (base64.length % 4)) % 4),
      "="
    );

    const decipher = crypto.createDecipheriv(this.algorithm, key, iv);

    let decrypted = decipher.update(paddedBase64, "base64", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  }

  static handleInputChange = (e: any, setFormData: any) => {
    setFormData((prev: any) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  static removeUnderscores = (str: string): string => {
    return str.replace(/_/g, " ");
  };

  static safeNumber = (value: any, fallback = 0) => {
    const n = Number(value);
    return isNaN(n) ? fallback : n;
  };

  static queryToString<T extends {}>(query: T): string {
    return Object.entries(query)
      .filter(([_, value]) => value !== undefined && value !== null)
      .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`)
      .join("&");
  }

  /**
   * Helper function to build query URLs by replacing placeholders with actual values
   * @param template - URL template with placeholders (e.g., "path/:id?param=:value")
   * @param params - Object containing parameter values to substitute
   * @returns Formatted URL with placeholders replaced
   */
  static buildQueryUrl(
    template: string,
    params: Record<string, string | number | (string | number)[]>
  ): string {
    let result = template;

    // Then replace all other parameters
    for (const [key, value] of Object.entries(params)) {
      const placeholder = `:${key}`;
      let stringValue: string;

      if (Array.isArray(value)) {
        stringValue = value.map(String).join(",");
      } else {
        stringValue = String(value);
      }

      result = result.replace(new RegExp(placeholder, "g"), stringValue);
    }

    // Clean up any remaining placeholders (like :param) that weren't replaced
    // This handles cases where parameters are missing or empty
    result = result.replace(/:[^\/&\?]+/g, "");

    return result;
  }
}
