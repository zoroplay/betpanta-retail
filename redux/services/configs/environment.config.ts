// src/store/services/configs/environment.config.ts

export enum ENVIRONMENT_VARIABLES {
  BACKEND_URL = "NEXT_PUBLIC_BACKEND_URL",
  CLIENT_ID = "NEXT_PUBLIC_CLIENT_ID",
  MQTT_URI = "NEXT_PUBLIC_MQTT_URI",
  MQTT_USERNAME = "NEXT_PUBLIC_MQTT_USERNAME",
  MQTT_PASSWORD = "NEXT_PUBLIC_MQTT_PASSWORD",
  SITE_KEY = "NEXT_PUBLIC_SITE_KEY",
}

// Environment variable mapping - Next.js requires direct access for static analysis
const ENV_MAP: Record<ENVIRONMENT_VARIABLES, string | undefined> = {
  [ENVIRONMENT_VARIABLES.BACKEND_URL]: process.env.NEXT_PUBLIC_BACKEND_URL,
  [ENVIRONMENT_VARIABLES.CLIENT_ID]: process.env.NEXT_PUBLIC_CLIENT_ID,
  [ENVIRONMENT_VARIABLES.MQTT_URI]: process.env.NEXT_PUBLIC_MQTT_URI,
  [ENVIRONMENT_VARIABLES.MQTT_USERNAME]: process.env.NEXT_PUBLIC_MQTT_USERNAME,
  [ENVIRONMENT_VARIABLES.MQTT_PASSWORD]: process.env.NEXT_PUBLIC_MQTT_PASSWORD,
  [ENVIRONMENT_VARIABLES.SITE_KEY]: process.env.NEXT_PUBLIC_SITE_KEY,
};

// Type-safe environment variable getter
export const getEnvironmentVariable = (
  variable: ENVIRONMENT_VARIABLES
): string => {
  const value = ENV_MAP[variable] || "";
  console.log(`Getting environment variable: ${variable} with value: ${value}`);
  return value;
};

const getBaseUrl = (): string => {
  return getEnvironmentVariable(ENVIRONMENT_VARIABLES.BACKEND_URL);
};

// export const environmentConfig = {
//   API_BASE_URL: getBaseUrl(),
//   MQTT_URI: getEnvironmentVariable(ENVIRONMENT_VARIABLES.MQTT_URI),
//   MQTT_USERNAME: getEnvironmentVariable(ENVIRONMENT_VARIABLES.MQTT_USERNAME),
//   MQTT_PASSWORD: getEnvironmentVariable(ENVIRONMENT_VARIABLES.MQTT_PASSWORD),
//   // ACCESS_TOKEN: getEnvironmentVariable(ENVIRONMENT_VARIABLES.ACCESS_TOKEN),
//   // REFRESH_TOKEN: getEnvironmentVariable(ENVIRONMENT_VARIABLES.REFRESH_TOKEN),
//   // CLIENT_ID: 3,
//   CLIENT_ID: getEnvironmentVariable(ENVIRONMENT_VARIABLES.CLIENT_ID),
// };

// console.log(
//   "getEnvironmentVariable: API_BASE_URL",
//   getEnvironmentVariable(ENVIRONMENT_VARIABLES.BACKEND_URL)
// );
console.log(
  "getEnvironmentVariable: CLIENT_ID",
  getEnvironmentVariable(ENVIRONMENT_VARIABLES.CLIENT_ID)
);
// console.log("Environment Config:", environmentConfig);

// enviroments
const environment: { [key: string]: { API_BASE_URL: string | undefined } } = {
  production: {
    API_BASE_URL: process.env.NEXT_PUBLIC_BACKEND_URL || "",
  },
  development: {
    API_BASE_URL: process.env.NEXT_PUBLIC_BACKEND_URL || "",
  },
};
// enviroments

const currentEnvironment = process.env.NODE_ENV || "development";

export default {
  API_BASE_URL: environment[currentEnvironment].API_BASE_URL,
  CLIENT_ID: Number(getEnvironmentVariable(ENVIRONMENT_VARIABLES.CLIENT_ID)),
  SITE_KEY: getEnvironmentVariable(ENVIRONMENT_VARIABLES.SITE_KEY),
};
