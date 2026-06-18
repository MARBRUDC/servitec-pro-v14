import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import type { Empresa, EmpresaFormValues } from "../types/empresa";
import { empresaSchema } from "../validations/empresaSchema";

type EmpresaFormModalProps = {
  isOpen: boolean;
  empresa: Empresa | null;
  isSaving: boolean;
  onClose: () => void;
  onSubmit: (values: EmpresaFormValues, empresaId?: string) => Promise<void>;
};

const defaultValues: EmpresaFormValues = {
  razon_social: "",
  ruc: "",
  direccion: "",
  telefono: "",
  correo: "",
  logo_url: "",
  estado: "Activo",
};

function toFormValues(empresa: Empresa | null): EmpresaFormValues {
  if (!empresa) {
    return defaultValues;
  }

  return {
    razon_social: empresa.razon_social,
    ruc: empresa.ruc,
    direccion: empresa.direccion ?? "",
    telefono: empresa.telefono ?? "",
    correo: empresa.correo ?? "",
    logo_url: empresa.logo_url ?? "",
    estado: empresa.estado,
  };
}

export default function EmpresaFormModal({
  isOpen,
  empresa,
  isSaving,
  onClose,
  onSubmit,
}: EmpresaFormModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EmpresaFormValues>({
    resolver: zodResolver(empresaSchema),
    defaultValues,
  });

  useEffect(() => {
    reset(toFormValues(empresa));
  }, [empresa, reset, isOpen]);

  if (!isOpen) {
    return null;
  }

  const title = empresa ? "Editar empresa" : "Nueva empresa";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 py-6">
      <div className="flex max-h-[90vh] w-full max-w-3xl flex-col rounded-lg bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-950">{title}</h2>
            <p className="text-sm text-slate-500">
              Completa la informacion general de la empresa.
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
          onSubmit={handleSubmit((values) => onSubmit(values, empresa?.id))}
        >
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-1.5 md:col-span-2">
              <span className="text-sm font-medium text-slate-700">
                Razon social
              </span>
              <input
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                {...register("razon_social")}
              />
              {errors.razon_social ? (
                <p className="text-xs text-red-600">
                  {errors.razon_social.message}
                </p>
              ) : null}
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
              <span className="text-sm font-medium text-slate-700">Email</span>
              <input
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                type="email"
                {...register("correo")}
              />
              {errors.correo ? (
                <p className="text-xs text-red-600">{errors.correo.message}</p>
              ) : null}
            </label>

            <label className="space-y-1.5">
              <span className="text-sm font-medium text-slate-700">
                Logo URL
              </span>
              <input
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                placeholder="Preparado para carga de logo"
                {...register("logo_url")}
              />
            </label>

            <label className="space-y-1.5">
              <span className="text-sm font-medium text-slate-700">Estado</span>
              <select
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                {...register("estado")}
              >
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
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
              {isSaving ? "Guardando..." : "Guardar empresa"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
