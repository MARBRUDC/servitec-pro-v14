export type CotizacionEstado = "Borrador" | "Enviada" | "Aprobada" | "Rechazada";

export type TipoServicio =
  | "Mantenimiento preventivo"
  | "Mantenimiento correctivo"
  | "Calibración"
  | "Certificación"
  | "Diagnóstico"
  | "Instalación"
  | "Puesta en marcha"
  | "Reparación"
  | "Venta de repuestos"
  | "Servicio integral";

export type ModoCotizacion =
  | "Servicio General"
  | "Por Equipos"
  | "Venta de Repuestos"
  | "Alquiler";

export type Cotizacion = {
  id: string;
  empresa_id: string;
  cliente_id: string;
  codigo: string;
  numero: string | null;
  titulo: string;
  descripcion: string;
  subtotal: number;
  igv: number;
  total: number;
  estado: CotizacionEstado;
  tipo_cotizacion: TipoServicio | null;
  modo_servicio: ModoCotizacion | null;
  cliente_nombre: string | null;
  empresa_nombre: string | null;
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
  alquileres: CotizacionLineaFormValues[];
};

export type CotizacionDetalle = CotizacionFormValues & {
  id: string;
};
