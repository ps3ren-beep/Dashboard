/**
 * Widget de Próximas Despesas — placeholder.
 * Conteúdo completo será implementado no PROMPT 10.
 */
export function UpcomingExpensesWidget() {
  return (
    <section className="rounded-card border border-neutral-300 bg-surface-50 p-[var(--space-32)]">
      <div className="flex items-center justify-between">
        <h2 className="text-label-large font-semibold text-secondary-normal">
          Próximas despesas
        </h2>
      </div>
      <p className="mt-4 text-paragraph-small text-surface-700">
        Nenhuma despesa pendente.
      </p>
    </section>
  );
}
