import PageContainer from "@/components/common/PageContainer";
import PageHeader from "@/components/common/PageHeader";
import SectionCard from "@/components/common/SectionCard";

export default function DashboardPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Dashboard"
        description="Vista inicial del ERP SERVITEC PRO V14."
      />

      <SectionCard
        title="Infraestructura base"
        description="Los indicadores y modulos de negocio se implementaran en los siguientes sprints."
      >
        <p className="text-sm text-slate-500">
          Bienvenido a SERVITEC PRO V14.
        </p>
      </SectionCard>
    </PageContainer>
  );
}
