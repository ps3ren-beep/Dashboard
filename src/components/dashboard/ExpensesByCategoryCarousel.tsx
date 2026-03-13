import { useRef, useState, useCallback } from 'react';
import { useFinance } from '@/contexts';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { CategoryDonutCard } from './CategoryDonutCard';
import { IconChevronLeft, IconChevronRight } from '@/components/icons/SidebarIcons';

const SCROLL_AMOUNT = 200;
const CARD_GAP = 16;
const ARROW_GAP = 32; // gap entre seta e cards
const ARROW_SIZE = 40; // size-10

export function ExpensesByCategoryCarousel() {
  const { calculateExpensesByCategory } = useFinance();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const isDesktop = useMediaQuery('(min-width: 768px)');

  const categories = calculateExpensesByCategory();

  const scroll = useCallback((direction: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const delta = direction === 'left' ? -SCROLL_AMOUNT : SCROLL_AMOUNT;
    el.scrollBy({ left: delta, behavior: 'smooth' });
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent<HTMLDivElement>) => {
    const el = scrollRef.current;
    if (!el) return;
    const hasHorizontalScroll = el.scrollWidth > el.clientWidth;
    if (!hasHorizontalScroll) return;
    e.preventDefault();
    el.scrollLeft += e.deltaY;
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    const el = scrollRef.current;
    if (!el) return;
    const startX = e.pageX - el.offsetLeft;
    const startScrollLeft = el.scrollLeft;

    const handleMouseMove = (moveE: MouseEvent) => {
      const x = moveE.pageX - el.offsetLeft;
      el.scrollLeft = startScrollLeft - (x - startX);
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, []);

  if (categories.length === 0) {
    return (
      <section className="rounded-card border border-neutral-300 bg-surface-50 p-8 text-center">
        <p className="text-paragraph-medium text-surface-700">
          Nenhuma despesa no período selecionado.
        </p>
      </section>
    );
  }

  return (
    <section
      className="relative w-full"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Gradiente fade nas bordas */}
      <div
        className="pointer-events-none absolute left-0 top-0 z-10 h-full w-8 bg-gradient-to-r from-background-400 to-transparent"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute right-0 top-0 z-10 h-full w-8 bg-gradient-to-l from-background-400 to-transparent"
        aria-hidden
      />

      {/* Área scrollável — padding para gap de 32px entre setas e cards (só desktop) */}
      <div
        ref={scrollRef}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        className="scrollbar-hide select-none cursor-grab overflow-x-auto overflow-y-hidden py-4 active:cursor-grabbing"
        style={{
          paddingLeft: isDesktop ? ARROW_SIZE + ARROW_GAP : 16,
          paddingRight: isDesktop ? ARROW_SIZE + ARROW_GAP : 16,
        }}
      >
        <div
          className="flex"
          style={{ gap: CARD_GAP }}
        >
          {categories.map((item, index) => (
            <CategoryDonutCard
              key={item.category}
              category={item.category}
              amount={item.amount}
              percentage={item.percentage}
              colorIndex={index}
            />
          ))}
        </div>
      </div>

      {/* Setas de navegação — apenas desktop, gap 32px dos cards */}
      {isDesktop && isHovering && (
        <>
          <button
            type="button"
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 z-20 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-neutral-300 bg-surface-50 shadow-md transition-opacity hover:bg-neutral-300/30"
            aria-label="Rolar para esquerda"
          >
            <IconChevronLeft className="size-5 text-secondary-normal" />
          </button>
          <button
            type="button"
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 z-20 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-neutral-300 bg-surface-50 shadow-md transition-opacity hover:bg-neutral-300/30"
            aria-label="Rolar para direita"
          >
            <IconChevronRight className="size-5 text-secondary-normal" />
          </button>
        </>
      )}
    </section>
  );
}
