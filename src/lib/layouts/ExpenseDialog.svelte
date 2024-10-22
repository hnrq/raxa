<script lang="ts">
  import { page } from '$app/stores';
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

  const bill = createBillQuery({ id: id });

  let expense: Expense | undefined = $state();

  $effect(() => {
    if (id !== undefined && expenseId !== undefined)
      expense = client.getQueryData<Expense>(['bills', id, 'expenses', expenseId]);
  });

  $effect(() => {
    if (open && expenseId === undefined) form?.reset();
  });

  const updateExpense = createUpdateExpenseMutation({
    onSuccess: () => {
      onclose();
      form?.reset();
    }
  });

  const handleUpdateExpense = (event: SubmitEvent) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    $updateExpense.mutate({
      id: $page.params.id,
      expenseId: expenseId,
      expense: {
        title: formData.get('title') as string,
        price: Number.parseFloat(formData.get('price') as string),
        paidBy: formData.get('paidBy') as string,
        participants: formData.getAll('participants') as string[]
      }
    });
  };

  const handleClose = () => {
    onclose();
  };
</script>

<Dialog {open} onclose={handleClose}>
  <ExpenseForm
    bind:form
    initialValue={expense}
    oncancel={onclose}
    onsubmit={handleUpdateExpense}
    disabled={$updateExpense.isPending}
    participants={$bill.data?.participants ?? []}
  />
</Dialog>
