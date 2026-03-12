# mycash+ — Sequência de Prompts

Sequência oficial para construção do mycash+, alinhada às Project Rules e ao design do Figma.

**Breakpoints oficiais:** md 768px | lg 1280px | xl 1920px

---

## PROMPT 0: Análise e Planejamento Inicial ✅

- Acessar design via Figma MCP
- Mapear componentes visuais (Dashboard, Cartões, Transações, Perfil)
- Listar tokens semânticos e primitivos
- Analisar navegação (Sidebar, Header Mobile)
- Definir arquitetura (pastas, hierarquia, componentização)

**Status:** Concluído

---

## PROMPT 1: Estrutura Base e Configuração

**Objetivo:** Criar fundação do projeto com pastas, Tailwind, tipos e rotas.

- Estrutura de pastas: components (layout, dashboard, cards, modals), contexts, hooks, types, utils, constants
- Tailwind configurado com variáveis do Figma como classes customizadas (tokens semânticos e primitivos)
- Tipos TypeScript: Transaction, Goal, CreditCard, BankAccount, FamilyMember (campos completos, union types)
- React Router com 5 rotas principais (SPA, conteúdo central muda, navegação fixa)
- Responsividade: Desktop ≥1280px, Tablet 768-1279px, Mobile <768px

---

## PROMPT 2: Sistema de Layout e Navegação Desktop

**Objetivo:** Implementar Sidebar com estados expandido/colapsado.

- Sidebar altura total do viewport; estados expandido (logo + textos + perfil completo) e colapsado (apenas ícones + avatar)
- Botão circular na borda direita: seta esquerda (expandida) / seta direita (colapsada)
- Transições suaves; conteúdo principal ajusta margem esquerda de forma fluida e animada
- Tooltips ao passar mouse nos itens quando colapsada (delay leve, nome da seção)
- Item ativo: fundo preto, texto branco, ícone verde-limão; inativos: fundo transparente, texto cinza
- Exclusivamente variáveis do design system
- **Breakpoint:** Sidebar apenas em ≥1280px (lg)

---

## PROMPT 3: Sistema de Layout e Navegação Mobile

**Objetivo:** Header Mobile que substitui a Sidebar em viewports <1280px.

- HeaderMobile fixo no topo, largura total, visível durante scroll
- Logo "mycash+" à esquerda; avatar clicável à direita (trigger do menu)
- MenuDropdown: desliza de cima para baixo, não fullscreen
- Itens de navegação com ícone e texto; item atual com fundo preto; botão vermelho "Sair" no rodapé
- Fechamento: ao clicar em item, no X, ou fora (overlay escuro)
- **Breakpoint:** Sidebar apenas ≥1280px, Header Mobile apenas <1280px; nunca juntos

---

## PROMPT 4: Context Global e Gerenciamento de Estado

**Objetivo:** FinanceProvider com todo o estado da aplicação.

- **REGRA CRÍTICA:** NÃO usar localStorage, sessionStorage ou qualquer browser storage. Apenas React state (useState, useReducer).
- Arrays: transactions, goals, creditCards, bankAccounts, familyMembers
- CRUD para cada entidade
- Filtros globais: selectedMember, dateRange, transactionType, searchText
- Funções de cálculo derivadas: getFilteredTransactions, calculateTotalBalance, calculateIncomeForPeriod, calculateExpensesForPeriod, calculateExpensesByCategory, calculateCategoryPercentage, calculateSavingsRate
- Hook useFinance como único ponto de acesso
- Dados mock: 3 membros, 3 cartões, 20-30 transações, 4 objetivos, categorias brasileiras

---

## PROMPT 5: Cards de Resumo Financeiro

**Objetivo:** BalanceCard, IncomeCard e ExpenseCard.

- **BalanceCard:** fundo preto, texto branco, círculo verde-limão desfocado, badge com crescimento % vs mês anterior
- **IncomeCard:** fundo branco, label "Receitas", ícone seta baixo-esquerda em círculo cinza, valor de calculateIncomeForPeriod
- **ExpenseCard:** similar, label "Despesas", ícone seta cima-direita em círculo vermelho claro, valor de calculateExpensesForPeriod
- Layout: horizontal no desktop, vertical no mobile
- Animação de contagem nos valores (~800ms)

---

## PROMPT 6: Header do Dashboard com Controles

**Objetivo:** DashboardHeader com busca, filtros, período e avatares.

