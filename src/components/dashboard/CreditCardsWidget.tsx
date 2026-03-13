import { useState, useCallback, useRef } from 'react';
import { useFinance } from '@/contexts';
import type { CreditCard, CreditCardTheme } from '@/types';
import { formatCurrency } from '@/utils/format';
import { IconCreditCard, IconPlus, IconChevronLeft, IconChevronRight } from '@/components/icons/SidebarIcons';
import { NewCardModal } from '@/components/modals/NewCardModal';
import { CardDetailsModal } from '@/components/modals/CardDetailsModal';

const CARDS_PER_PAGE = 3;

function getThemeStyles(theme: CreditCardTheme) {
  switch (theme) {
    case 'black':
      return {
        bg: 'var(--color-neutral-900)',
        iconColor: 'var(--color-neutral-0)',
        badgeBg: 'var(--color-neutral-900)',
        badgeText: 'var(--color-neutral-0)',
      };
    case 'lime':
      return {
        bg: 'var(--color-lime)',
        iconColor: 'var(--color-neutral-900)',
        badgeBg: 'var(--color-lime)',
        badgeText: 'var(--color-neutral-900)',
      };
    case 'white':
      return {
        bg: 'var(--color-surface-50)',
        iconColor: 'var(--color-neutral-900)',
        badgeBg: 'var(--color-neutral-300)',
        badgeText: 'var(--color-neutral-900)',
      };
  }
}

interface CreditCardItemProps {
  card: CreditCard;
  onClick: () => void;
}

function CreditCardItem({ card, onClick }: CreditCardItemProps) {
  const usagePercent = Math.round((card.currentBill / card.limit) * 100);
  const styles = getThemeStyles(card.theme);
  const hasBorder = card.theme === 'white';

  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full items-center gap-4 rounded-card border border-neutral-300 bg-surface-50 p-[var(--space-16)] text-left shadow-sm transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-md hover:shadow-neutral-300/30 md:hover:-translate-y-2"
      style={{ minHeight: 74 }}
    >
      {/* Zona esquerda: bloco visual com cor do tema */}
      <div
        className="flex size-12 shrink-0 items-center justify-center rounded-[var(--space-4)]"
        style={{
          backgroundColor: styles.bg,
          border: hasBorder ? '1px solid var(--color-neutral-300)' : undefined,
          color: styles.iconColor,
        }}
      >
        <IconCreditCard className="size-6" />
      </div>

      {/* Zona central: nome, valor, vencimento e número mascarado */}
      <div className="min-w-0 flex-1">
        <p className="text-label-small text-surface-700">{card.name}</p>
        <p className="text-heading-small font-bold text-secondary-darker">
          {formatCurrency(card.currentBill)}
        </p>
        <p className="text-label-xsmall text-surface-700">
          Vence dia {card.dueDay} · •••• {card.lastDigits ?? '****'}
        </p>
      </div>

      {/* Zona direita: badge de percentual de uso */}
      <div
        className="shrink-0 rounded-pill px-3 py-1.5 text-label-xsmall font-semibold"
        style={{
          backgroundColor: styles.badgeBg,
          color: styles.badgeText,
        }}
      >
        {usagePercent}%
      </div>
    </button>
  );
}

export function CreditCardsWidget() {
  const { creditCards, selectedMember } = useFinance();
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [detailsCard, setDetailsCard] = useState<CreditCard | null>(null);
  const [page, setPage] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const filteredCards =
    selectedMember != null
      ? creditCards.filter((c) => c.holderId === selectedMember)
      : creditCards;

  const totalPages = Math.max(1, Math.ceil(filteredCards.length / CARDS_PER_PAGE));
  const paginatedCards = filteredCards.slice(
    page * CARDS_PER_PAGE,
    page * CARDS_PER_PAGE + CARDS_PER_PAGE
  );

  const handleSwipeStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);

  const handleSwipeEnd = useCallback((e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0 && page < totalPages - 1) setPage((p) => p + 1);
      else if (diff < 0 && page > 0) setPage((p) => p - 1);
    }
  }, [page, totalPages]);

  if (filteredCards.length === 0) {
    return (
      <section
        className="rounded-card border border-neutral-300 p-[var(--space-32)]"
        style={{ backgroundColor: 'rgba(229, 231, 235, 0.4)' }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center" style={{ gap: 'var(--space-8)' }}>
            <IconCreditCard className="size-5 text-secondary-normal" />
            <h2 className="text-label-large font-semibold text-secondary-normal">
              Cartões
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setIsNewModalOpen(true)}
            className="flex size-8 items-center justify-center rounded-full border border-neutral-300 bg-surface-50 text-secondary-darker transition-colors hover:bg-neutral-300/50 md:size-[32px]"
            aria-label="Novo cartão"
          >
            <IconPlus className="size-4" />
          </button>
        </div>
        <p className="mt-6 text-paragraph-small text-surface-700">
          Nenhum cartão cadastrado.
        </p>
        <NewCardModal isOpen={isNewModalOpen} onClose={() => setIsNewModalOpen(false)} />
      </section>
    );
  }

  return (
    <section
      className="rounded-card border border-neutral-300 p-[var(--space-32)]"
      style={{ backgroundColor: 'rgba(229, 231, 235, 0.4)' }}
    >
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center" style={{ gap: 'var(--space-8)' }}>
          <IconCreditCard className="size-5 text-secondary-normal" />
          <h2 className="text-label-large font-semibold text-secondary-normal">
            Cartões
          </h2>
        </div>
        <button
          type="button"
          onClick={() => setIsNewModalOpen(true)}
          className="flex size-8 items-center justify-center rounded-full border border-neutral-300 bg-surface-50 text-secondary-darker transition-colors hover:bg-neutral-300/50 md:size-[32px]"
          aria-label="Novo cartão"
        >
          <IconPlus className="size-4" />
        </button>
      </div>

      {/* Lista de cartões */}
      <div
        ref={scrollRef}
        className="flex flex-col"
        style={{ gap: 'var(--space-16)' }}
        onTouchStart={handleSwipeStart}
        onTouchEnd={handleSwipeEnd}
      >
        {paginatedCards.map((card) => (
          <CreditCardItem
            key={card.id}
            card={card}
            onClick={() => setDetailsCard(card)}
          />
        ))}
      </div>

      {/* Paginação */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center" style={{ gap: 'var(--space-8)' }}>
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="flex size-8 items-center justify-center rounded-full border border-neutral-300 bg-surface-50 text-secondary-darker transition-colors hover:bg-neutral-300/50 disabled:opacity-40 disabled:hover:bg-surface-50"
            aria-label="Página anterior"
          >
            <IconChevronLeft className="size-4" />
          </button>
          <span className="text-label-small text-surface-700">
            {page + 1} / {totalPages}
          </span>
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className="flex size-8 items-center justify-center rounded-full border border-neutral-300 bg-surface-50 text-secondary-darker transition-colors hover:bg-neutral-300/50 disabled:opacity-40 disabled:hover:bg-surface-50"
            aria-label="Próxima página"
          >
            <IconChevronRight className="size-4" />
          </button>
        </div>
      )}

      <NewCardModal isOpen={isNewModalOpen} onClose={() => setIsNewModalOpen(false)} />
      <CardDetailsModal
        isOpen={detailsCard != null}
        onClose={() => setDetailsCard(null)}
        card={detailsCard}
      />
    </section>
  );
}
