import { Outlet } from 'react-router-dom';

/**
 * Layout principal — estrutura de navegação permanece visível
 * Sidebar (desktop) e HeaderMobile (mobile) serão adicionados no PROMPT 2 e 3
 */
export function MainLayout() {
  return (
    <div className="min-h-screen w-full bg-background-400">
      <main className="w-full max-w-content mx-auto px-4 md:px-6 lg:px-8 py-6">
        <Outlet />
      </main>
    </div>
  );
}
