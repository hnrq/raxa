<script lang="ts">
  import client from '$lib/api/client';
  import createBillQuery from '$lib/api/operations/createBillQuery';
  import createUpdateExpenseMutation from '$lib/api/operations/createSaveExpenseMutation';
  import Dialog from '$lib/components/Dialog.svelte';
  import ExpenseForm from '$lib/forms/ExpenseForm.svelte';
  import type { Expense } from '$lib/types';

  let {
    id,
    expenseId,
    open,
    onclose
  }: { id: string; expenseId: string | undefined; open: boolean; onclose: () => void } = $props();
  let form: HTMLFormElement | undefined = $state();

  const bill = createBillQuery({ id });

  let expense: Expense | undefined = $state();

  const handleUpdateExpense = (event: SubmitEvent) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    $updateExpense.mutate({
      id,
      expenseId,
      expense: {
        title: formData.get('title') as string,
        price: Number.parseFloat(formData.get('price') as string),
        paidBy: formData.get('paidBy') as string,
        participants: formData.getAll('participants') as string[]
      }
    });
  };

  $effect(() => {
    if (id !== undefined && expenseId !== undefined)
      expense = client.getQueryData<Expense>(['bills', id, 'expenses', expenseId]);
  });

  $effect(() => {
    if (!open) {
      expense = undefined;
      form?.reset();
    }
  });

  const updateExpense = createUpdateExpenseMutation({
    onSuccess: onclose
  });
</script>

<Dialog {open} {onclose}>
  {#key expense}
    <ExpenseForm
      bind:form
      initialValue={expense}
      oncancel={onclose}
      onsubmit={handleUpdateExpense}
      disabled={$updateExpense.isPending}
      participants={$bill.data?.participants ?? []}
    />
  {/key}
</Dialog>
