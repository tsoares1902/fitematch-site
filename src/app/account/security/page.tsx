"use client";

import { useEffect, useMemo, useState } from "react";

import { getSessionsByUser } from "@/api/auth.api";
import AccountMenu from "@/components/Common/AccountMenu";
import { useAuth } from "@/contexts/auth-context";
import { AuthAccessItemInterface } from "@/interfaces/auth-access-item.interface";

const NOT_INFORMED_LABEL = "Nao informado";
const UNKNOWN_BROWSER_LABEL = "Navegador desconhecido";
const UNKNOWN_OS_LABEL = "Sistema desconhecido";
const FIELD_CLASS_NAME = "text-body-color text-sm leading-relaxed md:text-base";
const FIELD_LABEL_CLASS_NAME = "font-bold text-black";
const SESSION_DATE_FORMATTER = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});

function decodeTokenPayload(token: string) {
  try {
    const [, payload] = token.split(".");

    if (!payload) {
      return null;
    }

    const normalizedPayload = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decodedPayload = window.atob(normalizedPayload);

    return JSON.parse(decodedPayload) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function getUserIdFromToken(token: string | null) {
  if (!token) {
    return null;
  }

  const payload = decodeTokenPayload(token);

  if (!payload) {
    return null;
  }

  if (typeof payload.userId === "string") {
    return payload.userId;
  }

  if (typeof payload.sub === "string") {
    return payload.sub;
  }

  if (typeof payload.id === "string") {
    return payload.id;
  }

  return null;
}

function formatSessionDate(value: string | null) {
  if (!value) {
    return NOT_INFORMED_LABEL;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return NOT_INFORMED_LABEL;
  }

  const formattedDate = SESSION_DATE_FORMATTER.format(date);

  return formattedDate.replace(",", " -");
}

function getSessionTitle(session: AuthAccessItemInterface) {
  const browser = session.client?.browser ?? session.browser ?? UNKNOWN_BROWSER_LABEL;
  const os = session.client?.os ?? session.os ?? UNKNOWN_OS_LABEL;

  return `${browser} - ${os}`;
}

function getSessionIdentifier(session: AuthAccessItemInterface) {
  return session.sessionId ?? session.id ?? NOT_INFORMED_LABEL;
}

function getSessionStartedAt(session: AuthAccessItemInterface) {
  return session.startedAt ?? session.loggedAt ?? null;
}

function getClientValue(
  session: AuthAccessItemInterface,
  clientValue: string | null | undefined,
  fallbackValue: string | null | undefined,
) {
  return clientValue ?? fallbackValue ?? NOT_INFORMED_LABEL;
}

function getSessionBrowser(session: AuthAccessItemInterface) {
  return getClientValue(session, session.client?.browser, session.browser);
}

function getSessionDevice(session: AuthAccessItemInterface) {
  const device = getClientValue(session, session.client?.deviceType, session.deviceType);

  return device.charAt(0).toUpperCase() + device.slice(1);
}

function getSessionOs(session: AuthAccessItemInterface) {
  return getClientValue(session, session.client?.os, session.os);
}

function getSessionIp(session: AuthAccessItemInterface) {
  return getClientValue(session, session.client?.ip, session.ip);
}

function getSessionTimezone(session: AuthAccessItemInterface) {
  return getClientValue(session, session.client?.timezone, session.timezone);
}

type SessionFieldProps = {
  label: string;
  value: string;
};

function SessionField({ label, value }: SessionFieldProps) {
  return (
    <p className={FIELD_CLASS_NAME}>
      <span className={FIELD_LABEL_CLASS_NAME}>{label}:</span> {value}
    </p>
  );
}

export default function SecurityPage() {
  const { accessToken } = useAuth();
  const [sessions, setSessions] = useState<AuthAccessItemInterface[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const userId = useMemo(() => getUserIdFromToken(accessToken), [accessToken]);

  useEffect(() => {
    let isMounted = true;

    const loadSessions = async () => {
      if (!accessToken || !userId) {
        if (isMounted) {
          setSessions([]);
          setIsLoading(false);
        }

        return;
      }

      try {
        const response = await getSessionsByUser({
          access_token: accessToken,
          userId,
        });

        if (isMounted) {
          setSessions(response.items);
        }
      } catch {
        if (isMounted) {
          setSessions([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadSessions();

    return () => {
      isMounted = false;
    };
  }, [accessToken, userId]);

  const renderSessionsContent = () => {
    if (isLoading) {
      return (
        <p className="text-body-color text-base leading-relaxed md:text-lg">
          Carregando sessoes...
        </p>
      );
    }

    if (sessions.length === 0) {
      return (
        <p className="text-body-color text-base leading-relaxed md:text-lg">
          Nenhuma sessao encontrada.
        </p>
      );
    }

    return (
      <div className="space-y-6">
        {sessions.map((session) => (
          <div
            key={getSessionIdentifier(session)}
            className="rounded-xs border border-gray-200 bg-white p-6"
          >
            <h4 className="mb-4 text-base font-bold text-black md:text-lg">
              {getSessionTitle(session)}
            </h4>
            <div className="space-y-3">
              <SessionField label="Session ID" value={getSessionIdentifier(session)} />
              <SessionField label="Browser" value={getSessionBrowser(session)} />
              <SessionField label="Device" value={getSessionDevice(session)} />
              <SessionField label="Sistema Operacional" value={getSessionOs(session)} />
              <SessionField label="IP" value={getSessionIp(session)} />
              <SessionField label="Timezone" value={getSessionTimezone(session)} />
              <SessionField
                label="Data de acesso"
                value={formatSessionDate(getSessionStartedAt(session))}
              />
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <main className="bg-white pt-8 pb-20">
      <div className="container">
        <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <AccountMenu />
          </div>
          <div className="space-y-6 lg:col-span-3">
            <div className="rounded-xs border border-gray-200 bg-gray-50 p-8 md:p-12">
              {renderSessionsContent()}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
