import { Building2, Plus, Search } from "lucide-react";
import { useState } from "react";

import EmptyState from "@/components/common/EmptyState";
import LoadingState from "@/components/common/LoadingState";
import PageContainer from "@/components/common/PageContainer";
import PageHeader from "@/components/common/PageHeader";
import SectionCard from "@/components/common/SectionCard";

import EmpresaFormModal from "../components/EmpresaFormModal";
import EmpresasTable from "../components/EmpresasTable";
import { useEmpresas } from "../hooks/useEmpresas";
import type { Empresa, EmpresaFormValues } from "../types/empresa";

export default function EmpresasPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmpresa, setSelectedEmpresa] = useState<Empresa | null>(null);
  const { empresas, isLoading, isSaving, saveEmpresa, removeEmpresa } =
    useEmpresas(searchTerm);

  function openCreateModal() {
    setSelectedEmpresa(null);
    setIsModalOpen(true);
  }

  function openEditModal(empresa: Empresa) {
    setSelectedEmpresa(empresa);
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setSelectedEmpresa(null);
  }

  async function handleSubmit(values: EmpresaFormValues, empresaId?: string) {
    await saveEmpresa(values, empresaId);
    closeModal();
  }

  async function handleDelete(empresa: Empresa) {
    const shouldDelete = window.confirm(
      `Deseas eliminar la empresa ${empresa.razon_social}?`,
    );

    if (!shouldDelete) {
      return;
    }

    await removeEmpresa(empresa.id);
  }

  return (
    <PageContainer>
      <PageHeader
        title="Empresas"
        description="Administra las empresas base que usaran SERVITEC PRO V14."
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
        title="Listado de empresas"
        description="Busca por razon social, nombre comercial o RUC."
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
              placeholder="Buscar empresa..."
              className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </label>

          <span className="text-sm text-slate-500">
            {empresas.length} registro{empresas.length === 1 ? "" : "s"}
          </span>
        </div>

        {isLoading ? (
          <LoadingState label="Cargando empresas..." />
        ) : empresas.length === 0 ? (
          <EmptyState
            title="No hay empresas registradas"
            description="Crea la primera empresa para empezar a configurar la base multiempresa del ERP."
            action={
              <button
                type="button"
                onClick={openCreateModal}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                <Building2 size={16} />
                Nueva empresa
              </button>
            }
          />
        ) : (
          <EmpresasTable
            empresas={empresas}
            isSaving={isSaving}
            onEdit={openEditModal}
            onDelete={handleDelete}
          />
        )}
      </SectionCard>

      <EmpresaFormModal
        isOpen={isModalOpen}
        empresa={selectedEmpresa}
        isSaving={isSaving}
        onClose={closeModal}
        onSubmit={handleSubmit}
      />
    </PageContainer>
  );
}
