'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BriefcaseBusiness,
  Building2,
  ChevronLeft,
  Globe2,
  LayoutDashboard,
  Menu,
  MonitorSmartphone,
  Server,
  UserRound,
  X,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useState } from 'react';
import { ROUTES } from '@/constants/routes';

interface DashboardNavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

const DEFAULT_NAV_ITEMS: DashboardNavItem[] = [
  { href: ROUTES.RECRUITER_DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
  { href: ROUTES.RECRUITER_PROFILE, label: 'Perfil', icon: UserRound },
  { href: ROUTES.RECRUITER_COMPANY, label: 'Empresa', icon: Building2 },
  { href: ROUTES.RECRUITER_JOBS, label: 'Vagas', icon: BriefcaseBusiness },
  { href: ROUTES.RECRUITER_SESSIONS, label: 'Sessões', icon: MonitorSmartphone },
];

function SidebarContent({
  collapsed,
  homeHref,
  navItems,
  sidebarExtra,
  onNavigate,
}: {
  collapsed: boolean;
  homeHref: string;
  navItems: DashboardNavItem[];
  sidebarExtra?: React.ReactNode;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const dashboardHref = navItems[0]?.href || homeHref;

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center justify-between border-b border-zinc-800 px-4">
        <Link
          href={homeHref}
          className="inline-flex items-center gap-3 lowercase"
          onClick={onNavigate}
        >
          <span className="text-base font-semibold tracking-[-0.04em] text-zinc-50"></span>
        </Link>
      </div>

      <div className="flex-1 px-3 py-4">
        <div className="mb-4 rounded-2xl border border-zinc-800 bg-zinc-950/80 p-2 backdrop-blur">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === dashboardHref ? pathname === item.href : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                className={`mb-1 flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition-all duration-300 last:mb-0 ${
                  isActive
                    ? 'bg-lime-500/10 text-lime-300'
                    : 'text-zinc-400 hover:bg-white/[0.03] hover:text-zinc-100'
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </div>

        {!collapsed && sidebarExtra}

        {!collapsed && !sidebarExtra && (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-4 backdrop-blur">
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-zinc-500">Status</p>
            <div className="mt-4 space-y-3 text-sm text-zinc-400">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-2">
                  <Server className="h-4 w-4 text-lime-400" />
                  API
                </span>
                <span className="text-lime-400">Online</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-2">
                  <Globe2 className="h-4 w-4 text-lime-400" />
                  Site
                </span>
                <span className="text-lime-400">Online</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-2">
                  <UserRound className="h-4 w-4 text-lime-400" />
                  Perfil
                </span>
                <span className="text-zinc-200">Recrutador</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function DashboardShell({
  title,
  subtitle,
  homeHref = ROUTES.RECRUITER_DASHBOARD,
  navItems = DEFAULT_NAV_ITEMS,
  sidebarExtra,
  children,
}: {
  title: string;
  subtitle: string;
  homeHref?: string;
  navItems?: DashboardNavItem[];
  sidebarExtra?: React.ReactNode;
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-black text-zinc-50">
      <div className="flex min-h-screen">
        <aside
          className={`hidden border-r border-zinc-800 bg-zinc-950/70 backdrop-blur xl:block ${
            collapsed ? 'w-24' : 'w-72'
          } transition-all duration-300`}
        >
          <SidebarContent
            collapsed={collapsed}
            homeHref={homeHref}
            navItems={navItems}
            sidebarExtra={sidebarExtra}
          />
        </aside>

        <AnimatePresence>
          {mobileOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-40 bg-black/60 xl:hidden"
                onClick={() => setMobileOpen(false)}
              />
              <motion.aside
                initial={{ x: -24, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -24, opacity: 0 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="fixed inset-y-0 left-0 z-50 w-72 border-r border-zinc-800 bg-zinc-950/95 backdrop-blur xl:hidden"
              >
                <div className="flex items-center justify-end p-3">
                  <button
                    type="button"
                    onClick={() => setMobileOpen(false)}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-zinc-800 bg-zinc-950 text-zinc-200"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <SidebarContent
                  collapsed={false}
                  homeHref={homeHref}
                  navItems={navItems}
                  sidebarExtra={sidebarExtra}
                  onNavigate={() => setMobileOpen(false)}
                />
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 border-b border-zinc-800 bg-black/70 backdrop-blur-xl">
            <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setMobileOpen(true)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-zinc-800 bg-zinc-950 text-zinc-200 xl:hidden"
                >
                  <Menu className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setCollapsed((current) => !current)}
                  className="hidden h-10 w-10 items-center justify-center rounded-full border border-zinc-800 bg-zinc-950 text-zinc-200 xl:inline-flex"
                >
                  <ChevronLeft
                    className={`h-4 w-4 transition-transform ${collapsed ? 'rotate-180' : ''}`}
                  />
                </button>

                <div>
                  <p className="text-sm text-zinc-500">{subtitle}</p>
                  <h1 className="text-lg font-semibold tracking-[-0.04em] text-zinc-50">{title}</h1>
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
