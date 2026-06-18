import type { ReactNode } from "react";

type SectionCardProps = {
  title?: string;
  description?: string;
  children: ReactNode;
};

export default function SectionCard({
  title,
  description,
  children,
}: SectionCardProps) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
      {title || description ? (
        <div className="border-b border-slate-200 px-5 py-4">
          {title ? (
            <h2 className="text-base font-semibold text-slate-900">{title}</h2>
          ) : null}

          {description ? (
            <p className="mt-1 text-sm text-slate-500">{description}</p>
          ) : null}
        </div>
      ) : null}

      <div className="p-5">{children}</div>
    </section>
  );
}
