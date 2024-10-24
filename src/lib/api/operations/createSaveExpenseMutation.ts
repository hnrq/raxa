import { db } from '$lib/firebase/client';
import type { Expense } from '$lib/types';
import { createMutation, useQueryClient, type CreateMutationOptions } from '@tanstack/svelte-query';
import { updateDoc, doc, addDoc, collection, DocumentReference } from 'firebase/firestore/lite';

type UpdateExpenseMutationOptions = {
  expenseId?: string;
  expense: Omit<Expense, 'id'>;
  id: string;
};

const createSaveExpenseMutation = (
  opts?: CreateMutationOptions<DocumentReference | void, Error, UpdateExpenseMutationOptions>
) => {
  const queryClient = useQueryClient();

  return createMutation({
    ...opts,
    mutationKey: ['save-expense'],
    mutationFn: async ({ id, expenseId, expense }: UpdateExpenseMutationOptions) => {
      return expenseId
        ? updateDoc(doc(db, 'bills', id, 'expenses', expenseId), expense)
        : addDoc(collection(db, 'bills', id, 'expenses'), { ...expense, createdAt: new Date() });
    },
    onSuccess: async (data, variables, context) => {
      const { id, expense } = variables;
      const expenseId = variables.expenseId ?? variables.id;

      queryClient.setQueryData(['bills', id, 'expenses'], (expenses: Expense[]) =>
        variables.expenseId
          ? expenses.map((prev) => (prev.id === expenseId ? expense : prev))
          : [...expenses, { id: expenseId, ...expense }]
      );

      queryClient.setQueryData(['bills', id, 'expenses', expenseId], expense);
      queryClient.invalidateQueries({
        queryKey: ['bills', id, 'expenses', expenseId],
        exact: true
      });

      opts?.onSuccess?.(data, variables, context);
    }
  });
};

export default createSaveExpenseMutation;
