<script lang="ts">
  import FormActions from '$lib/components/FormActions.svelte';
  import type { Expense } from '$lib/types';

  let {
    onsubmit,
    oncancel,
    participants,
    initialValue,
    disabled
  }: {
    oncancel: () => void;
    disabled?: boolean;
    onsubmit: (event: SubmitEvent) => void | Promise<void>;
    participants: string[];
    initialValue?: Expense;
  } = $props();
</script>

<form class="expense-form" {onsubmit}>
  <label>
    Title:
    <input
      {disabled}
      type="text"
      name="title"
      placeholder="Soda"
      value={initialValue?.title}
      required
    />
  </label>
  <label>
    Price:
    <input
      {disabled}
      type="number"
      name="price"
      placeholder="5.00"
      step="0.01"
      value={initialValue?.price}
      required
    />
  </label>
  <label>
    Paid by:
    <select name="paidBy" required {disabled}>
      {#each participants as participant}
        <option value={participant} selected={initialValue?.paidBy === participant}>
          {participant}
        </option>
      {/each}
    </select>
  </label>
  <label>
    Used by:
    {#each participants as participant}
      <label>
        <input {disabled} type="checkbox" name="participants" value={participant} checked />
        {participant}
      </label>
    {/each}
  </label>
  <div class="expense-form__actions">
    <FormActions {disabled} {oncancel} saveLabel="Add" />
  </div>
</form>

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
