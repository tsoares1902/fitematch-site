"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { IoMdExit } from "react-icons/io";
import { GrNotes } from "react-icons/gr";
import { TbUserSquareRounded } from "react-icons/tb";
import { FaCreditCard } from "react-icons/fa";
import { MdOutlineSecurity } from "react-icons/md";
import { signOut as requestSignOut } from "@/services/auth";
import { useAuth } from "@/contexts/auth-context";
import { getLocaleFromPathname, localizePath } from "@/i18n/config";

const accountMenuItems = [
  {
    href: "/account/profile",
    label: "Perfil",
    icon: TbUserSquareRounded,
    roles: ["candidate", "recruiter"],
  },
  {
    href: "/account/advertisement",
    label: "Anúncios",
    icon: GrNotes,
    roles: ["recruiter"],
  },
  {
    href: "/jobs/applications",
    label: "Processos Seletivos",
    icon: GrNotes,
    roles: ["candidate"],
  },
  {
    href: "/account/membership",
    label: "Assinatura",
    icon: FaCreditCard,
    roles: ["candidate", "recruiter"],
  },
  {
    href: "/account/security",
    label: "Segurança",
    icon: MdOutlineSecurity,
    roles: ["candidate", "recruiter"],
  },
];

export default function AccountMenu() {
  const { accessToken, refreshToken, role, signOut } = useAuth();
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname) ?? "pt";
  const normalizedPathname = pathname.replace(/^\/(pt|es|en)(?=\/|$)/, "") || "/";
  const router = useRouter();
  const visibleMenuItems = accountMenuItems.filter((item) =>
    role ? item.roles.includes(role) : false,
  );

  const handleSignOut = async () => {
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

  return (
    <div className="space-y-6">
      <button
        type="button"
        onClick={handleSignOut}
        className="flex w-full items-center justify-center gap-3 rounded-xs border border-gray-200 bg-white px-6 py-3 text-base font-medium text-gray-900 transition-colors duration-300 hover:bg-red-900 hover:text-[#FCFCFC]"
      >
        <IoMdExit className="h-5 w-5 shrink-0" />
        <span>Sair</span>
      </button>
      <aside className="rounded-xs border border-gray-200 bg-white p-6">
        <nav aria-label="Account navigation">
          <ul className="flex flex-col gap-4">
            {visibleMenuItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={localizePath(item.href, locale)}
                  className={`flex items-center gap-3 text-base transition-colors duration-300 ${
                    normalizedPathname === item.href
                      ? "font-semibold text-gray-900"
                      : "text-gray-900 hover:text-gray-700"
                  }`}
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </div>
  );
}