- Campo de busca à esquerda ("Pesquisar..."), tempo real, case-insensitive (descrição + categoria)
- Botão filtros: popover no desktop, modal fullscreen no mobile
- FilterPopover: tipo (Todos/Receitas/Despesas), opção selecionada com fundo preto
- Seletor de período: botão com período atual; calendário com 2 meses (desktop) ou 1 (mobile); seleção de intervalo; atalhos (Este mês, Mês passado, etc.)
- Widget membros: avatares sobrepostos, clique filtra por membro, borda preta + check no selecionado, botão "+"
- Botão "Nova Transação" destaque (fundo preto)

---

## PROMPT 7: Carrossel de Gastos por Categoria

**Objetivo:** ExpensesByCategoryCarousel com donuts por categoria.

- CategoryDonutCard: donut 64px, percentual (calculateCategoryPercentage), nome, valor
- Cores rotativas: verde-limão, preta, cinza
- Carrossel scrollável: mouse wheel, arrastar, setas flutuantes (desktop)
- Gradiente fade nas bordas
- Hover: borda verde-limão
- Mobile: apenas scroll por toque

---

## PROMPT 8: Gráfico de Fluxo Financeiro

**Objetivo:** FinancialFlowChart com evolução de receitas e despesas.

- Card com título, legenda (Receitas verde-limão, Despesas preta)
- Gráfico 300px altura, largura responsiva; eixos X (meses abreviados), Y (valores compactos)
- Duas áreas: receitas (linha verde-limão, gradiente) e despesas (linha preta, gradiente mais suave)
- Tooltip interativo com mês, receitas e despesas formatados
- Sugestão: Recharts

---

## PROMPT 9: Widget de Cartões de Crédito

**Objetivo:** CreditCardsWidget com lista de cartões.

- Container fundo cinza claro; header com ícone, título "Cartões", botão "+"
- Cards: ícone colorido (tema), nome, fatura, últimos dígitos, badge % de uso
- Hover: translateY -4px, sombra; clique abre modal de detalhes
- Paginação se >3 cartões; mobile: swipe

---

## PROMPT 10: Widget de Próximas Despesas

**Objetivo:** Lista cronológica de despesas pendentes.

- Fundo branco, header com ícone carteira, título, botão "+"
- Lista ordenada por vencimento; cada item: descrição, data "Vence dia DD/MM", conta/cartão, valor, botão check
- Check: marca paga, animação, remove da lista, cria recorrente se aplicável
- Estado vazio: "Nenhuma despesa pendente"

---

## PROMPT 11: Tabela de Transações Detalhada

**Objetivo:** TransactionsTable completa.

- Header: título, busca local, select tipo
- Colunas: Avatar, Data, Descrição, Categoria, Conta/Cartão, Parcelas, Valor
- Zebra striping, hover
- Filtros combinados (globais + locais), ordenação por data decrescente
- Paginação 5 por vez, contador "Mostrando 1 a 5 de N", botões Anterior/Próxima
- Estado vazio: "Nenhum lançamento encontrado"

---

## PROMPT 12: Modal de Nova Transação

**Objetivo:** Modal fullscreen para adicionar transação.

- Header: ícone por tipo, título, subtítulo, botão X
- Formulário: toggle Receita/Despesa, valor, descrição, categoria, membro, conta/cartão
- Parcelamento condicional (se cartão + despesa)
- Checkbox despesa recorrente (desabilita parcelamento >1x)
- Validação; footer com Cancelar e Salvar
- Toast de sucesso; sem localStorage

---

## PROMPT 13: Modal de Adicionar Membro

**Objetivo:** AddMemberModal com formulário de membro.

- Campos: Nome completo, Função (combobox com sugestões), Avatar (URL ou Upload), Renda mensal (opcional)
- Validação; adiciona a familyMembers; toast de sucesso

---

## PROMPT 14: Modal de Adicionar Cartão

**Objetivo:** Modal para conta bancária ou cartão de crédito.

- Toggle Conta Bancária / Cartão de Crédito
- Comum: Nome, Titular (dropdown membros)
- Conta: Saldo inicial
- Cartão: Dia fechamento, dia vencimento, limite, últimos 4 dígitos (opcional), tema visual (Black/Lime/White)
- Validação; adiciona ao array apropriado

---

## PROMPT 15: Modal de Detalhes do Cartão

**Objetivo:** CardDetailsModal ao clicar em cartão.

- Informações: limite, fatura, disponível, % uso, datas, últimos dígitos
- Representação visual (donut ou barra de progresso)
- Tabela de despesas vinculadas
- Ações: Ver Extrato, Adicionar Despesa, Editar Cartão, Fechar

---

## PROMPT 16: Modal de Filtros Mobile

**Objetivo:** FiltersMobileModal para mobile.

