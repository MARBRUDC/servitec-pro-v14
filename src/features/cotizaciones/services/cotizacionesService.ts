import { getSupabaseClient } from "@/lib/supabase";

import type {
  Cotizacion,
  CotizacionClienteOption,
  CotizacionDetalle,
  CotizacionEmpresaOption,
  CotizacionFormValues,
  CotizacionLineaFormValues,
  CotizacionProductoFormValues,
} from "../types/cotizacion";

const TABLE_SCHEMA = "public";

type CotizacionRow = Cotizacion;
type EquipoRow = {
  id: string;
  equipo: string;
  marca: string;
  modelo: string;
  serie: string;
};
type ActividadRow = {
  id_equipo: string;
  actividad: string;
  precio: number;
  orden: number;
};
type ItemRow = {
  tipo: string;
  nombre: string;
  cantidad: number;
  precio_unitario: number;
};
type ProductoRow = CotizacionProductoFormValues & {
  precio: number;
};

function table(name: string) {
  return getSupabaseClient().schema(TABLE_SCHEMA).from(name);
}

function text(value: string) {
  return value.trim();
}

function lineTotal(line: Pick<CotizacionLineaFormValues, "cantidad" | "precio_unitario">) {
  return Number((Number(line.cantidad || 0) * Number(line.precio_unitario || 0)).toFixed(2));
}

function logSupabaseError(action: string, error: unknown) {
  console.error(error);
  console.error(`[Supabase][cotizaciones][${action}]`, error);
}

export function calculateCotizacionTotals(values: CotizacionFormValues) {
  const generalTotal =
    values.modo_servicio === "Servicio general"
      ? values.actividades_generales.reduce((sum, item) => sum + lineTotal(item), 0)
      : 0;
  const equiposTotal =
    values.modo_servicio === "Por equipo"
      ? values.equipos.reduce(
          (sum, equipo) =>
            sum +
            equipo.actividades.reduce((subtotal, item) => subtotal + lineTotal(item), 0),
          0,
        )
      : 0;
  const productosTotal =
    values.modo_servicio === "Venta de repuestos"
      ? values.productos.reduce((sum, item) => sum + lineTotal(item), 0)
      : 0;
  const subtotal = Number((generalTotal + equiposTotal + productosTotal).toFixed(2));
  const igv = Number((subtotal * 0.18).toFixed(2));
  const total = Number((subtotal + igv).toFixed(2));

  return { subtotal, igv, total };
}

function toCotizacionPayload(values: CotizacionFormValues) {
  const totals = calculateCotizacionTotals(values);

  return {
    empresa_id: values.empresa_id,
    cliente_id: values.cliente_id,
    codigo: text(values.codigo),
    titulo: text(values.titulo),
    descripcion: text(values.descripcion),
    estado: values.estado,
    tipo_cotizacion: values.tipo_cotizacion,
    modo_servicio: values.modo_servicio,
    subtotal: totals.subtotal,
    igv: totals.igv,
    total: totals.total,
  };
}

export async function getCotizacionOptions() {
  const [empresasResult, clientesResult] = await Promise.all([
    table("empresas").select("id, razon_social").order("razon_social"),
    table("clientes").select("id, empresa_id, nombre").order("nombre"),
  ]);

  if (empresasResult.error) {
    logSupabaseError("select-empresas", empresasResult.error);
    throw empresasResult.error;
  }
  if (clientesResult.error) {
    logSupabaseError("select-clientes", clientesResult.error);
    throw clientesResult.error;
  }

  return {
    empresas: (empresasResult.data ?? []) as CotizacionEmpresaOption[],
    clientes: (clientesResult.data ?? []) as CotizacionClienteOption[],
  };
}

export async function getCotizaciones(searchTerm: string) {
  const search = searchTerm.trim();
  let query = table("cotizaciones")
    .select(
      "id, empresa_id, cliente_id, codigo, titulo, descripcion, subtotal, igv, total, estado, tipo_cotizacion, modo_servicio, created_at, updated_at",
    )
    .order("created_at", { ascending: false });

  if (search) {
    query = query.or(
      `codigo.ilike.%${search}%,titulo.ilike.%${search}%,estado.ilike.%${search}%`,
    );
  }

  const { data, error } = await query;

  if (error) {
    logSupabaseError("select", error);
    throw error;
  }

  return (data ?? []) as Cotizacion[];
}

