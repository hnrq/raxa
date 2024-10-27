<script lang="ts">
  import createExpensesQuery from '$lib/api/operations/expensesQuery';
  import Dialog from '$lib/components/Dialog.svelte';
  import simplifiedDebts, { calcDebts } from '$lib/utils/debts';

  let { id, open, onclose }: { id: string; open: boolean; onclose: () => void } = $props();
  const expenses = createExpensesQuery({ id });
  let simplifyDebts = $state(true);

  let debtsSimplified = $derived(simplifiedDebts($expenses.data ?? []));
  let debtsComplete = $derived(calcDebts($expenses.data ?? []));

  let debts = $derived(simplifyDebts ? debtsSimplified : debtsComplete);
</script>

<Dialog {open} {onclose}>
  <div class="debts">
    <h3>Who are the deadbeats?</h3>
    <label>
      <input type="checkbox" bind:checked={simplifyDebts} />
      Simplify Debts
    </label>
    {#if debts.length === 0}
      <p>No debts</p>
    {:else}
      <ul>
        {#each debts as { from, to, amount }}
          <li>
            <small><b>{from}</b> owes <b>${Number(amount).toFixed()}</b> to <b>{to}</b></small>
          </li>
        {/each}
      </ul>
    {/if}
  </div>
</Dialog>

<style>
  .debts {
    padding: calc(var(--base-spacing) * 2);
  }

  li {
    list-style: none;
  }

  ul {
    padding: 0;
  }

  h3 {
    margin: 0;
  }
</style>
