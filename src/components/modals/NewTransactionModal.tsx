import { IconX } from '@/components/icons/SidebarIcons';

interface NewTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Modal para adicionar nova transação.
 * Conteúdo completo será implementado no PROMPT 12.
 */
export function NewTransactionModal({ isOpen, onClose }: NewTransactionModalProps) {
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
        className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-card border border-neutral-300 bg-surface-50 p-[var(--space-32)] shadow-lg"
        style={{ animation: 'slideDown 0.25s ease-out' }}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-label-large font-semibold text-secondary-darker">
            Nova transação
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
        <p className="mt-4 text-paragraph-small text-surface-700">
          Formulário em breve (PROMPT 12).
        </p>
      </div>
    </>
  );
}
