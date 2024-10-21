<script lang="ts">
	import { page } from '$app/stores';
	import Dialog from '$lib/components/Dialog.svelte';
	import Expense from '$lib/components/Expense.svelte';
	import Tag from '$lib/components/Tag.svelte';
	import ExpenseForm from '$lib/forms/ExpenseForm.svelte';
	import ParticipantsForm from '$lib/forms/ParticipantsForm.svelte';
	import createBill, { fetchBill } from '$lib/stores/bill';

	let showAddExpenseDialog = $state(false);
	let showEditParticipantsForm = $state(false);

	const {
		participants,
		total,
		expenses,
		set,
		updateParticipants,
		addExpense,
		updateExpenseParticipants
	} = createBill();

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

	const onUpdateExpenseParticipants = (id: string) => async (event: SubmitEvent) => {
		event.preventDefault();
		const formData = new FormData(event.target as HTMLFormElement);
		await updateExpenseParticipants(id, (formData.get('participants') as string).split(', '));
	};
</script>

{#await setBillInitialState()}
	<h4>Loading...</h4>
{:then}
	<div class="participants">
		{#if showEditParticipantsForm}
			<ParticipantsForm
				onsubmit={onParticipantsSubmit}
				oncancel={() => (showEditParticipantsForm = false)}
				initialValue={$participants.join(', ')}
			/>
		{:else}
			{#each $participants as participant}
				<Tag label={participant} />
			{/each}
			<button onclick={() => (showEditParticipantsForm = true)}>Edit participants</button>
		{/if}
	</div>
	<div>
		{#each $expenses as expense}
			<Expense
				{expense}
				onUpdateParticipants={onUpdateExpenseParticipants(expense.id)}
				participants={$participants}
			/>
		{/each}
		{$total}
		<button disabled={$participants.length === 0} onclick={() => (showAddExpenseDialog = true)}>
			Add expense
		</button>
	</div>

	<Dialog bind:open={showAddExpenseDialog}>
		<ExpenseForm
			onsubmit={onExpenseSubmit}
			oncancel={() => (showAddExpenseDialog = false)}
			participants={$participants}
		/>
	</Dialog>
{/await}
