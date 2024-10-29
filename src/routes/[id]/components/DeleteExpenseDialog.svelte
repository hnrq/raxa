<script lang="ts">
  import { page } from '$app/stores';
  import ConfirmationDialog from '$lib/components/ConfirmationDialog.svelte';
  import type createBill from '../stores/bill';
  import { getContext } from 'svelte';

  let { onclose, open }: { onclose: () => void; open: boolean } = $props();

  const { bill, deleteExpense } = getContext<ReturnType<typeof createBill>>('bill');
  let loading = $state(false);

  let { expenseId } = $page.state;

  const handleDelete = async () => {
    if (expenseId === undefined) return;

    await fetch(`/api/bills/${$page.params.id}/expenses/${expenseId}`, { method: 'DELETE' });
    deleteExpense(expenseId);
    onclose();
  };
</script>

{#if expenseId}
  {@const expense = $bill.expenses.find(({ id }) => id === expenseId)}
  <ConfirmationDialog
    {open}
    title="Delete bill"
    message={`Are you sure you want to delete the expense ${expense?.title}?`}
    disabled={loading}
    oncancel={onclose}
    confirmLabel="Delete"
    onconfirm={handleDelete}
  />
{/if}
