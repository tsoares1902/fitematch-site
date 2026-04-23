"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import { signOut as requestSignOut } from "@/services/auth";
import { useAuth } from "@/contexts/auth-context";
import { getLocaleFromPathname, localizePath } from "@/i18n/config";

export default function LogoutPageClient() {
  const { accessToken, refreshToken, signOut } = useAuth();
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname) ?? "pt";
  const router = useRouter();

  useEffect(() => {
    const handleLogout = async () => {
      if (!accessToken || !refreshToken) {
        signOut();
        router.replace(localizePath("/", locale));
        router.refresh();
        return;
      }

      try {
        await requestSignOut({
          refreshToken,
        });

        signOut();
        router.replace(localizePath("/", locale));
        router.refresh();
      } catch {
        return;
      }
    };

    void handleLogout();
  }, [accessToken, refreshToken, locale, router, signOut]);

  return null;
}
