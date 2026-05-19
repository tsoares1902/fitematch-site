import {
  FaDiscord,
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaXTwitter,
  FaYoutube,
} from 'react-icons/fa6';

export const SOCIAL_LINKS = [
  {
    href: '#',
    label: 'Facebook',
    icon: FaFacebookF,
    hoverClassName: 'hover:border-[#1877F2]/30 hover:text-[#1877F2]',
  },
  {
    href: '#',
    label: 'Instagram',
    icon: FaInstagram,
    hoverClassName: 'hover:border-[#E4405F]/30 hover:text-[#E4405F]',
  },
  {
    href: '#',
    label: 'X',
    icon: FaXTwitter,
    hoverClassName: 'hover:border-white/30 hover:text-white',
  },
  {
    href: '#',
    label: 'YouTube',
    icon: FaYoutube,
    hoverClassName: 'hover:border-[#FF0000]/30 hover:text-[#FF0000]',
  },
  {
    href: '#',
    label: 'LinkedIn',
    icon: FaLinkedinIn,
    hoverClassName: 'hover:border-[#0A66C2]/30 hover:text-[#0A66C2]',
  },
  {
    href: '#',
    label: 'Discord',
    icon: FaDiscord,
    hoverClassName: 'hover:border-[#5865F2]/30 hover:text-[#5865F2]',
  },
] as const;

export const CONTACT_SOCIAL_LINKS = SOCIAL_LINKS.filter((item) =>
  ['Instagram', 'LinkedIn'].includes(item.label),
);
