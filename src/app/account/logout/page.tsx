"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { logout } from "@/api/auth";
import { useAuth } from "@/contexts/auth-context";

export default function LogoutPage() {
  const { accessToken, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        if (accessToken) {
          await logout({
            access_token: accessToken,
          });
        }
      } catch (error) {
        console.error("Logout failed", error);
      } finally {
        signOut();
        router.replace("/");
        router.refresh();
      }
    };

    void handleLogout();
  }, [accessToken, router, signOut]);

  return null;
}
