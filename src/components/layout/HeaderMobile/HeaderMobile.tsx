import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  IconHome,
  IconTarget,
  IconCreditCard,
  IconReceipt,
  IconUser,
} from '@/components/icons/SidebarIcons';
import { ROUTES } from '@/constants/routes';
import { MenuDropdown } from './MenuDropdown';

const NAV_ITEMS = [
  { path: ROUTES.DASHBOARD, label: 'Dashboard', icon: IconHome },
  { path: ROUTES.OBJETIVOS, label: 'Objetivos', icon: IconTarget },
  { path: ROUTES.CARTOES, label: 'Cartões', icon: IconCreditCard },
  { path: ROUTES.TRANSACOES, label: 'Transações', icon: IconReceipt },
  { path: ROUTES.PERFIL, label: 'Perfil', icon: IconUser },
] as const;

const USER = {
  name: 'Rafael Eugênio',
  email: 'ren@gmail.com.br',
  avatarUrl: '',
};

/**
 * Logo mycash+ — ícone SVG conforme Figma
 */
function LogoIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
    </svg>
  );
}

/**
 * HeaderMobile — substitui Sidebar em viewports <1280px
 * Fixo no topo, largura total, logo à esquerda, avatar à direita (trigger do menu)
 */
export function HeaderMobile() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const closeMenu = () => setIsMenuOpen(false);

  const handleLogout = () => {
    closeMenu();
    // Placeholder — será integrado com auth no futuro
    navigate(ROUTES.DASHBOARD);
  };

  return (
    <>
      <header
        className="fixed left-0 right-0 top-0 z-50 flex h-14 items-center justify-between bg-surface-50 px-4 shadow-sm md:px-6"
        style={{ minHeight: 56 }}
      >
        {/* Logo à esquerda — tamanho apropriado para mobile */}
        <NavLink
          to={ROUTES.DASHBOARD}
          className="flex items-center gap-2 text-secondary-normal"
          onClick={closeMenu}
        >
          <LogoIcon className="size-5 shrink-0" />
          <span className="text-heading-xsmall font-bold whitespace-nowrap">
            mycash+
          </span>
        </NavLink>

        {/* Avatar à direita — trigger do dropdown */}
        <button
          type="button"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-neutral-300 transition-opacity hover:opacity-90 min-[44px]:size-11"
          aria-label="Abrir menu de navegação"
          aria-expanded={isMenuOpen}
          aria-haspopup="menu"
        >
          {USER.avatarUrl ? (
            <img
              src={USER.avatarUrl}
              alt=""
              className="size-full object-cover"
            />
          ) : (
            <IconUser className="size-5 text-secondary-normal" />
          )}
        </button>
      </header>

      <MenuDropdown
        isOpen={isMenuOpen}
        onClose={closeMenu}
        onLogout={handleLogout}
        navItems={NAV_ITEMS}
      />
    </>
  );
}
