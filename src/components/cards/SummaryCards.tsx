import { BalanceCard } from './BalanceCard';
import { IncomeCard } from './IncomeCard';
import { ExpenseCard } from './ExpenseCard';

/**
 * Cards de resumo financeiro — Saldo total, Receitas, Despesas
 * Desktop: horizontal com proporções | Mobile: vertical full width
 */
export function SummaryCards() {
  return (
    <section
      className="grid w-full grid-cols-1 gap-4 md:grid-cols-[1.15fr_1fr_1fr] md:gap-[18px]"
      aria-label="Resumo financeiro"
    >
      <BalanceCard />
      <IncomeCard />
      <ExpenseCard />
    </section>
  );
}
