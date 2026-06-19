import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2, X } from "lucide-react";
import { useEffect } from "react";
import {
  useFieldArray,
  useForm,
  useWatch,
} from "react-hook-form";
import type { Control, Resolver, UseFormRegister } from "react-hook-form";

import { calculateCotizacionTotals } from "../services/cotizacionesService";
import type {
  CotizacionClienteOption,
  CotizacionDetalle,
  CotizacionEquipoFormValues,
  CotizacionEmpresaOption,
  CotizacionFormValues,
  CotizacionLineaFormValues,
  CotizacionProductoFormValues,
} from "../types/cotizacion";
import { cotizacionSchema } from "../validations/cotizacionSchema";

type CotizacionFormModalProps = {
  isOpen: boolean;
  cotizacion: CotizacionDetalle | null;
  empresas: CotizacionEmpresaOption[];
  clientes: CotizacionClienteOption[];
  isSaving: boolean;
  onClose: () => void;
  onSubmit: (values: CotizacionFormValues, cotizacionId?: string) => Promise<void>;
};

type EquipoActivitiesProps = {
  control: Control<CotizacionFormValues>;
  register: UseFormRegister<CotizacionFormValues>;
  equipoIndex: number;
};

const cotizacionResolver = zodResolver(
  cotizacionSchema as never,
) as unknown as Resolver<CotizacionFormValues>;

const emptyLine: CotizacionLineaFormValues = {
  descripcion: "",
  cantidad: 1,
  precio_unitario: 0,
};

const defaultValues: CotizacionFormValues = {
  empresa_id: "",
  cliente_id: "",
  codigo: "",
  tipo_cotizacion: "Mantenimiento preventivo",
  modo_servicio: "Servicio general",
  estado: "Borrador",
  titulo: "",
  descripcion: "",
  actividades_generales: [emptyLine],
  equipos: [
    {
      equipo: "",
      marca: "",
      modelo: "",
      serie: "",
      actividades: [emptyLine],
    },
  ],
  productos: [],
};

function lineTotal(line?: Partial<CotizacionLineaFormValues>) {
  return Number(line?.cantidad || 0) * Number(line?.precio_unitario || 0);
}

