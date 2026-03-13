/**
 * Formata valor numérico como moeda brasileira
 * R$ 12.458,90
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

/**
 * Formata valor monetário de forma compacta para eixos
 * R$ 2k, R$ 4k, R$ 6k, etc.
 */
/**
 * Formata data para exibição de vencimento
 * "Vence dia 21/03"
 */
export function formatDueDate(dateStr: string): string {
  const [, m, d] = dateStr.split('-').map(Number);
  const day = (d || 0).toString().padStart(2, '0');
  const month = (m || 0).toString().padStart(2, '0');
  return `Vence dia ${day}/${month}`;
}

export function formatCurrencyCompact(value: number): string {
  if (value >= 1000) {
    return `R$ ${(value / 1000).toFixed(0)}k`;
  }
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}
