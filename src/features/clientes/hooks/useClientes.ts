import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import toast from "react-hot-toast";

import {
  createCliente,
  deleteCliente,
  getClienteEmpresas,
  getClientes,
  updateCliente,
} from "../services/clientesService";
import type { ClienteFormValues } from "../types/cliente";

export function useClientes(searchTerm: string) {
  const queryClient = useQueryClient();

  const clientesQuery = useQuery({
    queryKey: ["clientes", searchTerm],
    queryFn: () => getClientes(searchTerm),
  });

  const empresasQuery = useQuery({
    queryKey: ["clientes-empresas"],
    queryFn: getClienteEmpresas,
  });

  const saveMutation = useMutation({
    mutationFn: ({
      values,
      clienteId,
    }: {
      values: ClienteFormValues;
      clienteId?: string;
    }) =>
      clienteId
        ? updateCliente(clienteId, values)
        : createCliente(values),
    onSuccess: async (_, variables) => {
      toast.success(
        variables.clienteId
          ? "Cliente actualizado correctamente."
          : "Cliente creado correctamente.",
      );
      void queryClient.invalidateQueries({ queryKey: ["clientes"] });
    },
    onError: (error) => {
      const message =
        error instanceof Error ? error.message : "No se pudo guardar el cliente.";
      toast.error(message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCliente,
    onSuccess: async () => {
      toast.success("Cliente eliminado correctamente.");
      void queryClient.invalidateQueries({ queryKey: ["clientes"] });
    },
    onError: (error) => {
      const message =
        error instanceof Error ? error.message : "No se pudo eliminar el cliente.";
      toast.error(message);
    },
  });

  return {
    clientes: clientesQuery.data ?? [],
    empresas: empresasQuery.data ?? [],
    isLoading: clientesQuery.isLoading || empresasQuery.isLoading,
    isSaving: saveMutation.isPending || deleteMutation.isPending,
    refreshClientes: () => clientesQuery.refetch(),
    saveCliente: (values: ClienteFormValues, clienteId?: string) =>
      saveMutation.mutateAsync({ values, clienteId }),
    removeCliente: (id: string) => deleteMutation.mutateAsync(id),
  };
}
