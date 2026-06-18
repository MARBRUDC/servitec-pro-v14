import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Plus, Search, Users } from "lucide-react";
import { useState } from "react";

import EmptyState from "@/components/common/EmptyState";
import LoadingState from "@/components/common/LoadingState";
import PageContainer from "@/components/common/PageContainer";
import PageHeader from "@/components/common/PageHeader";
import SectionCard from "@/components/common/SectionCard";

import ClienteFormModal from "../components/ClienteFormModal";
import ClientesTable from "../components/ClientesTable";
import { useClientes } from "../hooks/useClientes";
import type { Cliente, ClienteFormValues } from "../types/cliente";

const clientesQueryClient = new QueryClient();

function ClientesContent() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);
  const {
    clientes,
    empresas,
    isLoading,
    isSaving,
    refreshClientes,
    saveCliente,
    removeCliente,
  } = useClientes(searchTerm);

  function openCreateModal() {
    setSelectedCliente(null);
    setIsModalOpen(true);
  }

  function openEditModal(cliente: Cliente) {
    setSelectedCliente(cliente);
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setSelectedCliente(null);
  }

  async function handleSubmit(values: ClienteFormValues, clienteId?: string) {
    await saveCliente(values, clienteId);
    closeModal();
    void refreshClientes();
  }

  async function handleDelete(cliente: Cliente) {
    const shouldDelete = window.confirm(
      `Deseas eliminar el cliente ${cliente.nombre}?`,
    );

    if (!shouldDelete) {
      return;
    }

    await removeCliente(cliente.id);
  }

  return (
    <PageContainer>
      <PageHeader
        title="Clientes"
        description="Administra los clientes vinculados a una empresa del ERP."
        actions={
          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            <Plus size={16} />
            Nuevo
          </button>
        }
      />

      <SectionCard
        title="Listado de clientes"
        description="Busca por nombre, RUC, correo, contacto, direccion o telefono."
      >
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <label className="relative w-full sm:max-w-md">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Buscar cliente..."
              className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </label>

          <span className="text-sm text-slate-500">
            {clientes.length} registro{clientes.length === 1 ? "" : "s"}
          </span>
        </div>

        {isLoading ? (
          <LoadingState label="Cargando clientes..." />
        ) : clientes.length === 0 ? (
          <EmptyState
            title="No hay clientes registrados"
            description="Crea el primer cliente y vincularlo a una empresa existente."
            action={
              <button
                type="button"
                onClick={openCreateModal}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                <Users size={16} />
                Nuevo cliente
              </button>
            }
          />
        ) : (
          <ClientesTable
            clientes={clientes}
            empresas={empresas}
            isSaving={isSaving}
            onEdit={openEditModal}
            onDelete={handleDelete}
          />
        )}
      </SectionCard>

      <ClienteFormModal
        isOpen={isModalOpen}
        cliente={selectedCliente}
        empresas={empresas}
        isSaving={isSaving}
        onClose={closeModal}
        onSubmit={handleSubmit}
      />
    </PageContainer>
  );
}

export default function ClientesPage() {
  return (
    <QueryClientProvider client={clientesQueryClient}>
      <ClientesContent />
    </QueryClientProvider>
  );
}
