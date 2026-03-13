import { useFinance } from '@/contexts';
import { useCountUp } from '@/hooks/useCountUp';
import { formatCurrency } from '@/utils/format';
import { IconArrowUpRight } from '@/components/icons/SidebarIcons';

export function ExpenseCard() {
  const { calculateExpensesForPeriod } = useFinance();
  const expenses = calculateExpensesForPeriod();
  const displayValue = useCountUp(expenses, 800);

  return (
    <article className="rounded-card border border-neutral-300 bg-surface-50 p-[var(--space-24)]">
      <div className="flex items-start justify-between">
        <p className="text-paragraph-medium font-semibold text-surface-700">
          Despesas
        </p>
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-red-600/15 text-red-600">
          <IconArrowUpRight className="size-4" />
        </div>
      </div>
      <p
        className="mt-4 text-heading-medium font-bold text-secondary-darker"
        style={{ marginTop: 'var(--space-24)' }}
      >
        {formatCurrency(displayValue)}
      </p>
    </article>
  );
}
