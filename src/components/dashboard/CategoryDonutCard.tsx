import { formatCurrency } from '@/utils/format';

/** Cores rotativas para o anel do donut: lime, preto, cinza médio, cinza claro */
const DONUT_COLORS = [
  'var(--color-lime)',
  'var(--color-neutral-900)',
  'var(--color-surface-700)',
  'var(--color-neutral-300)',
] as const;

interface CategoryDonutCardProps {
  category: string;
  amount: number;
  percentage: number;
  colorIndex: number;
}

/** Donut SVG — diâmetro 64px, anel colorido por percentual */
function DonutChart({ percentage, color }: { percentage: number; color: string }) {
  const size = 64;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(percentage, 100) / 100) * circumference;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="rotate-[-90deg]"
      aria-hidden
    >
      {/* Anel de fundo (cinza claro) */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="var(--color-neutral-300)"
        strokeWidth={strokeWidth}
      />
      {/* Anel colorido (percentual) */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
      />
    </svg>
  );
}

export function CategoryDonutCard({
  category,
  amount,
  percentage,
  colorIndex,
}: CategoryDonutCardProps) {
  const color = DONUT_COLORS[colorIndex % DONUT_COLORS.length];
  const displayPct = percentage;

  return (
    <article
      className="flex w-[160px] shrink-0 flex-col items-center rounded-card border border-neutral-300 bg-surface-50 p-[var(--space-24)] transition-colors hover:border-lime"
      style={{ gap: 'var(--space-8)' }}
    >
      <div className="relative flex size-16 items-center justify-center">
        <DonutChart percentage={displayPct} color={color} />
        <span className="absolute text-label-xsmall font-semibold text-secondary-darker">
          {displayPct.toFixed(1)}%
        </span>
      </div>
      <p className="w-full truncate text-center text-label-xsmall text-surface-700">
        {category}
      </p>
      <p className="text-heading-xsmall font-bold text-secondary-darker">
        {formatCurrency(amount)}
      </p>
    </article>
  );
}
