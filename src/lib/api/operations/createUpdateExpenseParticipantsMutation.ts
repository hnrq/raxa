import { db } from '$lib/firebase/client';
import type { Bill } from '$lib/types';
import { createMutation, useQueryClient, type CreateMutationOptions } from '@tanstack/svelte-query';
import { updateDoc, doc } from 'firebase/firestore/lite';

type UpdateExpenseParticipantsMutationOptions = {
	expenseId: string;
	participants: string[];
	id: string;
};

const createUpdateExpenseParticipantsMutation = (
	opts?: CreateMutationOptions<void, Error, UpdateExpenseParticipantsMutationOptions>
) => {
	const queryClient = useQueryClient();

	return createMutation({
		...opts,
		mutationKey: ['update-expense-participants'],
		mutationFn: async ({
			id,
			expenseId,
			participants
		}: UpdateExpenseParticipantsMutationOptions) => {
			await updateDoc(doc(db, 'bills', id, 'expenses', expenseId), {
				participants: [...new Set(participants)]
			});
		},
		onSuccess: async (data, variables, context) => {
			const { id, expenseId, participants } = variables;

			queryClient.setQueryData(['bills', id], (prev: Bill) => ({
				...prev,
				expenses: prev.expenses.map((expense) =>
					expense.id === expenseId ? { ...expense, participants } : expense
				)
			}));
			queryClient.invalidateQueries({ queryKey: ['bills', id], exact: true });
			opts?.onSuccess?.(data, variables, context);
		}
	});
};

export default createUpdateExpenseParticipantsMutation;
