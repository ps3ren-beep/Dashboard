import { useState, useRef, useCallback } from 'react';
import { useFinance } from '@/contexts';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import {
  IconSearch,
  IconFilter,
  IconCalendar,
  IconPlus,
} from '@/components/icons/SidebarIcons';
import { FilterPopover } from './FilterPopover';
import { DateRangePicker } from './DateRangePicker';
import { FamilyMembersWidget } from './FamilyMembersWidget';
import { FiltersMobileModal } from '@/components/modals/FiltersMobileModal';
import { NewTransactionModal } from '@/components/modals/NewTransactionModal';

const MONTHS = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

function formatRangeLabel(startDate: string, endDate: string): string {
  const [sy, sm, sd] = startDate.split('-').map(Number);
  const [ey, em, ed] = endDate.split('-').map(Number);
  const d1 = sd.toString().padStart(2, '0');
  const m1 = MONTHS[sm - 1].toLowerCase();
  const d2 = ed.toString().padStart(2, '0');
  const m2 = MONTHS[em - 1].toLowerCase();
  const y = ey;
  if (sm === em && sy === ey) {
    return `${d1} ${m1} - ${d2} ${m2} ${y}`;
  }
  return `${d1} ${m1} - ${d2} ${m2}, ${y}`;
}

export function DashboardHeader() {
  const { searchText, setSearchText, dateRange } = useFinance();
  const [filterOpen, setFilterOpen] = useState(false);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [isNewTransactionOpen, setIsNewTransactionOpen] = useState(false);
  const filterBtnRef = useRef<HTMLButtonElement>(null);
  const dateBtnRef = useRef<HTMLButtonElement>(null);
  const isMobile = !useMediaQuery('(min-width: 768px)');
  const isDesktop = useMediaQuery('(min-width: 1280px)');

  const handleNewTransaction = useCallback(() => {
    setIsNewTransactionOpen(true);
  }, []);

  return (
    <>
      <header className="flex min-w-0 w-full flex-col gap-4 py-[var(--space-12)] md:flex-row md:flex-wrap md:items-center md:gap-4 md:justify-between">
        {/* Esquerda: busca + filtro + data + membros */}
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-3 md:gap-4">
          {/* Campo de busca */}
          <div className="relative min-w-0 w-full md:max-w-[280px] lg:max-w-[316px]">
            <IconSearch className="absolute left-4 top-1/2 size-6 -translate-y-1/2 text-secondary-normal" />
            <input
              type="search"
              placeholder="Pesquisar..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="h-[53px] w-full min-w-0 rounded-pill border border-surface-700 bg-surface-50 pl-12 pr-4 text-paragraph-small text-secondary-darker placeholder:text-secondary-normal focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
              aria-label="Pesquisar transações"
            />
          </div>

          {/* Botão filtro */}
          <div className="relative flex shrink-0 items-center">
              <button
                ref={filterBtnRef}
                type="button"
                onClick={() => setFilterOpen((o) => !o)}
                className="flex size-12 shrink-0 items-center justify-center rounded-full border border-neutral-300 bg-surface-50 text-secondary-normal transition-colors hover:bg-neutral-300/50 min-[768px]:size-[53px]"
                aria-label="Filtros"
                aria-expanded={filterOpen}
              >
                <IconFilter className="size-6" />
              </button>
              {isDesktop ? (
                <div className="absolute left-0 top-full pt-2">
                  <FilterPopover
                    isOpen={filterOpen}
                    onClose={() => setFilterOpen(false)}
                    anchorRef={filterBtnRef}
                  />
                </div>
              ) : (
                <FiltersMobileModal
                  isOpen={filterOpen}
                  onClose={() => setFilterOpen(false)}
                />
              )}
          </div>

          {/* Seletor de período */}
          <div className="relative min-w-0 shrink">
              <button
                ref={dateBtnRef}
                type="button"
                onClick={() => setDatePickerOpen((o) => !o)}
                className="flex h-[53px] min-w-0 items-center gap-2 rounded-pill border border-surface-700 bg-surface-50 px-4 text-paragraph-small text-secondary-darker transition-colors hover:border-neutral-900 md:gap-[var(--space-8)]"
                aria-label="Selecionar período"
                aria-expanded={datePickerOpen}
              >
                <IconCalendar className="size-6 shrink-0 text-secondary-normal" />
                <span className="truncate">
                  {formatRangeLabel(dateRange.startDate, dateRange.endDate)}
                </span>
              </button>
              {datePickerOpen && (
                <div className="absolute left-0 top-full z-50 pt-2">
                  <DateRangePicker
                    isOpen
                    onClose={() => setDatePickerOpen(false)}
                    isMobile={isMobile}
                    anchorRef={dateBtnRef}
                  />
                </div>
              )}
          </div>

          {/* Widget membros */}
          <FamilyMembersWidget />
        </div>

        {/* Nova transação — shrink-0 para nunca ser cortado */}
        <button
          type="button"
          onClick={handleNewTransaction}
          className="flex h-[53px] w-full shrink-0 items-center justify-center gap-2 rounded-pill bg-neutral-900 px-6 text-label-large font-semibold text-neutral-0 transition-opacity hover:opacity-90 md:w-auto"
        >
          <IconPlus className="size-4 shrink-0" />
          Nova transação
        </button>
      </header>

      <NewTransactionModal
        isOpen={isNewTransactionOpen}
        onClose={() => setIsNewTransactionOpen(false)}
      />
    </>
  );
}
