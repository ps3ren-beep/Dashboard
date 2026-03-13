import { Outlet } from 'react-router-dom';
import { Sidebar } from '@/components/layout/Sidebar';
import { HeaderMobile } from '@/components/layout/HeaderMobile';
import { useSidebarState } from '@/hooks/useSidebarState';
import { useMediaQuery } from '@/hooks/useMediaQuery';

const SIDEBAR_WIDTH_EXPANDED = 299;
const SIDEBAR_WIDTH_COLLAPSED = 80;
const HEADER_MOBILE_HEIGHT = 56; // h-14

/**
 * Layout principal — Sidebar (desktop ≥1280px) | HeaderMobile (<1280px)
 * Nunca renderiza Sidebar e HeaderMobile simultaneamente
 */
export function MainLayout() {
  const { isExpanded, toggle } = useSidebarState(true);
  const isDesktop = useMediaQuery('(min-width: 1280px)');

  const mainMarginLeft =
    isDesktop ? (isExpanded ? SIDEBAR_WIDTH_EXPANDED : SIDEBAR_WIDTH_COLLAPSED) : 0;
  const mainPaddingTop = isDesktop ? undefined : HEADER_MOBILE_HEIGHT + 24; // header + conteúdo

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-background-400">
      {isDesktop ? (
        <Sidebar isExpanded={isExpanded} onToggle={toggle} />
      ) : (
        <HeaderMobile />
      )}

      <main
        className="min-w-0 w-full max-w-content mx-auto px-4 md:px-6 lg:px-8 py-6 transition-[margin] duration-300 ease-out"
        style={{
          marginLeft: mainMarginLeft,
          ...(mainPaddingTop != null && { paddingTop: mainPaddingTop }),
        }}
      >
        <Outlet />
      </main>
    </div>
  );
}
