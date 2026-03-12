import { useState, useRef, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import {
  IconHome,
  IconTarget,
  IconCreditCard,
  IconReceipt,
  IconUser,
  IconChevronLeft,
  IconChevronRight,
} from '@/components/icons/SidebarIcons';
import { ROUTES } from '@/constants/routes';

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
 * Logo mycash+ — ícone SVG conforme Figma (estilizado S/ribbon)
 * Expandido: ícone + texto | Colapsado: apenas ícone
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

interface NavItemProps {
  path: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  isExpanded: boolean;
}

function NavItem({ path, label, icon: Icon, isExpanded }: NavItemProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const handleMouseEnter = () => {
    if (!isExpanded) {
      timeoutRef.current = setTimeout(() => setShowTooltip(true), 300);
    }
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setShowTooltip(false);
  };

  useEffect(
    () => () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    },
    []
  );

  return (
    <NavLink
      to={path}
      className={({ isActive }) =>
        `relative flex items-center gap-[var(--space-8)] rounded-pill px-[var(--space-24)] py-[var(--space-12)] transition-colors duration-200 ${
          isActive
            ? 'bg-neutral-900 text-neutral-0 [&_svg]:!text-lime'
            : 'text-secondary-normal hover:bg-neutral-300/30 [&_svg]:text-secondary-normal'
        }`
      }
      style={{ minWidth: isExpanded ? undefined : 'auto', justifyContent: isExpanded ? undefined : 'center' }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Icon className="size-4 shrink-0" />
      {isExpanded && (
        <span className="text-label-large font-semibold whitespace-nowrap">
          {label}
        </span>
      )}
      {!isExpanded && showTooltip && (
        <div
          className="absolute left-full ml-2 top-1/2 -translate-y-1/2 z-50 rounded-card bg-neutral-900 px-3 py-2 text-label-small font-semibold text-neutral-0 whitespace-nowrap shadow-lg"
          role="tooltip"
        >
          {label}
        </div>
      )}
    </NavLink>
  );
}

interface SidebarProps {
  isExpanded: boolean;
  onToggle: () => void;
}

export function Sidebar({ isExpanded, onToggle }: SidebarProps) {
  return (
    <aside
      className="fixed left-0 top-0 z-40 flex h-screen flex-col justify-between bg-surface-50 shadow-sm transition-[width] duration-300 ease-out"
      style={{
        width: isExpanded ? 299 : 80,
        padding: 'var(--space-24)',
      }}
    >
      {/* Top: Logo + Menu — gap space/56 conforme Figma */}
      <div
        className="flex flex-col shrink-0"
        style={{ gap: 'var(--space-56)' }}
      >
        {/* Logo — expandido: ícone + "mycash+" | colapsado: apenas ícone */}
        <div
          className={`flex items-center ${isExpanded ? 'gap-2' : 'justify-center'}`}
        >
          <div className="flex shrink-0 items-center justify-center text-secondary-normal">
            <LogoIcon className="size-5" />
          </div>
          {isExpanded && (
        <span className="text-heading-xsmall font-bold text-secondary-normal whitespace-nowrap">
          mycash+
        </span>
          )}
        </div>

        {/* Menu — gap 0 entre itens, cada item com px-24 py-12 rounded-pill */}
        <nav
          className={`flex flex-col ${isExpanded ? 'w-full items-stretch' : 'items-center'}`}
          style={{ gap: 'var(--space-0)' }}
        >
          {NAV_ITEMS.map((item) => (
            <NavItem
              key={item.path}
              path={item.path}
              label={item.label}
              icon={item.icon}
              isExpanded={isExpanded}
            />
          ))}
        </nav>
      </div>

      {/* Bottom: User — gap space/12 conforme Figma */}
      <div
        className={`flex flex-col shrink-0 ${isExpanded ? 'items-start' : 'items-center'}`}
        style={{ gap: 'var(--space-12)' }}
      >
        <div
          className="flex size-[30px] shrink-0 items-center justify-center overflow-hidden rounded-full bg-neutral-300"
          style={{ width: 30, height: 30 }}
        >
          {USER.avatarUrl ? (
            <img src={USER.avatarUrl} alt="" className="size-full object-cover" />
          ) : (
            <IconUser className="size-4 text-secondary-normal" />
          )}
        </div>
        {isExpanded && (
          <div
            className="flex flex-col gap-[var(--space-4)] overflow-hidden"
            style={{ width: 184 }}
          >
            <span className="text-label-medium font-semibold text-secondary-darker truncate">
              {USER.name}
            </span>
            <span className="text-paragraph-small font-normal text-secondary-darker truncate">
              {USER.email}
            </span>
          </div>
        )}
      </div>

      {/* Toggle — right-[-14px], size 32px, top 62px conforme Figma */}
      <button
        type="button"
        onClick={onToggle}
        className="absolute flex items-center justify-center rounded-full bg-surface-50 shadow-md transition-colors hover:bg-neutral-300/50"
        style={{
          right: -14,
          top: 62,
          width: 32,
          height: 32,
        }}
        aria-label={isExpanded ? 'Recolher menu' : 'Expandir menu'}
      >
        {isExpanded ? (
          <IconChevronLeft className="size-4 text-secondary-normal" />
        ) : (
          <IconChevronRight className="size-4 text-secondary-normal" />
        )}
      </button>
    </aside>
  );
}
