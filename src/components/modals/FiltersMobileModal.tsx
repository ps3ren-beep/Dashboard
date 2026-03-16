import { useState, useEffect } from 'react';
import { useFinance } from '@/contexts';
import type { TransactionTypeFilter } from '@/contexts';
import type { DateRange } from '@/contexts';
import { IconX } from '@/components/icons/SidebarIcons';

function getFirstDayOfMonth(year: number, month: number): Date {
  return new Date(year, month, 1);
}
function getLastDayOfMonth(year: number, month: number): Date {
  return new Date(year, month + 1, 0);
}
function toYYYYMMDD(d: Date): string {
  return d.toISOString().slice(0, 10);
}

const PERIOD_SHORTCUTS: { label: string; get: () => DateRange }[] = [
  {
    label: 'Este mês',
    get: () => {
      const now = new Date();
      const start = getFirstDayOfMonth(now.getFullYear(), now.getMonth());
      const end = getLastDayOfMonth(now.getFullYear(), now.getMonth());
      return { startDate: toYYYYMMDD(start), endDate: toYYYYMMDD(end) };
    },
  },
  {
    label: 'Mês passado',
    get: () => {
      const now = new Date();
      const start = getFirstDayOfMonth(now.getFullYear(), now.getMonth() - 1);
      const end = getLastDayOfMonth(now.getFullYear(), now.getMonth() - 1);
      return { startDate: toYYYYMMDD(start), endDate: toYYYYMMDD(end) };
    },
  },
  {
    label: 'Últimos 3 meses',
    get: () => {
      const end = new Date();
      const start = new Date(end);
      start.setMonth(start.getMonth() - 3);
      return { startDate: toYYYYMMDD(start), endDate: toYYYYMMDD(end) };
    },
  },
  {
    label: 'Este ano',
    get: () => {
      const now = new Date();
      return {
        startDate: toYYYYMMDD(new Date(now.getFullYear(), 0, 1)),
        endDate: toYYYYMMDD(now),
      };
    },
  },
];

const TYPE_OPTIONS: { value: TransactionTypeFilter; label: string }[] = [
  { value: 'all', label: 'Todos' },
  { value: 'income', label: 'Receitas' },
  { value: 'expense', label: 'Despesas' },
];

interface FiltersMobileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FiltersMobileModal({ isOpen, onClose }: FiltersMobileModalProps) {
  const {
    transactionType,
    setTransactionType,
    selectedMember,
    setSelectedMember,
    dateRange,
    setDateRange,
    familyMembers,
  } = useFinance();

  const [tempType, setTempType] = useState<TransactionTypeFilter>(transactionType);
  const [tempMemberId, setTempMemberId] = useState<string | null>(selectedMember);
  const [tempRange, setTempRange] = useState<DateRange>(dateRange);

  useEffect(() => {
    if (isOpen) {
      setTempType(transactionType);
      setTempMemberId(selectedMember);
      setTempRange(dateRange);
    }
  }, [isOpen, transactionType, selectedMember, dateRange]);

  const handleApply = () => {
    setTransactionType(tempType);
    setSelectedMember(tempMemberId);
    setDateRange(tempRange);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        role="presentation"
        aria-hidden
        onClick={onClose}
        className="fixed inset-0 z-40 bg-secondary-darker/50"
      />
      <div
        className="fixed inset-x-0 bottom-0 z-50 flex max-h-[85vh] flex-col rounded-t-card border border-neutral-300 bg-surface-50 shadow-lg"
        style={{ animation: 'slideUp 0.3s ease-out' }}
      >
        {/* Header — touch target min 44px */}
        <header className="flex min-h-[56px] shrink-0 items-center justify-between border-b border-neutral-300 px-4 py-3">
          <h2 className="text-label-large font-semibold text-secondary-darker">
            Filtros
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full text-secondary-normal transition-colors hover:bg-neutral-300/50"
            aria-label="Fechar"
          >
            <IconX className="size-5" />
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-6">
          {/* Tipo */}
          <section className="mb-6">
            <p className="mb-2 text-label-small font-semibold text-secondary-darker">
              Tipo
            </p>
            <div className="flex flex-wrap gap-2">
              {TYPE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setTempType(opt.value)}
                  className={`min-h-[44px] rounded-pill px-4 py-2 text-label-medium transition-colors ${
                    tempType === opt.value
                      ? 'bg-neutral-900 text-neutral-0 font-semibold'
                      : 'border border-neutral-300 bg-surface-50 text-secondary-normal'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </section>

          {/* Membro */}
          <section className="mb-6">
            <p className="mb-2 text-label-small font-semibold text-secondary-darker">
              Membro
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setTempMemberId(null)}
                className={`flex min-h-[44px] items-center gap-2 rounded-pill px-4 py-2 text-label-medium transition-colors ${
                  tempMemberId === null
                    ? 'bg-neutral-900 text-neutral-0 font-semibold'
                    : 'border border-neutral-300 bg-surface-50 text-secondary-normal'
                }`}
              >
                Todos
              </button>
              {familyMembers.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setTempMemberId(m.id)}
                  className={`flex min-h-[44px] items-center gap-2 rounded-pill px-3 py-2 text-label-medium transition-colors ${
                    tempMemberId === m.id
                      ? 'bg-neutral-900 text-neutral-0 font-semibold'
                      : 'border border-neutral-300 bg-surface-50 text-secondary-normal'
                  }`}
                >
                  {m.avatarUrl ? (
                    <img
                      src={m.avatarUrl}
                      alt=""
                      className="size-8 shrink-0 rounded-full object-cover"
                    />
                  ) : (
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-neutral-300 text-label-xsmall font-semibold text-secondary-darker">
                      {m.name.charAt(0)}
                    </span>
                  )}
                  <span className="truncate max-w-[120px]">{m.name}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Período */}
          <section>
            <p className="mb-2 text-label-small font-semibold text-secondary-darker">
              Período
            </p>
            <div className="flex flex-wrap gap-2">
              {PERIOD_SHORTCUTS.map((s) => {
                const range = s.get();
                const isActive =
                  tempRange.startDate === range.startDate &&
                  tempRange.endDate === range.endDate;
                return (
                  <button
                    key={s.label}
                    type="button"
                    onClick={() => setTempRange(range)}
                    className={`min-h-[44px] rounded-pill px-4 py-2 text-label-medium transition-colors ${
                      isActive
                        ? 'bg-neutral-900 text-neutral-0 font-semibold'
                        : 'border border-neutral-300 bg-surface-50 text-secondary-normal'
                    }`}
                  >
                    {s.label}
                  </button>
                );
              })}
            </div>
          </section>
        </div>

        {/* Footer */}
        <footer className="shrink-0 border-t border-neutral-300 p-4">
          <button
            type="button"
            onClick={handleApply}
            className="flex min-h-[48px] w-full items-center justify-center rounded-pill bg-neutral-900 text-label-large font-semibold text-neutral-0 transition-opacity hover:opacity-90"
          >
            Aplicar Filtros
          </button>
        </footer>
      </div>
    </>
  );
}
