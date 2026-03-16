import { useState, useMemo, useCallback } from 'react';
import {
  IconX,
  IconArrowDownLeft,
  IconArrowUpRight,
  IconCheck,
} from '@/components/icons/SidebarIcons';
import { useFinance } from '@/contexts';
import type { Transaction, CreditCard, BankAccount, FamilyMember } from '@/types';
import { formatCurrency } from '@/utils/format';

interface NewTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialType?: 'income' | 'expense';
  initialAccountId?: string;
}

type LocalType = 'income' | 'expense';

interface FieldErrors {
  amount?: string;
  description?: string;
  category?: string;
  account?: string;
}

function getAllCategoriesByType(transactions: Transaction[], type: LocalType): string[] {
  const set = new Set<string>();
  transactions.forEach((t) => {
    if (t.type === type && t.category) {
      set.add(t.category);
    }
  });
  return Array.from(set).sort((a, b) => a.localeCompare(b));
}

function isCreditCard(accountId: string | null, creditCards: CreditCard[]): boolean {
  if (!accountId) return false;
  return creditCards.some((c) => c.id === accountId);
}

function getMemberOptions(familyMembers: FamilyMember[]): { id: string | null; label: string }[] {
  return [
    { id: null, label: 'Família (Geral)' },
    ...familyMembers.map((m) => ({ id: m.id, label: m.name })),
  ];
}

