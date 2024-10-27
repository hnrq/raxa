import { db } from '$lib/firebase/client';
import type { Expense } from '$lib/types';
import { createQuery, type CreateQueryOptions } from '@tanstack/svelte-query';
import { getDoc, doc } from 'firebase/firestore/lite';

type ExpenseQueryOptions = { id: string; expenseId: string } & Omit<
  CreateQueryOptions<Expense>,
  'queryFn' | 'queryKey'
>;

export const expenseQueryOpts = ({ id, expenseId, ...opts }: ExpenseQueryOptions) => ({
  ...opts,
  queryKey: ['bills', id, 'expenses', expenseId],
  queryFn: async () => {
    const snapshot = await getDoc(doc(db, 'bills', id, 'expenses', expenseId));
    return snapshot.data() as Expense;
  }
});

const createExpenseQuery = (opts: ExpenseQueryOptions) => createQuery(expenseQueryOpts(opts));

export default createExpenseQuery;
