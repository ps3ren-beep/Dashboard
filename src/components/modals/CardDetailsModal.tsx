import type { CreditCard } from '@/types';
import { formatCurrency } from '@/utils/format';
import { IconX } from '@/components/icons/SidebarIcons';

interface CardDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  card: CreditCard | null;
}

/**
 * Modal de detalhes do cartão de crédito.
 * Conteúdo completo será implementado no PROMPT 15.
 */
export function CardDetailsModal({ isOpen, onClose, card }: CardDetailsModalProps) {
  if (!isOpen || !card) return null;

  return (
    <>
      <div
        role="presentation"
        aria-hidden
        onClick={onClose}
        className="fixed inset-0 z-40 bg-secondary-darker/50"
      />
      <div
        className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-card border border-neutral-300 bg-surface-50 p-[var(--space-32)] shadow-lg"
        style={{ animation: 'slideDown 0.25s ease-out' }}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-label-large font-semibold text-secondary-darker">
            {card.name}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-secondary-normal transition-colors hover:bg-neutral-300/50"
            aria-label="Fechar"
          >
            <IconX className="size-5" />
          </button>
        </div>
        <div className="mt-6 space-y-2 text-paragraph-small text-secondary-darker">
          <p>Fatura atual: {formatCurrency(card.currentBill)}</p>
          <p>Limite: {formatCurrency(card.limit)}</p>
          <p>Vence dia {card.dueDay}</p>
          {card.lastDigits && (
            <p>Final •••• {card.lastDigits}</p>
          )}
        </div>
      </div>
    </>
  );
}
