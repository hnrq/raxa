<script lang="ts">
  import Dialog from '$lib/components/Dialog.svelte';
  import { getContext } from 'svelte';
  import type createBill from '../stores/bill.svelte';
  import { page } from '$app/stores';
  import FormActions from '$lib/components/FormActions.svelte';

  let { onclose }: { onclose: () => void } = $props();
  let form: HTMLFormElement | undefined = $state();

  let { expenseId = '' } = $page.state;
  let { participants, expenses } = getContext<ReturnType<typeof createBill>>('bill');
  let expense = expenses[expenseId];

  let loading = $state(false);
  let open = $derived($page.state.modalShown === 'expense');

  $effect(() => {
    if (open) form?.reset();
  });
</script>

<Dialog {open} {onclose}>
  {#key expense}
    <form class="expense-form" bind:this={form} action="?/save-expense">
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
          {#each Object.values(participants) as participant}
            <option value={participant.id} selected={expense?.paidBy[0].id === participant.id}>
              {participant.name}
            </option>
          {/each}
        </select>
      </label>
      <label>
        Used by:
        {#each Object.values(participants) as participant}
          <label>
            <input
              disabled={loading}
              type="checkbox"
              name="participants"
              value={participant.id}
              checked={!expense?.participants || participants[participant.id] !== undefined}
            />
            {participant.name}
          </label>
        {/each}
      </label>
      <div class="expense-form__actions">
        <FormActions disabled={loading} oncancel={onclose} />
      </div>
    </form>
  {/key}
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
