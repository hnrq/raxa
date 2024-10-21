<script lang="ts">
	import type { Expense } from '$lib/types';
	import Tag from './Tag.svelte';

	let { expense, onRemoveUser, onAddUser } = $props<{
		expense: Expense;
		onAddUser: () => void;
		onRemoveUser: () => void;
	}>();
</script>

<div class="expense">
	<h3>{expense.title}</h3>
	<p>Price: {expense.price}</p>
	<p>Paid by: {expense.paidBy}</p>
	<div class="expense__used-by">
		Used by:
		{#each expense.participants as participant}
			<Tag label={participant} onRemove={onRemoveUser} />
		{/each}
	</div>
	<button onclick={onAddUser}>Add user</button>
</div>
