import { AuthClientContextInterface } from "@/interfaces/auth-client-context.interface";

export interface AuthAccessItemInterface {
  browser: string | null;
  browserVersion: string | null;
  client?: AuthClientContextInterface | null;
  deviceType: string | null;
  id: string;
  ip: string | null;
  isCurrent: boolean;
  language: string | null;
  lastSeenAt: string | null;
  loggedAt: string;
  os: string | null;
  osVersion: string | null;
  revokedAt: string | null;
  sessionId?: string | null;
  startedAt?: string | null;
  status?: string | null;
  timezone: string | null;
  userAgent: string | null;
}
