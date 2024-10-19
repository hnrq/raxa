<script lang="ts">
	import Tag from './Tag.svelte';

	let { title, amount, paidBy, participants, onAddUser } = $props<{
		name: string;
		amount: number;
		paidBy: string;
		participants: Set<string>;
		onAddUser: () => void;
	}>();

	const onRemove = (user: string) => participants.delete(user);
</script>

<div class="expense">
	<h3>{title}</h3>
	<p>Amount: {amount}</p>
	<p>Paid by: {paidBy}</p>
	<div class="expense__used-by">
		Used by:
		{#each participants as participant}
			<Tag label={participant} onRemove={() => onRemove(participant)} />
		{/each}
	</div>
	<button onclick={onAddUser}>Add user</button>
</div>
