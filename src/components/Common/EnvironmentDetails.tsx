"use client";

import { useState } from "react";

function getBrowserName(userAgent: string) {
  if (userAgent.includes("Edg/")) {
    return "Edge";
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

  if (userAgent.includes("OPR/") || userAgent.includes("Opera/")) {
    return "Opera";
  }

  return "Navegador desconhecido";
}

function getOperatingSystem(userAgent: string) {
  if (userAgent.includes("Windows")) {
    return "Windows";
  }

  if (userAgent.includes("Mac OS X")) {
    return "macOS";
  }

  if (userAgent.includes("Android")) {
    return "Android";
  }

  if (userAgent.includes("iPhone") || userAgent.includes("iPad")) {
    return "iOS";
  }

  if (userAgent.includes("Linux")) {
    return "Linux";
  }

  return "Sistema desconhecido";
}

export default function EnvironmentDetails() {
  const [environmentLabel] = useState(() => {
    if (typeof window === "undefined") {
      return "Navegador desconhecido - Sistema desconhecido";
    }

    const userAgent = window.navigator.userAgent;
    const browserName = getBrowserName(userAgent);
    const operatingSystem = getOperatingSystem(userAgent);

    return `${browserName} - ${operatingSystem}`;
  });
  const [formattedDate] = useState(() => {
    if (typeof window === "undefined") {
      return "";
    }

    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }).format(new Date());
  });

  return (
    <>
      <h4 className="mb-4 text-base font-bold text-black md:text-lg">
        {environmentLabel}
      </h4>
      <p className="text-body-color text-base leading-relaxed md:text-lg">
        {formattedDate}
      </p>
    </>
  );
}
