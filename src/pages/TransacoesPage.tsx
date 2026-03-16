import { useState, useRef } from 'react';
import { useFinance } from '@/contexts';
import type { BankAccount, CreditCard } from '@/types';
import { formatCurrency, formatDateSlash } from '@/utils/format';
import { PageContainer } from '@/components/layout/PageContainer';
import { TransactionsTable } from '@/components/dashboard/TransactionsTable';
import { DateRangePicker } from '@/components/dashboard/DashboardHeader/DateRangePicker';
import { FiltersMobileModal } from '@/components/modals/FiltersMobileModal';
import {
  IconReceipt,
  IconSearch,
  IconCalendar,
  IconFilter,
  IconDownload,
} from '@/components/icons/SidebarIcons';
import { useMediaQuery } from '@/hooks/useMediaQuery';

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

function getAccountName(
  accountId: string,
  bankAccounts: BankAccount[],
  creditCards: CreditCard[]
): string {
  const bank = bankAccounts.find((a) => a.id === accountId);
  if (bank) return bank.name;
  const card = creditCards.find((c) => c.id === accountId);
  if (card) return card.name;
  return 'Desconhecido';
}

function exportToCsv(
  transactions: ReturnType<ReturnType<typeof useFinance>['getFilteredTransactions']>,
  bankAccounts: BankAccount[],
  creditCards: CreditCard[]
): void {
  const headers = ['Data', 'Descrição', 'Tipo', 'Categoria', 'Conta/Cartão', 'Parcelas', 'Valor'];
  const rows = transactions.map((t) => [
    formatDateSlash(t.date),
    t.description,
    t.type === 'income' ? 'Receita' : 'Despesa',
    t.category,
    getAccountName(t.accountId, bankAccounts, creditCards),
    t.installments <= 1 ? '' : `${t.installments}x`,
    t.type === 'income' ? t.amount : -t.amount,
  ]);
  const csv = [headers.join(';'), ...rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(';'))].join('\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `transacoes-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function TransacoesPage() {
  const {
    searchText,
    setSearchText,
    transactionType,
    setTransactionType,
    selectedMember,
    setSelectedMember,
    dateRange,
    familyMembers,
    getFilteredTransactions,
    calculateIncomeForPeriod,
    calculateExpensesForPeriod,
    bankAccounts,
    creditCards,
  } = useFinance();

  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [filtersModalOpen, setFiltersModalOpen] = useState(false);
  const dateBtnRef = useRef<HTMLButtonElement>(null);
  const isDesktop = useMediaQuery('(min-width: 1280px)');

  const filtered = getFilteredTransactions();
  const income = calculateIncomeForPeriod();
  const expenses = calculateExpensesForPeriod();
  const balance = income - expenses;

  const handleExport = () => {
    exportToCsv(filtered, bankAccounts, creditCards);
  };

  return (
    <PageContainer>
      <div className="flex w-full max-w-[1400px] flex-col gap-6 lg:max-w-[1600px]">
        <header className="flex min-w-0 flex-wrap items-center justify-between gap-4">
          <h1 className="text-heading-medium font-bold text-secondary-darker">
            Transações
          </h1>
          <button
            type="button"
            onClick={handleExport}
            className="flex min-h-[44px] items-center justify-center gap-2 rounded-pill border border-neutral-300 bg-surface-50 px-4 py-2 text-label-medium font-semibold text-secondary-darker transition-colors hover:bg-neutral-300/50"
          >
            <IconDownload className="size-5" />
            Exportar
          </button>
        </header>

        {/* Filtros: desktop inline, mobile botão abre modal */}
        <section className="rounded-card border border-neutral-300 bg-surface-50 p-4">
          {isDesktop ? (
            <div className="flex flex-wrap items-center gap-4">
              <div className="relative min-w-0 flex-1 md:max-w-[280px]">
                <IconSearch className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-surface-700" />
                <input
                  type="search"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  placeholder="Pesquisar..."
                  className="h-[48px] w-full rounded-pill border border-surface-700 bg-surface-50 pl-11 pr-4 text-paragraph-small text-secondary-darker placeholder:text-surface-700 focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  aria-label="Pesquisar transações"
                />
              </div>
              <select
                value={transactionType}
                onChange={(e) => setTransactionType(e.target.value as 'all' | 'income' | 'expense')}
                className="h-[48px] min-h-[44px] w-full rounded-pill border border-surface-700 bg-surface-50 px-4 text-paragraph-small text-secondary-darker md:w-[140px]"
                aria-label="Tipo"
              >
                <option value="all">Todos</option>
                <option value="income">Receitas</option>
                <option value="expense">Despesas</option>
              </select>
              <select
                value={selectedMember ?? ''}
                onChange={(e) => setSelectedMember(e.target.value || null)}
                className="h-[48px] min-h-[44px] w-full rounded-pill border border-surface-700 bg-surface-50 px-4 text-paragraph-small text-secondary-darker md:w-[160px]"
                aria-label="Membro"
              >
                <option value="">Todos</option>
                {familyMembers.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
              <div className="relative">
                <button
                  ref={dateBtnRef}
                  type="button"
                  onClick={() => setDatePickerOpen((o) => !o)}
                  className="flex h-[48px] min-h-[44px] items-center gap-2 rounded-pill border border-surface-700 bg-surface-50 px-4 text-paragraph-small text-secondary-darker"
                  aria-label="Período"
                  aria-expanded={datePickerOpen}
                >
                  <IconCalendar className="size-5 text-surface-700" />
                  <span className="truncate">
                    {formatRangeLabel(dateRange.startDate, dateRange.endDate)}
                  </span>
                </button>
                {datePickerOpen && (
                  <div className="absolute left-0 top-full z-50 pt-2">
                    <DateRangePicker
                      isOpen
                      onClose={() => setDatePickerOpen(false)}
                      isMobile={false}
                      anchorRef={dateBtnRef}
                    />
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-3">
              <div className="relative min-w-0 flex-1">
                <IconSearch className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-surface-700" />
                <input
                  type="search"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  placeholder="Pesquisar..."
                  className="h-[48px] w-full rounded-pill border border-surface-700 bg-surface-50 pl-11 pr-4 text-paragraph-small text-secondary-darker placeholder:text-surface-700"
                  aria-label="Pesquisar transações"
                />
              </div>
              <button
                type="button"
                onClick={() => setFiltersModalOpen(true)}
                className="flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-full border border-neutral-300 bg-surface-50 text-secondary-normal"
                aria-label="Filtros"
              >
                <IconFilter className="size-5" />
              </button>
            </div>
          )}
        </section>

        {/* Resumo do período */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-card border border-neutral-300 bg-surface-50 px-4 py-4">
            <p className="text-label-xsmall text-surface-700">Receitas (período)</p>
            <p className="text-heading-small font-bold text-green-600">
              {formatCurrency(income)}
            </p>
          </div>
          <div className="rounded-card border border-neutral-300 bg-surface-50 px-4 py-4">
            <p className="text-label-xsmall text-surface-700">Despesas (período)</p>
            <p className="text-heading-small font-bold text-secondary-darker">
              - {formatCurrency(expenses)}
            </p>
          </div>
          <div className="rounded-card border border-neutral-300 bg-surface-50 px-4 py-4">
            <p className="text-label-xsmall text-surface-700">Saldo (período)</p>
            <p className={`text-heading-small font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(balance)}
            </p>
          </div>
        </div>

        {/* Tabela expandida */}
        <section className="rounded-card border border-neutral-300 bg-surface-50 p-4 md:p-6">
          <div className="mb-4 flex items-center gap-2">
            <IconReceipt className="size-5 text-secondary-normal" />
            <h2 className="text-label-large font-semibold text-secondary-darker">
              Extrato detalhado
            </h2>
          </div>
          <TransactionsTable perPage={15} showHeader={false} />
        </section>
      </div>

      <FiltersMobileModal isOpen={filtersModalOpen} onClose={() => setFiltersModalOpen(false)} />
    </PageContainer>
  );
}
