<script lang="ts">
  import createUpdateExpenseMutation from '$lib/api/operations/createUpdateExpenseMutation';
  import type { Expense } from '$lib/types';
  import FormActions from './FormActions.svelte';

  let showEditParticipantsForm = $state(false);

  const updateParticipants = createUpdateExpenseMutation({
    onSuccess: () => {
      showEditParticipantsForm = false;
    }
  });

  const {
    billId,
    expense,
    participants
  }: { billId: string; participants: string[]; expense: Expense } = $props();

  const handleUpdateParticipants = async (event: SubmitEvent) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    $updateParticipants.mutate({
      id: billId,
      expenseId: expense.id,
      participants: formData.getAll('participants') as string[]
    });
  };
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
  {#if showEditParticipantsForm}
    <form onsubmit={handleUpdateParticipants}>
      {#each participants as participant}
        <label>
          <input
            type="checkbox"
            name="participants"
            value={participant}
            checked={expense.participants.includes(participant)}
            disabled={$updateParticipants.isPending}
          />
          {participant}
        </label>
      {/each}
      <FormActions
        oncancel={() => (showEditParticipantsForm = false)}
        disabled={$updateParticipants.isPending}
      />
    </form>
  {:else}
    <small class="expense__used-by">
      Divided with {expense.participants.join(', ')}
      <button onclick={() => (showEditParticipantsForm = true)}> Edit</button>
    </small>
  {/if}
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
