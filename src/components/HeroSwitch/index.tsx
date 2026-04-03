"use client";

import Hero from "@/components/Hero";
import HeroLogged from "@/components/HeroLogged";
import { useAuth } from "@/contexts/auth-context";

export default function HeroSwitch() {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? <HeroLogged /> : <Hero />;
}
