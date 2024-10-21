<script lang="ts">
	import { page } from '$app/stores';
	import Dialog from '$lib/components/Dialog.svelte';
	import Expense from '$lib/components/Expense.svelte';
	import Tag from '$lib/components/Tag.svelte';
	import createBill, { fetchBill } from '$lib/stores/bill';

	let showAddExpenseDialog = $state(false);
	let showEditParticipantsForm = $state(false);

	const { participants, total, expenses, updateParticipants, addExpense, set } = createBill();

	const setBillInitialState = async () => {
		const result = await fetchBill($page.params.id);
		if (result) set(result);
	};

	const onParticipantsSubmit = async (event: SubmitEvent) => {
		event.preventDefault();
		const formData = new FormData(event.target as HTMLFormElement);
		await updateParticipants((formData.get('participants') as string).split(', '));
		showEditParticipantsForm = false;
	};

	const onExpenseSubmit = async (event: SubmitEvent) => {
		event.preventDefault();
		const formData = new FormData(event.target as HTMLFormElement);
		await addExpense({
			title: formData.get('title') as string,
			price: parseFloat(formData.get('price') as string),
			paidBy: formData.get('paidBy') as string,
			participants: formData.getAll('participants') as string[]
		});
		showAddExpenseDialog = false;
	};
</script>

{#await setBillInitialState()}
	<h4>Loading...</h4>
{:then}
	<div class="participants">
		{#if showEditParticipantsForm}
			<form onsubmit={onParticipantsSubmit}>
				<textarea
					placeholder="Type participants separated by comma"
					name="participants"
					value={$participants.join(', ')}
					required
				></textarea>
				<button onclick={() => (showEditParticipantsForm = false)}>Cancel</button>
				<button type="submit">Save</button>
			</form>
		{:else}
			{#each $participants as participant}
				<Tag label={participant} />
			{/each}
			<button onclick={() => (showEditParticipantsForm = true)}>Edit participants</button>
		{/if}
	</div>
	<div>
		{#each $expenses as expense}
			<Expense {expense} />
		{/each}
		{$total}
		<button onclick={() => (showAddExpenseDialog = true)}>Add expense</button>
	</div>

	<Dialog bind:open={showAddExpenseDialog}>
		<form onsubmit={onExpenseSubmit}>
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
					{#each $participants as participant}
						<option value={participant}>{participant}</option>
					{/each}
				</select>
			</label>
			<label>
				Used by:
				{#each $participants as participant}
					<label>
						<input type="checkbox" name="participants" value={participant} />
						{participant}
					</label>
				{/each}
			</label>
			<button type="submit">Add</button>
		</form>
	</Dialog>
{/await}
