import { useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { IconX } from '@/components/icons/SidebarIcons';

interface NavItem {
  path: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface MenuDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  navItems: readonly NavItem[];
}

/**
 * MenuDropdown — desliza de cima, cobre conteúdo sem ser fullscreen
 * Fecha: item de nav, X, clique fora (overlay)
 */
export function MenuDropdown({
  isOpen,
  onClose,
  onLogout,
  navItems,
}: MenuDropdownProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay escuro semi-transparente — abaixo do header */}
      <div
        role="presentation"
        aria-hidden
        onClick={onClose}
        className="fixed inset-x-0 bottom-0 z-40 bg-secondary-darker/50 transition-opacity duration-200"
        style={{ top: 56 }}
      />

      {/* Painel do menu — desliza de cima, não fullscreen */}
      <div
        ref={panelRef}
        role="menu"
        aria-label="Menu de navegação"
        className="fixed left-4 right-4 z-50 mx-auto flex max-h-[calc(100vh-88px)] max-w-[360px] flex-col overflow-hidden rounded-card bg-surface-50 shadow-lg md:left-6 md:right-6"
        style={{
          top: 72,
          padding: 'var(--space-24)',
          animation: 'slideDown 0.3s ease-out',
        }}
      >
        {/* Botão X no canto superior direito */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-[var(--space-24)] top-[var(--space-24)] flex size-10 items-center justify-center rounded-full text-secondary-normal transition-colors hover:bg-neutral-300/50 min-[44px]:size-11"
          aria-label="Fechar menu"
        >
          <IconX className="size-5" />
        </button>

        {/* Itens de navegação */}
        <nav
          className="flex flex-col overflow-y-auto"
          style={{ gap: 'var(--space-4)' }}
        >
          {navItems.map(({ path, label, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-[var(--space-8)] rounded-pill px-[var(--space-24)] py-[var(--space-12)] transition-colors duration-200 ${
                  isActive
                    ? 'bg-neutral-900 text-neutral-0 [&_svg]:!text-lime'
                    : 'text-secondary-normal hover:bg-neutral-300/30 [&_svg]:text-secondary-normal'
                }`
              }
            >
              <Icon className="size-4 shrink-0" />
              <span className="text-label-large font-semibold">{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Botão Sair — vermelho, rodapé */}
        <div className="mt-auto shrink-0 pt-[var(--space-24)]">
          <button
            type="button"
            onClick={onLogout}
            className="flex w-full items-center justify-center gap-[var(--space-8)] rounded-pill bg-red-600 px-[var(--space-24)] py-[var(--space-12)] text-label-large font-semibold text-neutral-0 transition-opacity hover:opacity-90"
          >
            Sair
          </button>
        </div>
      </div>
    </>
  );
}
