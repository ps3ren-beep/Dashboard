# mycash+ — Documentação

## Progresso

- [x] PROMPT 0: Análise e Planejamento Inicial
- [x] PROMPT 1: Estrutura Base e Configuração
- [x] PROMPT 2: Sistema de Layout e Navegação Desktop
- [x] PROMPT 3: Sistema de Layout e Navegação Mobile
- [ ] PROMPT 4: Context Global e Gerenciamento de Estado
- [ ] PROMPT 5: Cards de Resumo Financeiro
- [ ] PROMPT 6: Header do Dashboard com Controles
- [ ] PROMPT 7: Carrossel de Gastos por Categoria
- [ ] PROMPT 8: Gráfico de Fluxo Financeiro
- [ ] PROMPT 9: Widget de Cartões de Crédito
- [ ] PROMPT 10: Widget de Próximas Despesas
- [ ] PROMPT 11: Tabela de Transações Detalhada
- [ ] PROMPT 12: Modal de Nova Transação
- [ ] PROMPT 13: Modal de Adicionar Membro
- [ ] PROMPT 14: Modal de Adicionar Cartão
- [ ] PROMPT 15: Modal de Detalhes do Cartão
- [ ] PROMPT 16: Modal de Filtros Mobile
- [ ] PROMPT 17: View Completa de Cartões
- [ ] PROMPT 18: View Completa de Transações
- [ ] PROMPT 19: View de Perfil — Aba Informações
- [ ] PROMPT 20: View de Perfil — Aba Configurações
- [ ] PROMPT 21: Animações e Transições Globais
- [ ] PROMPT 22: Formatação e Utilitários
- [ ] PROMPT 23: Responsividade e Ajustes Finais
- [ ] PROMPT 24: Testes e Validação Final
- [ ] PROMPT FINAL: Revisão e Entrega

---

## Nota de Breakpoints

A implementação segue os **breakpoints oficiais das Project Rules**:

- **Mobile (base):** < 768px
- **Tablet (md):** ≥ 768px e < 1280px
- **Desktop (lg):** ≥ 1280px e < 1920px
- **Wide / 4K (xl):** ≥ 1920px

**Tailwind:** `md: 768px`, `lg: 1280px`, `xl: 1920px`

Onde os prompts citarem 1024px ou 640px, adaptar para **1280px** e **768px** respectivamente.

---

## To-Do por Prompt

- [x] 1. Estrutura Base e Configuração
- [x] 2. Sistema de Layout e Navegação Desktop
- [x] 3. Sistema de Layout e Navegação Mobile
- [ ] 4. Context Global e Gerenciamento de Estado
- [ ] 5. Cards de Resumo Financeiro
- [ ] 6. Header do Dashboard com Controles
- [ ] 7. Carrossel de Gastos por Categoria
- [ ] 8. Gráfico de Fluxo Financeiro
- [ ] 9. Widget de Cartões de Crédito
- [ ] 10. Widget de Próximas Despesas
- [ ] 11. Tabela de Transações Detalhada
- [ ] 12. Modal de Nova Transação
- [ ] 13. Modal de Adicionar Membro
- [ ] 14. Modal de Adicionar Cartão
- [ ] 15. Modal de Detalhes do Cartão
- [ ] 16. Modal de Filtros Mobile
- [ ] 17. View Completa de Cartões
- [ ] 18. View Completa de Transações
- [ ] 19. View de Perfil — Aba Informações
- [ ] 20. View de Perfil — Aba Configurações
- [ ] 21. Animações e Transições Globais
- [ ] 22. Formatação e Utilitários
- [ ] 23. Responsividade e Ajustes Finais
- [ ] 24. Testes e Validação Final
- [ ] 25. PROMPT FINAL: Revisão e Entrega

---

## PROMPT 1: Estrutura Base e Configuração

**Status:** ✅ | Data: 12/03/2025 | Build: ✅ (1 tentativa)

### Implementado

- Projeto Vite + React + TypeScript
- Tailwind CSS com tokens do Figma (cores, tipografia, shapes)
- Estrutura de pastas: components (layout, dashboard, cards, modals), contexts, hooks, types, utils, constants
- Tipos: Transaction, Goal, CreditCard, BankAccount, FamilyMember
- React Router com 5 rotas: Dashboard, Objetivos, Cartões, Transações, Perfil
- MainLayout, PageContainer, páginas placeholder

### Tokens