- Slide-in de baixo para cima
- Header fixo (título, X), conteúdo scrollável, footer fixo (botão "Aplicar Filtros")
- Seções: Tipo (Todos/Receitas/Despesas), Membro (avatar + nome), Período (calendário)
- Estado temporário; aplicar copia para contexto global
- Fechar sem aplicar descarta mudanças

---

## PROMPT 17: View Completa de Cartões

**Objetivo:** CardsView como seção principal.

- Header com título e botão "Novo Cartão"
- Grid: mobile 1 col, tablet 2, desktop 3
- Cards detalhados com limite, fatura, disponível, % uso, datas, tema
- Estado vazio: "Nenhum cartão cadastrado"

---

## PROMPT 18: View Completa de Transações

**Objetivo:** TransactionsView com filtros avançados.

- Header, barra de filtros (busca, tipo, categoria, conta, membro, período, status)
- Linha de resumo: receitas, despesas, diferença, quantidade
- Tabela expandida (10 linhas por página)
- Ordenação clicável nos headers
- Botão Exportar (CSV/PDF)

---

## PROMPT 19: View de Perfil — Aba Informações

**Objetivo:** ProfileView com aba Informações.

- Abas no topo: Informações | Configurações
- Seção perfil: avatar grande, nome, função, email, renda
- Seção membros da família: lista com avatar, nome, função, renda
- Botão "Sair" vermelho

---

## PROMPT 20: View de Perfil — Aba Configurações

**Objetivo:** Aba Configurações da ProfileView.

- Preferências: modo escuro (em breve), moeda, formato data
- Notificações: toggles (lembrete vencimento, alerta limite, resumo email, objetivos)
- Gerenciar categorias: receita e despesa, adicionar/editar/deletar
- Dados e privacidade: exportar, limpar (com confirmação)
- Sobre: versão, termos, privacidade

---

## PROMPT 21: Animações e Transições Globais

**Objetivo:** Animações consistentes em todo o sistema.

- Navegação: fade-out/fade-in entre seções
- Cards e listas: fade-in + slide-up com stagger
- Hover: transições 200-250ms em botões, cards, avatares
- Valores: animação de contagem 800ms
- Barras de progresso: preenchimento 1000ms
- Modais: fade + scale
- Toasts: slide-in/slide-out
- **Respeitar prefers-reduced-motion**

---

## PROMPT 22: Formatação e Utilitários

**Objetivo:** Funções utilitárias reutilizáveis.

- Moeda: formatCurrency, formatCompactCurrency, parseCurrencyInput
- Datas: formatDate, formatDateLong, formatDateRange, formatRelativeDate
- Arrays: groupByCategory, filterByDateRange, sortByDate
- Cálculos: calculatePercentage, calculateDifference, calculateInstallmentValue
- Validação: isValidEmail, isValidCPF, isValidDate, isPositiveNumber
- generateUniqueId
- Organizar em arquivos por categoria; JSDoc; testes unitários

---

## PROMPT 23: Responsividade e Ajustes Finais

**Objetivo:** Revisão completa mobile-first.

- Breakpoints oficiais: <768px, 768-1279px, 1280-1919px, ≥1920px
- Sidebar só em ≥1280px; Header Mobile só em <1280px
- Grids fluidos (auto-fit/auto-fill)
- Tabela: no mobile virar cards verticais
- Modais responsivos; touch targets 44x44px
- Validação em 375px, 768px, 1280px, 1920px

---

## PROMPT 24: Testes e Validação Final

**Objetivo:** Validação completa do sistema.

- Fluxo de teste: dashboard → filtros → nova transação → cartões → transações → perfil
- Validar cálculos financeiros
- Validar filtros combinados
- Validar formatações (moeda, data, percentual)
- Validar responsividade e breakpoints
- Validar modais e fechamentos
- Validar acessibilidade (teclado, foco, leitor de tela)
- Tratamento de erros; mensagens de feedback

---

## PROMPT FINAL: Revisão e Entrega

**Objetivo:** Checklist de qualidade e preparação para entrega.

- Checklist: seções, navegação, context, cálculos, filtros, modais, design system, responsividade, animações, formatações, acessibilidade
- Revisar organização do código
- Comentários JSDoc, remover debug
- Otimizar performance
- Comentários // TODO: integrar com Supabase
- Documentação de componentes
- README.md completo
- Relatório final

---

## Comandos Reconhecidos

- **Próximo** → Avançar para próximo prompt
- **Revisar [arquivo]** → Revisar arquivo específico
- **Refazer** → Refazer prompt atual
- **Status** → Ver progresso
- **Tokens** → Ver mapeamento de conversões
