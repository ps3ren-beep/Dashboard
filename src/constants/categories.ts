/**
 * Categorias padrão brasileiras para receitas e despesas
 */

export const INCOME_CATEGORIES = [
  'Salário',
  'Freelance',
  'Investimentos',
  'Aluguel recebido',
  'Outros',
] as const;

export const EXPENSE_CATEGORIES = [
  'Alimentação',
  'Aluguel',
  'Mercado',
  'Transporte',
  'Saúde',
  'Educação',
  'Lazer',
  'Academia',
  'Contas',
  'Compras',
  'Outros',
] as const;

export type IncomeCategory = (typeof INCOME_CATEGORIES)[number];
export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number];
