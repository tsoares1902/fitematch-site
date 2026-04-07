"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { logout } from "@/api/auth.api";
import { useAuth } from "@/contexts/auth-context";

export default function LogoutPageClient() {
  const { accessToken, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const handleLogout = async () => {
      if (!accessToken) {
        signOut();
        router.replace("/");
        router.refresh();
        return;
      }

      try {
        const success = await logout({
          access_token: accessToken,
        });

        if (success) {
          signOut();
          router.replace("/");
          router.refresh();
        }
      } catch {
        return;
      }
    };

    void handleLogout();
  }, [accessToken, router, signOut]);

  return null;
}
