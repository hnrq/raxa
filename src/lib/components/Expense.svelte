<script lang="ts">
  import type { Expense } from '$lib/types';

  let { expense, onedit }: { expense: Expense; onedit: () => void } = $props();
</script>

<div class="expense">
  <div class="expense__title">
    <span>{expense.title}</span>
    <hr />
    <span>{Number(expense.price).toFixed(2)}</span>
  </div>
  <small class="expense__paid-by">
    Paid by {expense.paidBy}
  </small>
  <small class="expense__used-by">
    Divided by {expense.participants.join(', ')}
    <button onclick={onedit} class="button--text">Edit</button>
  </small>
</div>

<style>
  .expense {
    display: flex;
    flex-direction: column;
    gap: var(--base-spacing);
    padding: var(--base-spacing) calc(var(--base-spacing) * 3);
  }

  .expense__title {
    font-size: 1.5rem;
    display: flex;
    gap: var(--base-spacing);
    align-items: baseline;
    color: var(--text-high);
  }

  .expense__title > hr {
    flex: 1;
    border: none;
    border-top: 1px dotted var(--text-medium);
    height: 0;
  }

  .expense__used-by,
  .expense__paid-by {
    color: var(--text-medium);
  }
</style>