function EquipoActivitiesFields({
  control,
  register,
  equipoIndex,
}: EquipoActivitiesProps) {
  const activities = useFieldArray({
    control,
    name: `equipos.${equipoIndex}.actividades`,
  });
  const watchedActivities = useWatch({
    control,
    name: `equipos.${equipoIndex}.actividades`,
  });

  return (
    <div className="space-y-3 md:col-span-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-700">Actividades</p>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm"
          onClick={() => activities.append(emptyLine)}
        >
          <Plus size={15} />
          Actividad
        </button>
      </div>

      {activities.fields.map((field, activityIndex) => (
        <div
          key={field.id}
          className="grid gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 md:grid-cols-5"
        >
          <input
            placeholder="Descripcion"
            className="rounded-lg border px-3 py-2 text-sm md:col-span-2"
            {...register(
              `equipos.${equipoIndex}.actividades.${activityIndex}.descripcion`,
            )}
          />
          <input
            type="number"
            placeholder="Cantidad"
            className="rounded-lg border px-3 py-2 text-sm"
            {...register(
              `equipos.${equipoIndex}.actividades.${activityIndex}.cantidad`,
              { valueAsNumber: true },
            )}
          />
          <input
            type="number"
            placeholder="Precio unitario"
            className="rounded-lg border px-3 py-2 text-sm"
            {...register(
              `equipos.${equipoIndex}.actividades.${activityIndex}.precio_unitario`,
              { valueAsNumber: true },
            )}
          />
          <div className="flex items-center gap-2">
            <span className="flex-1 text-sm font-semibold text-slate-700">
              S/ {lineTotal(watchedActivities?.[activityIndex]).toFixed(2)}
            </span>
            <button
              type="button"
              className="rounded-lg border px-3 py-2 text-red-600"
              onClick={() => activities.remove(activityIndex)}
            >
              <Trash2 size={15} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function CotizacionFormModal({
  isOpen,
  cotizacion,
  empresas,
  clientes,
  isSaving,
  onClose,
  onSubmit,
}: CotizacionFormModalProps) {
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CotizacionFormValues>({
    resolver: cotizacionResolver,
    defaultValues,
  });

  const actividadesGenerales = useFieldArray({
    control,
    name: "actividades_generales",
  });
  const equipos = useFieldArray({ control, name: "equipos" });
  const productos = useFieldArray({ control, name: "productos" });
  const values = useWatch({ control });
  const modoServicio = values.modo_servicio ?? "Servicio general";
  const totals = calculateCotizacionTotals({
    ...defaultValues,
    ...values,
    actividades_generales: (values.actividades_generales ??
      []) as CotizacionLineaFormValues[],
    equipos: (values.equipos ?? []) as CotizacionEquipoFormValues[],
    productos: (values.productos ?? []) as CotizacionProductoFormValues[],
  });

  useEffect(() => {
    reset(cotizacion ?? defaultValues);
  }, [cotizacion, reset, isOpen]);

  if (!isOpen) {
    return null;
  }

  async function submit(valuesToSubmit: CotizacionFormValues) {
    await onSubmit(valuesToSubmit, cotizacion?.id);
    reset(defaultValues);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 py-6">
      <div className="flex max-h-[92vh] w-full max-w-6xl flex-col rounded-lg bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-950">
              {cotizacion ? "Editar cotizacion" : "Nueva cotizacion"}
            </h2>
            <p className="text-sm text-slate-500">
              Cotizacion SERVITEC PRO por servicio, equipo o repuestos.
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
          onSubmit={handleSubmit(submit)}
        >
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-1.5">
              <span className="text-sm font-medium text-slate-700">Empresa</span>
              <select
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                {...register("empresa_id")}
              >
                <option value="">Selecciona empresa</option>
                {empresas.map((empresa) => (
                  <option key={empresa.id} value={empresa.id}>
                    {empresa.razon_social}
                  </option>
                ))}
              </select>
              {errors.empresa_id ? (
                <p className="text-xs text-red-600">{errors.empresa_id.message}</p>
              ) : null}
            </label>

            <label className="space-y-1.5">
              <span className="text-sm font-medium text-slate-700">Cliente</span>
              <select
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                {...register("cliente_id")}
              >
                <option value="">Selecciona cliente</option>
                {clientes.map((cliente) => (
                  <option key={cliente.id} value={cliente.id}>
                    {cliente.nombre}
                  </option>
                ))}
              </select>
              {errors.cliente_id ? (
                <p className="text-xs text-red-600">{errors.cliente_id.message}</p>
              ) : null}
            </label>

            <label className="space-y-1.5">
              <span className="text-sm font-medium text-slate-700">Numero</span>
              <input
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                {...register("codigo")}
              />
            </label>

            <label className="space-y-1.5">
              <span className="text-sm font-medium text-slate-700">
                Tipo de servicio
              </span>
              <select
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                {...register("tipo_cotizacion")}
              >
                <option value="Mantenimiento preventivo">Mantenimiento preventivo</option>
                <option value="Mantenimiento correctivo">Mantenimiento correctivo</option>
                <option value="Calibración">Calibracion</option>
                <option value="Instalación">Instalacion</option>
                <option value="Diagnóstico">Diagnostico</option>
                <option value="Venta de repuestos">Venta de repuestos</option>
              </select>
            </label>

            <label className="space-y-1.5">
              <span className="text-sm font-medium text-slate-700">
                Modo de cotizacion
              </span>
              <select
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                {...register("modo_servicio")}
              >
                <option value="Servicio general">Servicio general</option>
                <option value="Por equipo">Por equipo</option>
                <option value="Venta de repuestos">Venta de repuestos</option>
              </select>
            </label>

            <label className="space-y-1.5">
              <span className="text-sm font-medium text-slate-700">Estado</span>
              <select
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                {...register("estado")}
              >
                <option value="Borrador">Borrador</option>
                <option value="Enviada">Enviada</option>
                <option value="Aprobada">Aprobada</option>
                <option value="Rechazada">Rechazada</option>
              </select>
            </label>

            <label className="space-y-1.5 md:col-span-2">
              <span className="text-sm font-medium text-slate-700">Titulo</span>
              <input
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                {...register("titulo")}
              />
            </label>

            <label className="space-y-1.5 md:col-span-2">
              <span className="text-sm font-medium text-slate-700">Descripcion</span>
              <textarea
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                rows={2}
                {...register("descripcion")}
              />
            </label>
          </div>

          {modoServicio === "Servicio general" ? (
            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-slate-900">
                  Actividades generales
                </h3>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm"
                  onClick={() => actividadesGenerales.append(emptyLine)}
                >
                  <Plus size={15} />
                  Actividad
                </button>
              </div>
              {actividadesGenerales.fields.map((field, index) => (
                <div
                  key={field.id}
                  className="grid gap-3 rounded-lg border border-slate-200 p-4 md:grid-cols-5"
                >
                  <input
                    placeholder="Descripcion"
                    className="rounded-lg border px-3 py-2 text-sm md:col-span-2"
                    {...register(`actividades_generales.${index}.descripcion`)}
                  />
                  <input
                    type="number"
                    placeholder="Cantidad"
                    className="rounded-lg border px-3 py-2 text-sm"
                    {...register(`actividades_generales.${index}.cantidad`, {
                      valueAsNumber: true,
                    })}
                  />
                  <input
                    type="number"
                    placeholder="Precio unitario"
                    className="rounded-lg border px-3 py-2 text-sm"
                    {...register(`actividades_generales.${index}.precio_unitario`, {
                      valueAsNumber: true,
                    })}
                  />
                  <div className="flex items-center gap-2">
                    <span className="flex-1 text-sm font-semibold text-slate-700">
                      S/ {lineTotal(values.actividades_generales?.[index]).toFixed(2)}
                    </span>
                    <button
                      type="button"
                      className="rounded-lg border px-3 py-2 text-red-600"
                      onClick={() => actividadesGenerales.remove(index)}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : null}

          {modoServicio === "Por equipo" ? (
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-slate-900">Equipos</h3>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm"
                  onClick={() =>
                    equipos.append({
                      equipo: "",
                      marca: "",
                      modelo: "",
                      serie: "",
                      actividades: [emptyLine],
                    })
                  }
                >
                  <Plus size={15} />
                  Equipo
                </button>
              </div>
              {equipos.fields.map((field, index) => (
                <div
                  key={field.id}
                  className="grid gap-3 rounded-lg border border-slate-200 p-4 md:grid-cols-4"
                >
                  <input
                    placeholder="Equipo"
                    className="rounded-lg border px-3 py-2 text-sm"
                    {...register(`equipos.${index}.equipo`)}
                  />
                  <input
                    placeholder="Marca"
                    className="rounded-lg border px-3 py-2 text-sm"
                    {...register(`equipos.${index}.marca`)}
                  />
                  <input
                    placeholder="Modelo"
                    className="rounded-lg border px-3 py-2 text-sm"
                    {...register(`equipos.${index}.modelo`)}
                  />
                  <div className="flex gap-2">
                    <input
                      placeholder="Serie"
                      className="w-full rounded-lg border px-3 py-2 text-sm"
                      {...register(`equipos.${index}.serie`)}
                    />
                    <button
                      type="button"
                      className="rounded-lg border px-3 text-red-600"
                      onClick={() => equipos.remove(index)}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                  <EquipoActivitiesFields
                    control={control}
                    register={register}
                    equipoIndex={index}
                  />
                </div>
              ))}
            </div>
          ) : null}

          {modoServicio === "Venta de repuestos" ? (
            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-slate-900">
                  Productos/Repuestos
                </h3>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm"
                  onClick={() =>
                    productos.append({
                      descripcion: "",
                      marca: "",
                      modelo: "",
                      cantidad: 1,
                      precio_unitario: 0,
                    })
                  }
                >
                  <Plus size={15} />
                  Producto
                </button>
              </div>
              {productos.fields.map((field, index) => (
                <div
                  key={field.id}
                  className="grid gap-3 rounded-lg border border-slate-200 p-4 md:grid-cols-6"
                >
                  <input
                    placeholder="Descripcion"
                    className="rounded-lg border px-3 py-2 text-sm md:col-span-2"
                    {...register(`productos.${index}.descripcion`)}
                  />
                  <input
                    placeholder="Marca"
                    className="rounded-lg border px-3 py-2 text-sm"
                    {...register(`productos.${index}.marca`)}
                  />
                  <input
                    placeholder="Modelo"
                    className="rounded-lg border px-3 py-2 text-sm"
                    {...register(`productos.${index}.modelo`)}
                  />
                  <input
                    type="number"
                    placeholder="Cantidad"
                    className="rounded-lg border px-3 py-2 text-sm"
                    {...register(`productos.${index}.cantidad`, {
                      valueAsNumber: true,
                    })}
                  />
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Precio unitario"
                      className="w-full rounded-lg border px-3 py-2 text-sm"
                      {...register(`productos.${index}.precio_unitario`, {
                        valueAsNumber: true,
                      })}
                    />
                    <button
                      type="button"
                      className="rounded-lg border px-3 text-red-600"
                      onClick={() => productos.remove(index)}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : null}

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-5">
            <div className="flex gap-4 text-sm">
              <span>
                Subtotal: <strong>S/ {totals.subtotal.toFixed(2)}</strong>
              </span>
              <span>
                IGV 18%: <strong>S/ {totals.igv.toFixed(2)}</strong>
              </span>
              <span>
                Total: <strong>S/ {totals.total.toFixed(2)}</strong>
              </span>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-70"
              >
                {isSaving ? "Guardando..." : "Guardar cotizacion"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
