<script lang="ts">
	import { page } from '$app/stores';
	import createAddExpenseMutation from '$lib/api/operations/createAddExpenseMutation';
	import createBillQuery from '$lib/api/operations/createBillQuery';
	import createUpdateParticipantsMutation from '$lib/api/operations/createUpdateParticipantsMutation';
	import Dialog from '$lib/components/Dialog.svelte';
	import Expense from '$lib/components/Expense.svelte';
	import ExpenseForm from '$lib/forms/ExpenseForm.svelte';
	import ParticipantsForm from '$lib/forms/ParticipantsForm.svelte';
	import { derived } from 'svelte/store';

	let showAddExpenseDialog = $state(false);
	let showEditParticipantsForm = $state(false);

	const bill = createBillQuery({ id: $page.params.id });
	const updateParticipants = createUpdateParticipantsMutation({
		onSuccess: () => {
			showEditParticipantsForm = false;
		}
	});
	const addExpense = createAddExpenseMutation();
	const updateExpenseParticipants = createUpdateParticipantsMutation();

	const onParticipantsSubmit = async (event: SubmitEvent) => {
		event.preventDefault();
		const formData = new FormData(event.target as HTMLFormElement);
		$updateParticipants.mutate({
			id: $page.params.id,
			participants: (formData.get('participants') as string).split(', ')
		});
	};

	const onExpenseSubmit = async (event: SubmitEvent) => {
		event.preventDefault();
		const formData = new FormData(event.target as HTMLFormElement);
		$addExpense.mutate(
			{
				expense: {
					title: formData.get('title') as string,
					price: Number.parseFloat(formData.get('price') as string),
					paidBy: formData.get('paidBy') as string,
					participants: formData.getAll('participants') as string[]
				},
				id: $page.params.id
			},
			{
				onSuccess: () => {
					showAddExpenseDialog = false;
					(event.target as HTMLFormElement).reset();
				}
			}
		);
	};

	const onUpdateExpenseParticipants = (id: string) => async (participants: string[]) =>
		$updateExpenseParticipants.mutate({ id, participants });

	const total = derived(
		bill,
		($bill) => $bill.data?.expenses.reduce((acc, { price }) => acc + price, 0) ?? 0
	);
</script>

{#if $bill.isLoading}
	<h4>Loading...</h4>
{:else if $bill.data !== undefined}
	<div class="bill">
		<div class="bill__participants">
			{#if showEditParticipantsForm}
				<ParticipantsForm
					disabled={$updateParticipants.isPending}
					onsubmit={onParticipantsSubmit}
					oncancel={() => (showEditParticipantsForm = false)}
					initialValue={$bill.data.participants.join(', ')}
				/>
			{:else}
				<small>Divided by {$bill.data.participants.join(', ')}</small>
				<button onclick={() => (showEditParticipantsForm = true)}>Edit</button>
			{/if}
		</div>
		<hr />
		<div class="bill__expenses">
			<button
				type="button"
				disabled={$bill.data.participants.length === 0}
				onclick={() => (showAddExpenseDialog = true)}
			>
				+ Add expense
			</button>
			<div>
				{#each $bill.data.expenses as expense}
					<Expense
						{expense}
						onUpdateParticipants={onUpdateExpenseParticipants(expense.id)}
						participants={$bill.data.participants}
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
			participants={$bill.data.participants}
		/>
	</Dialog>
{/if}

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
