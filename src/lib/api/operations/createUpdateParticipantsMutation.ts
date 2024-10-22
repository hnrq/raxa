import { db } from '$lib/firebase/client';
import type { Bill } from '$lib/types';
import { createMutation, useQueryClient, type CreateMutationOptions } from '@tanstack/svelte-query';
import { doc, updateDoc } from 'firebase/firestore/lite';

type UpdateParticipantsMutationOptions = {
  participants: Bill['participants'];
  id: string;
};

const createUpdateParticipantsMutation = (
  opts?: CreateMutationOptions<void, Error, UpdateParticipantsMutationOptions>
) => {
  const queryClient = useQueryClient();

  const cascadeUpdateExpenseParticipants = async (id: string, participants: string[]) => {
    const { expenses } = queryClient.getQueryData<Bill>(['bills', id])!;

    const editedExpenses = expenses
      .map((expense) => {
        const remainingParticipants = expense.participants.filter((participant) =>
          participants.includes(participant)
        );
        if (remainingParticipants.length === expense.participants.length) return undefined;

        updateDoc(doc(db, 'bills', id, 'expenses', expense.id), {
          participants: remainingParticipants
        });
        return { ...expense, participants: remainingParticipants };
      })
      .filter(Boolean);

    if (editedExpenses.length > 0)
      queryClient.setQueryData(['bills', id], (prev: Bill) => ({
        ...prev,
        expenses: editedExpenses
      }));
  };

  return createMutation({
    ...opts,
    mutationKey: ['update-participants'],
    mutationFn: async ({ id, participants }: UpdateParticipantsMutationOptions) => {
      updateDoc(doc(db, 'bills', id), { participants: [...new Set(participants)] });
    },
    onSuccess: (data, variables, context) => {
      queryClient.setQueryData(['bills', variables.id], (prev: Bill) => ({
        ...prev,
        participants: variables.participants
      }));
      cascadeUpdateExpenseParticipants(variables.id, variables.participants);
      queryClient.invalidateQueries({ queryKey: ['bills', variables.id], exact: true });
      opts?.onSuccess?.(data, variables, context);
    }
  });
};

export default createUpdateParticipantsMutation;
