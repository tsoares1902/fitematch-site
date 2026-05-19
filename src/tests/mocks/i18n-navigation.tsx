import NextLink from 'next/link';
import { usePathname as useNextPathname, useRouter as useNextRouter } from 'next/navigation';

export const Link = NextLink;

export function usePathname() {
  return useNextPathname();
}

export function useRouter() {
  return useNextRouter();
}

export function redirect() {
  return null;
}

export function getPathname() {
  return '/';
}
