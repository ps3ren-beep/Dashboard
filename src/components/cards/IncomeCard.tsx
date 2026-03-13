import { useFinance } from '@/contexts';
import { useCountUp } from '@/hooks/useCountUp';
import { formatCurrency } from '@/utils/format';
import { IconArrowDownLeft } from '@/components/icons/SidebarIcons';

export function IncomeCard() {
  const { calculateIncomeForPeriod } = useFinance();
  const income = calculateIncomeForPeriod();
  const displayValue = useCountUp(income, 800);

  return (
    <article className="rounded-card border border-neutral-300 bg-surface-50 p-[var(--space-24)]">
      <div className="flex items-start justify-between">
        <p className="text-paragraph-medium font-semibold text-secondary-darker">
          Receitas
        </p>
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-neutral-300 text-green-600">
          <IconArrowDownLeft className="size-4" />
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
