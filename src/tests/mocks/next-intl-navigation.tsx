import NextLink from 'next/link';
import { usePathname as useNextPathname, useRouter as useNextRouter } from 'next/navigation';

export function createNavigation() {
  return {
    Link: NextLink,
    redirect: jest.fn(),
    usePathname: () => useNextPathname(),
    useRouter: () => useNextRouter(),
    getPathname: () => '/',
  };
}