async function deleteCotizacionChildren(cotizacionId: string) {
  const equiposResult = await table("cotizacion_equipos")
    .select("id")
    .eq("id_cotizacion", cotizacionId);

  if (equiposResult.error) {
    logSupabaseError("select-equipos-delete", equiposResult.error);
    throw equiposResult.error;
  }

  const equipoIds = ((equiposResult.data ?? []) as { id: string }[]).map(
    (equipo) => equipo.id,
  );

  if (equipoIds.length > 0) {
    const actividadesResult = await table("cotizacion_actividades")
      .delete()
      .in("id_equipo", equipoIds);

    if (actividadesResult.error) {
      logSupabaseError("delete-actividades", actividadesResult.error);
      throw actividadesResult.error;
    }
  }

  const deletes = await Promise.all([
    table("cotizacion_items").delete().eq("cotizacion_id", cotizacionId),
    table("cotizacion_productos").delete().eq("id_cotizacion", cotizacionId),
    table("cotizacion_equipos").delete().eq("id_cotizacion", cotizacionId),
  ]);

  for (const result of deletes) {
    if (result.error) {
      logSupabaseError("delete-children", result.error);
      throw result.error;
    }
  }
}

async function insertItems(cotizacionId: string, rows: ItemRow[]) {
  if (rows.length === 0) {
    return;
  }

  const { error } = await table("cotizacion_items").insert(
    rows.map((item) => ({
      cotizacion_id: cotizacionId,
      tipo: item.tipo,
      nombre: text(item.nombre),
      cantidad: Number(item.cantidad || 0),
      precio_unitario: Number(item.precio_unitario || 0),
      marca: "",
      modelo: "",
      serie: "",
      codigo_equipo: "",
      color: "",
      qr: "",
      codigo_barras: "",
      foto_url: "",
    })),
  );

  if (error) {
    logSupabaseError("insert-items", error);
    throw error;
  }
}

async function insertCotizacionChildren(
  cotizacionId: string,
  values: CotizacionFormValues,
) {
  if (values.modo_servicio === "Servicio general") {
    await insertItems(
      cotizacionId,
      values.actividades_generales.map((item) => ({
        tipo: "actividad_general",
        nombre: item.descripcion,
        cantidad: item.cantidad,
        precio_unitario: item.precio_unitario,
      })),
    );
  }

  if (values.modo_servicio === "Por equipo") {
    const equiposPayload = values.equipos.map((item) => ({
      id_cotizacion: cotizacionId,
      equipo: text(item.equipo),
      marca: text(item.marca),
      modelo: text(item.modelo),
      serie: text(item.serie),
      cantidad: 1,
      precio: item.actividades.reduce((sum, line) => sum + lineTotal(line), 0),
      codigo_patrimonial: "",
      color: "",
      qr: "",
      codigo_barras: "",
      foto_url: "",
    }));

    const equiposResult = await table("cotizacion_equipos")
      .insert(equiposPayload)
      .select("id, equipo, marca, modelo, serie");

    if (equiposResult.error) {
      logSupabaseError("insert-equipos", equiposResult.error);
      throw equiposResult.error;
    }

    const equipos = (equiposResult.data ?? []) as EquipoRow[];
    const actividadesPayload = values.equipos.flatMap((equipo, equipoIndex) =>
      equipo.actividades.map((actividad, actividadIndex) => ({
        id_equipo: equipos[equipoIndex]?.id,
        actividad: text(actividad.descripcion),
        precio: lineTotal(actividad),
        estado: "Pendiente",
        observacion: `Cantidad: ${actividad.cantidad}; Precio unitario: ${actividad.precio_unitario}`,
        orden: actividadIndex + 1,
      })),
    );

    if (actividadesPayload.length > 0) {
      const actividadesResult = await table("cotizacion_actividades").insert(
        actividadesPayload,
      );

      if (actividadesResult.error) {
        logSupabaseError("insert-actividades", actividadesResult.error);
        throw actividadesResult.error;
      }
    }

    await insertItems(
      cotizacionId,
      values.equipos.flatMap((equipo) =>
        equipo.actividades.map((actividad) => ({
          tipo: "actividad_equipo",
          nombre: `${equipo.equipo} - ${actividad.descripcion}`,
          cantidad: actividad.cantidad,
          precio_unitario: actividad.precio_unitario,
        })),
      ),
    );
  }

  if (values.modo_servicio === "Venta de repuestos") {
    const productosPayload = values.productos.map((item) => ({
      id_cotizacion: cotizacionId,
      descripcion: text(item.descripcion),
      marca: text(item.marca),
      modelo: text(item.modelo),
      cantidad: Number(item.cantidad || 0),
      precio: Number(item.precio_unitario || 0),
      total: lineTotal(item),
    }));

    if (productosPayload.length > 0) {
      const productosResult = await table("cotizacion_productos").insert(
        productosPayload,
      );

      if (productosResult.error) {
        logSupabaseError("insert-productos", productosResult.error);
        throw productosResult.error;
      }
    }

    await insertItems(
      cotizacionId,
      values.productos.map((item) => ({
        tipo: "producto",
        nombre: item.descripcion,
        cantidad: item.cantidad,
        precio_unitario: item.precio_unitario,
      })),
    );
  }
}

