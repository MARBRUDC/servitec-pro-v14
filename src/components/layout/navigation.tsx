import type { ReactNode } from "react";
import {
  BarChart3,
  Building2,
  ClipboardList,
  FileText,
  LayoutDashboard,
  Settings,
  Users,
  Wrench,
} from "lucide-react";

export type UserRole = "admin" | "manager" | "technician";

export type SidebarItem = {
  title: string;
  path: string;
  icon: ReactNode;
  roles: UserRole[];
  disabled?: boolean;
};

export type SidebarGroup = {
  title: string;
  items: SidebarItem[];
};

export const sidebarGroups: SidebarGroup[] = [
  {
    title: "General",
    items: [
      {
        title: "Dashboard",
        path: "/",
        icon: <LayoutDashboard size={18} />,
        roles: ["admin", "manager", "technician"],
      },
    ],
  },
  {
    title: "Operaciones",
    items: [
      {
        title: "Clientes",
        path: "/clientes",
        icon: <Users size={18} />,
        roles: ["admin", "manager"],
      },
      {
        title: "Cotizaciones",
        path: "/cotizaciones",
        icon: <FileText size={18} />,
        roles: ["admin", "manager"],
        disabled: true,
      },
      {
        title: "Ordenes",
        path: "/ordenes",
        icon: <ClipboardList size={18} />,
        roles: ["admin", "manager", "technician"],
        disabled: true,
      },
      {
        title: "Ejecucion",
        path: "/ejecucion",
        icon: <Wrench size={18} />,
        roles: ["admin", "manager", "technician"],
        disabled: true,
      },
    ],
  },
  {
    title: "Administracion",
    items: [
      {
        title: "Empresas",
        path: "/empresas",
        icon: <Building2 size={18} />,
        roles: ["admin"],
      },
      {
        title: "Indicadores",
        path: "/indicadores",
        icon: <BarChart3 size={18} />,
        roles: ["admin", "manager"],
        disabled: true,
      },
      {
        title: "Configuracion",
        path: "/configuracion",
        icon: <Settings size={18} />,
        roles: ["admin"],
        disabled: true,
      },
    ],
  },
];

export function getSidebarGroupsByRole(role: UserRole) {
  return sidebarGroups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => item.roles.includes(role)),
    }))
    .filter((group) => group.items.length > 0);
}

export function getSidebarItemByPath(pathname: string) {
  return sidebarGroups
    .flatMap((group) => group.items)
    .find((item) => item.path === pathname);
}
