import { useState, useCallback, useMemo } from 'react';
import { useFinance } from '@/contexts';
import type { Transaction, BankAccount, CreditCard } from '@/types';
import { formatCurrency, formatDueDate } from '@/utils/format';
import { IconWallet, IconPlus, IconCheck } from '@/components/icons/SidebarIcons';
import { NewTransactionModal } from '@/components/modals/NewTransactionModal';

function getAccountDisplayName(
  accountId: string,
  bankAccounts: BankAccount[],
  creditCards: CreditCard[]
): string {
  const bank = bankAccounts.find((a) => a.id === accountId);
  if (bank) return `${bank.name}`;
  const card = creditCards.find((c) => c.id === accountId);
  if (card) return `Crédito ${card.name} **** ${card.lastDigits ?? '****'}`;
  return 'Conta';
}

interface ExpenseItemProps {
  transaction: Transaction;
  accountLabel: string;
  onMarkPaid: (tx: Transaction) => void;
  isMarking: boolean;
}

function ExpenseItem({
  transaction,
  accountLabel,
  onMarkPaid,
  isMarking,
}: ExpenseItemProps) {
  const [isExiting, setIsExiting] = useState(false);

  const handleClick = useCallback(() => {
    if (isMarking) return;
    setIsExiting(true);
    setTimeout(() => {
      onMarkPaid(transaction);
    }, 250);
  }, [transaction, onMarkPaid, isMarking]);

  return (
    <div
      className={`flex items-start justify-between py-[var(--space-24)] transition-opacity duration-200 ${
        isExiting ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="min-w-0 flex-1">
        <p className="text-label-medium font-semibold text-secondary-darker">
          {transaction.description}
        </p>
        <p className="mt-0.5 text-label-small text-surface-700">
          {formatDueDate(transaction.date)}
        </p>
        <p className="mt-0.5 text-paragraph-small text-surface-700">
          {accountLabel}
        </p>
      </div>
      <div className="flex shrink-0 flex-col items-end" style={{ gap: 'var(--space-8)' }}>
        <p className="text-label-medium font-semibold text-secondary-darker">
          {formatCurrency(transaction.amount)}
        </p>
        <button
          type="button"
          onClick={handleClick}
          disabled={isMarking}
          className="flex size-8 items-center justify-center rounded-full border border-neutral-300 bg-transparent text-green-600 transition-colors hover:border-green-600 hover:bg-green-100 hover:text-green-600 disabled:opacity-50"
          aria-label="Marcar como pago"
        >
          <IconCheck className={`size-4 ${isMarking ? 'text-green-600' : ''}`} />
        </button>
      </div>
    </div>
  );
}

export function UpcomingExpensesWidget() {
  const {
    transactions,
    bankAccounts,
    creditCards,
    selectedMember,
    updateTransaction,
    addTransaction,
  } = useFinance();

  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [markingId, setMarkingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const pendingExpenses = useMemo(() => {
    const filtered = transactions.filter(
      (t) =>
        t.type === 'expense' &&
        !t.isPaid &&
        (selectedMember == null || t.memberId === selectedMember)
    );
    return [...filtered].sort((a, b) => a.date.localeCompare(b.date));
  }, [transactions, selectedMember]);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  }, []);

  const handleMarkPaid = useCallback(
    (tx: Transaction) => {
      setMarkingId(tx.id);
      updateTransaction(tx.id, { isPaid: true, status: 'completed' });

      if (tx.isRecurring) {
        const [y, m, d] = tx.date.split('-').map(Number);
        const nextDate = new Date(y, m - 1, d);
        nextDate.setMonth(nextDate.getMonth() + 1);
        const nextDateStr = nextDate.toISOString().slice(0, 10);
        const { id: _id, ...rest } = tx;
        addTransaction({
          ...rest,
          date: nextDateStr,
          isPaid: false,
          status: 'pending',
        });
      }

      setMarkingId(null);
      showToast('Despesa marcada como paga!');
    },
    [updateTransaction, addTransaction, showToast]
  );

  return (
    <section className="rounded-card border border-neutral-300 bg-surface-50 p-[var(--space-32)]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center" style={{ gap: 'var(--space-8)' }}>
          <IconWallet className="size-5 text-secondary-normal" />
          <h2 className="text-label-large font-semibold text-secondary-normal">
            Próximas despesas
          </h2>
        </div>
        <button
          type="button"
          onClick={() => setIsNewModalOpen(true)}
          className="flex size-10 items-center justify-center rounded-full border border-neutral-300 bg-surface-50 text-secondary-darker transition-colors hover:bg-neutral-300/50"
          aria-label="Nova transação"
        >
          <IconPlus className="size-4" />
        </button>
      </div>

      {/* Lista ou empty state */}
      {pendingExpenses.length === 0 ? (
        <div className="mt-6 flex flex-col items-center justify-center rounded-card border border-dashed border-neutral-300 py-12">
          <div className="flex size-12 items-center justify-center rounded-full bg-green-100 text-green-600">
            <IconCheck className="size-6" />
          </div>
          <p className="mt-4 text-paragraph-small text-surface-700">
            Nenhuma despesa pendente.
          </p>
        </div>
      ) : (
        <div className="mt-6 divide-y divide-neutral-300">
          {pendingExpenses.map((tx) => (
            <ExpenseItem
              key={tx.id}
              transaction={tx}
              accountLabel={getAccountDisplayName(
                tx.accountId,
                bankAccounts,
                creditCards
              )}
              onMarkPaid={handleMarkPaid}
              isMarking={markingId === tx.id}
            />
          ))}
        </div>
      )}

      {/* Toast de confirmação */}
      {toastMessage && (
        <div
          className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-pill bg-neutral-900 px-6 py-3 text-label-small font-semibold text-neutral-0 shadow-lg"
          style={{ animation: 'slideDown 0.2s ease-out' }}
        >
          {toastMessage}
        </div>
      )}

      <NewTransactionModal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
      />
    </section>
  );
}
