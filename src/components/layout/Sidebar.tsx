import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  FileText,
  ClipboardList,
  Wrench,
  Settings,
} from "lucide-react";

const menu = [
  {
    title: "Dashboard",
    icon: <LayoutDashboard size={18} />,
    path: "/",
  },
  {
    title: "Clientes",
    icon: <Users size={18} />,
    path: "/clientes",
  },
  {
    title: "Cotizaciones",
    icon: <FileText size={18} />,
    path: "/cotizaciones",
  },
  {
    title: "Órdenes",
    icon: <ClipboardList size={18} />,
    path: "/ordenes",
  },
  {
    title: "Ejecución",
    icon: <Wrench size={18} />,
    path: "/ejecucion",
  },
  {
    title: "Configuración",
    icon: <Settings size={18} />,
    path: "/configuracion",
  },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-slate-900 text-white h-screen flex flex-col">
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-xl font-bold">SERVITEC</h1>

        <p className="text-xs text-slate-400">PRO V14</p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menu.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-4 py-3 transition ${
                isActive ? "bg-blue-600" : "hover:bg-slate-800"
              }`
            }
          >
            {item.icon}
            <span>{item.title}</span>
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-slate-700 p-4 text-xs text-slate-400">
        SERVITEC PRO V14
      </div>
    </aside>
  );
}
