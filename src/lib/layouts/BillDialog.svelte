<script lang="ts">
  import client from '$lib/api/client';
  import createBillQuery from '$lib/api/operations/billQuery';
  import createUpdateBillMutation from '$lib/api/operations/updateBillMutation';
  import Dialog from '$lib/components/Dialog.svelte';
  import BillForm from '$lib/forms/BillForm.svelte';
  import type { Bill } from '$lib/types';

  let {
    id,
    expenseId,
    open,
    onclose
  }: { id: string; expenseId: string | undefined; open: boolean; onclose: () => void } = $props();
  let form: HTMLFormElement | undefined = $state();

  const bill = createBillQuery({ id });

  let expense: Bill | undefined = $state();

  const handleUpdateBill = (event: SubmitEvent) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    $updateBill.mutate({
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
      expense = client.getQueryData<Bill>(['bills', id, 'expenses', expenseId]);
  });

  $effect(() => {
    if (!open) {
      expense = undefined;
      form?.reset();
    }
  });

  const updateBill = createUpdateBillMutation({
    onSuccess: onclose
  });
</script>

<Dialog {open} {onclose}>
  {#key expense}
    <BillForm
      bind:form
      initialValue={expense}
      oncancel={onclose}
      onsubmit={handleUpdateBill}
      disabled={$updateBill.isPending}
      participants={$bill.data?.participants ?? []}
    />
  {/key}
</Dialog>
