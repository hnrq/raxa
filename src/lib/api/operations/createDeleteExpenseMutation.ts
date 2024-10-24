import { db } from '$lib/firebase/client';
import type { Expense } from '$lib/types';
import { createMutation, useQueryClient, type CreateMutationOptions } from '@tanstack/svelte-query';
import { doc, DocumentReference, deleteDoc } from 'firebase/firestore/lite';

type DeleteExpenseMutationOptions = {
  expenseId: string;
  id: string;
};

const createDeleteExpenseMutation = (
  opts?: CreateMutationOptions<DocumentReference | void, Error, DeleteExpenseMutationOptions>
) => {
  const queryClient = useQueryClient();

  return createMutation({
    ...opts,
    mutationKey: ['delete-expense'],
    mutationFn: async ({ id, expenseId }: DeleteExpenseMutationOptions) =>
      deleteDoc(doc(db, 'bills', id, 'expenses', expenseId)),
    onSuccess: async (data, variables, context) => {
      const { id, expenseId } = variables;

      queryClient.setQueryData(['bills', id, 'expenses'], (expenses: Expense[]) =>
        expenses.filter((expense) => expense.id !== expenseId)
      );

      queryClient.removeQueries({
        queryKey: ['bills', id, 'expenses', expenseId],
        exact: true
      });

      opts?.onSuccess?.(data, variables, context);
    }
  });
};

export default createDeleteExpenseMutation;
