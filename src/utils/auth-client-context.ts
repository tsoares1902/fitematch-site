"use client";

import { AuthClientContextInterface } from "@/interfaces/auth-client-context.interface";

type RequiredAuthClientFields = Required<AuthClientContextInterface>;

const UNKNOWN_VALUE = "unknown";

function getBrowser(userAgent: string) {
  if (userAgent.includes("Edg/")) {
    return "Edge";
  }

  if (userAgent.includes("OPR/") || userAgent.includes("Opera/")) {
    return "Opera";
  }

  if (userAgent.includes("Firefox/")) {
    return "Firefox";
  }

  if (userAgent.includes("Chrome/") && !userAgent.includes("Edg/")) {
    return "Chrome";
  }

  if (userAgent.includes("Safari/") && !userAgent.includes("Chrome/")) {
    return "Safari";
  }

  return UNKNOWN_VALUE;
}

function getOperatingSystem(userAgent: string) {
  if (userAgent.includes("Windows")) {
    return "Windows";
  }

  if (userAgent.includes("Android")) {
    return "Android";
  }

  if (userAgent.includes("iPhone") || userAgent.includes("iPad")) {
    return "iOS";
  }

  if (userAgent.includes("Mac OS X")) {
    return "macOS";
  }

  if (userAgent.includes("Linux")) {
    return "Linux";
  }

  return UNKNOWN_VALUE;
}

function getDeviceType(userAgent: string) {
  if (/iPad|Tablet|PlayBook|Silk/i.test(userAgent)) {
    return "tablet";
  }

  if (/Mobile|Android|iPhone|iPod/i.test(userAgent)) {
    return "mobile";
  }

  return "desktop";
}

function getTimezone() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

function sanitizeValue(value?: string) {
  const normalizedValue = value?.trim();

  return normalizedValue ? normalizedValue : UNKNOWN_VALUE;
}

async function getRequestIp() {
  try {
    const response = await fetch("/api/client-ip", {
      cache: "no-store",
      method: "GET",
    });

    if (!response.ok) {
      return UNKNOWN_VALUE;
    }

    const data = (await response.json()) as { ip?: string };

    return sanitizeValue(data.ip);
  } catch {
    return UNKNOWN_VALUE;
  }
}

export async function buildAuthClientContext(): Promise<RequiredAuthClientFields> {
  if (typeof window === "undefined") {
    return {
      browser: UNKNOWN_VALUE,
      deviceType: UNKNOWN_VALUE,
      ip: UNKNOWN_VALUE,
      os: UNKNOWN_VALUE,
      timezone: UNKNOWN_VALUE,
      userAgent: UNKNOWN_VALUE,
    };
  }

  const userAgent = window.navigator.userAgent;
  const ip = await getRequestIp();

  return {
    browser: sanitizeValue(getBrowser(userAgent)),
    deviceType: sanitizeValue(getDeviceType(userAgent)),
    ip,
    os: sanitizeValue(getOperatingSystem(userAgent)),
    timezone: sanitizeValue(getTimezone()),
    userAgent: sanitizeValue(userAgent),
  };
}

export function hasCompleteAuthClientContext(
  clientContext: AuthClientContextInterface | undefined,
): clientContext is RequiredAuthClientFields {
  if (!clientContext) {
    return false;
  }

  const requiredKeys: Array<keyof RequiredAuthClientFields> = [
    "browser",
    "deviceType",
    "ip",
    "os",
    "timezone",
    "userAgent",
  ];

  return requiredKeys.every((key) => {
    const value = clientContext[key];

    return typeof value === "string" && value.trim().length > 0;
  });
}
