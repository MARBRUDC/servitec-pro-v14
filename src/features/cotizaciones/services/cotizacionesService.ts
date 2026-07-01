import { getSupabaseClient } from "@/lib/supabase";

import type {
  Cotizacion,
  CotizacionClienteOption,
  CotizacionDetalle,
  CotizacionEmpresaOption,
  CotizacionFormValues,
  CotizacionLineaFormValues,
  TipoServicio,
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
  observacion: string;
  orden: number;
};
type ItemRow = {
  tipo: string;
  nombre: string;
  cantidad: number;
  precio_unitario: number;
};
type ProductoRow = {
  descripcion: string;
  marca: string;
  modelo: string;
  cantidad: number;
  precio: number;
};

function table(name: string) {
  return getSupabaseClient().schema(TABLE_SCHEMA).from(name);
}

function clean(value: string) {
  return value.trim();
}

function lineTotal(line: Pick<CotizacionLineaFormValues, "cantidad" | "precio_unitario">) {
  return Number((Number(line.cantidad || 0) * Number(line.precio_unitario || 0)).toFixed(2));
}

function logSupabaseError(action: string, error: unknown) {
  console.error(error);
  console.error(`[Supabase][cotizaciones][${action}]`, error);
}

function getCurrentYear() {
  return new Date().getFullYear();
}

function parseCotizacionNumber(value: string | null | undefined) {
  const currentYear = getCurrentYear();
  const formattedMatch = value?.match(/^COT-(\d{4})-(\d{6})$/);

  if (formattedMatch) {
    const [, year, number] = formattedMatch;
    return Number(year) === currentYear ? Number(number) : 0;
  }

  const legacyMatch = value?.match(/^COT-(\d+)$/);
  return legacyMatch ? Number(legacyMatch[1]) : 0;
}

function formatCotizacionCodigo(number: number) {
  return `COT-${getCurrentYear()}-${String(number).padStart(6, "0")}`;
}

function normalizeTipoServicio(value: string | null | undefined): TipoServicio {
  switch (value) {
    case "Mantenimiento Preventivo":
    case "Mantenimiento preventivo":
      return "Mantenimiento preventivo";
    case "Mantenimiento Correctivo":
    case "Mantenimiento correctivo":
      return "Mantenimiento correctivo";
    case "Calibración":
    case "Calibracion":
      return "Calibración";
    case "Certificación":
    case "Certificacion":
      return "Certificación";
    case "Diagnóstico Técnico":
    case "Diagnóstico":
    case "Diagnostico Tecnico":
    case "Diagnostico":
      return "Diagnóstico";
    case "Instalación":
    case "Instalacion":
      return "Instalación";
    case "Puesta en marcha":
      return "Puesta en marcha";
    case "Reparación":
    case "Reparacion":
      return "Reparación";
    case "Venta de Repuestos":
    case "Venta de repuestos":
      return "Venta de repuestos";
    case "Servicio Integral":
    case "Servicio integral":
      return "Servicio integral";
    default:
      return "Mantenimiento preventivo";
  }
}

export async function getNextCotizacionCodigo(empresaId: string) {
  if (!empresaId) {
    return formatCotizacionCodigo(1);
  }

  const currentYear = getCurrentYear();
  const startOfYear = `${currentYear}-01-01T00:00:00.000Z`;
  const startOfNextYear = `${currentYear + 1}-01-01T00:00:00.000Z`;

  const { data, error } = await table("cotizaciones")
    .select("codigo, numero")
    .eq("empresa_id", empresaId)
    .gte("created_at", startOfYear)
    .lt("created_at", startOfNextYear)
    .order("created_at", { ascending: false })
    .limit(1000);

  if (error) {
    logSupabaseError("next-codigo", error);
    throw error;
  }

  const maxNumber = ((data ?? []) as { codigo: string | null; numero: string | null }[])
    .flatMap((row) => [row.codigo, row.numero])
    .reduce((max, value) => Math.max(max, parseCotizacionNumber(value)), 0);

  return formatCotizacionCodigo(maxNumber + 1);
}

export function calculateCotizacionTotals(values: CotizacionFormValues) {
  const generalTotal =
    values.modo_servicio === "Servicio General"
      ? values.actividades_generales.reduce((sum, line) => sum + lineTotal(line), 0)
      : 0;
  const equiposTotal =
    values.modo_servicio === "Por Equipos"
      ? values.equipos.reduce(
          (sum, equipo) =>
            sum + equipo.actividades.reduce((subtotal, line) => subtotal + lineTotal(line), 0),
          0,
        )
      : 0;
  const productosTotal =
    values.modo_servicio === "Venta de Repuestos"
      ? values.productos.reduce((sum, product) => sum + lineTotal(product), 0)
      : 0;
  const alquilerTotal =
    values.modo_servicio === "Alquiler"
      ? values.alquileres.reduce((sum, line) => sum + lineTotal(line), 0)
      : 0;
  const subtotal = Number((generalTotal + equiposTotal + productosTotal + alquilerTotal).toFixed(2));
  const igv = Number((subtotal * 0.18).toFixed(2));
  const total = Number((subtotal + igv).toFixed(2));

  return { subtotal, igv, total };
}

