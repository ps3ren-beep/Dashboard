import { useState } from 'react';
import { useFinance } from '@/contexts';
import type { CreditCard, CreditCardTheme } from '@/types';
import { formatCurrency } from '@/utils/format';
import { PageContainer } from '@/components/layout/PageContainer';
import { IconCreditCard, IconPlus } from '@/components/icons/SidebarIcons';
import { NewCardModal } from '@/components/modals/NewCardModal';
import { CardDetailsModal } from '@/components/modals/CardDetailsModal';

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

interface CardTileProps {
  card: CreditCard;
  onClick: () => void;
}

function CardTile({ card, onClick }: CardTileProps) {
  const usagePercent = card.limit > 0 ? Math.round((card.currentBill / card.limit) * 100) : 0;
  const styles = getThemeStyles(card.theme);
  const hasBorder = card.theme === 'white';

  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full items-center gap-4 rounded-card border border-neutral-300 bg-surface-50 p-[var(--space-16)] text-left shadow-sm transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-md hover:shadow-neutral-300/30"
      style={{ minHeight: 74 }}
    >
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
      <div className="min-w-0 flex-1">
        <p className="text-label-small text-surface-700">{card.name}</p>
        <p className="text-heading-small font-bold text-secondary-darker">
          {formatCurrency(card.currentBill)}
        </p>
        <p className="text-label-xsmall text-surface-700">
          Vence dia {card.dueDay} · •••• {card.lastDigits ?? '****'}
        </p>
      </div>
      <div
        className="shrink-0 rounded-pill px-3 py-1.5 text-label-xsmall font-semibold"
        style={{ backgroundColor: styles.badgeBg, color: styles.badgeText }}
      >
        {usagePercent}%
      </div>
    </button>
  );
}

export function CartoesPage() {
  const { creditCards } = useFinance();
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [detailsCard, setDetailsCard] = useState<CreditCard | null>(null);

  return (
    <PageContainer>
      <div className="flex w-full max-w-[1400px] flex-col gap-6 lg:max-w-[1600px]">
        <header className="flex min-w-0 flex-wrap items-center justify-between gap-4">
          <h1 className="text-heading-large font-bold text-secondary-darker">
            Cartões
          </h1>
          <button
            type="button"
            onClick={() => setIsNewModalOpen(true)}
            className="flex min-h-[44px] min-w-[44px] items-center justify-center gap-2 rounded-pill bg-neutral-900 px-5 py-2.5 text-label-medium font-semibold text-neutral-0 transition-opacity hover:opacity-90"
          >
            <IconPlus className="size-5" />
            Novo Cartão
          </button>
        </header>

        {creditCards.length === 0 ? (
          <section className="flex flex-col items-center justify-center rounded-card border border-neutral-300 bg-surface-50 px-6 py-16 text-center">
            <div className="flex size-16 items-center justify-center rounded-full bg-neutral-300/50 text-secondary-normal">
              <IconCreditCard className="size-8" />
            </div>
            <h2 className="mt-4 text-label-large font-semibold text-secondary-darker">
              Nenhum cartão cadastrado
            </h2>
            <p className="mt-2 max-w-sm text-paragraph-small text-surface-700">
              Adicione um cartão de crédito ou conta bancária para acompanhar faturas e limites.
            </p>
            <button
              type="button"
              onClick={() => setIsNewModalOpen(true)}
              className="mt-6 flex min-h-[48px] items-center justify-center gap-2 rounded-pill bg-neutral-900 px-6 py-3 text-label-medium font-semibold text-neutral-0 transition-opacity hover:opacity-90"
            >
              <IconPlus className="size-5" />
              Novo Cartão
            </button>
          </section>
        ) : (
          <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {creditCards.map((card) => (
              <CardTile
                key={card.id}
                card={card}
                onClick={() => setDetailsCard(card)}
              />
            ))}
          </div>
        )}
      </div>

      <NewCardModal isOpen={isNewModalOpen} onClose={() => setIsNewModalOpen(false)} />
      <CardDetailsModal
        isOpen={detailsCard != null}
        onClose={() => setDetailsCard(null)}
        card={detailsCard}
      />
    </PageContainer>
  );
}
