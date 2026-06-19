import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import {
  createCotizacion,
  deleteCotizacion,
  getCotizacionDetalle,
  getCotizacionOptions,
  getCotizaciones,
  updateCotizacion,
} from "../services/cotizacionesService";
import type { CotizacionFormValues } from "../types/cotizacion";

export function useCotizaciones(searchTerm: string) {
  const queryClient = useQueryClient();

  const cotizacionesQuery = useQuery({
    queryKey: ["cotizaciones", searchTerm],
    queryFn: () => getCotizaciones(searchTerm),
  });

  const optionsQuery = useQuery({
    queryKey: ["cotizaciones-options"],
    queryFn: getCotizacionOptions,
  });

  const saveMutation = useMutation({
    mutationFn: ({
      values,
      cotizacionId,
    }: {
      values: CotizacionFormValues;
      cotizacionId?: string;
    }) =>
      cotizacionId
        ? updateCotizacion(cotizacionId, values)
        : createCotizacion(values),
    onSuccess: (_, variables) => {
      toast.success(
        variables.cotizacionId
          ? "Cotizacion actualizada correctamente."
          : "Cotizacion creada correctamente.",
      );
      void queryClient.invalidateQueries({ queryKey: ["cotizaciones"] });
    },
    onError: (error) => {
      const message =
        error instanceof Error
          ? error.message
          : "No se pudo guardar la cotizacion.";
      toast.error(message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCotizacion,
    onSuccess: () => {
      toast.success("Cotizacion eliminada correctamente.");
      void queryClient.invalidateQueries({ queryKey: ["cotizaciones"] });
    },
    onError: (error) => {
      const message =
        error instanceof Error
          ? error.message
          : "No se pudo eliminar la cotizacion.";
      toast.error(message);
    },
  });

  return {
    cotizaciones: cotizacionesQuery.data ?? [],
    empresas: optionsQuery.data?.empresas ?? [],
    clientes: optionsQuery.data?.clientes ?? [],
    isLoading: cotizacionesQuery.isLoading || optionsQuery.isLoading,
    isSaving: saveMutation.isPending || deleteMutation.isPending,
    getDetalle: getCotizacionDetalle,
    refreshCotizaciones: () => cotizacionesQuery.refetch(),
    saveCotizacion: (values: CotizacionFormValues, cotizacionId?: string) =>
      saveMutation.mutateAsync({ values, cotizacionId }),
    removeCotizacion: (id: string) => deleteMutation.mutateAsync(id),
  };
}
