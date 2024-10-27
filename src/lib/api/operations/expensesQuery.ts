import { db } from '$lib/firebase/client';
import type { Expense } from '$lib/types';
import { createQuery, useQueryClient, type CreateQueryOptions } from '@tanstack/svelte-query';
import { getDocs, collection } from 'firebase/firestore/lite';

type ExpensesQueryOptions = { id: string } & Omit<
  CreateQueryOptions<Expense[]>,
  'queryFn' | 'queryKey'
>;

const createExpensesQuery = ({ id, ...opts }: ExpensesQueryOptions) => {
  const queryClient = useQueryClient();

  return createQuery({
    ...opts,
    queryKey: ['bills', id, 'expenses'],
    queryFn: async () => {
      const expensesSnapshot = await getDocs(collection(db, 'bills', id, 'expenses'));

      return expensesSnapshot.docs.map((doc) => {
        const expense = { id: doc.id, ...doc.data() };
        queryClient.setQueryData(['bills', id, 'expenses', doc.id], expense);
        return expense;
      }) as Expense[];
    }
  });
};

export default createExpensesQuery;