export function NewTransactionModal({
  isOpen,
  onClose,
  initialType = 'expense',
  initialAccountId,
}: NewTransactionModalProps) {
  const {
    transactions,
    bankAccounts,
    creditCards,
    familyMembers,
    addTransaction,
  } = useFinance();

  const [type, setType] = useState<LocalType>(initialType);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [memberId, setMemberId] = useState<string | null>(null);
  const [accountId, setAccountId] = useState<string | null>(initialAccountId ?? null);
  const [installments, setInstallments] = useState(1);
  const [isRecurring, setIsRecurring] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = useMemo(
    () => getAllCategoriesByType(transactions, type),
    [transactions, type]
  );

  const memberOptions = useMemo(
    () => getMemberOptions(familyMembers),
    [familyMembers]
  );

  const accountOptions = useMemo(
    () => ({
      bank: bankAccounts,
      cards: creditCards,
    }),
    [bankAccounts, creditCards]
  );

  const selectedAccountIsCard = isCreditCard(accountId, creditCards);
  const showInstallments = type === 'expense' && selectedAccountIsCard;
  const showRecurring = type === 'expense';

  const resetState = useCallback(() => {
    setType(initialType);
    setAmount('');
    setDescription('');
    setCategory('');
    setCustomCategory('');
    setIsAddingCategory(false);
    setMemberId(null);
    setAccountId(initialAccountId ?? null);
    setInstallments(1);
    setIsRecurring(false);
    setErrors({});
    setIsSubmitting(false);
  }, [initialAccountId, initialType]);

  const handleClose = useCallback(() => {
    resetState();
    onClose();
  }, [onClose, resetState]);

  const handleTypeChange = useCallback(
    (next: LocalType) => {
      setType(next);
      setCategory('');
      setErrors((prev) => ({ ...prev, category: undefined }));
      if (next === 'income') {
        setIsRecurring(false);
        setInstallments(1);
      }
    },
    []
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (isSubmitting) return;

      const nextErrors: FieldErrors = {};
      const cleanedAmount = amount.replace(/\./g, '').replace(',', '.').trim();
      const amountNumber = Number(cleanedAmount);

      if (!cleanedAmount || Number.isNaN(amountNumber) || amountNumber <= 0) {
        nextErrors.amount = 'Informe um valor maior que zero.';
      }
      if (!description || description.trim().length < 3) {
        nextErrors.description = 'Descrição deve ter pelo menos 3 caracteres.';
      }
      const finalCategory = category || customCategory;
      if (!finalCategory.trim()) {
        nextErrors.category = 'Selecione ou crie uma categoria.';
      }
      if (!accountId) {
        nextErrors.account = 'Selecione uma conta ou cartão.';
      }

      setErrors(nextErrors);
      if (Object.keys(nextErrors).length > 0) return;

      if (!accountId) return;

      setIsSubmitting(true);

      const now = new Date();
      const dateStr = now.toISOString().slice(0, 10);

      const tx: Omit<Transaction, 'id'> = {
        type,
        amount: amountNumber,
        description: description.trim(),
        category: finalCategory.trim(),
        date: dateStr,
        accountId,
        memberId,
        installments: showInstallments ? installments : 1,
        status: 'completed',
        isRecurring: showRecurring ? isRecurring : false,
        isPaid: false,
      };

      addTransaction(tx);
      setIsSubmitting(false);
      handleClose();
      // Toast global de sucesso pode ser implementado via contexto de UI futuramente
    },
    [
      accountId,
      addTransaction,
      amount,
      description,
      category,
      customCategory,
      handleClose,
      isSubmitting,
      isRecurring,
      installments,
      memberId,
      showInstallments,
      showRecurring,
      type,
    ]
  );

  if (!isOpen) return null;

  const iconBgClass =
    type === 'income' ? 'bg-lime text-neutral-900' : 'bg-neutral-900 text-neutral-0';

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-surface-50">
      {/* Overlay de saída por ESC ou X apenas — clique fora não fecha para evitar perda acidental */}
      <div className="pointer-events-none fixed inset-0 bg-secondary-darker/10" />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between border-b border-neutral-300 px-[var(--space-32)] py-[var(--space-24)]">
        <div className="flex items-center" style={{ gap: 'var(--space-16)' }}>
          <div
            className={`flex size-16 items-center justify-center rounded-full ${iconBgClass}`}
          >
            {type === 'income' ? (
              <IconArrowDownLeft className="size-7" />
            ) : (
              <IconArrowUpRight className="size-7" />
            )}
          </div>
          <div className="flex flex-col" style={{ gap: 'var(--space-4)' }}>
            <h1 className="text-heading-medium font-bold text-secondary-darker">
              Nova transação
            </h1>
            <p className="text-paragraph-small text-surface-700">
              Registre entradas e saídas para manter seu controle financeiro em dia.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleClose}
          className="flex size-12 items-center justify-center rounded-full text-secondary-normal transition-colors hover:bg-neutral-300/40"
          aria-label="Fechar modal"
        >
          <IconX className="size-5" />
        </button>
      </header>

      {/* Conteúdo scrollável */}
      <main className="relative z-0 flex-1 overflow-y-auto bg-background-400">
        <form
          onSubmit={handleSubmit}
          className="mx-auto flex w-full max-w-[680px] flex-col px-4 py-[var(--space-32)]"
          style={{ gap: 'var(--space-24)' }}
        >
          {/* Toggle tipo */}
          <section className="rounded-pill bg-neutral-300/40 p-1">
            <div className="flex" style={{ gap: 'var(--space-4)' }}>
              <button
                type="button"
                onClick={() => handleTypeChange('income')}
                className={`flex-1 rounded-pill px-4 py-3 text-center text-label-medium transition-colors ${
                  type === 'income'
                    ? 'bg-surface-50 text-secondary-darker shadow-sm'
                    : 'text-surface-700'
                }`}
              >
                Receita
              </button>
              <button
                type="button"
                onClick={() => handleTypeChange('expense')}
                className={`flex-1 rounded-pill px-4 py-3 text-center text-label-medium transition-colors ${
                  type === 'expense'
                    ? 'bg-surface-50 text-secondary-darker shadow-sm'
                    : 'text-surface-700'
                }`}
              >
                Despesa
              </button>
            </div>
          </section>

          {/* Valor */}
          <section className="flex flex-col" style={{ gap: 'var(--space-8)' }}>
            <label className="text-label-small font-semibold text-secondary-darker">
              Valor da Transação
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-label-medium text-surface-700">
                R$
              </span>
              <input
                type="text"
                inputMode="decimal"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className={`h-14 w-full rounded-card border bg-surface-50 pl-12 pr-4 text-label-medium text-secondary-darker outline-none transition-colors ${
                  errors.amount ? 'border-red-600' : 'border-neutral-300 focus:border-neutral-900'
                }`}
                placeholder="0,00"
              />
            </div>
            {errors.amount && (
              <p className="text-label-xsmall text-red-600">{errors.amount}</p>
            )}
          </section>

          {/* Descrição */}
          <section className="flex flex-col" style={{ gap: 'var(--space-8)' }}>
            <label className="text-label-small font-semibold text-secondary-darker">
              Descrição
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`h-14 w-full rounded-card border bg-surface-50 px-4 text-label-medium text-secondary-darker outline-none transition-colors ${
                errors.description
                  ? 'border-red-600'
                  : 'border-neutral-300 focus:border-neutral-900'
              }`}
              placeholder="Ex: Supermercado semanal"
            />
            {errors.description && (
              <p className="text-label-xsmall text-red-600">{errors.description}</p>
            )}
          </section>

          {/* Categoria com nova categoria inline */}
          <section className="flex flex-col" style={{ gap: 'var(--space-8)' }}>
            <label className="text-label-small font-semibold text-secondary-darker">
              Categoria
            </label>
            {!isAddingCategory && (
              <div className="flex items-center" style={{ gap: 'var(--space-8)' }}>
                <select
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                    setCustomCategory('');
                    setErrors((prev) => ({ ...prev, category: undefined }));
                  }}
                  className={`h-14 flex-1 rounded-card border bg-surface-50 px-4 text-label-medium text-secondary-darker outline-none transition-colors ${
                    errors.category
                      ? 'border-red-600'
                      : 'border-neutral-300 focus:border-neutral-900'
                  }`}
                >
                  <option value="">Selecione uma categoria</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingCategory(true);
                    setCategory('');
                    setErrors((prev) => ({ ...prev, category: undefined }));
                  }}
                  className="h-14 rounded-card border border-neutral-300 bg-surface-50 px-4 text-label-small font-semibold text-secondary-darker transition-colors hover:bg-neutral-300/30"
                >
                  + Nova
                </button>
              </div>
            )}
            {isAddingCategory && (
              <div className="flex items-center" style={{ gap: 'var(--space-8)' }}>
                <input
                  type="text"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  className={`h-14 flex-1 rounded-card border bg-surface-50 px-4 text-label-medium text-secondary-darker outline-none transition-colors ${
                    errors.category
                      ? 'border-red-600'
                      : 'border-neutral-300 focus:border-neutral-900'
                  }`}
                  placeholder="Nome da categoria"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (!customCategory.trim()) {
                      setErrors((prev) => ({
                        ...prev,
                        category: 'Informe um nome para a categoria.',
                      }));
                      return;
                    }
                    setCategory(customCategory.trim());
                    setIsAddingCategory(false);
                    setErrors((prev) => ({ ...prev, category: undefined }));
                  }}
                  className="flex h-14 items-center rounded-card bg-neutral-900 px-4 text-label-small font-semibold text-neutral-0"
                >
                  <IconCheck className="mr-1 size-4" />
                  Salvar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingCategory(false);
                    setCustomCategory('');
                  }}
                  className="h-14 rounded-card border border-neutral-300 bg-surface-50 px-4 text-label-small text-surface-700 transition-colors hover:bg-neutral-300/30"
                >
                  Cancelar
                </button>
              </div>
            )}
            {errors.category && (
              <p className="text-label-xsmall text-red-600">{errors.category}</p>
            )}
          </section>

          {/* Grid membro / conta */}
          <section className="grid grid-cols-1 gap-[var(--space-16)] md:grid-cols-2">
            {/* Membro */}
            <div className="flex flex-col" style={{ gap: 'var(--space-8)' }}>
              <label className="text-label-small font-semibold text-secondary-darker">
                Membro
              </label>
              <select
                value={memberId ?? ''}
                onChange={(e) => {
                  const v = e.target.value;
                  setMemberId(v === '' ? null : v);
                }}
                className="h-14 w-full rounded-card border border-neutral-300 bg-surface-50 px-4 text-label-medium text-secondary-darker outline-none focus:border-neutral-900"
              >
                {memberOptions.map((opt) => (
                  <option key={opt.id ?? 'null'} value={opt.id ?? ''}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Conta / Cartão */}
            <div className="flex flex-col" style={{ gap: 'var(--space-8)' }}>
              <label className="text-label-small font-semibold text-secondary-darker">
                Conta / Cartão
              </label>
              <select
                value={accountId ?? ''}
                onChange={(e) => {
                  setAccountId(e.target.value || null);
                  setErrors((prev) => ({ ...prev, account: undefined }));
                }}
                className={`h-14 w-full rounded-card border bg-surface-50 px-4 text-label-medium text-secondary-darker outline-none transition-colors ${
                  errors.account
                    ? 'border-red-600'
                    : 'border-neutral-300 focus:border-neutral-900'
                }`}
              >
                <option value="">Selecione</option>
                {accountOptions.bank.length > 0 && (
                  <optgroup label="Contas bancárias">
                    {accountOptions.bank.map((acc: BankAccount) => (
                      <option key={acc.id} value={acc.id}>
                        {acc.name}
                      </option>
                    ))}
                  </optgroup>
                )}
                {accountOptions.cards.length > 0 && (
                  <optgroup label="Cartões de crédito">
                    {accountOptions.cards.map((card: CreditCard) => (
                      <option key={card.id} value={card.id}>
                        {card.name}
                      </option>
                    ))}
                  </optgroup>
                )}
              </select>
              {errors.account && (
                <p className="text-label-xsmall text-red-600">{errors.account}</p>
              )}
            </div>
          </section>

          {/* Parcelamento condicional */}
          {showInstallments && (
            <section className="flex flex-col" style={{ gap: 'var(--space-8)' }}>
              <label className="text-label-small font-semibold text-secondary-darker">
                Parcelamento
              </label>
              <select
                value={installments}
                onChange={(e) => {
                  const v = Number(e.target.value) || 1;
                  setInstallments(v);
                  if (v > 1) {
                    setIsRecurring(false);
                  }
                }}
                disabled={showRecurring && isRecurring}
                className="h-14 w-full rounded-card border border-neutral-300 bg-surface-50 px-4 text-label-medium text-secondary-darker outline-none focus:border-neutral-900 disabled:bg-neutral-300/40"
              >
                <option value={1}>À vista (1x)</option>
                {Array.from({ length: 11 }, (_, i) => i + 2).map((n) => (
                  <option key={n} value={n}>
                    {n}x
                  </option>
                ))}
              </select>
              {showRecurring && isRecurring && (
                <p className="text-label-xsmall italic text-surface-700">
                  Parcelamento desabilitado para despesas recorrentes.
                </p>
              )}
            </section>
          )}

          {/* Despesa recorrente condicional */}
          {showRecurring && (
            <section className="rounded-card border border-blue-600/30 bg-blue-600/5 p-4">
              <label className="flex cursor-pointer items-start" style={{ gap: 'var(--space-8)' }}>
                <input
                  type="checkbox"
                  checked={isRecurring}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    if (installments > 1 && checked) {
                      setInstallments(1);
                    }
                    setIsRecurring(checked);
                  }}
                  disabled={installments > 1}
                  className="mt-1 h-4 w-4 rounded border-neutral-300 text-neutral-900 accent-neutral-900 disabled:opacity-50"
                />
                <div className="flex flex-col" style={{ gap: 'var(--space-4)' }}>
                  <span className="text-label-small font-semibold text-secondary-darker">
                    Despesa recorrente
                  </span>
                  <span className="text-paragraph-small text-surface-700">
                    {installments > 1
                      ? 'Não disponível para compras parceladas.'
                      : 'Ative para repetir automaticamente esta despesa nos próximos meses.'}
                  </span>
                </div>
              </label>
            </section>
          )}

          {/* Preview simples de valor / tipo */}
          <section className="mt-2 flex items-center justify-between">
            <span className="text-label-small text-surface-700">
              {type === 'income' ? 'Esta transação será registrada como receita.' : 'Esta transação será registrada como despesa.'}
            </span>
            {amount && (
              <span className="text-label-small font-semibold text-secondary-darker">
                {formatCurrency(
                  Number(amount.replace(/\./g, '').replace(',', '.')) || 0
                )}
              </span>
            )}
          </section>
        </form>
      </main>

      {/* Footer */}
      <footer className="flex items-center justify-end border-t border-neutral-300 bg-surface-50 px-[var(--space-32)] py-[var(--space-16)]">
        <div className="flex items-center" style={{ gap: 'var(--space-8)' }}>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-pill border border-neutral-300 bg-surface-50 px-6 py-2 text-label-medium text-secondary-darker transition-colors hover:bg-neutral-300/40"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={(e) => handleSubmit(e as unknown as React.FormEvent)}
            disabled={isSubmitting}
            className="rounded-pill bg-neutral-900 px-8 py-2 text-label-medium font-semibold text-neutral-0 transition-colors hover:bg-neutral-900/90 disabled:cursor-default disabled:opacity-60"
          >
            Salvar transação
          </button>
        </div>
      </footer>
    </div>
  );
}
