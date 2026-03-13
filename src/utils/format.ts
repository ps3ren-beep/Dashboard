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
