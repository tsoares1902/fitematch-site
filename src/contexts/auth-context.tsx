"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";

type AuthContextValue = {
  accessToken: string | null;
  isAuthenticated: boolean;
  setAccessToken: (token: string | null) => void;
  signOut: () => void;
};

const AUTH_STORAGE_KEY = "auth_access_token";
const DEFAULT_AUTH_STATE = null;

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function normalizeAccessToken(token: string | null) {
  if (!token) {
    return DEFAULT_AUTH_STATE;
  }

  const normalizedToken = token.trim();

  if (
    normalizedToken.length === 0 ||
    normalizedToken === "null" ||
    normalizedToken === "undefined"
  ) {
    return DEFAULT_AUTH_STATE;
  }

  return normalizedToken;
}

function subscribe(callback: () => void) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const handleStorageChange = (event: StorageEvent) => {
    if (event.key === AUTH_STORAGE_KEY) {
      callback();
    }
  };

  window.addEventListener("storage", handleStorageChange);

  return () => {
    window.removeEventListener("storage", handleStorageChange);
  };
}

function getClientSnapshot() {
  if (typeof window === "undefined") {
    return DEFAULT_AUTH_STATE;
  }

  return normalizeAccessToken(
    window.localStorage.getItem(AUTH_STORAGE_KEY) ?? DEFAULT_AUTH_STATE,
  );
}

function getServerSnapshot() {
  return DEFAULT_AUTH_STATE;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const accessToken = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot,
  );

  const setAccessToken = useCallback((token: string | null) => {
    if (typeof window === "undefined") {
      return;
    }

    const normalizedToken = normalizeAccessToken(token);

    if (normalizedToken) {
      window.localStorage.setItem(AUTH_STORAGE_KEY, normalizedToken);
      window.dispatchEvent(new StorageEvent("storage", {
        key: AUTH_STORAGE_KEY,
        newValue: normalizedToken,
      }));
      return;
    }

    window.localStorage.removeItem(AUTH_STORAGE_KEY);

    window.dispatchEvent(new StorageEvent("storage", {
      key: AUTH_STORAGE_KEY,
      newValue: DEFAULT_AUTH_STATE,
    }));
  }, []);

  const signOut = useCallback(() => {
    setAccessToken(DEFAULT_AUTH_STATE);
  }, [setAccessToken]);

  const value = useMemo(
    () => ({
      accessToken,
      isAuthenticated: normalizeAccessToken(accessToken) !== DEFAULT_AUTH_STATE,
      setAccessToken,
      signOut,
    }),
    [accessToken, setAccessToken, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }

  return context;
}
