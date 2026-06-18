import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
  createEmpresa,
  deleteEmpresa,
  getEmpresas,
  updateEmpresa,
} from "../services/empresasService";
import type { Empresa, EmpresaFormValues } from "../types/empresa";

export function useEmpresas(searchTerm: string) {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const fetchEmpresas = useCallback(async () => {
    try {
      const data = await getEmpresas(searchTerm);
      setEmpresas(data);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "No se pudieron cargar las empresas.";
      toast.error(message);
      setEmpresas([]);
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm]);

  const loadEmpresas = useCallback(async () => {
    setIsLoading(true);
    await fetchEmpresas();
  }, [fetchEmpresas]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchEmpresas();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [fetchEmpresas]);

  async function saveEmpresa(values: EmpresaFormValues, empresaId?: string) {
    setIsSaving(true);

    try {
      if (empresaId) {
        await updateEmpresa(empresaId, values);
        toast.success("Empresa actualizada correctamente.");
      } else {
        await createEmpresa(values);
        toast.success("Empresa creada correctamente.");
      }

      await loadEmpresas();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "No se pudo guardar la empresa.";
      toast.error(message);
      throw error;
    } finally {
      setIsSaving(false);
    }
  }

  async function removeEmpresa(id: string) {
    setIsSaving(true);

    try {
      await deleteEmpresa(id);
      toast.success("Empresa eliminada correctamente.");
      await loadEmpresas();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "No se pudo eliminar la empresa.";
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  }

  return {
    empresas,
    isLoading,
    isSaving,
    loadEmpresas,
    saveEmpresa,
    removeEmpresa,
  };
}
