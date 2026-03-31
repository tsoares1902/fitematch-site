import { Menu } from "@/types/menu";

  const menuData: Menu[] = [
  {
    id: 1,
    title: "Home",
    path: "/",
    newTab: false,
  },
  {
    id: 2,
    title: "Vagas",
    path: "/jobs",
    newTab: false,
  },
  {
    id: 3,
    title: "Preços",
    path: "/pricing",
    newTab: false,
  },
  {
    id: 4,
    title: "FAQ",
    path: "/faq",
    newTab: false,
  },
  {
    id: 5,
    title: "Linguas",
    newTab: false,
    submenu: [
      {
        id: 6,
        title: "🇧🇷 PORTUGUÊS",
        path: "#",
        newTab: false,
      },
      {
        id: 7,
        title: "🇪🇸 ESPANHOL",
        path: "#",
        newTab: false,
      },
      {
        id: 8,
        title: "🇺🇸 INGLES",
        path: "#",
        newTab: false,
      },
    ],
  },
];

export default menuData;
