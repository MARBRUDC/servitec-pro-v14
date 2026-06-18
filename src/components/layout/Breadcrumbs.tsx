import { ChevronRight, Home } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

import { getSidebarItemByPath } from "./navigation";

function formatSegment(segment: string) {
  return segment
    .replaceAll("-", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default function Breadcrumbs() {
  const { pathname } = useLocation();
  const item = getSidebarItemByPath(pathname);
  const segments = pathname.split("/").filter(Boolean);
  const currentLabel = item?.title ?? segments.at(-1);

  return (
    <nav
      aria-label="Breadcrumb"
      className="flex min-h-10 items-center gap-2 border-b border-slate-200 bg-white px-4 text-sm text-slate-500 sm:px-6"
    >
      <Link
        to="/"
        className="inline-flex items-center gap-2 font-medium text-slate-600 transition hover:text-blue-700"
      >
        <Home size={15} />
        Inicio
      </Link>

      {pathname !== "/" && currentLabel ? (
        <>
          <ChevronRight size={15} className="text-slate-400" />
          <span className="font-medium text-slate-800">
            {item?.title ?? formatSegment(currentLabel)}
          </span>
        </>
      ) : null}
    </nav>
  );
}
