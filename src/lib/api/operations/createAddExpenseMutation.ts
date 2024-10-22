import { db } from '$lib/firebase/client';
import type { Bill } from '$lib/types';
import { createMutation, useQueryClient, type CreateMutationOptions } from '@tanstack/svelte-query';
import { addDoc, collection, DocumentReference } from 'firebase/firestore/lite';

type AddExpenseMutationOptions = {
  expense: Omit<Bill['expenses'][number], 'id' | 'createdAt'>;
  id: string;
};

const createAddExpenseMutation = (
  opts?: CreateMutationOptions<DocumentReference<unknown>, Error, AddExpenseMutationOptions>
) => {
  const queryClient = useQueryClient();

  return createMutation({
    ...opts,
    mutationKey: ['add-expense'],
    mutationFn: async ({ id, expense }: AddExpenseMutationOptions) =>
      addDoc(collection(db, 'bills', id, 'expenses'), { ...expense, createdAt: new Date() }),
    onSuccess: async (data, variables, context) => {
      queryClient.setQueryData(['bills', variables.id], (prev: Bill) => ({
        ...prev,
        expenses: [{ id: data.id, ...variables.expense }, ...prev.expenses]
      }));
      queryClient.invalidateQueries({ queryKey: ['bills', variables.id], exact: true });
      opts?.onSuccess?.(data, variables, context);
    }
  });
};

export default createAddExpenseMutation;
