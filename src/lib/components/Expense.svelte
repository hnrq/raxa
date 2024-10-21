<script lang="ts">
	import type { Expense } from '$lib/types';
	import Tag from './Tag.svelte';

	let showEditParticipantsForm = $state(false);

	let {
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
	<h3>{expense.title}</h3>
	<p>Price: {expense.price}</p>
	<p>Paid by: {expense.paidBy}</p>
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
			<button onclick={() => (showEditParticipantsForm = false)}>Cancel</button>
			<button type="submit">Save</button>
		</form>
	{:else}
		<div class="expense__used-by">
			Used by:
			{#each expense.participants as participant}
				<Tag label={participant} />
			{/each}
		</div>
		<button onclick={() => (showEditParticipantsForm = true)}>Update Participants</button>
	{/if}
</div>
