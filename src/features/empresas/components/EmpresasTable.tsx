import { Pencil, Trash2 } from "lucide-react";

import type { Empresa } from "../types/empresa";

type EmpresasTableProps = {
  empresas: Empresa[];
  isSaving: boolean;
  onEdit: (empresa: Empresa) => void;
  onDelete: (empresa: Empresa) => void;
};

export default function EmpresasTable({
  empresas,
  isSaving,
  onEdit,
  onDelete,
}: EmpresasTableProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Empresa</th>
              <th className="px-4 py-3">RUC</th>
              <th className="px-4 py-3">Contacto</th>
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200 bg-white">
            {empresas.map((empresa) => (
              <tr key={empresa.id} className="hover:bg-slate-50">
                <td className="px-4 py-4">
                  <div className="font-semibold text-slate-900">
                    {empresa.razon_social}
                  </div>
                </td>

                <td className="px-4 py-4 font-mono text-slate-700">
                  {empresa.ruc}
                </td>

                <td className="px-4 py-4 text-slate-600">
                  <div>{empresa.correo || "Sin correo"}</div>
                  <div className="text-xs text-slate-500">
                    {empresa.telefono || "Sin telefono"}
                  </div>
                </td>

                <td className="px-4 py-4">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => onEdit(empresa)}
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-100"
                      aria-label={`Editar ${empresa.razon_social}`}
                    >
                      <Pencil size={16} />
                    </button>

                    <button
                      type="button"
                      disabled={isSaving}
                      onClick={() => onDelete(empresa)}
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                      aria-label={`Eliminar ${empresa.razon_social}`}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
