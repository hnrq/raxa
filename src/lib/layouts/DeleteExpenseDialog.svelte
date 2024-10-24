<script lang="ts">
  import createDeleteExpenseMutation from '$lib/api/operations/createDeleteExpenseMutation';
  import ConfirmationDialog from '$lib/components/ConfirmationDialog.svelte';
  import type { Expense } from '$lib/types';
  import { useQueryClient } from '@tanstack/svelte-query';

  const client = useQueryClient();
  let {
    open,
    onclose,
    id,
    expenseId
  }: { open: boolean; onclose: () => void; id: string; expenseId?: string } = $props();
  let expense: Expense | undefined = $state();

  $effect(() => {
    if (id !== undefined && expenseId !== undefined)
      expense = client.getQueryData<Expense>(['bills', id, 'expenses', expenseId]);
  });

  const deleteExpense = createDeleteExpenseMutation({
    onSuccess: onclose
  });
</script>

<ConfirmationDialog
  {open}
  title="Delete bill"
  message={`Are you sure you want to delete the expense ${expense?.title}?`}
  disabled={$deleteExpense.isPending}
  oncancel={onclose}
  confirmLabel="Delete"
  onconfirm={() => $deleteExpense.mutate({ id, expenseId: expenseId as string })}
/>
