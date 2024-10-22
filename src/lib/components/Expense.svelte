<script lang="ts">
	import type { Expense } from '$lib/types';
	import FormActions from './FormActions.svelte';

	let showEditParticipantsForm = $state(false);

	const {
		expense,
		onUpdateParticipants,
		participants
	}: {
		participants: string[];
		expense: Expense;
		onUpdateParticipants: (participants: string[]) => Promise<void>;
	} = $props();

	const handleUpdateParticipants = async (event: SubmitEvent) => {
		event.preventDefault();
		const formData = new FormData(event.target as HTMLFormElement);
		await onUpdateParticipants(formData.getAll('participants') as string[]);
		showEditParticipantsForm = false;
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
					/>
					{participant}
				</label>
			{/each}
			<FormActions oncancel={() => (showEditParticipantsForm = false)} />
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
