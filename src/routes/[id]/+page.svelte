<script lang="ts">
  import { pushState, replaceState } from '$app/navigation';
  import { page } from '$app/stores';
  import Expense from '$lib/components/Expense.svelte';
  import ThemeToggle from '$lib/components/ThemeToggle.svelte';
  import ExpenseDialog from './components/ExpenseDialog.svelte';
  import type { PageServerData } from './$types';
  import createBill from './stores/bill.svelte';
  import { setContext } from 'svelte';
  import BillDialog from './components/BillDialog.svelte';
  import DebtsDialog from './components/DebtsDialog.svelte';
  import DeleteExpenseDialog from './components/DeleteExpenseDialog.svelte';

  let { data }: { data: PageServerData } = $props();

  const billStore = createBill(data.bill);
  const { bill, total, participants, expenses } = billStore;
  const onclose = () => replaceState(`/${$page.params.id}`, {});

  setContext('bill', billStore);
</script>

<div class="bill">
  <ThemeToggle class="theme-toggle" />
  <div class="bill__title">
    <h1>{bill.title ? bill.title : 'Untitled bill'}</h1>
    <button
      type="button"
      class="button--text"
      onclick={() => pushState('', { modalShown: 'bill' })}
    >
      Edit
    </button>
  </div>
  <div class="bill__participants">
    <small
      >Divided by {Object.values(participants)
        .map(({ name }) => name)
        .join(', ')}</small
    >
  </div>
  <hr />
  <button
    type="button"
    class="bill__add-expense"
    onclick={() => pushState('', { modalShown: 'expense' })}
  >
    + Add expense
  </button>
  <div class="bill__expenses">
    {#each Object.values(expenses) as expense}
      <Expense
        {expense}
        onedit={() => pushState('', { modalShown: 'expense', expenseId: expense.id })}
        ondelete={() => pushState('', { modalShown: 'delete-expense', expenseId: expense.id })}
      />
    {/each}
  </div>
  <button type="button" onclick={() => pushState('', { modalShown: 'debts' })}>Show Debts</button>
  <hr />
  <div class="bill__total">
    <small>Total:</small>
    <h1>${Number(total).toFixed(2)}</h1>
  </div>
</div>

<BillDialog {onclose} />
<ExpenseDialog {onclose} />
<DebtsDialog {onclose} />
<DeleteExpenseDialog {onclose} />

<style>
  .bill {
    box-sizing: border-box;
    height: 100vh;
    display: flex;
    flex-direction: column;
    padding-bottom: calc(4 * var(--base-spacing));
  }

  .bill > * {
    padding: 0 calc(2 * var(--base-spacing));
  }

  .bill__participants {
    display: flex;
    flex-wrap: wrap;
    gap: var(--base-spacing);
    margin-bottom: calc(2 * var(--base-spacing));
  }

  .bill__expenses {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: var(--base-spacing);
    padding: calc(2 * var(--base-spacing)) 0;
    height: 100%;
    overflow: auto;
  }

  .bill__title {
    display: flex;
    align-items: center;
    gap: var(--base-spacing);
    margin: calc(3 * var(--base-spacing)) 0;
  }

  .bill__title > h1 {
    margin: 0;
  }

  hr {
    border: 1px dashed var(--text-low);
    margin: 0;
  }

  .bill__add-expense {
    padding: var(--base-spacing);
  }

  .bill__total {
    margin-top: auto;
    text-align: right;
  }

  .bill__total > h1 {
    margin: 0;
  }

  :global(.theme-toggle) {
    margin-left: auto;
    padding: var(--base-spacing);
  }
</style>
