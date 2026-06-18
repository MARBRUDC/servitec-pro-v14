import { z } from "zod";

export const clienteSchema = z.object({
  empresa_id: z.string().trim().min(1, "Selecciona una empresa."),
  nombre: z
    .string()
    .trim()
    .min(3, "El nombre debe tener al menos 3 caracteres."),
  ruc: z
    .string()
    .trim()
    .regex(/^\d{11}$/, "El RUC debe tener 11 digitos."),
  direccion: z.string().trim(),
  telefono: z.string().trim(),
  correo: z
    .string()
    .trim()
    .refine(
      (value) => value === "" || z.email().safeParse(value).success,
      "Ingresa un correo valido.",
    ),
  nombre_comercial: z.string().trim(),
  contacto: z.string().trim(),
  razon_social: z.string().trim(),
  activo: z.enum(["true", "false"]),
});

export type ClienteSchemaValues = z.infer<typeof clienteSchema>;
