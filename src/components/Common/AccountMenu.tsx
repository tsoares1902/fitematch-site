"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { IoMdExit } from "react-icons/io";
import { GrNotes } from "react-icons/gr";
import { TbUserSquareRounded } from "react-icons/tb";
import { FaCreditCard } from "react-icons/fa";
import { MdOutlineSecurity } from "react-icons/md";
import { logout } from "@/api/auth.api";
import { useAuth } from "@/contexts/auth-context";

const accountMenuItems = [
  {
    href: "/account/profile",
    label: "Perfil",
    icon: TbUserSquareRounded,
  },
  {
    href: "/account/advertisement",
    label: "Anúncios",
    icon: GrNotes,
  },
  {
    href: "/account/membership",
    label: "Assinatura",
    icon: FaCreditCard,
  },
  {
    href: "/account/security",
    label: "Segurança",
    icon: MdOutlineSecurity,
  },
];

export default function AccountMenu() {
  const { accessToken, signOut } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
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
            {accountMenuItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 text-base transition-colors duration-300 ${
                    pathname === item.href
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
