import { z } from "zod";

import type { CotizacionFormValues } from "../types/cotizacion";

const lineaSchema = z.object({
  descripcion: z.string().trim().min(1, "Ingresa la descripcion."),
  cantidad: z.number().min(1, "Cantidad minima 1."),
  precio_unitario: z.number().min(0, "Precio invalido."),
});

export const cotizacionSchema: z.ZodType<CotizacionFormValues> = z.object({
  empresa_id: z.string().trim().min(1, "Selecciona una empresa."),
  cliente_id: z.string().trim().min(1, "Selecciona un cliente."),
  codigo: z.string().trim().min(1, "Ingresa el numero."),
  tipo_cotizacion: z.enum([
    "Mantenimiento preventivo",
    "Mantenimiento correctivo",
    "Calibración",
    "Instalación",
    "Diagnóstico",
    "Venta de repuestos",
  ]),
  modo_servicio: z.enum([
    "Servicio general",
    "Por equipo",
    "Venta de repuestos",
  ]),
  estado: z.enum(["Borrador", "Enviada", "Aprobada", "Rechazada"]),
  titulo: z.string().trim().min(3, "Ingresa un titulo."),
  descripcion: z.string().trim(),
  actividades_generales: z.array(lineaSchema),
  equipos: z.array(
    z.object({
      equipo: z.string().trim().min(1, "Ingresa el equipo."),
      marca: z.string().trim(),
      modelo: z.string().trim(),
      serie: z.string().trim(),
      actividades: z.array(lineaSchema).min(1, "Agrega una actividad."),
    }),
  ),
  productos: z.array(
    z.object({
      descripcion: z.string().trim().min(1, "Ingresa la descripcion."),
      marca: z.string().trim(),
      modelo: z.string().trim(),
      cantidad: z.number().min(1, "Cantidad minima 1."),
      precio_unitario: z.number().min(0, "Precio invalido."),
    }),
  ),
});
