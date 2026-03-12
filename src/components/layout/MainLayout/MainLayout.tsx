import { Outlet } from 'react-router-dom';
import { Sidebar } from '@/components/layout/Sidebar';
import { useSidebarState } from '@/hooks/useSidebarState';
import { useMediaQuery } from '@/hooks/useMediaQuery';

const SIDEBAR_WIDTH_EXPANDED = 299;
const SIDEBAR_WIDTH_COLLAPSED = 80;

/**
 * Layout principal — Sidebar (desktop ≥1280px) + conteúdo com transição fluida
 * Sidebar não renderiza em mobile/tablet (PROMPT 3: HeaderMobile)
 */
export function MainLayout() {
  const { isExpanded, toggle } = useSidebarState(true);
  const isDesktop = useMediaQuery('(min-width: 1280px)');

  const mainMarginLeft =
    isDesktop ? (isExpanded ? SIDEBAR_WIDTH_EXPANDED : SIDEBAR_WIDTH_COLLAPSED) : 0;

  return (
    <div className="min-h-screen w-full bg-background-400">
      {isDesktop && (
        <Sidebar isExpanded={isExpanded} onToggle={toggle} />
      )}

      <main
        className="w-full max-w-content mx-auto px-4 md:px-6 lg:px-8 py-6 transition-[margin] duration-300 ease-out"
        style={{ marginLeft: mainMarginLeft }}
      >
        <Outlet />
      </main>
    </div>
  );
}
