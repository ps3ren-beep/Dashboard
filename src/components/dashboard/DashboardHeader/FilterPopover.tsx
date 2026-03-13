import { useFinance } from '@/contexts';
import type { TransactionTypeFilter } from '@/contexts';

const OPTIONS: { value: TransactionTypeFilter; label: string }[] = [
  { value: 'all', label: 'Todos' },
  { value: 'income', label: 'Receitas' },
  { value: 'expense', label: 'Despesas' },
];

interface FilterPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  anchorRef: React.RefObject<HTMLButtonElement | null>;
  /** No desktop: popover. No mobile: só o conteúdo para ir dentro do modal */
  variant?: 'popover' | 'inline';
}

export function FilterPopover({
  isOpen,
  onClose,
  anchorRef: _anchorRef,
  variant = 'popover',
}: FilterPopoverProps) {
  const { transactionType, setTransactionType } = useFinance();

  const content = (
    <div
      className={`min-w-[200px] rounded-card border border-neutral-300 bg-surface-50/95 py-2 shadow-lg backdrop-blur-md ${
        variant === 'popover' ? 'mt-2' : ''
      }`}
      style={{ padding: 'var(--space-12)' }}
    >
      <p className="mb-2 text-label-small font-semibold text-secondary-darker">
        Tipo de Transação
      </p>
      <div className="flex flex-col" style={{ gap: 'var(--space-4)' }}>
        {OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => {
              setTransactionType(opt.value);
              onClose();
            }}
            className={`rounded-pill px-[var(--space-16)] py-[var(--space-8)] text-left text-label-medium transition-colors ${
              transactionType === opt.value
                ? 'bg-neutral-900 text-neutral-0 font-semibold'
                : 'text-secondary-normal hover:bg-neutral-300/30'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );

  if (!isOpen) return null;

  if (variant === 'inline') {
    return content;
  }

  return (
    <>
      <div
        role="presentation"
        aria-hidden
        onClick={onClose}
        className="fixed inset-0 z-40"
      />
      <div className="absolute left-0 top-full z-50">{content}</div>
    </>
  );
}
