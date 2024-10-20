<script lang="ts">
	import type { Expense } from '$lib/types';
	import Tag from './Tag.svelte';

	let { title, price, paidBy, participants, onAddUser } = $props<
		Expense & { onAddUser: () => void }
	>();

	const onRemove = (user: string) => participants.delete(user);
</script>

<div class="expense">
	<h3>{title}</h3>
	<p>Price: {price}</p>
	<p>Paid by: {paidBy}</p>
	<div class="expense__used-by">
		Used by:
		{#each participants as participant}
			<Tag label={participant} onRemove={() => onRemove(participant)} />
		{/each}
	</div>
	<button onclick={onAddUser}>Add user</button>
</div>
