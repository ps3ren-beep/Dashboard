import { useFinance } from '@/contexts';
import { useCountUp } from '@/hooks/useCountUp';
import { formatCurrency } from '@/utils/format';
import { IconDollar, IconChartTrending } from '@/components/icons/SidebarIcons';

export function BalanceCard() {
  const { calculateTotalBalance, calculateBalanceGrowthPercent } = useFinance();
  const balance = calculateTotalBalance();
  const growth = calculateBalanceGrowthPercent();
  const displayValue = useCountUp(balance, 800);

  return (
    <article
      className="group relative overflow-hidden rounded-card bg-neutral-900 p-[var(--space-24)] transition-colors"
      style={{ minHeight: 140 }}
    >
      {/* Círculo verde-limão desfocado */}
      <div
        className="absolute -right-12 -top-12 size-40 rounded-full bg-lime opacity-20 blur-3xl transition-opacity group-hover:opacity-30"
        aria-hidden
      />

      <div className="relative flex flex-col" style={{ gap: 'var(--space-4)' }}>
        <div className="flex size-8 items-center justify-center text-blue-600">
          <IconDollar className="size-8" />
        </div>
        <p className="text-paragraph-medium font-normal text-neutral-300">
          Saldo total
        </p>
        <p className="text-heading-medium font-bold text-neutral-0">
          {formatCurrency(displayValue)}
        </p>
        <div className="mt-1 flex items-center gap-1.5 rounded-pill bg-neutral-0/20 px-3 py-1.5">
          <IconChartTrending className="size-4 text-lime" />
          <span className="text-label-xsmall font-semibold text-neutral-0">
            {growth >= 0 ? '+' : ''}
            {Math.round(growth)}% esse mês
          </span>
        </div>
      </div>
    </article>
  );
}
