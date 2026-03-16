import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { useFinance } from '@/contexts';
import type { BankAccount, CreditCard, FamilyMember } from '@/types';
import { formatCurrency, formatDateSlash } from '@/utils/format';
import {
  IconReceipt,
  IconSearch,
  IconUser,
  IconArrowDownLeft,
  IconArrowUpRight,
  IconChevronLeft,
  IconChevronRight,
} from '@/components/icons/SidebarIcons';

const DEFAULT_PER_PAGE = 5;

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

function formatInstallments(installments: number): string {
  if (installments <= 1) return '-';
  return `${installments}x`;
}

interface TransactionsTableProps {
  /** Itens por página; default 5 no dashboard */
  perPage?: number;
  /** Exibir cabeçalho com busca e tipo (default true). Use false na view Transações. */
  showHeader?: boolean;
}

export function TransactionsTable({
  perPage = DEFAULT_PER_PAGE,
  showHeader = true,
}: TransactionsTableProps) {
  const {
    getFilteredTransactions,
    bankAccounts,
    creditCards,
    familyMembers,
    selectedMember,
    dateRange,
  } = useFinance();

  const [localSearch, setLocalSearch] = useState('');
  const [localType, setLocalType] = useState<'all' | 'income' | 'expense'>('all');
  const [page, setPage] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  const baseFiltered = getFilteredTransactions();

  const filteredTransactions = useMemo(() => {
    let result = baseFiltered.filter((t) => {
      if (localType === 'income' && t.type !== 'income') return false;
      if (localType === 'expense' && t.type !== 'expense') return false;
      if (localSearch.trim()) {
        const q = localSearch.toLowerCase().trim();
        const matchDesc = t.description.toLowerCase().includes(q);
        const matchCat = t.category.toLowerCase().includes(q);
        if (!matchDesc && !matchCat) return false;
      }
      return true;
    });
    return result.sort((a, b) => b.date.localeCompare(a.date));
  }, [baseFiltered, localType, localSearch]);

  const totalPages = Math.max(1, Math.ceil(filteredTransactions.length / perPage));
  const start = (page - 1) * perPage;
  const paginatedTransactions = filteredTransactions.slice(start, start + perPage);

  useEffect(() => {
    setPage(1);
  }, [localSearch, localType, selectedMember, dateRange.startDate, dateRange.endDate, baseFiltered.length]);

  const goToPage = useCallback(
    (newPage: number) => {
      const p = Math.max(1, Math.min(totalPages, newPage));
      setPage(p);
      containerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    },
    [totalPages]
  );

  const getMember = useCallback(
    (memberId: string | null): FamilyMember | undefined => {
      if (!memberId) return undefined;
      return familyMembers.find((m) => m.id === memberId);
    },
    [familyMembers]
  );

  const pageNumbers = useMemo((): (number | 'ellipsis')[] => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (page <= 3) {
      return [1, 2, 3, 'ellipsis', totalPages - 1, totalPages];
    }
    if (page >= totalPages - 2) {
      return [1, 2, 'ellipsis', totalPages - 2, totalPages - 1, totalPages];
    }
    return [1, 2, 'ellipsis', page - 1, page, page + 1, 'ellipsis', totalPages - 1, totalPages];
  }, [totalPages, page]);

  const from = filteredTransactions.length === 0 ? 0 : start + 1;
  const to = Math.min(start + perPage, filteredTransactions.length);

  return (
    <section
      ref={containerRef}
      className="rounded-card border border-neutral-300 bg-surface-50 p-[var(--space-32)]"
    >
      {showHeader && (
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center" style={{ gap: 'var(--space-8)' }}>
            <IconReceipt className="size-5 text-secondary-normal" />
            <h2 className="text-label-large font-semibold text-secondary-normal">
              Extrato detalhado
            </h2>
          </div>
          <div className="flex flex-col gap-3 md:flex-row md:items-center" style={{ gap: 'var(--space-16)' }}>
            <div className="relative w-full md:w-64">
              <IconSearch className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-surface-700" />
              <input
                type="search"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder="Buscar lançamentos..."
                className="h-[53px] w-full rounded-pill border border-surface-700 bg-surface-50 pl-12 pr-4 text-paragraph-small text-secondary-darker placeholder:text-surface-700 focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                aria-label="Buscar lançamentos"
              />
            </div>
            <select
              value={localType}
              onChange={(e) => setLocalType(e.target.value as 'all' | 'income' | 'expense')}
              className="h-[53px] w-full rounded-pill border border-surface-700 bg-surface-50 px-4 text-paragraph-small text-secondary-darker md:w-[140px]"
              aria-label="Filtrar por tipo"
            >
              <option value="all">Todos</option>
              <option value="income">Receitas</option>
              <option value="expense">Despesas</option>
            </select>
          </div>
        </div>
      )}

      {/* Tabela */}
      <div className="overflow-x-auto rounded-lg border border-neutral-300">
        <table className="w-full min-w-[600px] border-collapse">
          <thead>
            <tr className="bg-neutral-300/30">
              <th className="w-[50px] px-3 py-3 text-left">
                <span className="text-label-small font-semibold text-secondary-darker">Membros</span>
              </th>
              <th className="px-3 py-3 text-left">
                <span className="text-label-small font-semibold text-secondary-darker">Datas</span>
              </th>
              <th className="px-3 py-3 text-left">
                <span className="text-label-small font-semibold text-secondary-darker">Descrição</span>
              </th>
              <th className="px-3 py-3 text-left">
                <span className="text-label-small font-semibold text-secondary-darker">Categorias</span>
              </th>
              <th className="px-3 py-3 text-left">
                <span className="text-label-small font-semibold text-secondary-darker">Conta/Cartão</span>
              </th>
              <th className="px-3 py-3 text-left">
                <span className="text-label-small font-semibold text-secondary-darker">Parcelas</span>
              </th>
              <th className="px-3 py-3 text-right">
                <span className="text-label-small font-semibold text-secondary-darker">Valor</span>
              </th>
            </tr>
          </thead>
          <tbody key={page}>
            {filteredTransactions.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="h-[96px] border-t border-neutral-300 align-middle text-center text-paragraph-small text-surface-700"
                >
                  Nenhum lançamento encontrado.
                </td>
              </tr>
            ) : (
              paginatedTransactions.map((tx, idx) => {
                const member = getMember(tx.memberId);
                const isEven = (start + idx) % 2 === 0;
                return (
                  <tr
                    key={tx.id}
                    className={`border-t border-neutral-300 transition-colors hover:bg-neutral-300/20 ${
                      isEven ? 'bg-surface-50' : 'bg-neutral-300/5'
                    }`}
                  >
                    <td className="w-[50px] px-3 py-3">
                      <div className="flex size-[24px] items-center justify-center overflow-hidden rounded-full bg-neutral-300">
                        {member?.avatarUrl ? (
                          <img
                            src={member.avatarUrl}
                            alt=""
                            className="size-full object-cover"
                          />
                        ) : (
                          <IconUser className="size-3 text-surface-700" />
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-3 text-paragraph-small text-surface-700">
                      {formatDateSlash(tx.date)}
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center" style={{ gap: 'var(--space-8)' }}>
                        <span
                          className={`flex size-8 shrink-0 items-center justify-center rounded-full ${
                            tx.type === 'income' ? 'bg-green-100 text-green-600' : 'bg-red-600/10 text-red-600'
                          }`}
                        >
                          {tx.type === 'income' ? (
                            <IconArrowDownLeft className="size-4" />
                          ) : (
                            <IconArrowUpRight className="size-4" />
                          )}
                        </span>
                        <span className="text-label-small font-semibold text-secondary-darker">
                          {tx.description}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <span className="inline-block rounded-pill bg-neutral-300/50 px-2 py-0.5 text-label-xsmall text-surface-700">
                        {tx.category}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-paragraph-small text-surface-700">
                      {getAccountName(tx.accountId, bankAccounts, creditCards)}
                    </td>
                    <td className="px-3 py-3 text-paragraph-small text-surface-700">
                      {formatInstallments(tx.installments)}
                    </td>
                    <td className="px-3 py-3 text-right">
                      <span
                        className={`text-label-small font-semibold ${
                          tx.type === 'income' ? 'text-green-600' : 'text-secondary-darker'
                        }`}
                      >
                        {tx.type === 'income' ? '+' : '-'} {formatCurrency(tx.amount)}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Paginação */}
      {filteredTransactions.length > 0 && (
        <div className="mt-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-label-small text-surface-700">
            Mostrando {from} a {to} de {filteredTransactions.length}
          </p>
          <div className="flex items-center" style={{ gap: 'var(--space-8)' }}>
            <button
              type="button"
              onClick={() => goToPage(page - 1)}
              disabled={page <= 1}
              className="flex size-8 items-center justify-center rounded-full border border-neutral-300 bg-surface-50 text-secondary-darker transition-colors hover:bg-neutral-300/50 disabled:cursor-default disabled:opacity-40 disabled:hover:bg-surface-50"
              aria-label="Página anterior"
            >
              <IconChevronLeft className="size-4" />
            </button>
            <div className="flex items-center" style={{ gap: 'var(--space-4)' }}>
              {pageNumbers.map((p, i) =>
                p === 'ellipsis' ? (
                  <span key={`ellipsis-${i}`} className="px-2 text-surface-700">
                    …
                  </span>
                ) : (
                  <button
                    key={p}
                    type="button"
                    onClick={() => goToPage(p)}
                    className={`flex size-8 items-center justify-center rounded-full text-label-small font-semibold transition-colors ${
                      page === p
                        ? 'bg-neutral-900 text-neutral-0'
                        : 'text-surface-700 hover:bg-neutral-300/30'
                    }`}
                    aria-label={`Página ${p}`}
                    aria-current={page === p ? 'page' : undefined}
                  >
                    {p}
                  </button>
                )
              )}
            </div>
            <button
              type="button"
              onClick={() => goToPage(page + 1)}
              disabled={page >= totalPages}
              className="flex size-8 items-center justify-center rounded-full border border-neutral-300 bg-surface-50 text-secondary-darker transition-colors hover:bg-neutral-300/50 disabled:cursor-default disabled:opacity-40 disabled:hover:bg-surface-50"
              aria-label="Próxima página"
            >
              <IconChevronRight className="size-4" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
