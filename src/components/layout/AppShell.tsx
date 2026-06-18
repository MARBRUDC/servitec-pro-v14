import { useState } from "react";
import type { ReactNode } from "react";

import Breadcrumbs from "./Breadcrumbs";
import Header from "./Header";
import Sidebar from "./Sidebar";
import type { UserRole } from "./navigation";

type AppShellProps = {
  children: ReactNode;
};

type SessionPreview = {
  user: {
    name: string;
    email: string;
    role: UserRole;
  };
  company: string;
  branch: string;
  notifications: number;
};

const sessionPreview: SessionPreview = {
  user: {
    name: "Administrador",
    email: "admin@servitec.pro",
    role: "admin",
  },
  company: "SERVITEC PRO",
  branch: "Sede Principal",
  notifications: 0,
};

export default function AppShell({ children }: AppShellProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-100 text-slate-900">
      <Sidebar
        currentRole={sessionPreview.user.role}
        isCollapsed={isSidebarCollapsed}
        onToggle={() => setIsSidebarCollapsed((current) => !current)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header
          company={sessionPreview.company}
          branch={sessionPreview.branch}
          notifications={sessionPreview.notifications}
          user={sessionPreview.user}
        />

        <Breadcrumbs />

        <main className="flex-1 overflow-auto px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </main>

        <footer className="border-t border-slate-200 bg-white px-4 py-3 text-xs text-slate-500 sm:px-6">
          SERVITEC PRO V14 - Infraestructura base del ERP
        </footer>
      </div>
    </div>
  );
}
