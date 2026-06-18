import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { NavLink } from "react-router-dom";

import { getSidebarGroupsByRole } from "./navigation";
import type { UserRole } from "./navigation";

type SidebarProps = {
  currentRole: UserRole;
  isCollapsed: boolean;
  onToggle: () => void;
};

export default function Sidebar({
  currentRole,
  isCollapsed,
  onToggle,
}: SidebarProps) {
  const groups = getSidebarGroupsByRole(currentRole);

  return (
    <aside
      className={`hidden min-h-screen shrink-0 flex-col border-r border-slate-800 bg-slate-950 text-white transition-all duration-200 lg:flex ${
        isCollapsed ? "w-20" : "w-72"
      }`}
    >
      <div className="flex min-h-16 items-center justify-between border-b border-slate-800 px-4">
        <div className="min-w-0">
          <h1 className="truncate text-lg font-bold tracking-wide">
            {isCollapsed ? "SP" : "SERVITEC"}
          </h1>

          {!isCollapsed ? (
            <p className="text-xs font-medium text-slate-400">PRO V14</p>
          ) : null}
        </div>

        <button
          type="button"
          onClick={onToggle}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-300 transition hover:bg-slate-800 hover:text-white"
          aria-label={isCollapsed ? "Expandir menu" : "Colapsar menu"}
        >
          {isCollapsed ? (
            <PanelLeftOpen size={18} />
          ) : (
            <PanelLeftClose size={18} />
          )}
        </button>
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
        {groups.map((group) => (
          <div key={group.title} className="space-y-2">
            {!isCollapsed ? (
              <p className="px-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                {group.title}
              </p>
            ) : null}

            {group.items.map((item) =>
              item.disabled ? (
                <div
                  key={item.path}
                  className="flex cursor-not-allowed items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-500"
                  title={item.title}
                >
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center">
                    {item.icon}
                  </span>

                  {!isCollapsed ? (
                    <span className="truncate">{item.title}</span>
                  ) : null}
                </div>
              ) : (
                <NavLink
                  key={item.path}
                  to={item.path}
                  title={item.title}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                      isActive
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-slate-300 hover:bg-slate-800 hover:text-white"
                    }`
                  }
                >
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center">
                    {item.icon}
                  </span>

                  {!isCollapsed ? (
                    <span className="truncate">{item.title}</span>
                  ) : null}
                </NavLink>
              ),
            )}
          </div>
        ))}
      </nav>

      <div className="border-t border-slate-800 px-4 py-4 text-xs text-slate-500">
        {isCollapsed ? "ERP" : "ERP base - Sprint 1"}
      </div>
    </aside>
  );
}
