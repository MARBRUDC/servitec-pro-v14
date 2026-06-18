export type Cliente = {
  id: string;
  empresa_id: string;
  nombre: string;
  ruc: string;
  direccion: string | null;
  telefono: string | null;
  correo: string | null;
  nombre_comercial: string | null;
  contacto: string | null;
  razon_social: string | null;
  activo: boolean;
};

export type ClienteFormValues = {
  empresa_id: string;
  nombre: string;
  ruc: string;
  direccion: string;
  telefono: string;
  correo: string;
  nombre_comercial: string;
  contacto: string;
  razon_social: string;
  activo: "true" | "false";
};

export type ClientePayload = {
  empresa_id: string;
  nombre: string;
  ruc: string;
  direccion: string | null;
  telefono: string | null;
  correo: string | null;
  nombre_comercial: string | null;
  contacto: string | null;
  razon_social: string | null;
  activo: boolean;
};

export type ClienteEmpresaOption = {
  id: string;
  razon_social: string;
};
