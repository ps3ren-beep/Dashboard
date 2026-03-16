import { useState, useMemo } from 'react';
import type { CreditCard } from '@/types';
import { formatCurrency, formatDateSlash } from '@/utils/format';
import { IconX } from '@/components/icons/SidebarIcons';
import { useFinance } from '@/contexts';
import { NewTransactionModal } from './NewTransactionModal';

interface CardDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  card: CreditCard | null;
}

const EXPENSES_PER_PAGE = 10;

export function CardDetailsModal({ isOpen, onClose, card }: CardDetailsModalProps) {
  const { transactions } = useFinance();
  const [expensesPage, setExpensesPage] = useState(1);
  const [isNewTransactionOpen, setIsNewTransactionOpen] = useState(false);

  const cardExpenses = useMemo(() => {
    if (!card) return [];
    return transactions
      .filter((t) => t.type === 'expense' && t.accountId === card.id)
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [card, transactions]);

  const totalExpensesPages = Math.max(1, Math.ceil(cardExpenses.length / EXPENSES_PER_PAGE));
  const paginatedExpenses = useMemo(
    () =>
      cardExpenses.slice(
        (expensesPage - 1) * EXPENSES_PER_PAGE,
        expensesPage * EXPENSES_PER_PAGE
      ),
    [cardExpenses, expensesPage]
  );

  if (!isOpen || !card) return null;

  const limit = card.limit;
  const bill = card.currentBill;
  const available = Math.max(0, limit - bill);
  const usagePercent = limit > 0 ? (bill / limit) * 100 : 0;

  return (
    <>
      <div
        role="presentation"
        aria-hidden
        onClick={onClose}
        className="fixed inset-0 z-40 bg-secondary-darker/50"
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto px-4 py-6">
        <section
          className="my-auto w-full max-w-[720px] rounded-card border border-neutral-300 bg-surface-50 shadow-lg"
          style={{ animation: 'slideDown 0.25s ease-out' }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <header className="flex items-center justify-between border-b border-neutral-300 px-[var(--space-32)] py-[var(--space-24)]">
            <h2 className="text-label-large font-semibold text-secondary-darker">
              {card.name}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="flex size-10 items-center justify-center rounded-full text-secondary-normal transition-colors hover:bg-neutral-300/50"
              aria-label="Fechar"
            >
              <IconX className="size-5" />
            </button>
          </header>

          <div className="max-h-[80vh] overflow-y-auto px-[var(--space-32)] py-[var(--space-24)]">
            {/* Grid de informações */}
            <div className="grid grid-cols-1 gap-[var(--space-16)] md:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-card border border-neutral-300 bg-surface-50 p-4">
                <p className="text-label-xsmall text-surface-700">Limite total</p>
                <p className="text-label-medium font-semibold text-secondary-darker">
                  {formatCurrency(card.limit)}
                </p>
              </div>
              <div className="rounded-card border border-neutral-300 bg-surface-50 p-4">
                <p className="text-label-xsmall text-surface-700">Fatura atual</p>
                <p
                  className={`text-label-medium font-semibold ${
                    usagePercent >= 80 ? 'text-red-600' : 'text-secondary-darker'
                  }`}
                >
                  {formatCurrency(card.currentBill)}
                </p>
              </div>
              <div className="rounded-card border border-neutral-300 bg-surface-50 p-4">
                <p className="text-label-xsmall text-surface-700">Limite disponível</p>
                <p className="text-label-medium font-semibold text-secondary-darker">
                  {formatCurrency(available)}
                </p>
              </div>
              <div className="rounded-card border border-neutral-300 bg-surface-50 p-4">
                <p className="text-label-xsmall text-surface-700">Percentual de uso</p>
                <p className="text-label-medium font-semibold text-secondary-darker">
                  {usagePercent.toFixed(1)}%
                </p>
              </div>
              <div className="rounded-card border border-neutral-300 bg-surface-50 p-4">
                <p className="text-label-xsmall text-surface-700">Fechamento</p>
                <p className="text-label-medium font-semibold text-secondary-darker">
                  Dia {card.closingDay}
                </p>
              </div>
              <div className="rounded-card border border-neutral-300 bg-surface-50 p-4">
                <p className="text-label-xsmall text-surface-700">Vencimento</p>
                <p className="text-label-medium font-semibold text-secondary-darker">
                  Dia {card.dueDay}
                </p>
              </div>
              {card.lastDigits && (
                <div className="rounded-card border border-neutral-300 bg-surface-50 p-4 md:col-span-2 lg:col-span-1">
                  <p className="text-label-xsmall text-surface-700">Últimos 4 dígitos</p>
                  <p className="font-mono text-label-medium font-semibold text-secondary-darker">
                    •••• {card.lastDigits}
                  </p>
                </div>
              )}
            </div>

            {/* Barra de uso do limite */}
            <div className="mt-6">
              <div className="mb-1 flex justify-between text-label-xsmall text-surface-700">
                <span>Uso do limite</span>
                <span>{usagePercent.toFixed(1)}%</span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-pill bg-neutral-300/50">
                <div
                  className="h-full rounded-pill bg-lime transition-all"
                  style={{ width: `${Math.min(100, usagePercent)}%` }}
                />
              </div>
            </div>

            {/* Tabela de despesas */}
            <div className="mt-8">
              <h3 className="text-label-medium font-semibold text-secondary-darker">
                Despesas neste cartão
              </h3>
              {cardExpenses.length === 0 ? (
                <p className="mt-4 text-paragraph-small text-surface-700">
                  Nenhuma despesa registrada neste cartão ainda.
                </p>
              ) : (
                <>
                  <div className="mt-4 overflow-x-auto rounded-lg border border-neutral-300">
                    <table className="w-full min-w-[400px] border-collapse">
                      <thead>
                        <tr className="bg-neutral-300/30">
                          <th className="px-3 py-2 text-left text-label-xsmall font-semibold text-surface-700">
                            Data
                          </th>
                          <th className="px-3 py-2 text-left text-label-xsmall font-semibold text-surface-700">
                            Descrição
                          </th>
                          <th className="px-3 py-2 text-left text-label-xsmall font-semibold text-surface-700">
                            Categoria
                          </th>
                          <th className="px-3 py-2 text-left text-label-xsmall font-semibold text-surface-700">
                            Parcelas
                          </th>
                          <th className="px-3 py-2 text-right text-label-xsmall font-semibold text-surface-700">
                            Valor
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedExpenses.map((t) => (
                          <tr
                            key={t.id}
                            className="border-t border-neutral-300 text-paragraph-small"
                          >
                            <td className="px-3 py-2 text-surface-700">
                              {formatDateSlash(t.date)}
                            </td>
                            <td className="px-3 py-2 text-secondary-darker">
                              {t.description}
                            </td>
                            <td className="px-3 py-2 text-surface-700">{t.category}</td>
                            <td className="px-3 py-2 text-surface-700">
                              {t.installments <= 1 ? '-' : `${t.installments}x`}
                            </td>
                            <td className="px-3 py-2 text-right font-semibold text-secondary-darker">
                              - {formatCurrency(t.amount)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {totalExpensesPages > 1 && (
                    <div className="mt-3 flex items-center justify-between">
                      <p className="text-label-xsmall text-surface-700">
                        Página {expensesPage} de {totalExpensesPages}
                      </p>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setExpensesPage((p) => Math.max(1, p - 1))}
                          disabled={expensesPage <= 1}
                          className="rounded-pill border border-neutral-300 bg-surface-50 px-3 py-1 text-label-xsmall disabled:opacity-40"
                        >
                          Anterior
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setExpensesPage((p) => Math.min(totalExpensesPages, p + 1))
                          }
                          disabled={expensesPage >= totalExpensesPages}
                          className="rounded-pill border border-neutral-300 bg-surface-50 px-3 py-1 text-label-xsmall disabled:opacity-40"
                        >
                          Próxima
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Botões de ação */}
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setIsNewTransactionOpen(true)}
                className="rounded-pill bg-neutral-900 px-4 py-2 text-label-small font-semibold text-neutral-0 transition-colors hover:bg-neutral-900/90"
              >
                Adicionar Despesa
              </button>
              <button
                type="button"
                onClick={onClose}
                className="rounded-pill border border-neutral-300 bg-surface-50 px-4 py-2 text-label-small font-semibold text-secondary-darker transition-colors hover:bg-neutral-300/40"
              >
                Fechar
              </button>
            </div>
          </div>
        </section>
      </div>

      <NewTransactionModal
        isOpen={isNewTransactionOpen}
        onClose={() => setIsNewTransactionOpen(false)}
        initialType="expense"
        initialAccountId={card.id}
      />
    </>
  );
}
