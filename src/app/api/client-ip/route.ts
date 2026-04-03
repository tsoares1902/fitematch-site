import { NextResponse } from "next/server";
import { headers } from "next/headers";

const UNKNOWN_VALUE = "unknown";

function extractIpFromForwardedHeader(forwarded: string | null) {
  if (!forwarded) {
    return null;
  }

  const match = forwarded.match(/for=(?:"?\[?)([^;\],"]+)/i);

  return match?.[1] ?? null;
}

function extractClientIp(
  xForwardedFor: string | null,
  xRealIp: string | null,
  forwarded: string | null,
) {
  const forwardedIp = xForwardedFor?.split(",")[0]?.trim();

  if (forwardedIp) {
    return forwardedIp;
  }

  if (xRealIp?.trim()) {
    return xRealIp.trim();
  }

  const parsedForwardedIp = extractIpFromForwardedHeader(forwarded)?.trim();

  if (parsedForwardedIp) {
    return parsedForwardedIp;
  }

  return UNKNOWN_VALUE;
}

export async function GET() {
  const requestHeaders = await headers();
  const ip = extractClientIp(
    requestHeaders.get("x-forwarded-for"),
    requestHeaders.get("x-real-ip"),
    requestHeaders.get("forwarded"),
  );

  return NextResponse.json({ ip });
}
