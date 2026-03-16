import { useState, useCallback } from 'react';
import { useFinance } from '@/contexts';
import { IconX } from '@/components/icons/SidebarIcons';

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MemberErrors {
  name?: string;
  role?: string;
}

const ROLE_SUGGESTIONS = [
  'Pai',
  'Mãe',
  'Filho',
  'Filha',
  'Avô',
  'Avó',
  'Tio',
  'Tia',
];

const DEFAULT_AVATAR =
  'https://www.gravatar.com/avatar/?d=mp&s=200';

export function AddMemberModal({ isOpen, onClose }: AddMemberModalProps) {
  const { addFamilyMember } = useFinance();

  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [activeTab, setActiveTab] = useState<'url' | 'upload'>('url');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [monthlyIncome, setMonthlyIncome] = useState('');
  const [errors, setErrors] = useState<MemberErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetState = useCallback(() => {
    setName('');
    setRole('');
    setActiveTab('url');
    setAvatarUrl('');
    setMonthlyIncome('');
    setErrors({});
    setIsSubmitting(false);
  }, []);

  const handleClose = useCallback(() => {
    resetState();
    onClose();
  }, [onClose, resetState]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (isSubmitting) return;

      const next: MemberErrors = {};
      if (!name.trim() || name.trim().length < 3) {
        next.name = 'Por favor, insira um nome válido.';
      }
      if (!role.trim()) {
        next.role = 'Por favor, informe a função na família.';
      }

      setErrors(next);
      if (Object.keys(next).length > 0) return;

      setIsSubmitting(true);

      const incomeNumber = Number(
        monthlyIncome.replace(/\./g, '').replace(',', '.').trim() || '0'
      );

      addFamilyMember({
        name: name.trim(),
        role: role.trim(),
        avatarUrl: avatarUrl.trim() || DEFAULT_AVATAR,
        monthlyIncome: Number.isNaN(incomeNumber) ? 0 : incomeNumber,
      });

      setIsSubmitting(false);
      handleClose();
    },
    [addFamilyMember, avatarUrl, handleClose, isSubmitting, monthlyIncome, name, role]
  );

  if (!isOpen) return null;

  const filteredRoles = ROLE_SUGGESTIONS.filter((suggestion) =>
    suggestion.toLowerCase().includes(role.toLowerCase())
  );

  return (
    <>
      <div
        role="presentation"
        aria-hidden
        onClick={handleClose}
        className="fixed inset-0 z-40 bg-secondary-darker/50"
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        <section
          className="w-full max-w-[560px] rounded-card border border-neutral-300 bg-surface-50 shadow-lg"
          style={{ animation: 'slideDown 0.25s ease-out' }}
        >
          {/* Header */}
          <header className="flex items-center justify-between border-b border-neutral-300 px-[var(--space-32)] py-[var(--space-24)]">
            <div>
              <h2 className="text-label-large font-semibold text-secondary-darker">
                Adicionar Membro da Família
              </h2>
              <p className="mt-1 text-paragraph-small text-surface-700">
                Cadastre alguém para participar do controle financeiro.
              </p>
            </div>
            <button
              type="button"
              onClick={handleClose}
              className="flex size-10 items-center justify-center rounded-full text-secondary-normal transition-colors hover:bg-neutral-300/40"
              aria-label="Fechar modal"
            >
              <IconX className="size-5" />
            </button>
          </header>

          {/* Conteúdo */}
          <form
            onSubmit={handleSubmit}
            className="max-h-[70vh] overflow-y-auto px-[var(--space-32)] py-[var(--space-24)]"
          >
            <div className="flex flex-col" style={{ gap: 'var(--space-16)' }}>
              {/* Nome completo */}
              <div className="flex flex-col" style={{ gap: 'var(--space-8)' }}>
                <label className="text-label-small font-semibold text-secondary-darker">
                  Nome Completo
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`h-14 w-full rounded-card border bg-surface-50 px-4 text-label-medium text-secondary-darker outline-none transition-colors ${
                    errors.name
                      ? 'border-red-600'
                      : 'border-neutral-300 focus:border-neutral-900'
                  }`}
                  placeholder="Ex: João Silva"
                />
                {errors.name && (
                  <p className="text-label-xsmall text-red-600">{errors.name}</p>
                )}
              </div>

              {/* Função / papel (combobox simples) */}
              <div className="flex flex-col" style={{ gap: 'var(--space-8)' }}>
                <label className="text-label-small font-semibold text-secondary-darker">
                  Função na Família
                </label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className={`h-14 w-full rounded-card border bg-surface-50 px-4 text-label-medium text-secondary-darker outline-none transition-colors ${
                    errors.role
                      ? 'border-red-600'
                      : 'border-neutral-300 focus:border-neutral-900'
                  }`}
                  placeholder="Ex: Pai, Mãe, Filho..."
                  list="family-role-suggestions"
                />
                <datalist id="family-role-suggestions">
                  {filteredRoles.map((suggestion) => (
                    <option key={suggestion} value={suggestion} />
                  ))}
                </datalist>
                {errors.role && (
                  <p className="text-label-xsmall text-red-600">{errors.role}</p>
                )}
              </div>

              {/* Avatar tabs */}
              <div className="flex flex-col" style={{ gap: 'var(--space-8)' }}>
                <label className="text-label-small font-semibold text-secondary-darker">
                  Avatar (opcional)
                </label>
                <div className="flex rounded-pill border border-neutral-300 bg-surface-50 p-1">
                  <button
                    type="button"
                    onClick={() => setActiveTab('url')}
                    className={`flex-1 rounded-pill px-4 py-2 text-center text-label-small transition-colors ${
                      activeTab === 'url'
                        ? 'bg-neutral-900 text-neutral-0'
                        : 'text-surface-700'
                    }`}
                  >
                    URL
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('upload')}
                    className={`flex-1 rounded-pill px-4 py-2 text-center text-label-small transition-colors ${
                      activeTab === 'upload'
                        ? 'bg-neutral-900 text-neutral-0'
                        : 'text-surface-700'
                    }`}
                  >
                    Upload
                  </button>
                </div>
                {activeTab === 'url' ? (
                  <input
                    type="url"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    className="h-12 w-full rounded-card border border-neutral-300 bg-surface-50 px-4 text-paragraph-small text-secondary-darker outline-none focus:border-neutral-900"
                    placeholder="Cole a URL da imagem (JPG ou PNG)"
                  />
                ) : (
                  <input
                    type="file"
                    accept="image/png,image/jpeg"
                    className="block w-full text-paragraph-small text-surface-700"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      // Para simplificar o workshop, usamos URL temporária em memória.
                      const url = URL.createObjectURL(file);
                      setAvatarUrl(url);
                    }}
                  />
                )}
                <p className="text-label-xsmall text-surface-700">
                  Se nenhum avatar for definido, usaremos um ícone padrão.
                </p>
              </div>

              {/* Renda mensal (opcional) */}
              <div className="flex flex-col" style={{ gap: 'var(--space-8)' }}>
                <label className="text-label-small font-semibold text-secondary-darker">
                  Renda Mensal Estimada (opcional)
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-label-medium text-surface-700">
                    R$
                  </span>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={monthlyIncome}
                    onChange={(e) => setMonthlyIncome(e.target.value)}
                    className="h-12 w-full rounded-card border border-neutral-300 bg-surface-50 pl-12 pr-4 text-paragraph-small text-secondary-darker outline-none focus:border-neutral-900"
                    placeholder="0,00"
                  />
                </div>
              </div>
            </div>
          </form>

          {/* Footer */}
          <footer className="flex items-center justify-end gap-3 border-t border-neutral-300 bg-surface-50 px-[var(--space-32)] py-[var(--space-16)]">
            <button
              type="button"
              onClick={handleClose}
              className="rounded-pill border border-neutral-300 bg-surface-50 px-6 py-2 text-label-medium text-secondary-darker transition-colors hover:bg-neutral-300/40"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={(e) => handleSubmit(e as unknown as React.FormEvent)}
              disabled={isSubmitting}
              className="rounded-pill bg-neutral-900 px-8 py-2 text-label-medium font-semibold text-neutral-0 transition-colors hover:bg-neutral-900/90 disabled:cursor-default disabled:opacity-60"
            >
              Adicionar Membro
            </button>
          </footer>
        </section>
      </div>
    </>
  );
}