export async function createCotizacion(values: CotizacionFormValues) {
  const { data, error } = await table("cotizaciones")
    .insert(toCotizacionPayload(values))
    .select()
    .single();

  if (error) {
    logSupabaseError("insert", error);
    throw error;
  }

  const cotizacion = data as CotizacionRow;
  await insertCotizacionChildren(cotizacion.id, values);

  return cotizacion;
}

export async function updateCotizacion(id: string, values: CotizacionFormValues) {
  const { data, error } = await table("cotizaciones")
    .update(toCotizacionPayload(values))
    .eq("id", id)
    .select()
    .single();

  if (error) {
    logSupabaseError("update", error);
    throw error;
  }

  await deleteCotizacionChildren(id);
  await insertCotizacionChildren(id, values);

  return data as CotizacionRow;
}

export async function deleteCotizacion(id: string) {
  await deleteCotizacionChildren(id);

  const { error } = await table("cotizaciones").delete().eq("id", id);

  if (error) {
    logSupabaseError("delete", error);
    throw error;
  }
}

export async function getCotizacionDetalle(id: string): Promise<CotizacionDetalle> {
  const [cotizacionResult, itemsResult, equiposResult, productosResult] =
    await Promise.all([
      table("cotizaciones")
        .select(
          "id, empresa_id, cliente_id, codigo, titulo, descripcion, estado, tipo_cotizacion, modo_servicio",
        )
        .eq("id", id)
        .single(),
      table("cotizacion_items")
        .select("tipo, nombre, cantidad, precio_unitario")
        .eq("cotizacion_id", id),
      table("cotizacion_equipos")
        .select("id, equipo, marca, modelo, serie")
        .eq("id_cotizacion", id),
      table("cotizacion_productos")
        .select("descripcion, marca, modelo, cantidad, precio")
        .eq("id_cotizacion", id),
    ]);

  for (const result of [
    cotizacionResult,
    itemsResult,
    equiposResult,
    productosResult,
  ]) {
    if (result.error) {
      logSupabaseError("select-detalle", result.error);
      throw result.error;
    }
  }

  const cotizacion = cotizacionResult.data as CotizacionRow;
  const items = (itemsResult.data ?? []) as ItemRow[];
  const equipos = (equiposResult.data ?? []) as EquipoRow[];
  const productos = (productosResult.data ?? []) as ProductoRow[];
  const actividadesResult =
    equipos.length > 0
      ? await table("cotizacion_actividades")
          .select("id_equipo, actividad, precio, orden")
          .in(
            "id_equipo",
            equipos.map((equipo) => equipo.id),
          )
      : { data: [], error: null };

  if (actividadesResult.error) {
    logSupabaseError("select-detalle-actividades", actividadesResult.error);
    throw actividadesResult.error;
  }

  const actividades = (actividadesResult.data ?? []) as ActividadRow[];

  return {
    id: cotizacion.id,
    empresa_id: cotizacion.empresa_id,
    cliente_id: cotizacion.cliente_id,
    codigo: cotizacion.codigo,
    tipo_cotizacion:
      cotizacion.tipo_cotizacion ?? "Mantenimiento preventivo",
    modo_servicio: cotizacion.modo_servicio ?? "Servicio general",
    estado: cotizacion.estado,
    titulo: cotizacion.titulo,
    descripcion: cotizacion.descripcion,
    actividades_generales: items
      .filter((item) => item.tipo === "actividad_general")
      .map((item) => ({
        descripcion: item.nombre,
        cantidad: item.cantidad,
        precio_unitario: item.precio_unitario,
      })),
    equipos: equipos.map((equipo) => ({
      equipo: equipo.equipo,
      marca: equipo.marca,
      modelo: equipo.modelo,
      serie: equipo.serie,
      actividades: actividades
        .filter((actividad) => actividad.id_equipo === equipo.id)
        .map((actividad) => ({
          descripcion: actividad.actividad,
          cantidad: 1,
          precio_unitario: actividad.precio,
        })),
    })),
    productos: productos.map((producto) => ({
      descripcion: producto.descripcion,
      marca: producto.marca,
      modelo: producto.modelo,
      cantidad: producto.cantidad,
      precio_unitario: producto.precio,
    })),
  };
}
