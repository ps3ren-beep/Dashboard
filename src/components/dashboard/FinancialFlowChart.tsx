import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { formatCurrency, formatCurrencyCompact } from '@/utils/format';
import { IconChartTrending } from '@/components/icons/SidebarIcons';

/** Dados mensais de receitas e despesas — preparado para futura integração com transações */
export interface MonthlyFlowData {
  month: string;
  monthLabel: string;
  receitas: number;
  despesas: number;
}

/** Dados mock fixos — sete meses. Futuramente: agrupar transações por mês */
function getMockFlowData(): MonthlyFlowData[] {
  return [
    { month: '2025-01', monthLabel: 'Jan', receitas: 14700, despesas: 4200 },
    { month: '2025-02', monthLabel: 'Fev', receitas: 15200, despesas: 5800 },
    { month: '2025-03', monthLabel: 'Mar', receitas: 11800, despesas: 4900 },
    { month: '2025-04', monthLabel: 'Abr', receitas: 16200, despesas: 9200 },
    { month: '2025-05', monthLabel: 'Mai', receitas: 14100, despesas: 6100 },
    { month: '2025-06', monthLabel: 'Jun', receitas: 17500, despesas: 7800 },
    { month: '2025-07', monthLabel: 'Jul', receitas: 13200, despesas: 5500 },
  ];
}

interface TooltipPayload {
  monthLabel: string;
  receitas: number;
  despesas: number;
}

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: TooltipPayload }>;
}) {
  if (!active || !payload?.length) return null;
  const data = payload[0].payload;

  return (
    <div
      className="rounded-card border border-neutral-300 bg-surface-50 px-4 py-3 shadow-lg"
      style={{ minWidth: 160 }}
    >
      <p className="text-label-medium font-semibold text-secondary-darker">
        {data.monthLabel}
      </p>
      <p className="mt-1 text-label-small text-green-600">
        Receitas: {formatCurrency(data.receitas)}
      </p>
      <p className="text-label-small text-secondary-darker">
        Despesas: {formatCurrency(data.despesas)}
      </p>
    </div>
  );
}

export function FinancialFlowChart() {
  const data = getMockFlowData();
  const maxValue = Math.max(
    ...data.flatMap((d) => [d.receitas, d.despesas]),
    10000
  );
  const yDomain = [0, Math.ceil(maxValue / 2500) * 2500];

  return (
    <article className="rounded-card border border-neutral-300 bg-surface-50 p-[var(--space-32)]">
      {/* Header: título + legenda */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center" style={{ gap: 'var(--space-8)' }}>
          <div className="flex size-5 items-center justify-center text-secondary-normal">
            <IconChartTrending className="size-5" />
          </div>
          <h2 className="text-label-large font-semibold text-secondary-normal">
            Fluxo financeiro
          </h2>
        </div>
        <div className="flex items-center" style={{ gap: 'var(--space-16)' }}>
          <div className="flex items-center" style={{ gap: 'var(--space-4)' }}>
            <span
              className="size-4 shrink-0 rounded-full"
              style={{ backgroundColor: 'var(--color-lime)' }}
              aria-hidden
            />
            <span className="text-label-xsmall font-semibold text-secondary-darker">
              Receitas
            </span>
          </div>
          <div className="flex items-center" style={{ gap: 'var(--space-4)' }}>
            <span
              className="size-4 shrink-0 rounded-full"
              style={{ backgroundColor: 'var(--color-neutral-900)' }}
              aria-hidden
            />
            <span className="text-label-xsmall font-semibold text-secondary-darker">
              Despesas
            </span>
          </div>
        </div>
      </div>

      {/* Gráfico */}
      <div
        className="w-full overflow-visible rounded-card p-[var(--space-24)]"
        style={{
          height: 300,
          backgroundColor: 'rgba(229, 231, 235, 0.5)',
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 24, right: 24, left: 52, bottom: 24 }}
          >
            <defs>
              <linearGradient id="gradient-receitas" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor="var(--color-lime)"
                  stopOpacity={0.3}
                />
                <stop
                  offset="100%"
                  stopColor="var(--color-lime)"
                  stopOpacity={0}
                />
              </linearGradient>
              <linearGradient id="gradient-despesas" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor="var(--color-neutral-900)"
                  stopOpacity={0.1}
                />
                <stop
                  offset="100%"
                  stopColor="var(--color-neutral-900)"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="4 4"
              stroke="var(--color-neutral-300)"
              strokeOpacity={0.8}
              vertical={false}
            />
            <XAxis
              dataKey="monthLabel"
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'var(--color-surface-700)', fontSize: 12 }}
              dy={8}
            />
            <YAxis
              domain={yDomain}
              axisLine={false}
              tickLine={false}
              tickFormatter={formatCurrencyCompact}
              tick={{ fill: 'var(--color-surface-700)', fontSize: 12 }}
              width={52}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ stroke: 'var(--color-neutral-300)', strokeWidth: 1 }}
            />
            <Area
              type="monotone"
              dataKey="receitas"
              stroke="var(--color-lime)"
              strokeWidth={3}
              fill="url(#gradient-receitas)"
            />
            <Area
              type="monotone"
              dataKey="despesas"
              stroke="var(--color-neutral-900)"
              strokeWidth={3}
              fill="url(#gradient-despesas)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </article>
  );
}
