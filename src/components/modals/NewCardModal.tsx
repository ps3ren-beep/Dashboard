import { useState, useCallback } from 'react';
import { useFinance } from '@/contexts';
import { IconX } from '@/components/icons/SidebarIcons';
import type { CreditCardTheme } from '@/types';

interface NewCardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Mode = 'account' | 'card';

interface CardErrors {
  name?: string;
  holder?: string;
  initialBalance?: string;
  closingDay?: string;
  dueDay?: string;
  limit?: string;
  theme?: string;
}

export function NewCardModal({ isOpen, onClose }: NewCardModalProps) {
  const { familyMembers, addBankAccount, addCreditCard } = useFinance();

  const [mode, setMode] = useState<Mode>('account');
  const [name, setName] = useState('');
  const [holderId, setHolderId] = useState<string>('');

  const [initialBalance, setInitialBalance] = useState('');
  const [closingDay, setClosingDay] = useState('');
  const [dueDay, setDueDay] = useState('');
  const [limitValue, setLimitValue] = useState('');
  const [lastDigits, setLastDigits] = useState('');
  const [theme, setTheme] = useState<CreditCardTheme | null>(null);

  const [errors, setErrors] = useState<CardErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetState = useCallback(() => {
    setMode('account');
    setName('');
    setHolderId('');
    setInitialBalance('');
    setClosingDay('');
    setDueDay('');
    setLimitValue('');
    setLastDigits('');
    setTheme(null);
    setErrors({});
    setIsSubmitting(false);
  }, []);

  const handleClose = useCallback(() => {
    resetState();
    onClose();
  }, [onClose, resetState]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (isSubmitting) return;

      const next: CardErrors = {};
      if (!name.trim() || name.trim().length < 3) {
        next.name = 'Informe um nome com pelo menos 3 caracteres.';
      }
      if (!holderId) {
        next.holder = 'Selecione um titular.';
      }

      if (mode === 'account') {
        const value = Number(
          initialBalance.replace(/\./g, '').replace(',', '.').trim() || '0'
        );
        if (Number.isNaN(value)) {
          next.initialBalance = 'Saldo inicial inválido.';
        }
      } else {
        const closing = Number(closingDay);
        const due = Number(dueDay);
        const limitNumber = Number(
          limitValue.replace(/\./g, '').replace(',', '.').trim() || '0'
        );
        if (!closing || closing < 1 || closing > 31) {
          next.closingDay = 'Informe um dia entre 1 e 31.';
        }
        if (!due || due < 1 || due > 31) {
          next.dueDay = 'Informe um dia entre 1 e 31.';
        }
        if (!limitNumber || limitNumber <= 0 || Number.isNaN(limitNumber)) {
          next.limit = 'Informe um limite maior que zero.';
        }
        if (!theme) {
          next.theme = 'Selecione um tema visual.';
        }
        if (lastDigits && lastDigits.replace(/\D/g, '').length !== 4) {
          next.limit = next.limit ?? 'Últimos 4 dígitos devem conter exatamente 4 números.';
        }
      }

      setErrors(next);
      if (Object.keys(next).length > 0) return;

      setIsSubmitting(true);

      if (mode === 'account') {
        const balance = Number(
          initialBalance.replace(/\./g, '').replace(',', '.').trim() || '0'
        );
        addBankAccount({
          name: name.trim(),
          holderId,
          balance: Number.isNaN(balance) ? 0 : balance,
        });
      } else if (theme) {
        const limitNumber = Number(
          limitValue.replace(/\./g, '').replace(',', '.').trim() || '0'
        );
        addCreditCard({
          name: name.trim(),
          holderId,
          limit: limitNumber,
          currentBill: 0,
          closingDay: Number(closingDay),
          dueDay: Number(dueDay),
          theme,
          lastDigits: lastDigits ? lastDigits.replace(/\D/g, '').slice(-4) : undefined,
        });
      }

      setIsSubmitting(false);
      handleClose();
    },
    [
      addBankAccount,
      addCreditCard,
      closingDay,
      dueDay,
      handleClose,
      holderId,
      initialBalance,
      isSubmitting,
      lastDigits,
      limitValue,
      mode,
      name,
      theme,
    ]
  );

  if (!isOpen) return null;

  return (
    <>
      <div
        role="presentation"
        aria-hidden
        onClick={handleClose}
        className="fixed inset-0 z-40 bg-secondary-darker/50"
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        <section
          className="flex w-full max-w-[600px] flex-col rounded-card border border-neutral-300 bg-surface-50 shadow-lg"
          style={{ maxHeight: '90vh', animation: 'slideDown 0.25s ease-out' }}
        >
          {/* Header */}
          <header className="flex items-center justify-between border-b border-neutral-300 px-[var(--space-32)] py-[var(--space-24)]">
            <h2 className="text-label-large font-semibold text-secondary-darker">
              Adicionar Conta/Cartão
            </h2>
            <button
              type="button"
              onClick={handleClose}
              className="flex size-10 items-center justify-center rounded-full text-secondary-normal transition-colors hover:bg-neutral-300/40"
              aria-label="Fechar modal"
            >
              <IconX className="size-5" />
            </button>
          </header>

          {/* Conteúdo */}
          <form
            onSubmit={handleSubmit}
            className="flex-1 overflow-y-auto px-[var(--space-32)] py-[var(--space-24)]"
          >
            <div className="flex flex-col" style={{ gap: 'var(--space-16)' }}>
              {/* Toggle tipo */}
              <div className="flex rounded-pill border border-neutral-300 bg-surface-50 p-1">
                <button
                  type="button"
                  onClick={() => {
                    setMode('account');
                    setErrors({});
                  }}
                  className={`flex-1 rounded-pill px-4 py-2 text-center text-label-small transition-colors ${
                    mode === 'account'
                      ? 'bg-neutral-900 text-neutral-0'
                      : 'text-surface-700'
                  }`}
                >
                  Conta bancária
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode('card');
                    setErrors({});
                  }}
                  className={`flex-1 rounded-pill px-4 py-2 text-center text-label-small transition-colors ${
                    mode === 'card'
                      ? 'bg-neutral-900 text-neutral-0'
                      : 'text-surface-700'
                  }`}
                >
                  Cartão de crédito
                </button>
              </div>

              {/* Nome */}
              <div className="flex flex-col" style={{ gap: 'var(--space-8)' }}>
                <label className="text-label-small font-semibold text-secondary-darker">
                  {mode === 'account' ? 'Nome da Conta' : 'Nome do Cartão'}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`h-14 w-full rounded-card border bg-surface-50 px-4 text-label-medium text-secondary-darker outline-none transition-colors ${
                    errors.name
                      ? 'border-red-600'
                      : 'border-neutral-300 focus:border-neutral-900'
                  }`}
                  placeholder={
                    mode === 'account' ? 'Ex: Conta corrente Nubank' : 'Ex: Nubank Mastercard'
                  }
                />
                {errors.name && (
                  <p className="text-label-xsmall text-red-600">{errors.name}</p>
                )}
              </div>

              {/* Titular */}
              <div className="flex flex-col" style={{ gap: 'var(--space-8)' }}>
                <label className="text-label-small font-semibold text-secondary-darker">
                  Titular
                </label>
                <select
                  value={holderId}
                  onChange={(e) => setHolderId(e.target.value)}
                  className={`h-14 w-full rounded-card border bg-surface-50 px-4 text-label-medium text-secondary-darker outline-none transition-colors ${
                    errors.holder
                      ? 'border-red-600'
                      : 'border-neutral-300 focus:border-neutral-900'
                  }`}
                >
                  <option value="">Selecione um membro</option>
                  {familyMembers.map((member) => (
                    <option key={member.id} value={member.id}>
                      {member.name}
                    </option>
                  ))}
                </select>
                {errors.holder && (
                  <p className="text-label-xsmall text-red-600">{errors.holder}</p>
                )}
              </div>

              {/* Campos condicionais */}
              {mode === 'account' ? (
                <div className="flex flex-col" style={{ gap: 'var(--space-8)' }}>
                  <label className="text-label-small font-semibold text-secondary-darker">
                    Saldo Inicial
                  </label>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-label-medium text-surface-700">
                      R$
                    </span>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={initialBalance}
                      onChange={(e) => setInitialBalance(e.target.value)}
                      className={`h-14 w-full rounded-card border bg-surface-50 pl-12 pr-4 text-label-medium text-secondary-darker outline-none transition-colors ${
                        errors.initialBalance
                          ? 'border-red-600'
                          : 'border-neutral-300 focus:border-neutral-900'
                      }`}
                      placeholder="0,00"
                    />
                  </div>
                  {errors.initialBalance && (
                    <p className="text-label-xsmall text-red-600">
                      {errors.initialBalance}
                    </p>
                  )}
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 gap-[var(--space-16)] md:grid-cols-2">
                    <div className="flex flex-col" style={{ gap: 'var(--space-8)' }}>
                      <label className="text-label-small font-semibold text-secondary-darker">
                        Dia de Fechamento
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={31}
                        value={closingDay}
                        onChange={(e) => setClosingDay(e.target.value)}
                        className={`h-14 w-full rounded-card border bg-surface-50 px-4 text-label-medium text-secondary-darker outline-none transition-colors ${
                          errors.closingDay
                            ? 'border-red-600'
                            : 'border-neutral-300 focus:border-neutral-900'
                        }`}
                        placeholder="1 a 31"
                      />
                      {errors.closingDay && (
                        <p className="text-label-xsmall text-red-600">
                          {errors.closingDay}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col" style={{ gap: 'var(--space-8)' }}>
                      <label className="text-label-small font-semibold text-secondary-darker">
                        Dia de Vencimento
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={31}
                        value={dueDay}
                        onChange={(e) => setDueDay(e.target.value)}
                        className={`h-14 w-full rounded-card border bg-surface-50 px-4 text-label-medium text-secondary-darker outline-none transition-colors ${
                          errors.dueDay
                            ? 'border-red-600'
                            : 'border-neutral-300 focus:border-neutral-900'
                        }`}
                        placeholder="1 a 31"
                      />
                      {errors.dueDay && (
                        <p className="text-label-xsmall text-red-600">{errors.dueDay}</p>
                      )}
                    </div>
                  </div>

                  {/* Limite total */}
                  <div className="flex flex-col" style={{ gap: 'var(--space-8)' }}>
                    <label className="text-label-small font-semibold text-secondary-darker">
                      Limite Total
                    </label>
                    <div className="relative">
                      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-label-medium text-surface-700">
                        R$
                      </span>
                      <input
                        type="text"
                        inputMode="decimal"
                        value={limitValue}
                        onChange={(e) => setLimitValue(e.target.value)}
                        className={`h-14 w-full rounded-card border bg-surface-50 pl-12 pr-4 text-label-medium text-secondary-darker outline-none transition-colors ${
                          errors.limit
                            ? 'border-red-600'
                            : 'border-neutral-300 focus:border-neutral-900'
                        }`}
                        placeholder="0,00"
                      />
                    </div>
                    {errors.limit && (
                      <p className="text-label-xsmall text-red-600">{errors.limit}</p>
                    )}
                  </div>

                  {/* Últimos 4 dígitos */}
                  <div className="flex flex-col" style={{ gap: 'var(--space-8)' }}>
                    <label className="text-label-small font-semibold text-secondary-darker">
                      Últimos 4 Dígitos (opcional)
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={4}
                      value={lastDigits}
                      onChange={(e) =>
                        setLastDigits(e.target.value.replace(/\D/g, '').slice(0, 4))
                      }
                      className="h-14 w-full rounded-card border border-neutral-300 bg-surface-50 px-4 text-label-medium text-secondary-darker outline-none focus:border-neutral-900"
                      placeholder="1234"
                    />
                  </div>

                  {/* Tema visual */}
                  <div className="flex flex-col" style={{ gap: 'var(--space-8)' }}>
                    <label className="text-label-small font-semibold text-secondary-darker">
                      Tema Visual
                    </label>
                    <div className="grid grid-cols-3 gap-[var(--space-8)]">
                      {(['black', 'lime', 'white'] as CreditCardTheme[]).map((t) => {
                        const isActive = theme === t;
                        const baseClasses =
                          'flex h-16 flex-col items-center justify-center rounded-card border text-label-small font-semibold transition-colors';
                        const themeStyles: Record<CreditCardTheme, string> = {
                          black: 'bg-neutral-900 text-neutral-0',
                          lime: 'bg-lime text-neutral-900',
                          white: 'bg-surface-50 text-secondary-darker',
                        };
                        return (
                          <button
                            key={t}
                            type="button"
                            onClick={() => setTheme(t)}
                            className={`${baseClasses} ${
                              isActive
                                ? 'border-blue-600 ring-2 ring-blue-600/40'
                                : 'border-neutral-300'
                            } ${themeStyles[t]}`}
                          >
                            {t === 'black' && 'Black'}
                            {t === 'lime' && 'Lime'}
                            {t === 'white' && 'White'}
                          </button>
                        );
                      })}
                    </div>
                    {errors.theme && (
                      <p className="text-label-xsmall text-red-600">{errors.theme}</p>
                    )}
                  </div>
                </>
              )}
            </div>
          </form>

          {/* Footer */}
          <footer className="flex items-center justify-end gap-3 border-t border-neutral-300 bg-surface-50 px-[var(--space-32)] py-[var(--space-16)]">
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
              Adicionar
            </button>
          </footer>
        </section>
      </div>
    </>
  );
}