async function resolveDisplayNames(values: CotizacionFormValues) {
  const [empresaResult, clienteResult] = await Promise.all([
    table("empresas").select("razon_social").eq("id", values.empresa_id).maybeSingle(),
    table("clientes").select("nombre").eq("id", values.cliente_id).maybeSingle(),
  ]);

  if (empresaResult.error) {
    logSupabaseError("resolve-empresa", empresaResult.error);
    throw empresaResult.error;
  }
  if (clienteResult.error) {
    logSupabaseError("resolve-cliente", clienteResult.error);
    throw clienteResult.error;
  }

  return {
    empresa_nombre: (empresaResult.data as { razon_social?: string } | null)?.razon_social ?? "",
    cliente_nombre: (clienteResult.data as { nombre?: string } | null)?.nombre ?? "",
  };
}

async function toCotizacionPayload(values: CotizacionFormValues) {
  const totals = calculateCotizacionTotals(values);
  const codigo = clean(values.codigo);
  const names = await resolveDisplayNames(values);

  return {
    empresa_id: values.empresa_id,
    cliente_id: values.cliente_id,
    codigo,
    numero: codigo,
    titulo: clean(values.titulo),
    descripcion: clean(values.descripcion),
    estado: values.estado,
    tipo_cotizacion: normalizeTipoServicio(values.tipo_cotizacion),
    modo_servicio: values.modo_servicio,
    subtotal: totals.subtotal,
    igv: totals.igv,
    total: totals.total,
    empresa_nombre: names.empresa_nombre,
    cliente_nombre: names.cliente_nombre,
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
      "id, empresa_id, cliente_id, codigo, numero, titulo, descripcion, subtotal, igv, total, estado, tipo_cotizacion, modo_servicio, cliente_nombre, empresa_nombre, created_at, updated_at",
    )
    .order("created_at", { ascending: false });

  if (search) {
    query = query.or(
      `codigo.ilike.%${search}%,numero.ilike.%${search}%,titulo.ilike.%${search}%,estado.ilike.%${search}%,cliente_nombre.ilike.%${search}%`,
    );
  }

  const { data, error } = await query;

  if (error) {
    logSupabaseError("select", error);
    throw error;
  }

  const cotizaciones = (data ?? []) as Cotizacion[];
  const empresaIds = Array.from(
    new Set(cotizaciones.filter((row) => !row.empresa_nombre).map((row) => row.empresa_id)),
  );
  const clienteIds = Array.from(
    new Set(cotizaciones.filter((row) => !row.cliente_nombre).map((row) => row.cliente_id)),
  );

  const [empresasResult, clientesResult] = await Promise.all([
    empresaIds.length > 0
      ? table("empresas").select("id, razon_social").in("id", empresaIds)
      : Promise.resolve({ data: [], error: null }),
    clienteIds.length > 0
      ? table("clientes").select("id, nombre").in("id", clienteIds)
      : Promise.resolve({ data: [], error: null }),
  ]);

  if (empresasResult.error) {
    logSupabaseError("select-empresas-nombres", empresasResult.error);
    throw empresasResult.error;
  }
  if (clientesResult.error) {
    logSupabaseError("select-clientes-nombres", clientesResult.error);
    throw clientesResult.error;
  }

  const empresasById = new Map(
    ((empresasResult.data ?? []) as { id: string; razon_social: string }[]).map((empresa) => [
      empresa.id,
      empresa.razon_social,
    ]),
  );
  const clientesById = new Map(
    ((clientesResult.data ?? []) as { id: string; nombre: string }[]).map((cliente) => [
      cliente.id,
      cliente.nombre,
    ]),
  );

  return cotizaciones.map((cotizacion) => ({
    ...cotizacion,
    tipo_cotizacion: normalizeTipoServicio(cotizacion.tipo_cotizacion),
    empresa_nombre: cotizacion.empresa_nombre || empresasById.get(cotizacion.empresa_id) || null,
    cliente_nombre: cotizacion.cliente_nombre || clientesById.get(cotizacion.cliente_id) || null,
  }));
}

