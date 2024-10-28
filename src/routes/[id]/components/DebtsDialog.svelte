<script lang="ts">
  import Dialog from '$lib/components/Dialog.svelte';
  import type createBill from '../stores/bill.svelte';
  import simplifiedDebts, { calcDebts } from '$lib/utils/debts';
  import { getContext } from 'svelte';
  import { page } from '$app/stores';

  let { onclose }: { onclose: () => void } = $props();
  let { expenses } = getContext<ReturnType<typeof createBill>>('bill');
  let simplifyDebts = $state(true);

  let debts = $derived((simplifyDebts ? simplifiedDebts : calcDebts)(Object.values(expenses)));
</script>

<Dialog open={$page.state.modalShown === 'debts'} {onclose}>
  <div class="debts">
    <h3>Who are the deadbeats?</h3>
    <label>
      <input type="checkbox" bind:checked={simplifyDebts} />
      Simplify Debts
    </label>
    {#if debts.length === 0}
      <p>No one...? I wasn't expecting that :eyes:</p>
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
