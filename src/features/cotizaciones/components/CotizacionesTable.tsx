import { Pencil, Trash2 } from "lucide-react";

import type {
  Cotizacion,
  CotizacionClienteOption,
  CotizacionEmpresaOption,
} from "../types/cotizacion";

type CotizacionesTableProps = {
  cotizaciones: Cotizacion[];
  empresas: CotizacionEmpresaOption[];
  clientes: CotizacionClienteOption[];
  isSaving: boolean;
  onEdit: (cotizacion: Cotizacion) => void;
  onDelete: (cotizacion: Cotizacion) => void;
};

function findName<T extends { id: string }>(
  records: T[],
  id: string,
  getName: (record: T) => string,
) {
  const record = records.find((item) => item.id === id);
  return record ? getName(record) : "No encontrado";
}

export default function CotizacionesTable({
  cotizaciones,
  empresas,
  clientes,
  isSaving,
  onEdit,
  onDelete,
}: CotizacionesTableProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Cotizacion</th>
              <th className="px-4 py-3">Empresa</th>
              <th className="px-4 py-3">Cliente</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3 text-right">Total</th>
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {cotizaciones.map((cotizacion) => (
              <tr key={cotizacion.id} className="hover:bg-slate-50">
                <td className="px-4 py-4">
                  <div className="font-semibold text-slate-900">
                    {cotizacion.codigo}
                  </div>
                  <div className="text-xs text-slate-500">
                    {cotizacion.titulo}
                  </div>
                </td>
                <td className="px-4 py-4 text-slate-700">
                  {findName(empresas, cotizacion.empresa_id, (item) => item.razon_social)}
                </td>
                <td className="px-4 py-4 text-slate-700">
                  {findName(clientes, cotizacion.cliente_id, (item) => item.nombre)}
                </td>
                <td className="px-4 py-4">
                  <span className="inline-flex rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                    {cotizacion.estado}
                  </span>
                </td>
                <td className="px-4 py-4 text-right font-semibold text-slate-900">
                  S/ {cotizacion.total.toFixed(2)}
                </td>
                <td className="px-4 py-4">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => onEdit(cotizacion)}
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-100"
                      aria-label={`Editar ${cotizacion.codigo}`}
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      type="button"
                      disabled={isSaving}
                      onClick={() => onDelete(cotizacion)}
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                      aria-label={`Eliminar ${cotizacion.codigo}`}
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
