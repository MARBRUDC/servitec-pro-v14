import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { FileText, Plus, Search } from "lucide-react";
import { useState } from "react";

import EmptyState from "@/components/common/EmptyState";
import LoadingState from "@/components/common/LoadingState";
import PageContainer from "@/components/common/PageContainer";
import PageHeader from "@/components/common/PageHeader";
import SectionCard from "@/components/common/SectionCard";

import CotizacionFormModal from "../components/CotizacionFormModal";
import CotizacionesTable from "../components/CotizacionesTable";
import { useCotizaciones } from "../hooks/useCotizaciones";
import type {
  Cotizacion,
  CotizacionDetalle,
  CotizacionFormValues,
} from "../types/cotizacion";

const cotizacionesQueryClient = new QueryClient();

function CotizacionesContent() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCotizacion, setSelectedCotizacion] =
    useState<CotizacionDetalle | null>(null);
  const {
    cotizaciones,
    empresas,
    clientes,
    isLoading,
    isSaving,
    getDetalle,
    refreshCotizaciones,
    saveCotizacion,
    removeCotizacion,
  } = useCotizaciones(searchTerm);

  function openCreateModal() {
    setSelectedCotizacion(null);
    setIsModalOpen(true);
  }

  async function openEditModal(cotizacion: Cotizacion) {
    const detalle = await getDetalle(cotizacion.id);
    setSelectedCotizacion(detalle);
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setSelectedCotizacion(null);
  }

  async function handleSubmit(values: CotizacionFormValues, cotizacionId?: string) {
    await saveCotizacion(values, cotizacionId);
    closeModal();
    void refreshCotizaciones();
  }

  async function handleDelete(cotizacion: Cotizacion) {
    const shouldDelete = window.confirm(
      `Deseas eliminar la cotizacion ${cotizacion.codigo}?`,
    );

    if (!shouldDelete) {
      return;
    }

    await removeCotizacion(cotizacion.id);
  }

  return (
    <PageContainer>
      <PageHeader
        title="Cotizaciones"
        description="Gestiona cotizaciones con equipos, actividades y productos."
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
        title="Listado de cotizaciones"
        description="Busca por numero, titulo o estado."
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
              placeholder="Buscar cotizacion..."
              className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </label>

          <span className="text-sm text-slate-500">
            {cotizaciones.length} registro{cotizaciones.length === 1 ? "" : "s"}
          </span>
        </div>

        {isLoading ? (
          <LoadingState label="Cargando cotizaciones..." />
        ) : cotizaciones.length === 0 ? (
          <EmptyState
            title="No hay cotizaciones registradas"
            description="Crea la primera cotizacion para iniciar el flujo comercial."
            action={
              <button
                type="button"
                onClick={openCreateModal}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                <FileText size={16} />
                Nueva cotizacion
              </button>
            }
          />
        ) : (
          <CotizacionesTable
            cotizaciones={cotizaciones}
            empresas={empresas}
            clientes={clientes}
            isSaving={isSaving}
            onEdit={(cotizacion) => void openEditModal(cotizacion)}
            onDelete={handleDelete}
          />
        )}
      </SectionCard>

      <CotizacionFormModal
        isOpen={isModalOpen}
        cotizacion={selectedCotizacion}
        empresas={empresas}
        clientes={clientes}
        isSaving={isSaving}
        onClose={closeModal}
        onSubmit={handleSubmit}
      />
    </PageContainer>
  );
}

export default function CotizacionesPage() {
  return (
    <QueryClientProvider client={cotizacionesQueryClient}>
      <CotizacionesContent />
    </QueryClientProvider>
  );
}
