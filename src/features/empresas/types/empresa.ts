export type Empresa = {
  id: string;
  razon_social: string;
  ruc: string;
  direccion: string | null;
  telefono: string | null;
  correo: string | null;
  logo_url: string | null;
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
};

export type EmpresaPayload = {
  razon_social: string;
  ruc: string;
  direccion: string | null;
  telefono: string | null;
  correo: string | null;
  logo_url: string | null;
};
