<script lang="ts">
  import createExpensesQuery from '$lib/api/operations/createExpensesQuery';
  import Dialog from '$lib/components/Dialog.svelte';
  import simplifyDebts from '$lib/utils/debts';
  import LoadingScreen from '$lib/components/LoadingScreen.svelte';

  let { id, open, onclose }: { id: string; open: boolean; onclose: () => void } = $props();
  const expenses = createExpensesQuery({ id });
</script>

<Dialog {open} {onclose}>
  <div class="debts">
    <h3>Who are the deadbeats?</h3>
    {#await simplifyDebts($expenses.data ?? [])}
      <LoadingScreen />
      <p>No debts</p>
    {:then debts}
      <ul>
        {#each debts as { from, to, amount }}
          <li><b>{from}</b> owes <b>${Number(amount).toFixed()}</b> to <b>{to}</b></li>
        {/each}
      </ul>
    {/await}
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
