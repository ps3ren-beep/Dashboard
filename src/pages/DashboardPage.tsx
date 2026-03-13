import { PageContainer } from '@/components/layout/PageContainer';
import {
  DashboardHeader,
  ExpensesByCategoryCarousel,
  FinancialFlowChart,
  CreditCardsWidget,
  UpcomingExpensesWidget,
} from '@/components/dashboard';
import { SummaryCards } from '@/components/cards';

export function DashboardPage() {
  return (
    <PageContainer>
      <DashboardHeader />
      <div className="grid grid-cols-1 gap-6 py-6 lg:grid-cols-[1fr_minmax(320px,420px)]">
        {/* Coluna esquerda: categorias, resumo e gráfico */}
        <div className="flex min-w-0 flex-col gap-6">
          <ExpensesByCategoryCarousel />
          <SummaryCards />
          <FinancialFlowChart />
        </div>

        {/* Coluna direita: cartões e próximas despesas */}
        <div className="flex min-w-0 flex-col gap-6">
          <CreditCardsWidget />
          <UpcomingExpensesWidget />
        </div>
      </div>
    </PageContainer>
  );
}
