import type { BillQuery } from '$lib/supabase/queries/bill';
import type { IterableElement } from 'type-fest';

export type Bill = IterableElement<BillQuery>;

const createBill = (initialData?: Bill) => {
  const bill = $state(initialData ?? ({} as Bill));
  const expenses: Record<string, Bill['expenses'][number]> = $state(
    (initialData?.expenses ?? []).reduce((acc, e) => ({ ...acc, [e.id.toString()]: e }), {})
  );
  const participants: Record<string, Bill['participants'][number]> = $state(
    (initialData?.participants ?? []).reduce((acc, p) => ({ ...acc, [p.id.toString()]: p }), {})
  );
  const total = $derived(Object.values(expenses).reduce((acc, { amount }) => acc + amount, 0));

  return { bill, total, expenses, participants };
};

export default createBill;
