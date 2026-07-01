import { z } from "zod";

import type { CotizacionFormValues } from "../types/cotizacion";

const lineSchema = z.object({
  descripcion: z.string().trim(),
  cantidad: z.number().min(1, "Cantidad minima 1."),
  precio_unitario: z.number().min(0, "Precio invalido."),
});

export const cotizacionSchema = z
  .object({
    empresa_id: z.string().trim().min(1, "Selecciona una empresa."),
    cliente_id: z.string().trim().min(1, "Selecciona un cliente."),
    codigo: z.string().trim().min(1, "El correlativo es obligatorio."),
    tipo_cotizacion: z.enum([
      "Mantenimiento preventivo",
      "Mantenimiento correctivo",
      "Calibración",
      "Certificación",
      "Diagnóstico",
      "Instalación",
      "Puesta en marcha",
      "Reparación",
      "Venta de repuestos",
      "Servicio integral",
    ]),
    modo_servicio: z.enum([
      "Servicio General",
      "Por Equipos",
      "Venta de Repuestos",
      "Alquiler",
    ]),
    estado: z.enum(["Borrador", "Enviada", "Aprobada", "Rechazada"]),
    titulo: z.string().trim().min(3, "Ingresa un titulo."),
    descripcion: z.string().trim(),
    actividades_generales: z.array(lineSchema),
    equipos: z.array(
      z.object({
        equipo: z.string().trim(),
        marca: z.string().trim(),
        modelo: z.string().trim(),
        serie: z.string().trim(),
        actividades: z.array(lineSchema),
      }),
    ),
    productos: z.array(
      z.object({
        descripcion: z.string().trim(),
        marca: z.string().trim(),
        modelo: z.string().trim(),
        cantidad: z.number().min(1, "Cantidad minima 1."),
        precio_unitario: z.number().min(0, "Precio invalido."),
      }),
    ),
    alquileres: z.array(lineSchema),
  })
  .superRefine((values, ctx) => {
    if (
      values.modo_servicio === "Servicio General" &&
      !values.actividades_generales.some((line) => line.descripcion.trim())
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["actividades_generales"],
        message: "Agrega al menos una actividad general.",
      });
    }

    if (values.modo_servicio === "Por Equipos") {
      if (!values.equipos.some((equipo) => equipo.equipo.trim())) {
        ctx.addIssue({
          code: "custom",
          path: ["equipos"],
          message: "Agrega al menos un equipo.",
        });
      }

      if (
        !values.equipos.some((equipo) =>
          equipo.actividades.some((line) => line.descripcion.trim()),
        )
      ) {
        ctx.addIssue({
          code: "custom",
          path: ["equipos"],
          message: "Agrega actividades por equipo.",
        });
      }
    }

    if (
      values.modo_servicio === "Venta de Repuestos" &&
      !values.productos.some((product) => product.descripcion.trim())
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["productos"],
        message: "Agrega al menos un producto o repuesto.",
      });
    }

    if (
      values.modo_servicio === "Alquiler" &&
      !values.alquileres.some((line) => line.descripcion.trim())
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["alquileres"],
        message: "Agrega al menos un equipo o servicio alquilado.",
      });
    }
  }) as z.ZodType<CotizacionFormValues>;
