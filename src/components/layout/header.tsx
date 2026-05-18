'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  ChevronDown,
  FileText,
  LayoutDashboard,
  LogIn,
  LogOut,
  Menu,
  MonitorSmartphone,
  UserRound,
  UserRoundPlus,
  X,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { ROUTES } from '@/constants/routes';
import { useFlashMessage } from '@/contexts/flash-message-context';
import { useAuth } from '@/hooks/use-auth';
import { ProductRoleEnum } from '@/types/entities/user.entity';
import { LanguageDropdown } from './language-dropdown';

const NAV_LINK_BASE =
  'rounded-full px-3 py-2 text-sm text-zinc-50 transition-colors duration-200 hover:text-lime-500';
const NAV_LINK_ACTIVE = 'text-lime-400';

interface AccountMenuItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { showError, showSuccess } = useFlashMessage();
  const { user, isAuthenticated, isLoading, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const accountMenuRef = useRef<HTMLDivElement | null>(null);

  const isRecruiter = user?.productRole === ProductRoleEnum.RECRUITER;
  const isCandidate = user?.productRole === ProductRoleEnum.CANDIDATE;
  const profileHref = isCandidate
    ? ROUTES.CANDIDATE_PROFILE
    : isRecruiter
      ? ROUTES.RECRUITER_PROFILE
      : ROUTES.PROFILE;
  const displayName = user?.name?.trim() || 'Minha conta';
  const accountMenuItems: AccountMenuItem[] = isCandidate
    ? [
        { href: ROUTES.CANDIDATE_DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
        { href: ROUTES.CANDIDATE_PROFILE, label: 'Perfil', icon: UserRound },
        { href: ROUTES.CANDIDATE_APPLICATIONS, label: 'Applications', icon: FileText },
        { href: ROUTES.CANDIDATE_SESSIONS, label: 'Sessões', icon: MonitorSmartphone },
      ]
    : isRecruiter
      ? [
          { href: ROUTES.RECRUITER_DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
          { href: ROUTES.RECRUITER_PROFILE, label: 'Perfil', icon: UserRound },
          { href: ROUTES.RECRUITER_COMPANY, label: 'Empresa', icon: Building2 },
          { href: ROUTES.RECRUITER_JOBS, label: 'Vagas', icon: BriefcaseBusiness },
          { href: ROUTES.RECRUITER_SESSIONS, label: 'Sessões', icon: MonitorSmartphone },
        ]
      : [{ href: profileHref, label: 'Perfil', icon: UserRound }];

  const navItems = [
    { href: ROUTES.JOBS, label: 'Vagas', show: true },
    { href: ROUTES.FAQ, label: 'FAQ', show: true },
  ].filter((item) => item.show);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!accountMenuRef.current?.contains(event.target as Node)) {
        setAccountMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handlePointerDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
    };
  }, []);

  async function handleSignOut() {
    try {
      await signOut();
      showSuccess('Logout realizado com sucesso.');
      setMenuOpen(false);
      setAccountMenuOpen(false);
      router.push(ROUTES.HOME);
    } catch {
      showError('Não foi possível sair da conta.');
    }
  }

  function getNavClass(href: string) {
    const isActive = pathname.startsWith(href) && href !== ROUTES.HOME;
    return `${NAV_LINK_BASE} ${isActive ? NAV_LINK_ACTIVE : ''}`;
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/8 bg-black backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link
            href={ROUTES.HOME}
            className="text-lg font-semibold lowercase tracking-[-0.05em] text-zinc-50 transition-opacity hover:opacity-80"
          >
            <span className="text-zinc-50">fite</span>
            <span className="text-lime-400">match</span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className={getNavClass(item.href)}>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <LanguageDropdown />

          {!isLoading && !isAuthenticated && (
            <>
              <Link
                href={ROUTES.SIGN_IN}
                className="inline-flex items-center gap-2 rounded-full bg-zinc-50 px-4 py-2 text-sm font-medium text-black transition-all duration-300 hover:bg-white"
              >
                <LogIn className="h-4 w-4" />
                Entrar
              </Link>
              <Link
                href={ROUTES.SIGN_UP}
                className="inline-flex items-center gap-2 rounded-full bg-lime-500 px-4 py-2 text-sm font-medium text-black transition-all duration-300 hover:bg-lime-400"
              >
                Criar conta
                <ArrowRight className="h-4 w-4" />
              </Link>
            </>
          )}

          {!isLoading && isAuthenticated && (
            <>
              <div ref={accountMenuRef} className="relative">
                <button
                  type="button"
                  onClick={() => setAccountMenuOpen((current) => !current)}
                  className="inline-flex max-w-64 items-center gap-2 rounded-full border border-lime-500/20 bg-lime-500/10 px-4 py-2 text-sm text-lime-300 transition-all duration-300 hover:border-lime-500/35 hover:bg-lime-500/15 hover:text-lime-200"
                  aria-expanded={accountMenuOpen}
                  aria-haspopup="menu"
                >
                  <UserRound className="h-4 w-4 shrink-0" />
                  <span className="truncate">{displayName}</span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 transition-transform ${
                      accountMenuOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {accountMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.16, ease: 'easeOut' }}
                      className="absolute right-0 top-full z-50 mt-3 w-72 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950/95 p-2 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur"
                      role="menu"
                    >
                      <div className="border-b border-zinc-800 px-3 py-3">
                        <p className="truncate text-sm font-medium text-zinc-100">{displayName}</p>
                        <p className="mt-1 text-xs text-zinc-500">
                          {isRecruiter ? 'Área do recrutador' : 'Área do candidato'}
                        </p>
                      </div>

                      <div className="py-2">
                        {accountMenuItems.map((item) => {
                          const Icon = item.icon;
                          const isActive =
                            item.href === ROUTES.CANDIDATE_DASHBOARD ||
                            item.href === ROUTES.RECRUITER_DASHBOARD
                              ? pathname === item.href
                              : pathname.startsWith(item.href);

                          return (
                            <Link
                              key={item.href}
                              href={item.href}
                              onClick={() => setAccountMenuOpen(false)}
                              className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition-colors ${
                                isActive
                                  ? 'bg-lime-500/10 text-lime-300'
                                  : 'text-zinc-300 hover:bg-white/[0.03] hover:text-zinc-100'
                              }`}
                              role="menuitem"
                            >
                              <Icon className="h-4 w-4 shrink-0" />
                              <span>{item.label}</span>
                            </Link>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <button
                type="button"
                onClick={() => {
                  void handleSignOut();
                }}
                className="inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm text-red-200 transition-all duration-300 hover:border-red-500/35 hover:bg-red-500/15 hover:text-red-100"
              >
                <LogOut className="h-4 w-4" />
                Sair
              </button>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((current) => !current)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-zinc-100 transition-all duration-300 hover:border-white/15 hover:bg-white/[0.05] lg:hidden"
          aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="border-t border-white/8 bg-black/80 backdrop-blur-xl lg:hidden"
          >
            <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 sm:px-6">
              <div className="flex justify-end">
                <LanguageDropdown />
              </div>

              <nav className="flex flex-col gap-1">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className={`rounded-2xl px-4 py-3 text-sm transition-colors hover:bg-lime-500/10 hover:text-lime-400 ${
                      pathname.startsWith(item.href) && item.href !== ROUTES.HOME
                        ? 'text-lime-400'
                        : 'text-zinc-50'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              {!isLoading && !isAuthenticated && (
                <div className="grid gap-2 pt-2">
                  <Link
                    href={ROUTES.SIGN_IN}
                    onClick={() => setMenuOpen(false)}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-zinc-50 px-4 py-3 text-sm font-medium text-black transition-all duration-300 hover:bg-white"
                  >
                    <LogIn className="h-4 w-4" />
                    Entrar
                  </Link>
                  <Link
                    href={ROUTES.SIGN_UP}
                    onClick={() => setMenuOpen(false)}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-lime-500 px-4 py-3 text-sm font-medium text-black transition-all duration-300 hover:bg-lime-400"
                  >
                    <UserRoundPlus className="h-4 w-4" />
                    Criar conta
                  </Link>
                </div>
              )}

              {!isLoading && isAuthenticated && (
                <div className="grid gap-2 pt-2">
                  <div className="rounded-2xl border border-lime-500/20 bg-lime-500/10 px-4 py-3 text-lime-300">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <UserRound className="h-4 w-4" />
                      <span className="truncate">{displayName}</span>
                    </div>
                    <p className="mt-1 text-xs text-lime-300/70">
                      {isRecruiter ? 'Área do recrutador' : 'Área do candidato'}
                    </p>
                  </div>

                  <div className="grid gap-1">
                    {accountMenuItems.map((item) => {
                      const Icon = item.icon;
                      const isActive =
                        item.href === ROUTES.CANDIDATE_DASHBOARD ||
                        item.href === ROUTES.RECRUITER_DASHBOARD
                          ? pathname === item.href
                          : pathname.startsWith(item.href);

                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setMenuOpen(false)}
                          className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition-colors hover:bg-lime-500/10 hover:text-lime-400 ${
                            isActive ? 'text-lime-400' : 'text-zinc-50'
                          }`}
                        >
                          <Icon className="h-4 w-4 shrink-0" />
                          <span>{item.label}</span>
                        </Link>
                      );
                    })}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      void handleSignOut();
                    }}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200 transition-all duration-300 hover:border-red-500/35 hover:bg-red-500/15 hover:text-red-100"
                  >
                    <LogOut className="h-4 w-4" />
                    Sair
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