async function deleteCotizacionChildren(cotizacionId: string) {
  const equiposResult = await table("cotizacion_equipos")
    .select("id")
    .eq("id_cotizacion", cotizacionId);

  if (equiposResult.error) {
    logSupabaseError("select-equipos-delete", equiposResult.error);
    throw equiposResult.error;
  }

  const equipoIds = ((equiposResult.data ?? []) as { id: string }[]).map((equipo) => equipo.id);

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
      nombre: clean(item.nombre),
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

async function insertCotizacionChildren(cotizacionId: string, values: CotizacionFormValues) {
  if (values.modo_servicio === "Servicio General") {
    await insertItems(
      cotizacionId,
      values.actividades_generales
        .filter((line) => line.descripcion.trim())
        .map((line) => ({
          tipo: "servicio_general",
          nombre: line.descripcion,
          cantidad: line.cantidad,
          precio_unitario: line.precio_unitario,
        })),
    );
  }

  if (values.modo_servicio === "Alquiler") {
    await insertItems(
      cotizacionId,
      values.alquileres
        .filter((line) => line.descripcion.trim())
        .map((line) => ({
          tipo: "alquiler",
          nombre: line.descripcion,
          cantidad: line.cantidad,
          precio_unitario: line.precio_unitario,
        })),
    );
  }

  if (values.modo_servicio === "Por Equipos") {
    const equiposPayload = values.equipos
      .filter((equipo) => equipo.equipo.trim())
      .map((equipo) => ({
        id_cotizacion: cotizacionId,
        equipo: clean(equipo.equipo),
        marca: clean(equipo.marca),
        modelo: clean(equipo.modelo),
        serie: clean(equipo.serie),
        cantidad: 1,
        precio: equipo.actividades.reduce((sum, line) => sum + lineTotal(line), 0),
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
    const sourceEquipos = values.equipos.filter((equipo) => equipo.equipo.trim());
    const actividadesPayload = sourceEquipos.flatMap((equipo, equipoIndex) =>
      equipo.actividades
        .filter((line) => line.descripcion.trim())
        .map((line, lineIndex) => ({
          id_equipo: equipos[equipoIndex]?.id,
          actividad: clean(line.descripcion),
          precio: lineTotal(line),
          estado: "Pendiente",
          observacion: `Cantidad: ${line.cantidad}; Precio unitario: ${line.precio_unitario}`,
          orden: lineIndex + 1,
        })),
    );

    if (actividadesPayload.length > 0) {
      const actividadesResult = await table("cotizacion_actividades").insert(actividadesPayload);

      if (actividadesResult.error) {
        logSupabaseError("insert-actividades", actividadesResult.error);
        throw actividadesResult.error;
      }
    }

    await insertItems(
      cotizacionId,
      sourceEquipos.flatMap((equipo) =>
        equipo.actividades
          .filter((line) => line.descripcion.trim())
          .map((line) => ({
            tipo: "actividad_equipo",
            nombre: `${equipo.equipo} - ${line.descripcion}`,
            cantidad: line.cantidad,
            precio_unitario: line.precio_unitario,
          })),
      ),
    );
  }

  if (values.modo_servicio === "Venta de Repuestos") {
    const productosPayload = values.productos
      .filter((product) => product.descripcion.trim())
      .map((product) => ({
        id_cotizacion: cotizacionId,
        descripcion: clean(product.descripcion),
        marca: clean(product.marca),
        modelo: clean(product.modelo),
        cantidad: Number(product.cantidad || 0),
        precio: Number(product.precio_unitario || 0),
        total: lineTotal(product),
      }));

    if (productosPayload.length > 0) {
      const productosResult = await table("cotizacion_productos").insert(productosPayload);

      if (productosResult.error) {
        logSupabaseError("insert-productos", productosResult.error);
        throw productosResult.error;
      }
    }

    await insertItems(
      cotizacionId,
      values.productos
        .filter((product) => product.descripcion.trim())
        .map((product) => ({
          tipo: "producto",
          nombre: product.descripcion,
          cantidad: product.cantidad,
          precio_unitario: product.precio_unitario,
        })),
    );
  }
}

export async function createCotizacion(values: CotizacionFormValues) {
  const codigo = await getNextCotizacionCodigo(values.empresa_id);
  const { data, error } = await table("cotizaciones")
    .insert(await toCotizacionPayload({ ...values, codigo }))
    .select()
    .single();

  if (error) {
    logSupabaseError("insert", error);
    throw error;
  }

  const cotizacion = data as CotizacionRow;
  await insertCotizacionChildren(cotizacion.id, { ...values, codigo });

  return cotizacion;
}

export async function updateCotizacion(id: string, values: CotizacionFormValues) {
  const { data, error } = await table("cotizaciones")
    .update(await toCotizacionPayload(values))
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
  const [cotizacionResult, itemsResult, equiposResult, productosResult] = await Promise.all([
    table("cotizaciones")
      .select(
        "id, empresa_id, cliente_id, codigo, numero, titulo, descripcion, estado, tipo_cotizacion, modo_servicio",
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

  for (const result of [cotizacionResult, itemsResult, equiposResult, productosResult]) {
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
          .select("id_equipo, actividad, precio, observacion, orden")
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
    tipo_cotizacion: normalizeTipoServicio(cotizacion.tipo_cotizacion),
    modo_servicio: cotizacion.modo_servicio ?? "Servicio General",
    estado: cotizacion.estado,
    titulo: cotizacion.titulo,
    descripcion: cotizacion.descripcion,
    actividades_generales: items
      .filter((item) => item.tipo === "servicio_general" || item.tipo === "actividad_general")
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
    productos: productos.map((product) => ({
      descripcion: product.descripcion,
      marca: product.marca,
      modelo: product.modelo,
      cantidad: product.cantidad,
      precio_unitario: product.precio,
    })),
    alquileres: items
      .filter((item) => item.tipo === "alquiler")
      .map((item) => ({
        descripcion: item.nombre,
        cantidad: item.cantidad,
        precio_unitario: item.precio_unitario,
      })),
  };
}
