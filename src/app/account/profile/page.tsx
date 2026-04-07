import type { Metadata } from "next";

import ProfilePageClient from "./profile-page-client";

export const metadata: Metadata = {
  title: "fitematch | Perfil",
  description: "Visualize e edite as informacoes do seu perfil na fitematch.",
};

export default function ProfilePage() {
  return <ProfilePageClient />;
}