Semânticas: --color-primary, --color-success, --color-danger  
Primitivas: --color-secondary-*, --color-surface-*, --color-background-400, --color-neutral-*, --color-blue-*, --color-green-*, --color-red-*

### Build

Tentativas: 1 | Erros: 0

---

## PROMPT 2: Sistema de Layout e Navegação Desktop

**Status:** ✅ | Data: 12/03/2025 | Build: ✅ (1 tentativa)

### Implementado

- Sidebar com estados expandido (299px) e colapsado (80px)
- Botão circular na borda direita: seta esquerda (expandido) / direita (colapsado)
- Transições suaves (300ms) no conteúdo principal
- Tooltips ao passar mouse nos itens quando colapsada (delay 300ms)
- Item ativo: fundo preto (neutral-900), texto branco, ícone verde-limão
- Navegação: Dashboard, Objetivos, Cartões, Transações, Perfil
- Renderização apenas em desktop (≥1280px) via useMediaQuery

### Tokens

Semânticas: --color-primary  
Primitivas: --color-neutral-900, --color-surface-50, --color-secondary-normal, --color-lime, --shape-20, --shape-100

### Build

Tentativas: 1 | Erros: 0

---

## PROMPT 3: Sistema de Layout e Navegação Mobile

**Status:** ✅ | Data: 12/03/2025 | Build: ✅ (1 tentativa)

### Implementado

- HeaderMobile fixo no topo, largura total, visível durante scroll (h-14 = 56px)
- Logo "mycash+" à esquerda; avatar clicável à direita (trigger do MenuDropdown)
- MenuDropdown: desliza de cima (slideDown), não fullscreen, overlay escuro semi-transparente
- Itens de navegação com ícone e texto; item atual com fundo preto (neutral-900)
- Botão vermelho "Sair" no rodapé (red-600)
- Fechamento: clique em item, botão X, clique fora (overlay), tecla Escape
- Breakpoint: Sidebar ≥1280px | HeaderMobile <1280px (nunca juntos)

### Tokens

Semânticas: --color-danger  
Primitivas: --color-surface-50, --color-secondary-darker, --color-neutral-900, --color-red-600, --space-*

### Build

Tentativas: 1 | Erros: 0

---

## PROMPT 0: Análise e Planejamento Inicial

**Status:** ✅ | Data: 12/03/2025 | Build: N/A (análise)

### Fonte

