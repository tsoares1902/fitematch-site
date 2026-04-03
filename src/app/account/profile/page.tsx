"use client";

import { useMemo } from "react";
import { CiTrash } from "react-icons/ci";
import AccountMenu from "@/components/Common/AccountMenu";
import { useAuth } from "@/contexts/auth-context";

type TokenProfileData = {
  createdAt: string;
  email: string;
  name: string;
  role: string;
};

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

function getProfileDataFromToken(token: string | null): TokenProfileData {
  const defaultProfileData: TokenProfileData = {
    createdAt: "Not available",
    email: "Not available",
    name: "Not available",
    role: "Not available",
  };

  if (!token) {
    return defaultProfileData;
  }

  const payload = decodeTokenPayload(token);

  if (!payload) {
    return defaultProfileData;
  }

  const firstName = typeof payload.firstName === "string" ? payload.firstName : "";
  const lastName = typeof payload.lastName === "string" ? payload.lastName : "";
  const fullName = `${firstName} ${lastName}`.trim();
  const name =
    fullName ||
    (typeof payload.name === "string" ? payload.name : "") ||
    (typeof payload.username === "string" ? payload.username : "") ||
    defaultProfileData.name;
  const email =
    typeof payload.email === "string" ? payload.email : defaultProfileData.email;
  const role =
    typeof payload.role === "string" ? payload.role : defaultProfileData.role;
  const createdAtValue =
    typeof payload.createdAt === "string" ? payload.createdAt : null;
  const createdAt = createdAtValue
    ? new Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).format(new Date(createdAtValue))
    : defaultProfileData.createdAt;

  return {
    createdAt,
    email,
    name,
    role,
  };
}

export default function ProfilePage() {
  const { accessToken } = useAuth();
  const profileData = useMemo(
    () => getProfileDataFromToken(accessToken),
    [accessToken],
  );

  return (
    <main className="bg-white pt-8 pb-20">
      <div className="container">
        <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <AccountMenu />
          </div>
          <div className="space-y-6 lg:col-span-3">
            <div className="rounded-xs border border-gray-200 bg-gray-50 p-8 md:p-12">
              <h2 className="mb-4 text-3xl font-bold text-black md:text-4xl">
                Dados Pessoais
              </h2>
              <hr className="my-6 border-gray-200" />
              <div className="space-y-4">
                <p className="text-body-color text-base leading-relaxed md:text-lg">
                  <span className="font-bold text-black">Name:</span> {profileData.name}
                </p>
                <p className="text-body-color text-base leading-relaxed md:text-lg">
                  <span className="font-bold text-black">Email:</span> {profileData.email}
                </p>
                <p className="text-body-color text-base leading-relaxed md:text-lg">
                  <span className="font-bold text-black">Role:</span> {profileData.role}
                </p>
                <p className="text-body-color text-base leading-relaxed md:text-lg">
                  <span className="font-bold text-black">Since:</span> {profileData.createdAt}
                </p>
              </div>
            </div>
            <button
              type="button"
              className="flex w-full items-center justify-center gap-3 rounded-xs border border-gray-200 bg-white px-8 py-4 text-base font-medium text-black transition-colors duration-300 hover:bg-red-900 hover:text-[#FCFCFC]"
            >
              <CiTrash className="h-5 w-5 shrink-0" />
              <span>Excluir minha conta</span>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
