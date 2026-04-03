import type { Metadata } from "next";

import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "fitematch | Login",
  description: "Acesse sua conta na fitematch.",
};

export default function LoginPage() {
  return <LoginForm />;
}
