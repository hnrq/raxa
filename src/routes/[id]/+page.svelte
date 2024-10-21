<script lang="ts">
	import { page } from '$app/stores';
	import Dialog from '$lib/components/Dialog.svelte';
	import Expense from '$lib/components/Expense.svelte';
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
			price: Number.parseFloat(formData.get('price') as string),
			paidBy: formData.get('paidBy') as string,
			participants: formData.getAll('participants') as string[]
		});
		showAddExpenseDialog = false;
	};

	const onUpdateExpenseParticipants = (id: string) => async (participants: string[]) => {
		await updateExpenseParticipants(id, participants);
	};
</script>

{#await setBillInitialState()}
	<h4>Loading...</h4>
{:then}
	<div class="bill">
		<div class="bill__participants">
			{#if showEditParticipantsForm}
				<ParticipantsForm
					onsubmit={onParticipantsSubmit}
					oncancel={() => (showEditParticipantsForm = false)}
					initialValue={$participants.join(', ')}
				/>
			{:else}
				<small>Divided by {$participants.join(', ')}</small>
				<button onclick={() => (showEditParticipantsForm = true)}>Edit</button>
			{/if}
		</div>
		<hr />
		<div class="bill__expenses">
			<button disabled={$participants.length === 0} onclick={() => (showAddExpenseDialog = true)}>
				+ Add expense
			</button>
			<div>
				{#each $expenses as expense}
					<Expense
						{expense}
						onUpdateParticipants={onUpdateExpenseParticipants(expense.id)}
						participants={$participants}
					/>
				{/each}
			</div>
		</div>
		<hr />
		<div class="bill__total">
			<small>Total:</small>
			<h1>${Number($total).toFixed(2)}</h1>
		</div>
	</div>

	<Dialog bind:open={showAddExpenseDialog}>
		<ExpenseForm
			onsubmit={onExpenseSubmit}
			oncancel={() => (showAddExpenseDialog = false)}
			participants={$participants}
		/>
	</Dialog>
{/await}

<style>
	.bill {
		box-sizing: border-box;
		height: 100vh;
		display: flex;
		flex-direction: column;
		padding: calc(2 * var(--base-spacing));
		gap: var(--base-spacing);
	}

	.bill__participants {
		display: flex;
		flex-wrap: wrap;
		gap: var(--base-spacing);
	}

	.bill__expenses {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: var(--base-spacing);
		border-top: 1px dashed var(--text-low);
		border-bottom: 1px dashed var(--text-low);
		padding: calc(2 * var(--base-spacing)) 0;
	}

	.bill__total {
		margin-top: auto;
		text-align: right;
	}

	.bill__total > h1 {
		margin: 0;
	}
</style>
