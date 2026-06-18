import { Pencil, Trash2 } from "lucide-react";

import type { Cliente, ClienteEmpresaOption } from "../types/cliente";

type ClientesTableProps = {
  clientes: Cliente[];
  empresas: ClienteEmpresaOption[];
  isSaving: boolean;
  onEdit: (cliente: Cliente) => void;
  onDelete: (cliente: Cliente) => void;
};

function getEmpresaName(empresas: ClienteEmpresaOption[], empresaId: string) {
  return (
    empresas.find((empresa) => empresa.id === empresaId)?.razon_social ??
    "Empresa no encontrada"
  );
}

export default function ClientesTable({
  clientes,
  empresas,
  isSaving,
  onEdit,
  onDelete,
}: ClientesTableProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Cliente</th>
              <th className="px-4 py-3">Empresa</th>
              <th className="px-4 py-3">RUC</th>
              <th className="px-4 py-3">Contacto</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200 bg-white">
            {clientes.map((cliente) => (
              <tr key={cliente.id} className="hover:bg-slate-50">
                <td className="px-4 py-4">
                  <div className="font-semibold text-slate-900">
                    {cliente.nombre}
                  </div>
                  <div className="text-xs text-slate-500">
                    {cliente.nombre_comercial || cliente.razon_social || "Sin nombre comercial"}
                  </div>
                  <div className="text-xs text-slate-500">
                    {cliente.direccion || "Sin direccion"}
                  </div>
                </td>

                <td className="px-4 py-4 text-slate-700">
                  {getEmpresaName(empresas, cliente.empresa_id)}
                </td>

                <td className="px-4 py-4 font-mono text-slate-700">
                  {cliente.ruc}
                </td>

                <td className="px-4 py-4 text-slate-600">
                  <div>{cliente.contacto || "Sin contacto"}</div>
                  <div className="text-xs text-slate-500">
                    {cliente.correo || "Sin correo"}
                  </div>
                  <div className="text-xs text-slate-500">
                    {cliente.telefono || "Sin telefono"}
                  </div>
                </td>

                <td className="px-4 py-4">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                      cliente.activo
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {cliente.activo ? "Activo" : "Inactivo"}
                  </span>
                </td>

                <td className="px-4 py-4">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => onEdit(cliente)}
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-100"
                      aria-label={`Editar ${cliente.nombre}`}
                    >
                      <Pencil size={16} />
                    </button>

                    <button
                      type="button"
                      disabled={isSaving}
                      onClick={() => onDelete(cliente)}
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                      aria-label={`Eliminar ${cliente.nombre}`}
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
