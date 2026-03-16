import { useState } from 'react';
import { useFinance } from '@/contexts';
import { PageContainer } from '@/components/layout/PageContainer';
import { IconUser, IconPlus, IconLogOut } from '@/components/icons/SidebarIcons';
import { AddMemberModal } from '@/components/modals/AddMemberModal';

/** Dados do usuário logado (fonte única; pode vir de auth depois) */
const USER = {
  name: 'Rafael Eugênio',
  email: 'ren@gmail.com.br',
  avatarUrl: '',
};

type TabId = 'informacoes' | 'configuracoes';

const TABS: { id: TabId; label: string }[] = [
  { id: 'informacoes', label: 'Informações' },
  { id: 'configuracoes', label: 'Configurações' },
];

export function PerfilPage() {
  const { familyMembers } = useFinance();
  const [activeTab, setActiveTab] = useState<TabId>('informacoes');
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);

  const handleSair = () => {
    // Placeholder: sem auth real, apenas feedback visual
    if (typeof window !== 'undefined' && window.confirm('Deseja realmente sair?')) {
      // TODO: logout quando houver auth
    }
  };

  return (
    <PageContainer>
      <div className="w-full max-w-[1400px] lg:max-w-[1600px]">
        <h1 className="text-heading-medium font-bold text-secondary-darker">
          Perfil
        </h1>

        {/* Tabs */}
        <div className="mt-6 flex border-b border-neutral-300">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`min-h-[44px] border-b-2 px-4 py-2 text-label-medium font-semibold transition-colors ${
                activeTab === tab.id
                  ? 'border-neutral-900 text-secondary-darker'
                  : 'border-transparent text-surface-700 hover:text-secondary-darker'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Conteúdo Informações */}
        {activeTab === 'informacoes' && (
          <div className="mt-8 flex flex-col gap-8">
            {/* Card do usuário */}
            <section className="rounded-card border border-neutral-300 bg-surface-50 p-6">
              <h2 className="text-label-large font-semibold text-secondary-darker mb-4">
                Meu perfil
              </h2>
              <div className="flex flex-wrap items-center gap-6">
                <div className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-neutral-300 text-secondary-normal">
                  {USER.avatarUrl ? (
                    <img src={USER.avatarUrl} alt="" className="size-full object-cover" />
                  ) : (
                    <IconUser className="size-10" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-label-large font-semibold text-secondary-darker">
                    {USER.name}
                  </p>
                  <p className="text-paragraph-small text-surface-700">{USER.email}</p>
                </div>
              </div>
            </section>

            {/* Membros da família */}
            <section className="rounded-card border border-neutral-300 bg-surface-50 p-6">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
                <h2 className="text-label-large font-semibold text-secondary-darker">
                  Membros da família
                </h2>
                <button
                  type="button"
                  onClick={() => setIsAddMemberOpen(true)}
                  className="flex min-h-[44px] items-center justify-center gap-2 rounded-pill border border-neutral-300 bg-surface-50 px-4 py-2 text-label-medium font-semibold text-secondary-darker transition-colors hover:bg-neutral-300/50"
                >
                  <IconPlus className="size-5" />
                  Adicionar
                </button>
              </div>
              {familyMembers.length === 0 ? (
                <p className="text-paragraph-small text-surface-700">
                  Nenhum membro cadastrado. Adicione membros para filtrar transações por pessoa.
                </p>
              ) : (
                <ul className="flex flex-col gap-3">
                  {familyMembers.map((m) => (
                    <li
                      key={m.id}
                      className="flex items-center gap-4 rounded-lg border border-neutral-300/50 bg-surface-50 p-4"
                    >
                      <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-neutral-300 text-secondary-normal">
                        {m.avatarUrl ? (
                          <img src={m.avatarUrl} alt="" className="size-full object-cover" />
                        ) : (
                          <span className="text-label-medium font-semibold text-secondary-darker">
                            {m.name.charAt(0)}
                          </span>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-label-medium font-semibold text-secondary-darker">
                          {m.name}
                        </p>
                        <p className="text-label-xsmall text-surface-700">{m.role}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            {/* Sair */}
            <section>
              <button
                type="button"
                onClick={handleSair}
                className="flex min-h-[48px] items-center justify-center gap-2 rounded-pill border border-red-600/50 bg-surface-50 px-6 py-3 text-label-medium font-semibold text-red-600 transition-colors hover:bg-red-50"
              >
                <IconLogOut className="size-5" />
                Sair
              </button>
            </section>
          </div>
        )}

        {/* Conteúdo Configurações (PROMPT 20) */}
        {activeTab === 'configuracoes' && (
          <div className="mt-8 flex flex-col gap-6">
            <section className="rounded-card border border-neutral-300 bg-surface-50 p-6">
              <h2 className="text-label-large font-semibold text-secondary-darker mb-4">
                Preferências
              </h2>
              <p className="text-paragraph-small text-surface-700">
                Moeda, idioma e formato de data (em breve).
              </p>
            </section>
            <section className="rounded-card border border-neutral-300 bg-surface-50 p-6">
              <h2 className="text-label-large font-semibold text-secondary-darker mb-4">
                Notificações
              </h2>
              <p className="text-paragraph-small text-surface-700">
                Alertas de vencimento, metas e resumos (em breve).
              </p>
            </section>
            <section className="rounded-card border border-neutral-300 bg-surface-50 p-6">
              <h2 className="text-label-large font-semibold text-secondary-darker mb-4">
                Categorias
              </h2>
              <p className="text-paragraph-small text-surface-700">
                Gerenciar categorias de receitas e despesas (em breve).
              </p>
            </section>
            <section className="rounded-card border border-neutral-300 bg-surface-50 p-6">
              <h2 className="text-label-large font-semibold text-secondary-darker mb-4">
                Dados e privacidade
              </h2>
              <p className="text-paragraph-small text-surface-700">
                Exportar dados e configurações de privacidade (em breve).
              </p>
            </section>
            <section className="rounded-card border border-neutral-300 bg-surface-50 p-6">
              <h2 className="text-label-large font-semibold text-secondary-darker mb-4">
                Sobre
              </h2>
              <p className="text-paragraph-small text-surface-700">
                mycash+ — versão 1.0.0
              </p>
            </section>
          </div>
        )}
      </div>

      <AddMemberModal isOpen={isAddMemberOpen} onClose={() => setIsAddMemberOpen(false)} />
    </PageContainer>
  );
}
