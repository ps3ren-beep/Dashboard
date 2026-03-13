import { PageContainer } from '@/components/layout/PageContainer';
import { DashboardHeader, ExpensesByCategoryCarousel } from '@/components/dashboard';
import { SummaryCards } from '@/components/cards';

export function DashboardPage() {
  return (
    <PageContainer>
      <DashboardHeader />
      <div className="flex flex-col gap-6 py-6">
        <SummaryCards />
        <ExpensesByCategoryCarousel />
        <p className="text-paragraph-medium text-secondary-normal">
          Conteúdo do dashboard será implementado nos próximos prompts.
        </p>
      </div>
    </PageContainer>
  );
}
