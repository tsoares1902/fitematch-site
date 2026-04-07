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
    title: "FAQ",
    path: "/faq",
    newTab: false,
  },
  {
    id: 4,
    title: "Línguas",
    newTab: false,
    submenu: [
      {
        id: 5,
        title: "🇧🇷 PORTUGUÊS",
        path: "#",
        newTab: false,
      },
      {
        id: 6,
        title: "🇪🇸 ESPANHOL",
        path: "#",
        newTab: false,
      },
      {
        id: 7,
        title: "🇺🇸 INGLÊS",
        path: "#",
        newTab: false,
      },
    ],
  },
];

export default menuData;
