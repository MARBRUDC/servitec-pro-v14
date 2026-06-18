import EmptyState from "@/components/common/EmptyState";
import PageContainer from "@/components/common/PageContainer";
import PageHeader from "@/components/common/PageHeader";
import SectionCard from "@/components/common/SectionCard";

export default function ClientesPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Clientes"
        description="Modulo preparado para el CRUD de clientes en un sprint posterior."
      />

      <SectionCard>
        <EmptyState
          title="Modulo pendiente"
          description="Aqui se construira el CRUD de clientes cuando inicie el sprint funcional correspondiente."
        />
      </SectionCard>
    </PageContainer>
  );
}
