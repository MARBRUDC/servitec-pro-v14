import { z } from "zod";

export const empresaSchema = z.object({
  razon_social: z
    .string()
    .trim()
    .min(3, "La razon social debe tener al menos 3 caracteres."),
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
      "Ingresa un email valido.",
    ),
  logo_url: z.string().trim(),
  estado: z.enum(["Activo", "Inactivo"]),
});

export type EmpresaSchemaValues = z.infer<typeof empresaSchema>;
