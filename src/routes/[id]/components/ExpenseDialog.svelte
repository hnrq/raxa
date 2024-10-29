<script lang="ts">
  import Dialog from '$lib/components/Dialog.svelte';
  import { getContext } from 'svelte';
  import type createBill from '../stores/bill';
  import { page } from '$app/stores';
  import FormActions from '$lib/components/FormActions.svelte';

  let { onclose, open }: { onclose: () => void; open: boolean } = $props();

  const { bill } = getContext<ReturnType<typeof createBill>>('bill');
  const expense = $bill.expenses.find(({ id }) => id === expenseId);

  let { expenseId = '' } = $page.state;

  let loading = $state(false);
</script>

<Dialog {open} {onclose}>
  <form class="expense-form" action="?/save-expense">
    <input type="hidden" value={expense?.id} />
    <label>
      Title:
      <!-- svelte-ignore a11y_autofocus -->
      <input
        disabled={loading}
        type="text"
        name="title"
        placeholder="Soda"
        value={expense?.title}
        autofocus
        required
      />
    </label>
    <label>
      Price:
      <input
        disabled={loading}
        type="number"
        name="amount"
        placeholder="5.00"
        step="0.01"
        value={expense?.amount}
        required
      />
    </label>
    <label>
      Paid by:
      <select name="paidBy" required disabled={loading}>
        {#each $bill.participants as participant}
          <option value={participant.id} selected={expense?.paidBy[0].id === participant.id}>
            {participant.name}
          </option>
        {/each}
      </select>
    </label>
    <label>
      Used by:
      {#each $bill.participants as participant}
        <label>
          <input
            disabled={loading}
            type="checkbox"
            name="participants"
            value={participant.id}
            checked={!expense?.participants ||
              expense.participants.some(({ id }) => id === participant.id)}
          />
          {participant.name}
        </label>
      {/each}
    </label>
    <div class="expense-form__actions">
      <FormActions disabled={loading} oncancel={onclose} />
    </div>
  </form>
</Dialog>

<style>
  .expense-form {
    display: flex;
    flex-direction: column;
    gap: var(--base-spacing);
    padding: calc(var(--base-spacing) * 2);
  }

  .expense-form > label {
    display: flex;
    gap: var(--base-spacing);
    align-items: center;
    font-size: 0.75rem;
  }

  .expense-form > label > :is(input, select) {
    flex: 1;
  }

  .expense-form__actions {
    display: flex;
    gap: var(--base-spacing);
    justify-content: right;
  }
</style>