- **Figma:** [Workshop - Do figma MCP ao Cursor AI v.2](https://www.figma.com/design/ApYHCu6RlBQ6B2AinDYFKJ/Workshop---Do-figma-MCP-ao-Cursor-AI-v.2--Community-?node-id=2063-1130)
- **Node ID:** 2063:1130
- **FileKey:** ApYHCu6RlBQ6B2AinDYFKJ

---

### 1. Componentes Visuais e Hierarquia (Dashboard)

#### Layout Principal

| Componente | Descrição | Hierarquia |
|------------|-----------|------------|
| **Sidebar** | Navegação lateral fixa, ~240px expandida | Desktop ≥1280px |
| **TopBar** | Logo, busca, filtros, avatares, botão Nova transação | Acima do main |
| **Main Content** | Área fluida com fundo claro (#F5F6F8) | Wrapper do conteúdo |

#### TopBar (Header)

- Logo Mycash+
- Input de busca ("Pesquisar") com ícone
- Ícone de filtro
- Seletor de período (ex: 01 Jan - 31 Jan 2026)
- Avatares de membros + botão "+"
- Botão primário "Nova transação"

#### Sidebar Desktop

- Logo no topo
- Ícone colapsar/expandir (seta)
- Links: Home (ativo), Cartões
- Perfil do usuário (avatar, nome, e-mail) no rodapé

#### Cards/Seções do Dashboard

| Card | Conteúdo |
|------|----------|
| **Resumo por categoria** | 4 cards (Aluguel, Alimentação, Mercado, Academia) com donut % e valor |
| **Saldo** | 3 cards: Saldo total, Receitas, Despesas |
| **Cartões/Contas** | Lista de contas (Bundank, Charesco) com saldo, vencimento, últimos dígitos |
| **Fluxo financeiro** | Gráfico de linhas (Receitas vs Despesas por mês) |
| **Próximas despesas** | Lista de despesas recorrentes (Conta de luz, etc.) |
| **Extrato detalhado** | Tabela com colunas: Membros, Datas, Descrição, Categorias, Conta/Cartão, Parcelas, Valor + Paginação |

---

### 2. Tokens (Design System — do Figma)

#### Cores (Primitivas)

| Token Figma | Valor | Uso |
|-------------|-------|-----|
| `Colors/Secondary/Darker` | #06080E | Texto escuro |
| `Colors/Secondary/Normal` | #111827 | Texto principal |
| `Colors/Secondary/Light` | #E7E8E9 | Bordas, divisores |
| `Colors/Surface/surface-50` | #FFFFFF | Cards, inputs |
| `Colors/Surface/surface-700` | #B5B5B5 | Bordas inputs |
| `Colors/Background/background-400` | #F5F6F8 | Fundo da área principal |
| `color/neutral/0` | #ffffff | Branco |
| `color/neutral/300` | #e5e7eb | Bordas |
| `Accent/Neutral/neutral-900` | #0D0F03 | Texto muito escuro |
| `Accent/Blue/blue-200` | #A2C2FF | Azul claro |
| `Accent/Blue/blue-600` | #3070E7 | Primário (botões, links ativos) |
| `Accent/Green/green-100` | #C3F0DC | Fundo sucesso |
| `Accent/Green/green-600` | #38BB82 | Receitas |
| `Accent/Red/red-600` | #D85E6D | Despesas |

#### Tipografia

| Token | Família | Peso | Size | Line-height |
|-------|---------|------|------|-------------|
| `Heading/Medium` | Inter | Bold 700 | 28px | 36px |
| `Heading/Small` | Inter | Bold 700 | 24px | 32px |
| `Heading/X-Small` | Inter | Bold 700 | 20px | 28px |
| `Label/Large` | Inter | Semi Bold 600 | 18px | 24px |
| `Label/Medium` | Inter | Semi Bold 600 | 16px | 20px |
| `Label/Small` | Inter | Semi Bold 600 | 14px | 16px |
| `Label/X-small` | Inter | Semi Bold 600 | 12px | 16px |
| `Paragraph/Medium` | Inter | Regular 400 | 16px | 24px |
| `Paragraph/Small` | Inter | Regular 400 | 14px | 20px |

#### Espaçamento

| Token | Valor |
|-------|-------|
| `space/0` | 0 |
| `space/4` | 4px |
| `space/8` | 8px |
| `space/12` | 12px |
| `space/16` | 16px |
| `space/24` | 24px |
| `space/32` | 32px |
| `space/56` | 56px |

#### Shape / Size

| Token | Valor |
|-------|-------|
| `shape/20` | 20px (border-radius cards) |
| `shape/100` | 100px (inputs arredondados) |
| `size/2` | 2px |
| `size/32` | 32px |
| `size/72` | 72px |

---

### 3. Navegação (das Rules)

- **Desktop (≥1280px):** Sidebar visível; estados expandido/colapsado; empurra conteúdo.
- **Mobile/Tablet (<1280px):** Sidebar não renderiza; Header Mobile com menu drawer e ações.
- **Regra:** Nunca renderizar Sidebar + Header Mobile juntos.

---

### 4. Arquitetura Proposta

```
src/
├── components/
│   ├── layout/
│   │   ├── Sidebar/
│   │   ├── HeaderMobile/
│   │   ├── MainLayout/
│   │   └── PageContainer/
│   ├── ui/
│   │   ├── Button/
│   │   ├── Card/
│   │   ├── Input/
│   │   └── ...
│   └── features/
│       ├── dashboard/
│       ├── cartoes/
│       ├── transacoes/
│       └── perfil/
├── pages/
├── hooks/
├── services/
├── styles/
└── types/
```

---

### 5. Mapeamento de Conversões (para implementação)

Valores do Figma que não usam variáveis → tokens a usar:

| Original | Token | Justificativa |
|----------|-------|---------------|
| #080b12 | Colors/Secondary/Darker | Texto escuro |
| #b5b5b5 | Colors/Surface/surface-700 | Borda input |
| width: 1305px | 100% / max-width | Layout fluido (projeto) |
| rounded 100px | shape/100 | Input pill |
| rounded 20px | shape/20 | Cards |

---

## Referências

- [Figma Design](https://www.figma.com/design/ApYHCu6RlBQ6B2AinDYFKJ)
- [Documentação do Sistema](https://docs.google.com/document/d/1s-KKXi3hROSBsgfxXOKpeMOxD318U7z9hSJ0UiIRT4Q)
