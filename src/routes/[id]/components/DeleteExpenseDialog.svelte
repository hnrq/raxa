<script lang="ts">
  import { page } from '$app/stores';
  import ConfirmationDialog from '$lib/components/ConfirmationDialog.svelte';
  import type createBill from '../stores/bill.svelte';
  import { getContext } from 'svelte';

  let { onclose }: { onclose: () => void } = $props();

  const { expenses } = getContext<ReturnType<typeof createBill>>('bill');
  let loading = $state(false);

  let { expenseId = '' } = $page.state;

  const handleDelete = async () => {
    await fetch(`/api/bills/${$page.params.id}/expenses/${expenseId}`, { method: 'DELETE' });
    delete expenses[expenseId];
    onclose();
  };
</script>

{#if expenseId}
  {@const expense = expenses[expenseId]}
  <ConfirmationDialog
    open={$page.state.modalShown === 'expense'}
    title="Delete bill"
    message={`Are you sure you want to delete the expense ${expense?.title}?`}
    disabled={loading}
    oncancel={onclose}
    confirmLabel="Delete"
    onconfirm={handleDelete}
  />
{/if}
