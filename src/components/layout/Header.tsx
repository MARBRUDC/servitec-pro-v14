import { Bell, Building2, ChevronDown, MapPin, UserCircle } from "lucide-react";

import type { UserRole } from "./navigation";

type HeaderProps = {
  company: string;
  branch: string;
  notifications: number;
  user: {
    name: string;
    email: string;
    role: UserRole;
  };
};

const roleLabels: Record<UserRole, string> = {
  admin: "Administrador",
  manager: "Supervisor",
  technician: "Tecnico",
};

export default function Header({
  company,
  branch,
  notifications,
  user,
}: HeaderProps) {
  return (
    <header className="flex min-h-16 flex-wrap items-center justify-between gap-4 border-b border-slate-200 bg-white px-4 py-3 shadow-sm sm:px-6">
      <div className="min-w-0">
        <h1 className="truncate text-lg font-semibold text-slate-950">
          SERVITEC PRO V14
        </h1>

        <p className="truncate text-sm text-slate-500">
          Sistema Integral de Gestion de Servicios Tecnicos
        </p>
      </div>

      <div className="flex flex-1 flex-wrap items-center justify-end gap-3">
        <div className="hidden items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600 lg:flex">
          <Building2 size={16} className="text-slate-400" />
          <span className="font-medium text-slate-800">{company}</span>
        </div>

        <div className="hidden items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600 md:flex">
          <MapPin size={16} className="text-slate-400" />
          <span>{branch}</span>
        </div>

        <button
          type="button"
          className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50"
          aria-label="Notificaciones"
        >
          <Bell size={18} />

          {notifications > 0 ? (
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-blue-600" />
          ) : null}
        </button>

        <button
          type="button"
          className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2 text-left transition hover:bg-slate-50"
          aria-label="Perfil de usuario"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-white">
            <UserCircle size={20} />
          </div>

          <div className="hidden min-w-0 sm:block">
            <p className="truncate text-sm font-semibold text-slate-800">
              {user.name}
            </p>

            <p className="truncate text-xs text-slate-500">
              {roleLabels[user.role]} - {user.email}
            </p>
          </div>

          <ChevronDown size={16} className="hidden text-slate-400 sm:block" />
        </button>
      </div>
    </header>
  );
}
