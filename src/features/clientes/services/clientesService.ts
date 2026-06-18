import { getSupabaseClient } from "@/lib/supabase";

import type {
  Cliente,
  ClienteEmpresaOption,
  ClienteFormValues,
  ClientePayload,
} from "../types/cliente";

const CLIENTES_TABLE = "clientes";
const EMPRESAS_TABLE = "empresas";
const TABLE_SCHEMA = "public";

type ClienteRow = {
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

type EmpresaOptionRow = {
  id: string;
  razon_social: string;
};

function emptyToNull(value: string) {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function toClientePayload(values: ClienteFormValues): ClientePayload {
  return {
    empresa_id: values.empresa_id,
    nombre: values.nombre.trim(),
    ruc: values.ruc.trim(),
    direccion: emptyToNull(values.direccion),
    telefono: emptyToNull(values.telefono),
    correo: emptyToNull(values.correo),
    nombre_comercial: emptyToNull(values.nombre_comercial),
    contacto: emptyToNull(values.contacto),
    razon_social: emptyToNull(values.razon_social),
    activo: values.activo === "true",
  };
}

function toCliente(row: ClienteRow): Cliente {
  return {
    id: row.id,
    empresa_id: row.empresa_id,
    nombre: row.nombre,
    ruc: row.ruc,
    direccion: row.direccion,
    telefono: row.telefono,
    correo: row.correo,
    nombre_comercial: row.nombre_comercial,
    contacto: row.contacto,
    razon_social: row.razon_social,
    activo: row.activo,
  };
}

function toEmpresaOption(row: EmpresaOptionRow): ClienteEmpresaOption {
  return {
    id: row.id,
    razon_social: row.razon_social,
  };
}

function logSupabaseError(action: string, error: unknown) {
  console.error(error);
  console.error(`[Supabase][public.clientes][${action}]`, error);
}

function getClientesTable() {
  return getSupabaseClient().schema(TABLE_SCHEMA).from(CLIENTES_TABLE);
}

function getEmpresasTable() {
  return getSupabaseClient().schema(TABLE_SCHEMA).from(EMPRESAS_TABLE);
}

export async function getClientes(searchTerm: string) {
  const search = searchTerm.trim();

  let query = getClientesTable()
    .select(
      "id, empresa_id, nombre, ruc, direccion, telefono, correo, nombre_comercial, contacto, razon_social, activo",
    )
    .order("nombre", { ascending: true });

  if (search) {
    query = query.or(
      `nombre.ilike.%${search}%,ruc.ilike.%${search}%,direccion.ilike.%${search}%,telefono.ilike.%${search}%,correo.ilike.%${search}%,nombre_comercial.ilike.%${search}%,contacto.ilike.%${search}%,razon_social.ilike.%${search}%`,
    );
  }

  const { data, error } = await query;

  if (error) {
    logSupabaseError("select", error);
    throw error;
  }

  return ((data ?? []) as ClienteRow[]).map(toCliente);
}

export async function getClienteEmpresas() {
  const { data, error } = await getEmpresasTable()
    .select("id, razon_social")
    .order("razon_social", { ascending: true });

  if (error) {
    logSupabaseError("select-empresas", error);
    throw error;
  }

  return ((data ?? []) as EmpresaOptionRow[]).map(toEmpresaOption);
}

export async function createCliente(values: ClienteFormValues) {
  const payload = toClientePayload(values);

  const { data, error } = await getClientesTable()
    .insert(payload)
    .select()
    .single();

  if (error) {
    logSupabaseError("insert", error);
    throw error;
  }

  return toCliente(data as ClienteRow);
}

export async function updateCliente(id: string, values: ClienteFormValues) {
  const payload = toClientePayload(values);

  const { data, error } = await getClientesTable()
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    logSupabaseError("update", error);
    throw error;
  }

  return toCliente(data as ClienteRow);
}

export async function deleteCliente(id: string) {
  const { error } = await getClientesTable().delete().eq("id", id);

  if (error) {
    logSupabaseError("delete", error);
    throw error;
  }
}
