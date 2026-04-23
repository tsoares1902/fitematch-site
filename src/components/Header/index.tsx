"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { IoMdExit } from "react-icons/io";
import { MdLogin } from "react-icons/md";
import { MdKeyboardDoubleArrowDown } from "react-icons/md";
import { TbUserSquareRounded } from "react-icons/tb";
import { FaUserPlus } from "react-icons/fa";
import { signOut as requestSignOut } from "@/services/auth";
import { useDictionary, useLocale } from "@/contexts/locale-context";
import { useAuth } from "@/contexts/auth-context";
import { Locale, localizePath } from "@/i18n/config";
import { localeCookieName } from "@/i18n/config";

const Header = () => {
  const { accessToken, refreshToken, isAuthenticated, signOut } = useAuth();
  const dictionary = useDictionary();
  const locale = useLocale();
  const router = useRouter();
  const availableLanguages = useMemo(
    () => [
      { id: 5, locale: "pt" as Locale, title: dictionary.common.portuguese },
      { id: 6, locale: "es" as Locale, title: dictionary.common.spanish },
      { id: 7, locale: "en" as Locale, title: dictionary.common.english },
    ],
    [dictionary.common.english, dictionary.common.portuguese, dictionary.common.spanish],
  );
  const navigationMenuItems = useMemo(
    () => [
      { id: 1, title: dictionary.common.home, path: "/" },
      { id: 2, title: dictionary.common.jobs, path: "/jobs" },
      { id: 3, title: dictionary.common.faq, path: "/faq" },
    ],
    [dictionary.common.faq, dictionary.common.home, dictionary.common.jobs],
  );
  const languageMenuItem = { id: 4, title: dictionary.common.languages };
  const activeLanguage =
    availableLanguages.find((item) => item.locale === locale) ?? availableLanguages[0];

  // Navbar toggle
  const [navbarOpen, setNavbarOpen] = useState(false);
  const navbarToggleHandler = () => {
    setNavbarOpen(!navbarOpen);
  };

  // Sticky Navbar
  const [sticky, setSticky] = useState(false);
  const handleStickyNavbar = () => {
    if (window.scrollY >= 80) {
      setSticky(true);
    } else {
      setSticky(false);
    }
  };
  useEffect(() => {
    window.addEventListener("scroll", handleStickyNavbar);
    return () => window.removeEventListener("scroll", handleStickyNavbar);
  }, []);

  // submenu handler
  const [openIndex, setOpenIndex] = useState(-1);
  const handleSubmenu = (index: number) => {
    if (openIndex === index) {
      setOpenIndex(-1);
    } else {
      setOpenIndex(index);
    }
  };

  const handleSignOut = async () => {
    if (!accessToken || !refreshToken) {
      signOut();
      setNavbarOpen(false);
      router.replace(localizePath("/", locale));
      router.refresh();
      return;
    }

    try {
      await requestSignOut({
        refreshToken,
      });

      signOut();
      setNavbarOpen(false);
      router.replace(localizePath("/", locale));
      router.refresh();
    } catch {
      return;
    }
  };

  const pathname = usePathname();
  const currentPath = pathname.replace(/^\/(pt|es|en)(?=\/|$)/, "") || "/";

  const switchLanguage = (nextLocale: Locale) => {
    document.cookie = `${localeCookieName}=${nextLocale}; path=/; max-age=31536000`;
    router.push(localizePath(currentPath, nextLocale));
    router.refresh();
    setOpenIndex(-1);
    setNavbarOpen(false);
  };

  return (
    <header
        className={`header top-0 left-0 z-40 flex w-full items-center ${
          sticky
            ? "shadow-sticky fixed z-9999 bg-white/80 backdrop-blur-xs transition"
            : "absolute bg-transparent"
        }`}
      >
        <div className="container">
          <div className="relative -mx-4 flex items-center justify-between">
            <div className="w-60 max-w-full px-4 xl:mr-12">
              <Link
                href={localizePath("/", locale)}
                className={`header-logo block w-full text-2xl font-bold tracking-tight text-gray-800 transition-colors hover:text-gray-600 ${
                  sticky ? "py-5 lg:py-2" : "py-8"
                } `}
              >
                fitematch
              </Link>
            </div>
            <div className="flex w-full items-center px-4">
              <div className="flex-1">
                <button
                  onClick={navbarToggleHandler}
                  id="navbarToggler"
                  aria-label="Mobile Menu"
                  className="ring-primary absolute top-1/2 right-4 block translate-y-[-50%] rounded-lg px-3 py-[6px] focus:ring-2 lg:hidden"
                >
                  <span
                    className={`relative my-1.5 block h-0.5 w-[30px] bg-black transition-all duration-300 ${
                      navbarOpen ? "top-[7px] rotate-45" : " "
                    }`}
                  />
                  <span
                    className={`relative my-1.5 block h-0.5 w-[30px] bg-black transition-all duration-300 ${
                      navbarOpen ? "opacity-0" : " "
                    }`}
                  />
                  <span
                    className={`relative my-1.5 block h-0.5 w-[30px] bg-black transition-all duration-300 ${
                      navbarOpen ? "top-[-8px] -rotate-45" : " "
                    }`}
                  />
                </button>
                <nav
                  id="navbarCollapse"
                  className={`navbar border-body-color/50 absolute right-0 z-30 w-[250px] rounded border-[.5px] bg-white px-6 py-4 duration-300 lg:visible lg:static lg:w-auto lg:border-none lg:!bg-transparent lg:p-0 lg:opacity-100 ${
                    navbarOpen
                      ? "visibility top-full opacity-100"
                      : "invisible top-[120%] opacity-0"
                  }`}
                >
                  <ul className="block lg:flex lg:space-x-12">
                    {languageMenuItem && (
                      <li className="relative border-body-color/20 mb-2 border-b pb-2 lg:hidden">
                        <button
                          type="button"
                          onClick={() => handleSubmenu(languageMenuItem.id)}
                          className="flex w-full cursor-pointer items-center justify-between py-2 text-base font-semibold text-gray-800 transition-colors hover:text-gray-600"
                        >
                          {activeLanguage?.title || languageMenuItem.title}
                          <MdKeyboardDoubleArrowDown className="ml-2 text-lg" />
                        </button>
                        <div
                          className={`pt-2 ${openIndex === languageMenuItem.id ? "block" : "hidden"}`}
                        >
                          {availableLanguages
                            .filter((submenuItem) => submenuItem.id !== activeLanguage?.id)
                            .map((submenuItem) => (
                              <button
                                type="button"
                                key={submenuItem.id}
                                onClick={() => switchLanguage(submenuItem.locale)}
                                className="block w-full cursor-pointer rounded-sm py-2.5 text-left text-xs font-semibold text-gray-800 transition-colors hover:text-gray-600"
                              >
                                {submenuItem.title}
                              </button>
                            ))}
                        </div>
                      </li>
                    )}
                    <li className="border-body-color/20 mb-2 border-b pb-3 lg:hidden">
                      <div className="flex flex-col gap-3 pt-1">
                        {isAuthenticated ? (
                          <>
                            <Link
                              href={localizePath("/account/profile", locale)}
                              onClick={() => setNavbarOpen(false)}
                              className="ease-in-up shadow-btn hover:shadow-btn-hover flex items-center justify-center gap-2 rounded-xs bg-blue-900 px-5 py-3 text-center text-base font-medium text-white transition duration-300 hover:bg-blue-600"
                            >
                              <TbUserSquareRounded className="h-5 w-5 shrink-0" />
                              {dictionary.common.profile}
                            </Link>
                            <button
                              type="button"
                              onClick={handleSignOut}
                              className="ease-in-up shadow-btn hover:shadow-btn-hover flex cursor-pointer items-center justify-center gap-2 rounded-xs bg-green-900 px-5 py-3 text-center text-base font-medium text-white transition duration-300 hover:bg-green-600"
                            >
                              <IoMdExit className="h-5 w-5 shrink-0" />
                              {dictionary.common.signout}
                            </button>
                          </>
                        ) : (
                          <>
                            <Link
                              href={localizePath("/account/login", locale)}
                              onClick={() => setNavbarOpen(false)}
                              className="ease-in-up shadow-btn hover:shadow-btn-hover flex items-center justify-center gap-2 rounded-xs border border-blue-800 bg-transparent px-5 py-3 text-center text-base font-medium text-blue-800 transition duration-300 hover:border-blue-100 hover:bg-blue-800 hover:text-blue-100"
                            >
                              <MdLogin className="h-5 w-5 shrink-0" />
                              {dictionary.common.login}
                            </Link>
                            <Link
                              href={localizePath("/account/signup", locale)}
                              onClick={() => setNavbarOpen(false)}
                              className="ease-in-up shadow-btn hover:shadow-btn-hover flex items-center justify-center gap-2 rounded-xs bg-green-700 px-5 py-3 text-center text-base font-medium text-green-100 transition duration-300 hover:bg-green-900"
                            >
                              <FaUserPlus className="h-5 w-5 shrink-0" />
                              {dictionary.common.signup}
                            </Link>
                          </>
                        )}
                      </div>
                    </li>
                    {navigationMenuItems.map((menuItem, index) => (
                      <li key={index} className="group relative">
                        <Link
                          href={localizePath(menuItem.path, locale)}
                          className={`flex py-2 text-base lg:mr-0 lg:inline-flex lg:px-0 lg:py-6 ${
                            currentPath === menuItem.path ? "text-gray-800" : "text-gray-800 hover:text-gray-600"
                          }`}
                        >
                          {menuItem.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
              <div className="ml-auto flex items-center justify-end gap-3 pr-16 lg:pr-0">
                {languageMenuItem && (
                  <div className="group relative hidden lg:block">
                    <button
                      type="button"
                      onClick={() => handleSubmenu(languageMenuItem.id)}
                      className="flex cursor-pointer items-center justify-between px-7 py-3 text-base font-semibold text-gray-800 transition-colors group-hover:text-gray-600"
                    >
                      {activeLanguage?.title || languageMenuItem.title}
                      <MdKeyboardDoubleArrowDown className="ml-2 text-lg" />
                    </button>
                    <div
                      className={`submenu absolute top-[110%] right-0 rounded-sm bg-white transition-[top] duration-300 lg:block lg:w-[250px] lg:p-4 lg:opacity-0 lg:shadow-lg lg:group-hover:visible lg:group-hover:top-full lg:group-hover:opacity-100 ${
                        openIndex === languageMenuItem.id
                          ? "visible top-full opacity-100"
                          : "invisible opacity-0"
                      }`}
                    >
                      {availableLanguages
                        .filter((submenuItem) => submenuItem.id !== activeLanguage?.id)
                        .map((submenuItem) => (
                          <button
                            type="button"
                            key={submenuItem.id}
                            onClick={() => {
                              switchLanguage(submenuItem.locale);
                            }}
                            className="block w-full cursor-pointer rounded-sm py-2.5 text-left text-xs font-semibold text-gray-800 transition-colors hover:text-gray-600 lg:px-3"
                          >
                            {submenuItem.title}
                          </button>
                        ))}
                    </div>
                  </div>
                )}
                <div
                  className={`logged-header items-center gap-3 ${
                    isAuthenticated ? "flex" : "hidden"
                  }`}
                >
                  <Link
                    href={localizePath("/account/profile", locale)}
                    className="ease-in-up shadow-btn hover:shadow-btn-hover hidden items-center justify-center gap-2 rounded-xs bg-green-900 px-8 py-3 text-base font-medium text-white transition duration-300 hover:bg-green-700 md:flex md:px-9 lg:px-6 xl:px-9"
                  >
                    <TbUserSquareRounded className="h-5 w-5 shrink-0" />
                    {dictionary.common.profile}
                  </Link>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="ease-in-up shadow-btn hover:shadow-btn-hover hidden cursor-pointer items-center justify-center gap-2 rounded-xs bg-red-900 px-8 py-3 text-base font-medium text-white transition duration-300 hover:bg-red-700 md:flex md:px-9 lg:px-6 xl:px-9"
                  >
                    <IoMdExit className="h-5 w-5 shrink-0" />
                    {dictionary.common.signout}
                  </button>
                </div>
                <div
                  className={`default-header items-center gap-3 ${
                    isAuthenticated ? "hidden" : "flex"
                  }`}
                >
                  <Link
                    href={localizePath("/account/login", locale)}
                    className="ease-in-up shadow-btn hover:shadow-btn-hover hidden items-center justify-center gap-2 rounded-xs border border-blue-800 bg-transparent px-8 py-3 text-base font-medium text-blue-800 transition duration-300 hover:border-blue-100 hover:bg-blue-800 hover:text-blue-100 md:flex md:px-9 lg:px-6 xl:px-9"
                  >
                    <MdLogin className="h-5 w-5 shrink-0" />
                    {dictionary.common.login}
                  </Link>
                  <Link
                    href={localizePath("/account/signup", locale)}
                    className="ease-in-up shadow-btn hover:shadow-btn-hover hidden items-center justify-center gap-2 rounded-xs bg-green-700 px-8 py-3 text-base font-medium text-green-100 transition duration-300 hover:bg-green-900 md:flex md:px-9 lg:px-6 xl:px-9"
                  >
                    <FaUserPlus className="h-5 w-5 shrink-0" />
                    {dictionary.common.signup}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
  );
};

export default Header;
