export type EmpresaEstado = "Activo" | "Inactivo";

export type Empresa = {
  id: string;
  razon_social: string;
  nombre_comercial?: null;
  ruc: string;
  direccion: string | null;
  telefono: string | null;
  email: string | null;
  correo: string | null;
  logo_url: string | null;
  estado: EmpresaEstado;
  created_at?: string;
  updated_at?: string | null;
};

export type EmpresaFormValues = {
  razon_social: string;
  ruc: string;
  direccion: string;
  telefono: string;
  correo: string;
  logo_url: string;
  estado: EmpresaEstado;
};

export type EmpresaPayload = {
  razon_social: string;
  ruc: string;
  direccion: string | null;
  telefono: string | null;
  correo: string | null;
  logo_url: string | null;
  estado: EmpresaEstado;
};
