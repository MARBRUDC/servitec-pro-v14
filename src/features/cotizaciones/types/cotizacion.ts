export type CotizacionEstado = "Borrador" | "Enviada" | "Aprobada" | "Rechazada";

export type TipoServicio =
  | "Mantenimiento preventivo"
  | "Mantenimiento correctivo"
  | "Calibración"
  | "Instalación"
  | "Diagnóstico"
  | "Venta de repuestos";

export type ModoCotizacion =
  | "Servicio general"
  | "Por equipo"
  | "Venta de repuestos";

export type Cotizacion = {
  id: string;
  empresa_id: string;
  cliente_id: string;
  codigo: string;
  titulo: string;
  descripcion: string;
  subtotal: number;
  igv: number;
  total: number;
  estado: CotizacionEstado;
  tipo_cotizacion: TipoServicio | null;
  modo_servicio: ModoCotizacion | null;
  created_at?: string;
  updated_at?: string;
};

export type CotizacionEmpresaOption = {
  id: string;
  razon_social: string;
};

export type CotizacionClienteOption = {
  id: string;
  empresa_id: string | null;
  nombre: string;
};

export type CotizacionLineaFormValues = {
  descripcion: string;
  cantidad: number;
  precio_unitario: number;
};

export type CotizacionEquipoFormValues = {
  equipo: string;
  marca: string;
  modelo: string;
  serie: string;
  actividades: CotizacionLineaFormValues[];
};

export type CotizacionProductoFormValues = {
  descripcion: string;
  marca: string;
  modelo: string;
  cantidad: number;
  precio_unitario: number;
};

export type CotizacionFormValues = {
  empresa_id: string;
  cliente_id: string;
  codigo: string;
  tipo_cotizacion: TipoServicio;
  modo_servicio: ModoCotizacion;
  estado: CotizacionEstado;
  titulo: string;
  descripcion: string;
  actividades_generales: CotizacionLineaFormValues[];
  equipos: CotizacionEquipoFormValues[];
  productos: CotizacionProductoFormValues[];
};

export type CotizacionDetalle = CotizacionFormValues & {
  id: string;
};
