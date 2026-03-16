import { PageContainer } from '@/components/layout/PageContainer';
import {
  DashboardHeader,
  ExpensesByCategoryCarousel,
  FinancialFlowChart,
  CreditCardsWidget,
  UpcomingExpensesWidget,
  TransactionsTable,
} from '@/components/dashboard';
import { SummaryCards } from '@/components/cards';

export function DashboardPage() {
  return (
    <PageContainer>
      <DashboardHeader />
      <div className="flex flex-col pb-[18px] pt-[18px]" style={{ gap: 'var(--space-18)' }}>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_minmax(320px,420px)]" style={{ gap: 'var(--space-18)' }}>
          {/* Coluna esquerda: categorias, resumo e gráfico */}
          <div className="flex min-w-0 flex-col" style={{ gap: 'var(--space-18)' }}>
            <ExpensesByCategoryCarousel />
            <SummaryCards />
            <FinancialFlowChart />
          </div>

          {/* Coluna direita: cartões e próximas despesas */}
          <div className="flex min-w-0 flex-col" style={{ gap: 'var(--space-18)' }}>
            <CreditCardsWidget />
            <UpcomingExpensesWidget />
          </div>
        </div>
        {/* Extrato detalhado — largura total, 18px do grid */}
        <TransactionsTable />
      </div>
    </PageContainer>
  );
}
