import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import type {
  Cliente,
  ClienteEmpresaOption,
  ClienteFormValues,
} from "../types/cliente";
import { clienteSchema } from "../validations/clienteSchema";

type ClienteFormModalProps = {
  isOpen: boolean;
  cliente: Cliente | null;
  empresas: ClienteEmpresaOption[];
  isSaving: boolean;
  onClose: () => void;
  onSubmit: (values: ClienteFormValues, clienteId?: string) => Promise<void>;
};

const defaultValues: ClienteFormValues = {
  empresa_id: "",
  nombre: "",
  ruc: "",
  direccion: "",
  telefono: "",
  correo: "",
  nombre_comercial: "",
  contacto: "",
  razon_social: "",
  activo: "true",
};

function toFormValues(cliente: Cliente | null): ClienteFormValues {
  if (!cliente) {
    return defaultValues;
  }

  return {
    empresa_id: cliente.empresa_id,
    nombre: cliente.nombre,
    ruc: cliente.ruc,
    direccion: cliente.direccion ?? "",
    telefono: cliente.telefono ?? "",
    correo: cliente.correo ?? "",
    nombre_comercial: cliente.nombre_comercial ?? "",
    contacto: cliente.contacto ?? "",
    razon_social: cliente.razon_social ?? "",
    activo: cliente.activo ? "true" : "false",
  };
}

export default function ClienteFormModal({
  isOpen,
  cliente,
  empresas,
  isSaving,
  onClose,
  onSubmit,
}: ClienteFormModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ClienteFormValues>({
    resolver: zodResolver(clienteSchema),
    defaultValues,
  });

  useEffect(() => {
    reset(toFormValues(cliente));
  }, [cliente, reset, isOpen]);

  if (!isOpen) {
    return null;
  }

  const title = cliente ? "Editar cliente" : "Nuevo cliente";

  async function handleValidSubmit(values: ClienteFormValues) {
    await onSubmit(values, cliente?.id);
    reset(defaultValues);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 py-6">
      <div className="flex max-h-[90vh] w-full max-w-3xl flex-col rounded-lg bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-950">{title}</h2>
            <p className="text-sm text-slate-500">
              Completa la informacion general del cliente.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100"
            aria-label="Cerrar modal"
          >
            <X size={18} />
          </button>
        </div>

        <form
          className="overflow-y-auto px-6 py-5"
          onSubmit={handleSubmit(handleValidSubmit)}
        >
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-1.5 md:col-span-2">
              <span className="text-sm font-medium text-slate-700">
                Empresa
              </span>
              <select
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                {...register("empresa_id")}
              >
                <option value="">Selecciona una empresa</option>
                {empresas.map((empresa) => (
                  <option key={empresa.id} value={empresa.id}>
                    {empresa.razon_social}
                  </option>
                ))}
              </select>
              {errors.empresa_id ? (
                <p className="text-xs text-red-600">
                  {errors.empresa_id.message}
                </p>
              ) : null}
            </label>

            <label className="space-y-1.5 md:col-span-2">
              <span className="text-sm font-medium text-slate-700">
                Nombre
              </span>
              <input
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                {...register("nombre")}
              />
              {errors.nombre ? (
                <p className="text-xs text-red-600">
                  {errors.nombre.message}
                </p>
              ) : null}
            </label>

            <label className="space-y-1.5">
              <span className="text-sm font-medium text-slate-700">
                Nombre comercial
              </span>
              <input
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                {...register("nombre_comercial")}
              />
            </label>

            <label className="space-y-1.5">
              <span className="text-sm font-medium text-slate-700">
                Razon social
              </span>
              <input
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                {...register("razon_social")}
              />
            </label>

            <label className="space-y-1.5">
              <span className="text-sm font-medium text-slate-700">RUC</span>
              <input
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                maxLength={11}
                {...register("ruc")}
              />
              {errors.ruc ? (
                <p className="text-xs text-red-600">{errors.ruc.message}</p>
              ) : null}
            </label>

            <label className="space-y-1.5">
              <span className="text-sm font-medium text-slate-700">Correo</span>
              <input
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                type="email"
                {...register("correo")}
              />
              {errors.correo ? (
                <p className="text-xs text-red-600">{errors.correo.message}</p>
              ) : null}
            </label>

            <label className="space-y-1.5 md:col-span-2">
              <span className="text-sm font-medium text-slate-700">
                Direccion
              </span>
              <input
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                {...register("direccion")}
              />
            </label>

            <label className="space-y-1.5">
              <span className="text-sm font-medium text-slate-700">
                Telefono
              </span>
              <input
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                {...register("telefono")}
              />
            </label>

            <label className="space-y-1.5">
              <span className="text-sm font-medium text-slate-700">
                Contacto
              </span>
              <input
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                {...register("contacto")}
              />
            </label>

            <label className="space-y-1.5">
              <span className="text-sm font-medium text-slate-700">Estado</span>
              <select
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                {...register("activo")}
              >
                <option value="true">Activo</option>
                <option value="false">Inactivo</option>
              </select>
            </label>
          </div>

          <div className="mt-6 flex justify-end gap-3 border-t border-slate-200 pt-5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSaving ? "Guardando..." : "Guardar cliente"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
