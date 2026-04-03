"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";

import { useAuth } from "@/contexts/auth-context";

const GUEST_ONLY_PATHS = new Set([
  "/account/login",
  "/account/signup",
  "/account/candidate/register",
  "/account/recruiter/register",
]);

export default function AuthRouteGuard({
  children,
}: {
  children: ReactNode;
}) {
  const { isAuthenticated } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const isGuestOnlyPath = GUEST_ONLY_PATHS.has(pathname);
    const isAccountPath = pathname === "/account" || pathname.startsWith("/account/");
    const isProtectedAccountPath = isAccountPath && !isGuestOnlyPath;

    if (isAuthenticated && GUEST_ONLY_PATHS.has(pathname)) {
      router.replace("/");
      router.refresh();
      return;
    }

    if (!isAuthenticated && isProtectedAccountPath) {
      router.replace("/");
      router.refresh();
    }
  }, [isAuthenticated, pathname, router]);

  return children;
}
