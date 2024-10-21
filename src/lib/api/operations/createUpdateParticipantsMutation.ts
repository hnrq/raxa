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

	return createMutation({
		...opts,
		mutationKey: ['add-expense'],
		mutationFn: async ({ id, participants }: UpdateParticipantsMutationOptions) => {
			updateDoc(doc(db, 'bills', id), { participants: [...new Set(participants)] });
		},
		onSuccess: (data, variables, context) => {
			queryClient.setQueryData(['bills', variables.id], (prev: Bill) => ({
				...prev,
				participants: variables.participants
			}));
			queryClient.invalidateQueries({ queryKey: ['bills', variables.id], exact: true });
			opts?.onSuccess?.(data, variables, context);
		}
	});
};

export default createUpdateParticipantsMutation;
