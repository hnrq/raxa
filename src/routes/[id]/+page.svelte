<script lang="ts">
	import { enhance } from '$app/forms';
	import Dialog from '$lib/components/Dialog.svelte';
	import Tag from '$lib/components/Tag.svelte';
	import type { Expense } from '$lib/types';

	let participants: string[] = [];
	let expenses: Expense[] = [];
	let showAddExpenseDialog = false;
	let showEditParticipantsForm = false;

	$effect(() => {
		console.log({ showAddExpenseDialog });
	});
</script>

<div class="participants">
	{#if showEditParticipantsForm}
		<form
			method="POST"
			action="?/add-participant"
			use:enhance={() =>
				async ({ result }) => {
					if (result.type === 'success') {
						if (result.data?.participants) participants = result.data.participants as string[];
						showEditParticipantsForm = false;
					}
				}}
		>
			<textarea
				placeholder="Type participants separated by comma"
				name="participants"
				value={participants.join(', ')}
				required
			></textarea>
			<button onclick={() => (showEditParticipantsForm = false)}>Cancel</button>
			<button type="submit">Save</button>
		</form>
	{:else}
		{#each participants as participant}
			<Tag label={participant} />
		{/each}
		<button onclick={() => (showEditParticipantsForm = true)}>Edit participants</button>
	{/if}
</div>

<div>
	<button onclick={() => (showAddExpenseDialog = true)}>Add expense</button>
</div>

<Dialog open={showAddExpenseDialog}>
	<form method="POST" action="?/add-expense" use:enhance>
		<label>
			Title:
			<input type="text" name="title" placeholder="Soda" required />
		</label>
		<label>
			Price:
			<input type="number" name="price" placeholder="5.00" required />
		</label>
		<label>
			Paid by:
			<select name="paidBy" required>
				{#each participants as participant}
					<option value={participant}>{participant}</option>
				{/each}
			</select>
		</label>
		<label>
			Used by:
			{#each participants as participant}
				<label>
					<input type="checkbox" name="participants" value={participant} />
					{participant}
				</label>
			{/each}
		</label>
		<button type="submit">Add</button>
	</form>
</Dialog>
