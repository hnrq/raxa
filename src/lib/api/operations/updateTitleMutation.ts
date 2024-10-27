import { db } from '$lib/firebase/client';
import type { Bill } from '$lib/types';
import { createMutation, useQueryClient, type CreateMutationOptions } from '@tanstack/svelte-query';
import { doc, updateDoc } from 'firebase/firestore/lite';

type UpdateTitleMutationOptions = {
  title: string;
  id: string;
};

const createUpdateTitleMutation = (
  opts?: CreateMutationOptions<void, Error, UpdateTitleMutationOptions>
) => {
  const queryClient = useQueryClient();

  return createMutation({
    ...opts,
    mutationKey: ['update-title'],
    mutationFn: async ({ id, title }: UpdateTitleMutationOptions) =>
      updateDoc(doc(db, 'bills', id), { title }),
    onSuccess: async (data, variables, context) => {
      queryClient.setQueryData(['bills', variables.id], (prev: Bill) => ({
        ...prev,
        title: variables.title
      }));
      queryClient.invalidateQueries({ queryKey: ['bills', variables.id], exact: true });
      opts?.onSuccess?.(data, variables, context);
    }
  });
};

export default createUpdateTitleMutation;
