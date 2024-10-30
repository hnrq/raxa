<script lang="ts">
  import type { Bill } from '../../routes/[id]/stores/bill';

  let {
    expense,
    onedit,
    ondelete
  }: { expense: Bill['expenses'][number]; onedit: () => void; ondelete: () => void } = $props();
</script>

<div class="expense">
  <div class="expense__title">
    <span>{expense.title}</span>
    <hr />
    <span>{Number(expense.amount).toFixed(2)}</span>
  </div>
  <small class="expense__paid-by">
    Paid by {expense.paidBy?.name}
  </small>
  <small class="expense__used-by">
    Divided by {expense.participants.map(({ name }) => name).join(', ')}
  </small>
  <div class="expense__actions">
    <button onclick={onedit} class="button--text">Edit</button>
    <button onclick={ondelete} class="button--text">Delete</button>
  </div>
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

  .expense__actions {
    display: flex;
    gap: var(--base-spacing);
    margin-left: auto;
  }
</style>
