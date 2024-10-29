import type { BillQuery } from '$lib/supabase/queries/bill';
import { derived, writable } from 'svelte/store';
import type { IterableElement } from 'type-fest';

export type Bill = IterableElement<BillQuery>;

const createBill = (initialData?: Bill) => {
  const bill = writable(initialData ?? ({} as Bill));
  const total = derived(bill, ({ expenses }) =>
    expenses.reduce((acc, { amount }) => acc + amount, 0)
  );

  return {
    bill: { subscribe: bill.subscribe },
    total: { subscribe: total.subscribe },
    updateBill: bill.set,
    deleteExpense: (id: number) =>
      bill.update((prev) => ({
        ...prev,
        expenses: prev.expenses.filter((expense) => expense.id !== id)
      }))
  };
};

export default createBill;