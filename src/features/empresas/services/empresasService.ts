import { getSupabaseClient } from "@/lib/supabase";

import type {
  Empresa,
  EmpresaFormValues,
} from "../types/empresa";

const TABLE_NAME = "empresas";
const TABLE_SCHEMA = "public";

type EmpresaRow = {
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

type EmpresaDbPayload = {
  razon_social: string;
  ruc: string;
  direccion: string | null;
  telefono: string | null;
  correo: string | null;
  logo_url: string | null;
};

function emptyToNull(value: string) {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function toEmpresaPayload(values: EmpresaFormValues): EmpresaDbPayload {
  return {
    razon_social: values.razon_social.trim(),
    ruc: values.ruc.trim(),
    direccion: emptyToNull(values.direccion),
    telefono: emptyToNull(values.telefono),
    correo: emptyToNull(values.correo),
    logo_url: emptyToNull(values.logo_url),
  };
}

function toEmpresa(row: EmpresaRow): Empresa {
  return {
    id: row.id,
    razon_social: row.razon_social,
    ruc: row.ruc,
    direccion: row.direccion,
    telefono: row.telefono,
    correo: row.correo,
    logo_url: row.logo_url,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

function logSupabaseError(action: string, error: unknown) {
  console.error(`[Supabase][public.empresas][${action}]`, error);
}

function getEmpresasTable() {
  return getSupabaseClient().schema(TABLE_SCHEMA).from(TABLE_NAME);
}

export async function getEmpresas(searchTerm: string) {
  const search = searchTerm.trim();

  let query = getEmpresasTable()
    .select(
      "id, razon_social, ruc, direccion, telefono, correo, logo_url, created_at, updated_at",
    )
    .order("razon_social", { ascending: true });

  if (search) {
    query = query.or(
      `razon_social.ilike.%${search}%,ruc.ilike.%${search}%,correo.ilike.%${search}%`,
    );
  }

  const { data, error } = await query;

  if (error) {
    console.error(error);
    logSupabaseError("select", error);
    throw error;
  }

  return ((data ?? []) as EmpresaRow[]).map(toEmpresa);
}

export async function createEmpresa(values: EmpresaFormValues) {
  const payload = toEmpresaPayload(values);

  const { data, error } = await getEmpresasTable()
    .insert(payload)
    .select()
    .single();

  if (error) {
    console.error(error);
    logSupabaseError("insert", error);
    throw error;
  }

  return toEmpresa(data as EmpresaRow);
}

export async function updateEmpresa(id: string, values: EmpresaFormValues) {
  const payload = toEmpresaPayload(values);

  const { data, error } = await getEmpresasTable()
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(error);
    logSupabaseError("update", error);
    throw error;
  }

  return toEmpresa(data as EmpresaRow);
}

export async function deleteEmpresa(id: string) {
  const { error } = await getEmpresasTable().delete().eq("id", id);

  if (error) {
    console.error(error);
    logSupabaseError("delete", error);
    throw error;
  }
}
