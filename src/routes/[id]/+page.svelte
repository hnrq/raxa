<script lang="ts">
  import { pushState, replaceState } from '$app/navigation';
  import { page } from '$app/stores';
  import createBillQuery from '$lib/api/operations/createBillQuery';
  import createExpensesQuery from '$lib/api/operations/createExpensesQuery';
  import createUpdateParticipantsMutation from '$lib/api/operations/createUpdateParticipantsMutation';
  import createUpdateTitleMutation from '$lib/api/operations/createUpdateTitleMutation';
  import Expense from '$lib/components/Expense.svelte';
  import FormActions from '$lib/components/FormActions.svelte';
  import LoadingScreen from '$lib/components/LoadingScreen.svelte';
  import ThemeToggle from '$lib/components/ThemeToggle.svelte';
  import ParticipantsForm from '$lib/forms/ParticipantsForm.svelte';
  import DebtsDialog from '$lib/layouts/DebtsDialog.svelte';
  import DeleteExpenseDialog from '$lib/layouts/DeleteExpenseDialog.svelte';
  import ExpenseDialog from '$lib/layouts/ExpenseDialog.svelte';
  import { derived } from 'svelte/store';

  let showEditParticipantsForm = $state(false);
  let showEditTitleForm = $state(false);

  const bill = createBillQuery({ id: $page.params.id });
  const expenses = createExpensesQuery({ id: $page.params.id });
  const updateParticipants = createUpdateParticipantsMutation({
    onSuccess: () => (showEditParticipantsForm = false)
  });
  const updateTitle = createUpdateTitleMutation({
    onSuccess: () => (showEditTitleForm = false)
  });

  const handleParticipantsUpdate = async (event: SubmitEvent) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    $updateParticipants.mutate({
      id: $page.params.id,
      participants: (formData.get('participants') as string).split(', ')
    });
  };

  const handleChangeTitle = (event: SubmitEvent) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    $updateTitle.mutate({ id: $page.params.id, title: formData.get('title') as string });
  };

  const total = derived(
    expenses,
    ($expenses) => $expenses.data?.reduce((acc, { price }) => acc + price, 0) ?? 0
  );
</script>

{#if $bill.isLoading}
  <LoadingScreen />
{:else if $bill.data !== undefined}
  <div class="bill">
    <ThemeToggle class="theme-toggle" />
    <div class="bill__title">
      {#if showEditTitleForm}
        <form onsubmit={handleChangeTitle}>
          <!-- svelte-ignore a11y_autofocus -->
          <input
            disabled={$updateTitle.isPending}
            autofocus
            type="text"
            name="title"
            value={$bill.data.title}
            required
          />
          <FormActions
            disabled={$updateTitle.isPending}
            oncancel={() => (showEditTitleForm = false)}
          />
        </form>
      {:else}
        <h1>{$bill.data.title || 'Untitled bill'}</h1>
        <button type="button" class="button--text" onclick={() => (showEditTitleForm = true)}>
          Edit
        </button>
      {/if}
    </div>
    <div class="bill__participants">
      {#if showEditParticipantsForm}
        <ParticipantsForm
          disabled={$updateParticipants.isPending}
          onsubmit={handleParticipantsUpdate}
          oncancel={() => (showEditParticipantsForm = false)}
          initialValue={$bill.data.participants.join(', ')}
        />
      {:else}
        <small>Divided by {$bill.data.participants.join(', ')}</small>
        <button class="button--text" onclick={() => (showEditParticipantsForm = true)}>
          Edit
        </button>
      {/if}
    </div>
    <hr />
    <button
      type="button"
      class="bill__add-expense"
      disabled={$expenses.isLoading}
      onclick={() => pushState('', { modalShown: 'expense' })}
    >
      + Add expense
    </button>
    <div class="bill__expenses">
      {#if $expenses.isLoading}
        <LoadingScreen />
      {:else}
        {#each $expenses.data ?? [] as expense}
          <Expense
            {expense}
            onedit={() => pushState('', { modalShown: 'expense', expenseId: expense.id })}
            ondelete={() => pushState('', { modalShown: 'delete-expense', expenseId: expense.id })}
          />
        {/each}
      {/if}
    </div>
    <button type="button" onclick={() => pushState('', { modalShown: 'debts' })}>Show Debts</button>
    <hr />
    <div class="bill__total">
      <small>Total:</small>
      <h1>${Number($total).toFixed(2)}</h1>
    </div>
  </div>
{/if}

<ExpenseDialog
  open={$page.state.modalShown === 'expense'}
  id={$page.params.id}
  expenseId={$page.state.expenseId}
  onclose={() => replaceState(`/${$page.params.id}`, {})}
/>

<DebtsDialog
  open={$page.state.modalShown === 'debts'}
  id={$page.params.id}
  onclose={() => replaceState(`/${$page.params.id}`, {})}
/>

<DeleteExpenseDialog
  open={$page.state.modalShown === 'delete-expense'}
  id={$page.params.id}
  expenseId={$page.state.expenseId}
  onclose={() => replaceState(`/${$page.params.id}`, {})}
/>

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

  .bill__title > form {
    display: flex;
    align-items: center;
    gap: var(--base-spacing);
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
